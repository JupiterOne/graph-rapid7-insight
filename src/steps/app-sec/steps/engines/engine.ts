import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
  getRawData,
} from '@jupiterone/integration-sdk-core';
import { Rapid7InsighAppSecClient } from '../../client';
import { IntegrationConfig } from '../../../../config';
import {
  InsightAppSecRelationships,
  Rapid7InsightAppSecEntities,
  Rapid7InsightAppSecSteps,
} from '../../constants';
import { creteEngineEntity, getEngineGroupKey } from '../../converter';
import { Engine, EngineGroup, ResourceKey } from '../../types';
import { DEFAULT_CLOUD_ENGINE_GROUP_ID } from '../engine-groups/engine-groups';

async function fetchEngines(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;
  const client = new Rapid7InsighAppSecClient(config, logger);

  // Create an entity representing the cloud default engine
  const cloudDefaultEngineEntity = creteEngineEntity({
    id: 'default-cloud-engine',
    name: 'Default Cloud Engine',
  } as Engine);

  await jobState.addEntity(cloudDefaultEngineEntity);

  const defaultEngineGroupEntity = await jobState.findEntity(
    getEngineGroupKey(DEFAULT_CLOUD_ENGINE_GROUP_ID),
  );

  if (defaultEngineGroupEntity) {
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: defaultEngineGroupEntity,
        to: cloudDefaultEngineEntity,
      }),
    );
  }

  await jobState.iterateEntities(
    { _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP._type },
    async (engineGroupEntity) => {
      const engineGroupRawData = getRawData<EngineGroup>(engineGroupEntity);

      await client.seachAndIterateResources<Engine>(
        async (engine) => {
          const engineEntity = creteEngineEntity(engine);

          if (engine.engine_group?.id) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: engineGroupEntity,
                to: engineEntity,
              }),
            );
          }

          await jobState.addEntity(engineEntity);
        },
        {
          query: `engine.engine_group.id = '${engineGroupRawData?.id}'`,
          type: ResourceKey.ENGINE,
        },
      );
    },
  );
}

export const enginesStepMap: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINES.id,
    name: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINES.name,
    entities: [Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE],
    relationships: [InsightAppSecRelationships.ENGINE_GROUP_HAS_ENGINE],
    dependsOn: [
      Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.id,
    ],
    executionHandler: fetchEngines,
  },
];
