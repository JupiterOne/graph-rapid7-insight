import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { Rapid7InsighAppSecClient } from '../../client';
import { IntegrationConfig } from '../../../../config';
import {
  InsightAppSecRelationships,
  Rapid7InsightAppSecEntities,
  Rapid7InsightAppSecSteps,
} from '../../constants';
import { createEngineGroupEntity } from '../../converter';
import { EngineGroup } from '../../types';
import { RootSteps } from '../../../root/constants';
import { getProductKey } from '../../../root/converter';

export const DEFAULT_CLOUD_ENGINE_GROUP_ID = 'default-cloud-engine-group';

async function fetchEngineGroups(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;
  const client = new Rapid7InsighAppSecClient(config, logger);

  // Create an entity representing the cloud default engine group
  const cloudDefaultEngineGroupEntity = createEngineGroupEntity({
    id: DEFAULT_CLOUD_ENGINE_GROUP_ID,
    name: 'Default Cloud Engine Group',
  } as EngineGroup);

  const productEntity = await jobState.findEntity(getProductKey('AS'));

  if (productEntity) {
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: productEntity,
        to: cloudDefaultEngineGroupEntity,
      }),
    );
  }

  await client.iterateEngineGroups(async (engineGroup) => {
    const engineGroupEntity = createEngineGroupEntity(engineGroup);

    await jobState.addEntity(engineGroupEntity);

    // Create Insigh Product -> HAS -> Engine Group Relationship

    if (productEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: productEntity,
          to: engineGroupEntity,
        }),
      );
    }
  });

  await jobState.addEntity(cloudDefaultEngineGroupEntity);
}

export const engineGroupsStepMap: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.id,
    name: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.name,
    entities: [Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP],
    relationships: [
      InsightAppSecRelationships.INSIGHT_APP_SEC_PRODUCT_HAS_ENGINE_GROUP_RELATIONSHIP,
    ],
    dependsOn: [RootSteps.FETCH_ACCOUNT.id],
    executionHandler: fetchEngineGroups,
  },
];
