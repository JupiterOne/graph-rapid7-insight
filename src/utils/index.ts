import { URLSearchParams, URL } from 'url';
import { IntegrationConfig } from '../config';
import {
  INSIGHT_APP_SEC_ALLOWED_REGIONS,
  INSIGHT_VM_ALLOWED_REGIONS,
} from '../validateInvocation';
import { IntegrationValidationError } from '@jupiterone/integration-sdk-core';
import { uniqBy } from 'lodash';
import { ProductCode } from '../types';

export function buildQueryParams(params: { [key: string]: string }) {
  return `?${new URLSearchParams(params)}`;
}

export function isUrl(string: string): boolean {
  try {
    new URL(string);

    return true;
  } catch (_) {
    return false;
  }
}

export const parseProductCodes = (config: IntegrationConfig): string[] => {
  return uniqBy(config.productCodesToIngest.split(','));
};

export function validateRegions(config: IntegrationConfig) {
  /**
   * Check Regions
   */

  // InsightVM
  if (!INSIGHT_VM_ALLOWED_REGIONS.includes(config.insightVMRegion)) {
    throw new IntegrationValidationError(
      `InsightVM region is not valid. Please make sure to include a full API url with a valid region. Valid regions: ${INSIGHT_VM_ALLOWED_REGIONS.join(
        ', ',
      )}.`,
    );
  }

  // AppSec
  if (!INSIGHT_APP_SEC_ALLOWED_REGIONS.includes(config.insightVMRegion)) {
    throw new IntegrationValidationError(
      `InsightAppSec region is not valid. Please make sure to include a full API url with a valid region. Valid regions: ${INSIGHT_APP_SEC_ALLOWED_REGIONS.join(
        ', ',
      )}.`,
    );
  }
}

export function validateProductCodes(productCodes: string[]) {
  const validProductCodes = Object.values(ProductCode) as string[];

  for (const productCode of productCodes) {
    if (!validProductCodes.includes(productCode)) {
      throw new IntegrationValidationError(
        `${productCode} is not a supported product code.`,
      );
    }
  }
}
