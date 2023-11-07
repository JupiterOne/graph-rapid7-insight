import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { sitesStepMap } from './steps/sites/sites';

export const insightVMSteps: IntegrationStep<IntegrationConfig>[] = [
  ...sitesStepMap,
];
