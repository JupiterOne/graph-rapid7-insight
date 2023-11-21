import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import { RootEntities } from '../root/constants';

export const Rapid7InsightAppSecSteps = {
  FETCH_INSIGHT_APP_SEC_APPS: {
    id: 'fetch-insight-app-sec-apps',
    name: 'Fetch InsightAppSec Apps',
  },
  FETCH_INSIGHT_APP_SEC_ENGINE_GROUPS: {
    id: 'fetch-insight-app-sec-engine-groups',
    name: 'Fetch InsightAppSec Engine Groups',
  },
  FETCH_INSIGHT_APP_SEC_ENGINES: {
    id: 'fetch-insight-app-sec-engines',
    name: 'Fetch InsightAppSec Engines',
  },
  FETCH_INSIGHT_APP_SEC_SCANS: {
    id: 'fetch-insight-app-sec-scans',
    name: 'Fetch InsightAppSec Scans',
  },
  FETCH_INSIGHT_APP_SEC_SCAN_CONFIGS: {
    id: 'fetch-insight-app-sec-scan-configs',
    name: 'Fetch InsightAppSec Scan Configs',
  },
  FETCH_INSIGHT_APP_SEC_FINDINGS: {
    id: 'fetch-insight-app-sec-vulnerabilities',
    name: 'Fetch InsightAppSec Vulnerabilities',
  },
};

export const Rapid7InsightAppSecEntities = {
  INSIGHT_APP_SEC_APP: {
    resourceName: 'InsightAppSec App',
    _type: 'insight_app_sec_app',
    _class: ['Application'],
  },
  INSIGHT_APP_SEC_ENGINE_GROUP: {
    resourceName: 'InsightAppSec Engine Group',
    _type: 'insight_app_sec_engine_group',
    _class: ['Group'],
  },
  INSIGHT_APP_SEC_ENGINE: {
    resourceName: 'InsightAppSec Engine',
    _type: 'insight_app_sec_engine',
    _class: ['Scanner'],
  },
  INSIGHT_APP_SEC_SCAN: {
    resourceName: 'InsightAppSec Scan',
    _type: 'insight_app_sec_scan',
    _class: ['Assessment'],
  },
  INSIGHT_APP_SEC_SCAN_CONFIG: {
    resourceName: 'InsightAppSec Scan Config',
    _type: 'insight_app_sec_scan_config',
    _class: ['Configuration'],
  },
  INSIGHT_APP_SEC_FINDING: {
    resourceName: 'InsightAppSec Finding',
    _type: 'insight_app_sec_finding',
    _class: ['Finding'],
  },
};

export const InsightAppSecRelationships = {
  INSIGHT_APP_SEC_PRODUCT_HAS_ENGINE_GROUP_RELATIONSHIP: {
    _type: 'rapid7_insight_product_has_insight_app_sec_engine_group',
    _class: RelationshipClass.HAS,
    sourceType: RootEntities.PRODUCT._type,
    targetType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP._type,
  },
  ENGINE_GROUP_HAS_ENGINE: {
    _type: 'insight_app_sec_engine_group_has_engine',
    _class: RelationshipClass.HAS,
    sourceType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP._type,
    targetType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE._type,
  },
  SCAN_PROTECTS_APP: {
    _type: 'insight_app_sec_scan_protects_app',
    _class: RelationshipClass.PROTECTS,
    sourceType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN._type,
    targetType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_APP._type,
  },
  SCAN_CONFIG_PERFORMED_SCAN: {
    _type: 'insight_app_sec_scan_config_performed_scan',
    _class: RelationshipClass.PERFORMED,
    sourceType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN_CONFIG._type,
    targetType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN._type,
  },
  ENGINE_GROUP_USES_SCAN_CONFIG: {
    _type: 'insight_app_sec_engine_group_uses_scan_config',
    _class: RelationshipClass.USES,
    sourceType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_ENGINE_GROUP._type,
    targetType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_SCAN_CONFIG._type,
  },
  APP_HAS_FINDING: {
    _type: 'insight_app_sec_app_has_finding',
    _class: RelationshipClass.HAS,
    sourceType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_APP._type,
    targetType: Rapid7InsightAppSecEntities.INSIGHT_APP_SEC_FINDING._type,
  },
};
