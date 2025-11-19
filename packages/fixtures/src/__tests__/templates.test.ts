import { describe, expect, it } from 'vitest';

import {
  CONTRACT_TEMPLATE_IDS,
  DEFAULT_FIXTURE_PROCESSED_AT,
  DEFAULT_FIXTURE_TEAM_ID,
  createApiContractResponse,
  getContractFixture
} from '../templates';

describe('contract fixtures helpers', () => {
  it('provides deterministic defaults for every template id', () => {
    for (const templateId of CONTRACT_TEMPLATE_IDS) {
      const fixture = getContractFixture(templateId);
      expect(fixture.contractId).toBe(`demo-${templateId}`);
      expect(fixture.teamId).toBe(DEFAULT_FIXTURE_TEAM_ID);
      expect(fixture.processedAt).toBe(DEFAULT_FIXTURE_PROCESSED_AT);
      expect(fixture.payload.metadata).toBeDefined();
      expect(Array.isArray(fixture.payload.clauses)).toBe(true);
    }
  });

  it('applies overrides to api response clones without mutating base payload', () => {
    const first = createApiContractResponse('saas-msa', {
      contractId: 'contract-alpha',
      payload: {
        metadata: { stage: 'initial' },
        clauses: []
      }
    });

    const second = createApiContractResponse('saas-msa');

    expect(first.contract_id).toBe('contract-alpha');
    expect(first.payload.metadata).toMatchObject({ stage: 'initial' });
    expect(first.payload.clauses).toHaveLength(0);

    expect(second.contract_id).toBe('demo-saas-msa');
    expect(Array.isArray(second.payload.clauses)).toBe(true);
    expect(second.payload.metadata).not.toHaveProperty('stage');
  });
});