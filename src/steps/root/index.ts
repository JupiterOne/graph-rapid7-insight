import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAccountEntity, createProductEntity } from './converter';
import { Rapid7InsighVMClient } from '../insightvm/client';
import { RootEntities, RootRelationships, RootSteps } from './constants';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccount({
  jobState,
  instance: { config },
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // Account Entiy
  const client = new Rapid7InsighVMClient(config, logger);

  const products = await client.fetchAccountProducts();

  const accountEntity = await jobState.addEntity(
    createAccountEntity(products[0].organization_id),
  );

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);

  for (const product of products) {
    const productEntity = createProductEntity(product);
    await jobState.addEntity(productEntity);

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: productEntity,
      }),
    );
  }
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: RootSteps.FETCH_ACCOUNT.id,
    name: RootSteps.FETCH_ACCOUNT.name,
    entities: [RootEntities.ACCOUNT, RootEntities.PRODUCT],
    relationships: [RootRelationships.INSIGHT_ACCOUNT_HAS_PRODUCT],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
