import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { Rapid7InsighVMClient } from '../../client';
import { IntegrationConfig } from '../../../../config';
import {
  InsightVMRelationships,
  Rapid7InsightVMEntities,
  Rapid7InsightVMSteps,
} from '../../constants';
import { createSiteEntity } from '../../converter';
import { RootSteps } from '../../../root/constants';
import { getProductKey } from '../../../root/converter';

async function fetchSites(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;
  const client = new Rapid7InsighVMClient(config, logger);

  await client.iterateSites(async (site) => {
    await jobState.addEntity(createSiteEntity(site));
  });
}

async function buildInsightAccountSiteRelationships(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
): Promise<void> {
  const { jobState } = context;

  await jobState.iterateEntities(
    {
      _type: Rapid7InsightVMEntities.INSIGHT_VM_SITE._type,
    },
    async (site) => {
      const productEntity = await jobState.findEntity(getProductKey('IVM'));

      if (!productEntity) return;

      const accountSiteRelationship = createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: productEntity,
        to: site,
      });

      if (jobState.hasKey(accountSiteRelationship._key)) return;

      await jobState.addRelationship(accountSiteRelationship);
    },
  );
}

export const sitesStepMap: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Rapid7InsightVMSteps.FETCH_INSIGHT_VM_SITES.id,
    name: Rapid7InsightVMSteps.FETCH_INSIGHT_VM_SITES.name,
    entities: [Rapid7InsightVMEntities.INSIGHT_VM_SITE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchSites,
  },
  {
    id: Rapid7InsightVMSteps.BUILD_ACCOUNT_SITE_RELATIONSHIP.id,
    name: Rapid7InsightVMSteps.BUILD_ACCOUNT_SITE_RELATIONSHIP.name,
    entities: [],
    relationships: [
      InsightVMRelationships.INSIGHT_VM_PRODUCT_HAS_SITE_RELATIONSHIP,
    ],
    dependsOn: [
      RootSteps.FETCH_ACCOUNT.id,
      Rapid7InsightVMSteps.FETCH_INSIGHT_VM_SITES.id,
    ],
    executionHandler: buildInsightAccountSiteRelationships,
  },
];
