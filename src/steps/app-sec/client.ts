import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import { APIClient, API_BASE_URL } from '../../client';
import { IntegrationConfig } from '../../config';
import { Link, Rapid7ApiCallback, SeachBody } from '../../types';
import { RequestInit } from 'node-fetch';
import { buildQueryParams } from '../../utils';
import { Application, EngineGroup } from './types';
import pMap from 'p-map';

type CommonResponse<T> = {
  data: T[];
  metadata: {
    size: number;
    total_data: number;
    total_pages: number;
    index?: number;
  };
  links: Link[];
};

export class Rapid7InsighAppSecClient extends APIClient {
  private apiUrl: string;

  constructor(integrationConfig: IntegrationConfig, logger: IntegrationLogger) {
    super(integrationConfig, logger);

    this.apiUrl = `https://${integrationConfig.insightAppSecRegion}.${API_BASE_URL}/ias`;
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
        {
          ...init,
          headers: {
            ...init?.headers,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );

      hasNext = page > response.metadata.total_pages;
      page = page + 1;

      await cb(response.data);
    } while (hasNext);
  }

  public async iterateApps(
    callback: (data: Application) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi<Application>(
      async (apps) => {
        await pMap(
          apps,
          async (app) => {
            await callback(app);
          },
          {
            concurrency: 5,
          },
        );
      },
      '500',
      `/v1/apps`,
    );
  }

  public async iterateEngineGroups(
    callback: (data: EngineGroup) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi<EngineGroup>(
      async (engineGroups) => {
        for (const engineGroup of engineGroups) {
          await callback(engineGroup);
        }
      },
      '500',
      `/v1/engine-groups`,
    );
  }

  public async seachAndIterateResources<T>(
    callback: (data: T) => Promise<void>,
    seachBody: SeachBody,
  ): Promise<void> {
    await this.iterateApi<T>(
      async (resources) => {
        await pMap(
          resources,
          async (resource) => {
            await callback(resource);
          },
          {
            concurrency: 5,
          },
        );
      },
      '500',
      `/v1/search`,
      { method: 'POST', body: JSON.stringify(seachBody) },
    );
  }
}
