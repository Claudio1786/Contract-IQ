import { describe, expect, it, vi } from 'vitest';

import { fetchContract, severityToVariant, ApiContractProcessedResponse } from '../lib/contracts';

describe('lib/contracts', () => {
  it('fetches contract with expected payload and maps response', async () => {
    const apiResponse: ApiContractProcessedResponse = {
      contract_id: 'contract_789',
      team_id: 'team_abc',
      processed_at: '2025-11-05T12:00:00Z',
      payload: {
        metadata: { template: 'test-template' },
        clauses: [],
        risks: [],
        obligations: []
      }
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(apiResponse)
    });

    const contract = await fetchContract('test-template', {
      apiUrl: 'http://api.contract-iq.test',
      fetchFn: mockFetch
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://api.contract-iq.test/contracts/ingest',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: 'test-template',
          team_id: 'demo-team',
          ingest_source: 'web-demo'
        })
      })
    );

    expect(contract.contractId).toBe('contract_789');
    expect(contract.payload.metadata).toMatchObject({ template: 'test-template' });
  });

  it('maps severity scores to UI variants', () => {
    expect(severityToVariant(5)).toBe('danger');
    expect(severityToVariant(3)).toBe('warning');
    expect(severityToVariant(1)).toBe('success');
    expect(severityToVariant(2)).toBe('default');
  });
});