import {
  IntegrationError,
  IntegrationLogger,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { retry, sleep } from '@lifeomic/attempt';
import axios, { AxiosResponse } from 'axios';

export const DEFAULT_ATTEMPT_OPTIONS = {
  maxAttempts: 5,
  delay: 30_000,
  timeout: 180_000,
  factor: 2,
};

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private logger: IntegrationLogger;
  private integrationConfig: IntegrationConfig;

  constructor(integrationConfig: IntegrationConfig, logger: IntegrationLogger) {
    this.integrationConfig = integrationConfig;
    this.logger = logger;
  }

  public executeAPIRequestWithRetries<T>(
    requestUrl: string,
  ): Promise<AxiosResponse<T>> {
    const requestAttempt = async () => {
      const response = await axios.get(requestUrl, {
        headers: {
          ...this.getDefaultHeaders(),
        },
      });

      return response;
    };

    return retry(requestAttempt, {
      ...DEFAULT_ATTEMPT_OPTIONS,
      handleError: async (err, attemptContext) => {
        if (err.response.status === 401) {
          attemptContext.abort();

          return;
        }

        if (err.response.status === 429) {
          const retryAfter = err.retryAfter ? err.retryAfter * 1000 : 5000;
          this.logger.info(
            { retryAfter },
            `Received a rate limit error. Waiting before retrying.`,
          );
          await sleep(retryAfter);
        }

        this.logger.warn(
          { requestUrl, err, attemptContext },
          `Retrying API call error`,
        );
      },
    });
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.executeAPIRequestWithRetries(
        `${this.integrationConfig.apiUrl}/validate`,
      );
    } catch (err) {
      throw new IntegrationError({
        message: `Unable to verify credentials: ${err.response.status} ${err.response.data.message}`,
        code: err.response.status,
      });
    }
  }

  /**
   * PRIVATE ENDPOINTS
   */

  private getDefaultHeaders() {
    return {
      'X-Api-Key': this.integrationConfig.apiKey,
      accept: 'application/json',
    };
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  return new APIClient(config, logger);
}
