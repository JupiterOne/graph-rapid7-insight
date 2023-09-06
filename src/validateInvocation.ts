import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { createAPIClient } from './client';

export const ALLOWED_REGIONS = ['us', 'eu', 'ca', 'au', 'ap'];

export function validateUrl(config: IntegrationConfig) {
  // Append https if necessary
  if (!config.apiUrl.startsWith('https://')) {
    config.apiUrl = `https://${config.apiUrl}`;
  }

  // Check region
  if (
    !ALLOWED_REGIONS.includes(
      config.apiUrl.replace('https://', '').split('.')[0],
    )
  ) {
    throw new IntegrationValidationError(
      `API url region is not valid. Please make sure to include a full API url with a valid region. Valid regions: ${ALLOWED_REGIONS.join(
        ', ',
      )}.`,
    );
  }

  return config;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  const { logger } = context;

  if (!config.apiUrl || !config.apiKey) {
    throw new IntegrationValidationError(
      'Config requires all of {apiUrl, apiKey}',
    );
  }

  context.instance.config = validateUrl(config);

  const apiClient = createAPIClient(config, logger);
  await apiClient.verifyAuthentication();
}
