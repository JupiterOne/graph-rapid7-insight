import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import { RootEntities } from '../account/constants';

export const Rapid7InsightVMSteps = {
  FETCH_INSIGHTVM_SITES: {
    id: 'fetch-insighvm-sites',
    name: 'Fetch InsightVM Sites',
  },
  BUILD_ACCOUNT_SITE_RELATIONSHIP: {
    id: 'build_account_has_insightvm_site_relationship',
    name: 'Build Account InsightVM Relationship',
  },
};

export const Rapid7InsightVMEntities = {
  INSIGHT_VM_SITE: {
    resourceName: 'Insight VM Site',
    _type: 'insightvm_site',
    _class: ['Site'],
  },
};

export const InsightVMRelationships = {
  INSIGHT_ACCOUNT_HAS_SITE_RELATIONSHIP: {
    _type: 'rapid7_insight_account_has_insightvm_site',
    _class: RelationshipClass.HAS,
    sourceType: RootEntities.ACCOUNT._type,
    targetType: Rapid7InsightVMEntities.INSIGHT_VM_SITE._type,
  },
};
