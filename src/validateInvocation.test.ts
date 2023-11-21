import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { setupProjectRecording } from '../test/recording';
import { IntegrationConfig } from './config';
import {
  INSIGHT_APP_SEC_ALLOWED_REGIONS,
  INSIGHT_VM_ALLOWED_REGIONS,
  validateInvocation,
} from './validateInvocation';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  describe('#validateInvocation - integration setup', () => {
    test('requires valid config', async () => {
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {} as IntegrationConfig,
      });

      await expect(validateInvocation(executionContext)).rejects.toThrow(
        'Config requires all of {apiKey, insightAppSecRegion, insightVMRegion, productCodesToIngest}',
      );
    });

    test('Should validate InsightAppSec region', async () => {
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {
          apiKey: 'api-key',
          insightAppSecRegion: 'INVALID',
          insightVMRegion: 'us',
          productCodesToIngest: 'IVM',
        } as IntegrationConfig,
      });

      await expect(validateInvocation(executionContext)).rejects.toThrow(
        `InsightAppSec region is not valid. Please make sure to include a full API url with a valid region. Valid regions: ${INSIGHT_APP_SEC_ALLOWED_REGIONS.join(
          ', ',
        )}.`,
      );
    });

    test('Should validate InsightVM region', async () => {
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {
          apiKey: 'api-key',
          insightAppSecRegion: 'us2',
          insightVMRegion: 'INVALID',
          productCodesToIngest: 'IVM',
        } as IntegrationConfig,
      });

      await expect(validateInvocation(executionContext)).rejects.toThrow(
        `InsightVM region is not valid. Please make sure to include a full API url with a valid region. Valid regions: ${INSIGHT_VM_ALLOWED_REGIONS.join(
          ', ',
        )}.`,
      );
    });

    test('Should validate product codes to ingest', async () => {
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {
          apiKey: 'api-key',
          insightAppSecRegion: 'us2',
          insightVMRegion: 'us',
          productCodesToIngest: 'IVM,INVALID',
        } as IntegrationConfig,
      });

      await expect(validateInvocation(executionContext)).rejects.toThrow(
        `INVALID is not a supported product code.`,
      );
    });
  });

  describe('#validateInvocation - credentials verification', () => {
    test('#validateInvocation - valid credentials', async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: 'validate-invocation-valid-credentials',
      });

      const executionContext = createMockExecutionContext({
        instanceConfig: integrationConfig,
      });

      await expect(
        validateInvocation(executionContext),
      ).resolves.toBeUndefined();
    });

    test('#validateInvocation - invalid credentials', async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: 'validate-invocation-invalid-credentials',
        options: {
          recordFailedRequests: true,
        },
      });

      const executionContext = createMockExecutionContext({
        instanceConfig: {
          ...integrationConfig,
          apiKey: 'invalid',
        },
      });

      await expect(validateInvocation(executionContext)).rejects.toThrow(
        'Unable to verify credentials: 401 Unauthorized',
      );
    });
  });
});
