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
import { creteVulnerabilityEntity } from '../../converter';
import { Application, ResourceKey, Vulnerability } from '../../types';

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
    { _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_APP._type },
    async (applicationEntity) => {
      const applicationRawData = getRawData<Application>(applicationEntity);

      await client.seachAndIterateResources<Vulnerability>(
        async (vulnerability) => {
          const vulnerabilityEntity = creteVulnerabilityEntity(vulnerability);

          if (vulnerability.app?.id) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: applicationEntity,
                to: vulnerabilityEntity,
              }),
            );
          }

          await jobState.addEntity(vulnerabilityEntity);

          return;
        },
        {
          query: `vulnerability.app.id = '${applicationRawData?.id}'`,
          type: ResourceKey.VULNERABILITY,
        },
      );
    },
  );
}

export const vulnerabilitiesStepMap: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_FINDINGS.id,
    name: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_FINDINGS.name,
    entities: [Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_FINDING],
    relationships: [InsightAppSecRelationships.APP_HAS_FINDING],
    dependsOn: [Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_APPS.id],
    executionHandler: fetchScans,
  },
];
