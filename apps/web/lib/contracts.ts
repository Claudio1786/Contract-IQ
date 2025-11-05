export interface ApiContractProcessedResponse {
  contract_id: string;
  team_id: string;
  processed_at: string;
  payload: ApiContractPayload;
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

export interface ApiClause {
  id: string;
  category: string;
  text: string;
  benchmarkPercentile?: number;
  riskPosture?: string;
  source?: Record<string, unknown>;
  playbook?: Record<string, unknown>;
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

export interface ApiNegotiation {
  playbook: ApiPlaybookTopic[];
}

export interface ApiPlaybookTopic {
  topic: string;
  current?: string;
  target?: string;
  fallback?: string;
  impact?: string;
  confidence?: number;
}

export interface ContractPayload {
  metadata: Record<string, unknown>;
  financials?: Record<string, unknown> | null;
  clauses: ApiClause[];
  risks: ApiRisk[];
  obligations: ApiObligation[];
  negotiation?: ApiNegotiation | null;
  audit?: Record<string, unknown> | null;
}

export interface ContractRecord {
  contractId: string;
  teamId: string;
  processedAt: string;
  payload: ContractPayload;
}

export interface FetchContractOptions {
  teamId?: string;
  ingestSource?: string;
  apiUrl?: string;
  fetchFn?: typeof fetch;
}

const DEFAULT_TEAM_ID = 'demo-team';
const DEFAULT_INGEST_SOURCE = 'web-demo';

export async function fetchContract(
  templateId: string,
  options: FetchContractOptions = {}
): Promise<ContractRecord> {
  const fetchImpl = options.fetchFn ?? fetch;
  const apiBaseUrl = options.apiUrl ?? process.env.CONTRACT_IQ_API_URL ?? 'http://localhost:8000';

  const response = await fetchImpl(`${apiBaseUrl}/contracts/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template_id: templateId,
      team_id: options.teamId ?? DEFAULT_TEAM_ID,
      ingest_source: options.ingestSource ?? DEFAULT_INGEST_SOURCE
    }),
    cache: 'no-store'
  } as RequestInit);

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(`Failed to ingest contract ${templateId}: ${message}`);
  }

  const payload = (await response.json()) as ApiContractProcessedResponse;
  return mapContractResponse(payload);
}

export function mapContractResponse(payload: ApiContractProcessedResponse): ContractRecord {
  return {
    contractId: payload.contract_id,
    teamId: payload.team_id,
    processedAt: payload.processed_at,
    payload: payload.payload
  };
}

async function safeParseError(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text || response.statusText;
  } catch {
    return response.statusText;
  }
}

export function severityToVariant(severity: number): 'success' | 'warning' | 'danger' | 'default' {
  if (severity >= 4) {
    return 'danger';
  }

  if (severity === 3) {
    return 'warning';
  }

  if (severity <= 1) {
    return 'success';
  }

  return 'default';
}