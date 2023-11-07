import {
  Entity,
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Rapid7InsightAppSecEntities } from './constants';
import {
  Application,
  Engine,
  EngineGroup,
  Scan,
  ScanConfig,
  Vulnerability,
} from './types';

export const getApplicationKey = (applicationId: string) => {
  return `insight_app_sec_app:${applicationId}`;
};

export const getEngineGroupKey = (engineGrupId: string) => {
  return `insight_app_sec_engine_group:${engineGrupId}`;
};

export const getEngineKey = (engineId: string): string => {
  return `insight_app_sec_engine:${engineId}`;
};

export const getScanKey = (scanId: string): string => {
  return `insight_app_sec_scan:${scanId}`;
};

export const getScanConfigKey = (scanConfigId: string): string => {
  return `insight_app_sec_scan_config:${scanConfigId}`;
};

export const getVulnerabilityKey = (vulnerabilityId: string): string => {
  return `insight_app_sec_finding:${vulnerabilityId}`;
};

export const getVulnerabilityPriority = (
  vulnerabilityScore: number,
): string => {
  if (vulnerabilityScore >= 0 && vulnerabilityScore > 2) {
    return 'info';
  }
  if (vulnerabilityScore >= 2 && vulnerabilityScore > 4) {
    return 'low';
  }
  if (vulnerabilityScore >= 4 && vulnerabilityScore > 6) {
    return 'medium';
  }
  if (vulnerabilityScore >= 6 && vulnerabilityScore > 8) {
    return 'high';
  }
  if (vulnerabilityScore >= 8 && vulnerabilityScore > 10) {
    return 'critical';
  }

  return 'unknown';
};

export function createApplicationEntity(application: Application): Entity {
  return createIntegrationEntity({
    entityData: {
      source: application,
      assign: {
        _key: getApplicationKey(application.id),
        _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_APP._type,
        _class: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_APP._class,
        name: application.name,
        description: application.description,
        id: application.id,
      },
    },
  });
}

export function createEngineGroupEntity(engineGroup: EngineGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: engineGroup,
      assign: {
        _key: getEngineGroupKey(engineGroup.id),
        _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP._type,
        _class: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP._class,
        name: engineGroup.name,
        description: engineGroup.description,
        id: engineGroup.id,
      },
    },
  });
}

export function creteEngineEntity(engine: Engine): Entity {
  return createIntegrationEntity({
    entityData: {
      source: engine,
      assign: {
        _key: getEngineKey(engine.id),
        _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE._type,
        _class: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE._class,
        latestVersion: engine.latest_version,
        upgradeable: engine.upgradeable,
        name: engine.name,
        id: engine.id,
        failureReason: engine.failure_reason,
        autoUpgrade: engine.auto_upgrade,
        engineGroupID: engine.engine_group?.id,
        status: engine.status,
        category: ['application'],
      },
    },
  });
}

export function creteScanEntity(scan: Scan): Entity {
  return createIntegrationEntity({
    entityData: {
      source: scan,
      assign: {
        _key: getScanKey(scan.id),
        _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN._type,
        _class: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN._class,
        name: scan.id,
        appId: scan.app?.id,
        submitterId: scan.submitter?.id,
        submitterType: scan.submitter?.type,
        scanConfigId: scan.scan_config?.id,
        id: scan.id,
        failureReason: scan.failure_reason,
        validationParentScanId: scan.validation?.parent_scan_id,
        status: scan.status,
        completionTime: parseTimePropertyValue(scan.completion_time),
        submitTime: parseTimePropertyValue(scan.submit_time),
        // Assessment basic properties
        category: 'Vulnerability Scan',
        startedOn: parseTimePropertyValue(scan.submit_time),
        completedOn: parseTimePropertyValue(scan.completion_time),
        summary: 'Rapid7 AppSec Application Scan',
        internal: true,
      },
    },
  });
}

export function createScanConfigEntity(scanConfig: ScanConfig): Entity {
  return createIntegrationEntity({
    entityData: {
      source: scanConfig,
      assign: {
        _key: getScanConfigKey(scanConfig.id),
        _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN_CONFIG._type,
        _class: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN_CONFIG._class,
        appId: scanConfig.app?.id,
        assignmentEnvironment: scanConfig.assignment?.environment,
        assignmentId: scanConfig.assignment?.id,
        assignmentType: scanConfig.assignment?.type,
        name: scanConfig.name,
        description: scanConfig.description,
        id: scanConfig.id,
        incremental: scanConfig.incremental,
      },
    },
  });
}

export function creteVulnerabilityEntity(vulnerability: Vulnerability): Entity {
  return createIntegrationEntity({
    entityData: {
      source: vulnerability,
      assign: {
        _key: getVulnerabilityKey(vulnerability.id),
        _type: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_FINDING._type,
        _class: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_FINDING._class,
        name: vulnerability.id,
        appId: vulnerability.app?.id,
        vectorString: vulnerability.vector_string,
        newlyDiscovered: vulnerability.newly_discovered,
        insightUiUrl: vulnerability.insight_ui_url,
        vulnerabilityScore: vulnerability.vulnerability_score,
        variances: vulnerability.variances?.map((variance) => variance.id),
        id: vulnerability.id,
        rootCauseMethod: vulnerability.root_cause?.method,
        rootCauseParameter: vulnerability.root_cause?.parameter,
        rootCauseUrl: vulnerability.root_cause?.url,
        lastDiscovered: parseTimePropertyValue(vulnerability.last_discovered),
        lastDiscofirstDiscoveredvered: parseTimePropertyValue(
          vulnerability.first_discovered,
        ),
        // Finding basic properties
        category: 'application',
        status: vulnerability.status,
        severity: vulnerability.severity,
        numericSeverity: vulnerability.vulnerability_score,
        priority: getVulnerabilityPriority(vulnerability.vulnerability_score),
        score: vulnerability.vulnerability_score,
        vector: vulnerability.vector_string,
        open: vulnerability.status === 'UNREVIEWED',
        validated: vulnerability.status !== 'UNREVIEWED',
      },
    },
  });
}
