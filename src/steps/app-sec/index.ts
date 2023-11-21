import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { appsStepMap } from './steps/apps/apps';
import { engineGroupsStepMap } from './steps/engine-groups/engine-groups';
import { scansStepMap } from './steps/scans/scans';
import { enginesStepMap } from './steps/engines/engine';
import { vulnerabilitiesStepMap } from './steps/vulnerabilities/vulnerabilities';
import { scanConfigsStepMap } from './steps/scan-configs/scan-configs';

export const insightAppSecSteps: IntegrationStep<IntegrationConfig>[] = [
  ...appsStepMap,
  ...engineGroupsStepMap,
  ...enginesStepMap,
  ...scansStepMap,
  ...scanConfigsStepMap,
  ...vulnerabilitiesStepMap,
];
