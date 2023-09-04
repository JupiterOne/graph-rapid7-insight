import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _key: 'rapid7-insightvm-unique-account-id',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: 'rapid7-insightvm-account',
      },
    },
  });
}
