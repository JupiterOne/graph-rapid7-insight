import {
  IntegrationExecutionContext,
  IntegrationWarnEventName,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { parseProductCodes } from './utils';
import { integrationSteps } from './steps';
import { insightVMSteps } from './steps/insightvm';
import { insightAppSecSteps } from './steps/app-sec';
import { ProductCode } from './types';
import { set } from 'lodash';

export default function getStepStartStates(
  context: IntegrationExecutionContext<IntegrationConfig>,
): StepStartStates {
  const { instance, logger } = context;
  const { config } = instance;
  const productCodes = parseProductCodes(config);

  const stepIdsToDisable: string[] = [];
  if (!productCodes.includes(ProductCode.INSIGHT_VM)) {
    logger.publishWarnEvent({
      name: 'step_skip' as IntegrationWarnEventName,
      description: `Product codes to ingest does not include IVM. For this reason, the following steps will be disbled: ${insightVMSteps
        .map((insightVMStep) => insightVMStep.name)
        .join(', ')}.`,
    });
    stepIdsToDisable.push(...insightVMSteps.map((s) => s.id));
  }

  if (!productCodes.includes(ProductCode.INSIGHT_APP_SEC)) {
    logger.publishWarnEvent({
      name: 'step_skip' as IntegrationWarnEventName,
      description: `Product codes to ingest does not include AS (InsightAppSec). For this reason, the following steps will be disbled: ${insightAppSecSteps
        .map((insightAppSecStep) => insightAppSecStep.name)
        .join(', ')}.`,
    });
    stepIdsToDisable.push(...insightAppSecSteps.map((s) => s.id));
  }

  return integrationSteps.reduce(
    (startStates, step) =>
      set(
        startStates,
        `${step.id}.disabled`,
        stepIdsToDisable.includes(step.id),
      ),
    {},
  );
}
