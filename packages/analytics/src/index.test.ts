import { describe, expect, it, vi } from 'vitest';

import { createContractProcessedEvent, createPlaybookRecommendedEvent } from '@contract-iq/analytics';

describe('analytics events', () => {
  it('builds a contract processed event', () => {
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));

    const event = createContractProcessedEvent('team-1', {
      contractId: 'contract-123',
      confidenceScore: 0.92,
      issues: 3
    });

    expect(event).toEqual({
      name: 'contract.processed',
      teamId: 'team-1',
      timestamp: '2025-01-01T00:00:00.000Z',
      payload: {
        contractId: 'contract-123',
        confidenceScore: 0.92,
        issues: 3
      }
    });
  });

  it('builds a playbook recommended event', () => {
    vi.setSystemTime(new Date('2025-02-02T10:30:00.000Z'));

    const event = createPlaybookRecommendedEvent('team-9', {
      contractId: 'contract-xyz',
      topic: 'Renewal Uplift',
      target: '4% cap',
      fallback: 'CPI + 2%',
      impact: 'medium',
      confidence: 0.66
    });

    expect(event).toEqual({
      name: 'playbook.recommended',
      teamId: 'team-9',
      timestamp: '2025-02-02T10:30:00.000Z',
      payload: {
        contractId: 'contract-xyz',
        topic: 'Renewal Uplift',
        target: '4% cap',
        fallback: 'CPI + 2%',
        impact: 'medium',
        confidence: 0.66
      }
    });
  });
});