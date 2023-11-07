import {
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiKey: {
    type: 'string',
    mask: true,
  },
  insightVMRegion: {
    type: 'string',
  },
  insightAppSecRegion: {
    type: 'string',
  },
  productCodesToIngest: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  apiKey: string;
  insightVMRegion: string;
  insightAppSecRegion: string;
  productCodesToIngest: string;
}
