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
import { createScanConfigEntity, getEngineGroupKey } from '../../converter';
import { ResourceKey, ScanConfig } from '../../types';
import { DEFAULT_CLOUD_ENGINE_GROUP_ID } from '../engine-groups/engine-groups';

async function fetchScanConfigs(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;
  const client = new Rapid7InsighAppSecClient(config, logger);

  await client.seachAndIterateResources<ScanConfig>(
    async (scanConfig) => {
      const scanConfigEntity = createScanConfigEntity(scanConfig);

      const scanConfigAssigmentId = scanConfig.assignment?.id;

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.USES,
          fromKey: scanConfigAssigmentId
            ? getEngineGroupKey(scanConfigAssigmentId)
            : getEngineGroupKey(DEFAULT_CLOUD_ENGINE_GROUP_ID),
          fromType:
            Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP._type,
          toKey: scanConfigEntity._key,
          toType: scanConfigEntity._type,
        }),
      );

      await jobState.addEntity(scanConfigEntity);
    },
    {
      query: `scanconfig.assignment.type = 'ENGINE_GROUP'`,
      type: ResourceKey.SCAN_CONFIG,
    },
  );
}

export const scanConfigsStepMap: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_SCAN_CONFIGS.id,
    name: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_SCAN_CONFIGS.name,
    entities: [Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN_CONFIG],
    relationships: [InsightAppSecRelationships.ENGINE_GROUP_USES_SCAN_CONFIG],
    dependsOn: [
      Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.id,
    ],
    executionHandler: fetchScanConfigs,
  },
];
