export interface ApiClausePlaybook {
  fallback?: string;
  impact?: string;
  stakeholders?: string[];
  [key: string]: unknown;
}

export interface ApiClause {
  id: string;
  category: string;
  text: string;
  benchmarkPercentile?: number;
  riskPosture?: string;
  source?: Record<string, unknown>;
  playbook?: ApiClausePlaybook | null;
}

export interface ApiRisk {
  id: string;
  severity: number;
  signal: string;
  recommendation: string;
  linkedClause?: string;
}

export interface ApiObligation {
  owner: string;
  description: string;
  kpi?: string;
  due?: string | null;
}

export interface ApiPlaybookTopic {
  topic: string;
  current?: string;
  target?: string;
  fallback?: string;
  impact?: string;
  confidence?: number;
  [key: string]: unknown;
}

export interface ApiNegotiation {
  playbook: ApiPlaybookTopic[];
  personaNotes?: Record<string, string>;
  [key: string]: unknown;
}

export interface ApiContractPayload {
  metadata: Record<string, unknown>;
  financials?: Record<string, unknown> | null;
  clauses: ApiClause[];
  risks: ApiRisk[];
  obligations: ApiObligation[];
  negotiation?: ApiNegotiation | null;
  audit?: Record<string, unknown> | null;
}

export interface ApiContractProcessedResponse {
  contract_id: string;
  team_id: string;
  processed_at: string;
  payload: ApiContractPayload;
}

export interface ContractPayload extends ApiContractPayload {}

export interface ContractRecord {
  contractId: string;
  teamId: string;
  processedAt: string;
  payload: ContractPayload;
}