import { APIClient } from '../../client';
import { Site } from '../../types';

const INSIGHT_VM_VERTICAL = '/vm';

export class Rapid7InsighVMClient extends APIClient {
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
      `${INSIGHT_VM_VERTICAL}/v4/integration/sites`,
      {
        method: 'POST',
      },
    );
  }
}
