import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { setupProjectRecording } from '../test/recording';
import { IntegrationConfig } from './config';
import {
  ALLOWED_REGIONS,
  validateInvocation,
  validateUrl,
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
        'Config requires all of {apiUrl, apiKey}',
      );
    });

    test('api url region does not exist', async () => {
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {
          apiKey: 'api-key',
          apiUrl: 'non-existing.api.insight.rapid7.com',
        } as IntegrationConfig,
      });

      await expect(validateInvocation(executionContext)).rejects.toThrow(
        `API url region is not valid. Please make sure to include a full API url with a valid region. Valid regions: ${ALLOWED_REGIONS.join(
          ', ',
        )}.`,
      );
    });

    test('https is added to the URL if missing', () => {
      const urlWithNoProtocol = 'us.api.insight.rapid7.com';
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {
          apiKey: 'api-key',
          apiUrl: urlWithNoProtocol,
        } as IntegrationConfig,
      });

      expect(validateUrl(executionContext.instance.config).apiUrl).toEqual(
        `https://${urlWithNoProtocol}`,
      );
    });

    test('https is NOT added to the URL if present', () => {
      const urlWithProtocol = 'https://us.api.insight.rapid7.com';
      const executionContext = createMockExecutionContext<IntegrationConfig>({
        instanceConfig: {
          apiKey: 'api-key',
          apiUrl: urlWithProtocol,
        } as IntegrationConfig,
      });

      expect(validateUrl(executionContext.instance.config).apiUrl).toEqual(
        urlWithProtocol,
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
