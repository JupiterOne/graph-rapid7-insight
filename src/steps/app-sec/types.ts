export enum ResourceKey {
  APP = 'APP',
  SCAN_CONFIG = 'SCAN_CONFIG',
  SCAN = 'SCAN',
  VULNERABILITY = 'VULNERABILITY',
  ENGINE = 'ENGINE',
  ENGINE_GROUP = 'ENGINE_GROUP',
}

export type Application = {
  name: string;
  description: string;
  id: string;
};

export type EngineGroup = {
  name: string;
  description: string;
  id: string;
};

export type Engine = {
  latest_version: boolean;
  upgradeable: boolean;
  name: string;
  id: string;
  failure_reason: string;
  auto_upgrade: boolean;
  engine_group?: {
    id: string;
  };
  status: string;
};

export type Scan = {
  app?: {
    id: string;
  };
  submitter?: {
    id: string;
    type: string;
  };
  completion_time: string;
  scan_config?: {
    id: string;
  };
  submit_time: string;
  scan_type: string;
  id: string;
  failure_reason: string;
  validation?: {
    parent_scan_id: string;
  };
  status: string;
};

export type ScanConfig = {
  app?: {
    id: string;
  };
  assignment?: {
    environment: string;
    id: string;
    type: string;
  };
  name: string;
  description: string;
  id: string;
  incremental: boolean;
};

export type Exchange = {
  request: string;
  response: string;
  id: string;
};

export type Variance = {
  attack_exchanges?: Exchange[];
  original_value: string;
  attack_value: string;
  attack?: {
    id: string;
  };
  module?: {
    id: string;
  };
  proof_description: string;
  original_exchange?: Exchange;
  id: string;
  proof: string;
  message: string;
};

export type Vulnerability = {
  app?: {
    id: string;
  };
  severity: string;
  vector_string: string;
  newly_discovered: boolean;
  insight_ui_url: string;
  last_discovered: string;
  first_discovered: string;
  vulnerability_score: number;
  variances?: Variance[];
  id: string;
  root_cause?: {
    method: string;
    parameter: string;
    url: string;
  };
  status: string;
};
