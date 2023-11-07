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
import { creteScanEntity, getApplicationKey } from '../../converter';
import { ResourceKey, Scan, ScanConfig } from '../../types';

async function fetchScans(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;
  const client = new Rapid7InsighAppSecClient(config, logger);

  await jobState.iterateEntities(
    { _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN_CONFIG._type },
    async (scanConfigEntity) => {
      const scanConfigRawData = getRawData<ScanConfig>(scanConfigEntity);

      await client.seachAndIterateResources<Scan>(
        async (scan) => {
          const scanEntity = creteScanEntity(scan);

          // Create Scan -> PROTECTS -> App
          if (scan.app?.id) {
            const appEntity = await jobState.findEntity(
              getApplicationKey(scan.app?.id),
            );

            if (appEntity) {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.PROTECTS,
                  from: scanEntity,
                  to: appEntity,
                }),
              );
            }
          }

          // Create Scan Config -> PERFORMED -> Scan
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.PERFORMED,
              from: scanConfigEntity,
              to: scanEntity,
            }),
          );

          await jobState.addEntity(scanEntity);
        },
        {
          query: `scan.scan_config.id = '${scanConfigRawData?.id}'`,
          type: ResourceKey.SCAN,
        },
      );
    },
  );
}

export const scansStepMap: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_SCANS.id,
    name: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_SCANS.name,
    entities: [Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN],
    relationships: [
      InsightAppSecRelationships.SCAN_CONFIG_PERFORMED_SCAN,
      InsightAppSecRelationships.SCAN_PROTECTS_APP,
    ],
    dependsOn: [
      Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_SCAN_CONFIGS.id,
      Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_APPS.id,
    ],
    executionHandler: fetchScans,
  },
];
