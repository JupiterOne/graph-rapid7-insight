import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const RootSteps = {
  FETCH_ACCOUNT: {
    id: 'fetch-account',
    name: 'Fetch Account',
  },
};

export const RootEntities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'rapid7_insight_account',
    _class: ['Account'],
  },
  PRODUCT: {
    resourceName: 'Product',
    _type: 'rapid7_insight_product',
    _class: ['Product'],
  },
};

export const RootRelationships = {
  INSIGHT_ACCOUNT_HAS_PRODUCT: {
    _type: 'rapid7_insight_account_has_product',
    _class: RelationshipClass.HAS,
    sourceType: RootEntities.ACCOUNT._type,
    targetType: RootEntities.PRODUCT._type,
  },
};
