import {
  Entity,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';
import { Rapid7InsightVMEntities } from './constants';
import { Site } from './types';

const getSiteKey = (siteName: string): string => {
  return `insight_vm_site:${siteName}`;
};

export function createSiteEntity(site: Site): Entity {
  return createIntegrationEntity({
    entityData: {
      source: site,
      assign: {
        _key: getSiteKey(site.name),
        _type: Rapid7InsightVMEntities.INSIGHT_VM_SITE._type,
        _class: Rapid7InsightVMEntities.INSIGHT_VM_SITE._class,
        name: site.name,
        type: site.type,
      },
    },
  });
}
