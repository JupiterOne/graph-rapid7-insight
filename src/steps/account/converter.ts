import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { RootEntities } from './constants';

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
