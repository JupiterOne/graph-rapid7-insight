import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { RootEntities } from './constants';
import { Product } from '../../types';

export const getProductKey = (productCode: string): string => {
  return `rapid7_insight_product:${productCode}`;
};

export function createAccountEntity(organizationId: string): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _key: `rapid7_insight_account:${organizationId}`,
        _type: RootEntities.ACCOUNT._type,
        _class: RootEntities.ACCOUNT._class,
        name: 'rapid7-insight-account',
      },
    },
  });
}

export function createProductEntity(product: Product): Entity {
  return createIntegrationEntity({
    entityData: {
      source: product,
      assign: {
        _key: getProductKey(product.product_code),
        _type: RootEntities.PRODUCT._type,
        _class: RootEntities.PRODUCT._class,
        name: product.product_code,
        productToken: product.product_token,
      },
    },
  });
}
