import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_API_KEY = 'api-key';
const DEFAULT_INSIGHT_VM_REGION = 'us';
const DEFAULT_INSIGHT_APP_SEC_REGION = 'us2';
const DEFAULT_PRODUCT_CODES_TO_INGEST = 'IVM,AS';

export const integrationConfig: IntegrationConfig = {
  apiKey: process.env.API_KEY || DEFAULT_API_KEY,
  insightVMRegion: process.env.INSIGHT_VM_REGION || DEFAULT_INSIGHT_VM_REGION,
  insightAppSecRegion:
    process.env.INSIGHT_APP_SEC_REGION || DEFAULT_INSIGHT_APP_SEC_REGION,
  productCodesToIngest:
    process.env.PRODUCT_CODES_TO_INGEST || DEFAULT_PRODUCT_CODES_TO_INGEST,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
