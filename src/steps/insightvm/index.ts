import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { sitesStepMap } from './steps/sites';

export const insightVMSteps: IntegrationStep<IntegrationConfig>[] = [
  ...sitesStepMap,
];
