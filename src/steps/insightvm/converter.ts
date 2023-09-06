import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Site } from '../../types';
import { Rapid7InsightVMEntities } from './constants';

export function createSiteEntity(site: Site): Entity {
  return createIntegrationEntity({
    entityData: {
      source: site,
      assign: {
        _key: site.name,
        _type: Rapid7InsightVMEntities.INSIGHT_VM_SITE._type,
        _class: Rapid7InsightVMEntities.INSIGHT_VM_SITE._class,
        name: site.name,
        type: site.type,
      },
    },
  });
}
