import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../../../test/config';
import { setupProjectRecording } from '../../../../../test/recording';
import { Rapid7InsightVMSteps } from '../../constants';

describe(`rapid7-insightvm#${Rapid7InsightVMSteps.FETCH_INSIGHT_VM_SITES.id}`, () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) await recording.stop();
  });

  jest.setTimeout(45000);

  test(Rapid7InsightVMSteps.FETCH_INSIGHT_VM_SITES.id, async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: Rapid7InsightVMSteps.FETCH_INSIGHT_VM_SITES.id,
    });

    const stepConfig = buildStepTestConfigForStep(
      Rapid7InsightVMSteps.FETCH_INSIGHT_VM_SITES.id,
    );
    const stepResult = await executeStepWithDependencies(stepConfig);
    expect(stepResult).toMatchStepMetadata(stepConfig);
  });
});
