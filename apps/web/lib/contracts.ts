import type { ApiContractProcessedResponse, ContractRecord } from '@contract-iq/fixtures';
// Re-exporting for backwards compatibility within web app modules

export type {
  ApiClause,
  ApiContractPayload,
  ApiContractProcessedResponse,
  ApiNegotiation,
  ApiObligation,
  ApiPlaybookTopic,
  ApiRisk,
  ContractPayload,
  ContractRecord
} from '@contract-iq/fixtures';

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