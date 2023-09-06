import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAccountEntity } from './converter';
import { Rapid7InsighVMClient } from '../insightvm/client';
import { RootEntities, RootSteps } from './constants';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccount({
  jobState,
  instance: { config },
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new Rapid7InsighVMClient(config, logger);

  const products = await client.fetchAccountProducts();

  const accountEntity = await jobState.addEntity(
    createAccountEntity(products[0].organization_id),
  );

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: RootSteps.FETCH_ACCOUNT.id,
    name: RootSteps.FETCH_ACCOUNT.name,
    entities: [RootEntities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
