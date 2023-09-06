import {
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';
import { Response } from 'node-fetch';

export const httpErrorPolicy = {
  handleError(response: Response, requestUrl: string) {
    if (response.status === 401) {
      throw new IntegrationProviderAuthenticationError({
        status: response.status,
        statusText: response.statusText,
        endpoint: requestUrl,
      });
    }
    if (response.status === 403) {
      throw new IntegrationProviderAuthorizationError({
        status: response.status,
        statusText: response.statusText,
        endpoint: requestUrl,
      });
    }

    throw new IntegrationProviderAPIError({
      status: response.status,
      statusText: response.statusText,
      endpoint: requestUrl,
    });
  },
};
