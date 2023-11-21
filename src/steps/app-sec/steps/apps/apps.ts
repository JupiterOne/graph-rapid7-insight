import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { Rapid7InsighAppSecClient } from '../../client';
import { IntegrationConfig } from '../../../../config';
import {
  Rapid7InsightAppSecEntities,
  Rapid7InsightAppSecSteps,
} from '../../constants';
import { createApplicationEntity } from '../../converter';

async function fetchApps(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;
  const client = new Rapid7InsighAppSecClient(config, logger);

  await client.iterateApps(async (app) => {
    await jobState.addEntity(createApplicationEntity(app));
  });
}

export const appsStepMap: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_APPS.id,
    name: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_APPS.name,
    entities: [Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_APP],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchApps,
  },
];
