import { RequestInit } from 'node-fetch';
import { APIClient, API_BASE_URL } from '../../client';
import { Link, Rapid7ApiCallback } from '../../types';
import { buildQueryParams } from '../../utils';
import { IntegrationConfig } from '../../config';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import { Site } from './types';

type CommonResponse<T> = {
  data: T[];
  metadata: {
    number: number;
    size: number;
    totalResources: number;
    totalPages: number;
    cursor?: number;
  };
  links: Link[];
};

export class Rapid7InsighVMClient extends APIClient {
  private apiUrl: string;

  constructor(integrationConfig: IntegrationConfig, logger: IntegrationLogger) {
    super(integrationConfig, logger);

    this.apiUrl = `https://${integrationConfig.insightVMRegion}.${API_BASE_URL}/vm`;
  }

  private async iterateApi<T>(
    cb: Rapid7ApiCallback<T>,
    size: string,
    urlPath: string,
    init?: RequestInit,
  ) {
    let hasNext = false;
    let page = 0;

    do {
      const response = await this.executeAPIRequestWithRetries<
        CommonResponse<T>
      >(
        `${this.apiUrl}${urlPath}${buildQueryParams({
          size,
          page: String(page),
        })}`,
        init,
      );

      hasNext = page > response.metadata.totalPages;
      page = page + 1;

      await cb(response.data);
    } while (hasNext);
  }

  public async iterateSites(
    callback: (data: Site) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi<Site>(
      async (sites) => {
        for (const site of sites) {
          await callback(site);
        }
      },
      '100',
      `/v4/integration/sites`,
      {
        method: 'POST',
      },
    );
  }
}
