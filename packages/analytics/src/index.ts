export interface AnalyticsEvent<Payload extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  teamId: string;
  timestamp: string;
  payload: Payload;
}

export interface ContractProcessedEventPayload extends Record<string, unknown> {
  contractId: string;
  confidenceScore: number;
  issues: number;
}

/**
 * Builds the canonical event payload when a contract has finished processing.
 */
export function createContractProcessedEvent(
  teamId: string,
  payload: ContractProcessedEventPayload,
  timestamp: Date = new Date()
): AnalyticsEvent<ContractProcessedEventPayload> {
  return {
    name: 'contract.processed',
    teamId,
    timestamp: timestamp.toISOString(),
    payload
  };
}

export interface PlaybookRecommendedEventPayload extends Record<string, unknown> {
  contractId: string;
  topic: string;
  target: string;
  fallback?: string;
  impact: 'low' | 'medium' | 'high';
  confidence?: number;
}

export function createPlaybookRecommendedEvent(
  teamId: string,
  payload: PlaybookRecommendedEventPayload,
  timestamp: Date = new Date()
): AnalyticsEvent<PlaybookRecommendedEventPayload> {
  return {
    name: 'playbook.recommended',
    teamId,
    timestamp: timestamp.toISOString(),
    payload
  };
}