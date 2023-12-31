import {
  IntegrationError,
  IntegrationLogger,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { retry, sleep } from '@lifeomic/attempt';
import fetch, { RequestInit } from 'node-fetch';
import { Product } from './types';
import { httpErrorPolicy } from './HttpErrorPolicy';

export const DEFAULT_ATTEMPT_OPTIONS = {
  maxAttempts: 5,
  delay: 30_000,
  timeout: 180_000,
  factor: 2,
};

export const API_BASE_URL = 'api.insight.rapid7.com';

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
    init?: RequestInit,
  ): Promise<T> {
    const requestAttempt = async () => {
      const response = await fetch(requestUrl, {
        ...init,
        headers: {
          ...init?.headers,
          ...this.getDefaultHeaders(),
        },
      });

      if (response.ok) {
        return response.json();
      }

      httpErrorPolicy.handleError(response, requestUrl);
    };

    return retry(requestAttempt, {
      ...DEFAULT_ATTEMPT_OPTIONS,
      handleError: async (err, attemptContext) => {
        if (err.status === 401) {
          attemptContext.abort();

          return;
        }

        if (err.status === 429) {
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
        `https://us.${API_BASE_URL}/validate`,
      );
    } catch (err) {
      throw new IntegrationError({
        message: `Unable to verify credentials: ${err.status} ${err.statusText}`,
        code: err.statusText,
      });
    }
  }

  public async fetchAccountProducts(): Promise<Product[]> {
    return this.executeAPIRequestWithRetries<Product[]>(
      `https://us.${API_BASE_URL}/account/api/1/products`,
    );
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
