export interface NegotiationMetadataPayload {
  contract_name?: string | null;
  contract_type?: string | null;
  counterparty?: string | null;
  effective_date?: string | null;
  renewal_date?: string | null;
  jurisdiction?: string | null;
  additional_context?: Record<string, unknown> | null;
}

export interface NegotiationContextPayload {
  topic: string;
  contract_id: string;
  template_id: string;
  vertical?: string | null;
  current_position: string;
  target_position: string;
  fallback_position?: string | null;
  stakeholders?: string[];
  impact?: string | null;
  risk_signal?: string | null;
  metadata?: NegotiationMetadataPayload | null;
}

export interface NegotiationRequestPayload {
  context: NegotiationContextPayload;
  prompt_override?: string | null;
}

export interface NegotiationGuidanceResponsePayload {
  summary: string;
  fallback_recommendation: string;
  talking_points?: string[];
  risk_callouts?: string[];
  confidence: number;
  cached?: boolean;
  model: string;
  latency_ms: number;
  documentation_url?: string | null;
  generated_prompt?: string | null;
}

export interface NegotiationGuidance {
  summary: string;
  fallbackRecommendation: string;
  talkingPoints: string[];
  riskCallouts: string[];
  confidence: number;
  cached: boolean;
  model: string;
  latencyMs: number;
  documentationUrl?: string | null;
  generatedPrompt?: string | null;
}

export class NegotiationApiError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, options?: { status?: number; body?: unknown }) {
    super(message);
    this.name = 'NegotiationApiError';
    this.status = options?.status;
    this.body = options?.body;
  }
}

export interface RequestNegotiationGuidanceOptions {
  apiUrl?: string;
  promptOverride?: string | null;
  signal?: AbortSignal;
  fetchFn?: typeof fetch;
}

function resolveApiBaseUrl(): string | undefined {
  if (typeof window === 'undefined') {
    return process.env.CONTRACT_IQ_API_URL;
  }

  return process.env.NEXT_PUBLIC_CONTRACT_IQ_API_URL;
}

function normaliseGuidance(payload: NegotiationGuidanceResponsePayload): NegotiationGuidance {
  return {
    summary: payload.summary,
    fallbackRecommendation: payload.fallback_recommendation,
    talkingPoints: Array.isArray(payload.talking_points) ? payload.talking_points : [],
    riskCallouts: Array.isArray(payload.risk_callouts) ? payload.risk_callouts : [],
    confidence: payload.confidence,
    cached: Boolean(payload.cached),
    model: payload.model,
    latencyMs: payload.latency_ms,
    documentationUrl: payload.documentation_url ?? null,
    generatedPrompt: payload.generated_prompt ?? null
  };
}

async function parseErrorBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

export async function requestNegotiationGuidance(
  context: NegotiationContextPayload,
  options: RequestNegotiationGuidanceOptions = {}
): Promise<NegotiationGuidance> {
  const fetchImpl = options.fetchFn ?? fetch;
  const apiBase = options.apiUrl ?? resolveApiBaseUrl() ?? 'http://localhost:8000';

  const body: NegotiationRequestPayload = {
    context,
    prompt_override: options.promptOverride ?? undefined
  };

  const response = await fetchImpl(`${apiBase}/ai/negotiation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal: options.signal,
    cache: 'no-store'
  } as RequestInit);

  if (!response.ok) {
    const errorBody = await parseErrorBody(response);
    let message: string;

    if (typeof errorBody === 'string' && errorBody.length > 0) {
      message = errorBody;
    } else {
      const detail = (errorBody as { detail?: unknown })?.detail;
      if (typeof detail === 'string' && detail.length > 0) {
        message = detail;
      } else {
        message = `Request failed with status ${response.status}`;
      }
    }

    throw new NegotiationApiError(message, { status: response.status, body: errorBody });
  }

  const payload = (await response.json()) as NegotiationGuidanceResponsePayload;
  return normaliseGuidance(payload);
}
