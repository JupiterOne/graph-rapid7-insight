import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../../../test/config';
import { setupProjectRecording } from '../../../../../test/recording';
import { Rapid7InsightAppSecSteps } from '../../constants';

describe(`rapid7-insight-app-sec#${Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.id}`, () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) await recording.stop();
  });

  jest.setTimeout(45000);

  test(
    Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.id,
    async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.id,
      });

      const stepConfig = buildStepTestConfigForStep(
        Rapid7InsightAppSecSteps.FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS.id,
      );
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    },
  );
});
