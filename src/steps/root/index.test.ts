import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { RootSteps } from './constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test(`root-steps#${RootSteps.FETCH_ACCOUNT.id}`, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: RootSteps.FETCH_ACCOUNT.id,
  });

  const stepConfig = buildStepTestConfigForStep(RootSteps.FETCH_ACCOUNT.id);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
