import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { createAPIClient } from './client';
import {
  parseProductCodes,
  validateProductCodes,
  validateRegions,
} from './utils';

export const INSIGHT_VM_ALLOWED_REGIONS = ['us', 'eu', 'ca', 'au', 'ap'];
export const INSIGHT_APP_SEC_ALLOWED_REGIONS = [
  'us',
  'us2',
  'us3',
  'eu',
  'ca',
  'au',
  'ap',
];

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  const { logger } = context;

  if (
    !config.apiKey ||
    !config.insightAppSecRegion ||
    !config.insightVMRegion ||
    !config.productCodesToIngest
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {apiKey, insightAppSecRegion, insightVMRegion, productCodesToIngest}',
    );
  }

  const productCodes = parseProductCodes(config);

  validateRegions(config);
  validateProductCodes(productCodes);

  const apiClient = createAPIClient(config, logger);
  await apiClient.verifyAuthentication();
}
