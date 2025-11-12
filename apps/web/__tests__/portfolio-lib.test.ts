import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest';

import saasMsa from '../../../fixtures/contracts/saas-msa.json';
import saasDpa from '../../../fixtures/contracts/saas-dpa.json';
import healthcareBaa from '../../../fixtures/contracts/healthcare-baa.json';
import publicSectorSow from '../../../fixtures/contracts/public-sector-sow.json';
import nilAgreement from '../../../fixtures/contracts/nil-athlete-agreement.json';
import { computePortfolioMetrics } from '../lib/portfolio';
import type { ContractRecord } from '../lib/contracts';

function buildRecord(id: string, payload: unknown): ContractRecord {
  return {
    contractId: id,
    teamId: 'demo-team',
    processedAt: '2025-11-05T12:00:00Z',
    payload: payload as ContractRecord['payload']
  };
}

describe('portfolio metrics', () => {
  const fixtures = [
    buildRecord('contract-msa', saasMsa),
    buildRecord('contract-dpa', saasDpa),
    buildRecord('contract-healthcare', healthcareBaa),
    buildRecord('contract-public', publicSectorSow),
    buildRecord('contract-nil', nilAgreement)
  ];

  beforeAll(() => {
    const fixedNow = new Date('2025-11-05T12:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('aggregates summary metrics across contracts', () => {
    const metrics = computePortfolioMetrics(fixtures);

    expect(metrics.summary.totalContracts).toBe(5);
    expect(metrics.summary.annualizedValue).toBe(660000);
    expect(metrics.summary.highRiskContracts).toBe(5);
    expect(metrics.summary.upcomingRenewalCount).toBe(2);
    expect(metrics.summary.totalPlaybookTopics).toBe(8);
    expect(metrics.summary.averageConfidence).toBe(0.89);
  });

  it('produces prioritized alerts for renewals and critical risks', () => {
    const metrics = computePortfolioMetrics(fixtures);

    const renewalAlerts = metrics.alerts.filter((alert) => alert.type === 'renewal');
    const riskAlerts = metrics.alerts.filter((alert) => alert.type === 'risk');
    const obligationAlerts = metrics.alerts.filter((alert) => alert.type === 'obligation');

    expect(renewalAlerts).toHaveLength(2);
    expect(renewalAlerts.map((alert) => alert.contractId)).toContain('contract-msa');
    expect(renewalAlerts.map((alert) => alert.contractId)).toContain('contract-nil');
    expect(renewalAlerts.some((alert) => alert.severity === 'critical')).toBe(true);

    expect(riskAlerts).toHaveLength(5);
    expect(riskAlerts.filter((alert) => alert.severity === 'critical')).toHaveLength(1);
    expect(obligationAlerts).toHaveLength(2);
  });

  it('summarizes vertical breakdowns with value and risk signals', () => {
    const metrics = computePortfolioMetrics(fixtures);

    expect(metrics.verticals).toHaveLength(4);

    const saasSegment = metrics.verticals.find((segment) => segment.vertical === 'saas');
    const nilSegment = metrics.verticals.find((segment) => segment.vertical === 'nil');
    const healthcareSegment = metrics.verticals.find((segment) => segment.vertical === 'healthcare');
    const publicSectorSegment = metrics.verticals.find((segment) => segment.vertical === 'public-sector');

    expect(saasSegment).toEqual(
      expect.objectContaining({
        contracts: 2,
        annualizedValue: 185000,
        highSeverityRisks: 2,
        playbookTopics: 3
      })
    );

    expect(nilSegment).toEqual(
      expect.objectContaining({
        contracts: 1,
        annualizedValue: 140000,
        highSeverityRisks: 1,
        playbookTopics: 1
      })
    );

    expect(healthcareSegment).toEqual(
      expect.objectContaining({
        contracts: 1,
        annualizedValue: 125000,
        highSeverityRisks: 1,
        playbookTopics: 2
      })
    );

    expect(publicSectorSegment).toEqual(
      expect.objectContaining({
        contracts: 1,
        annualizedValue: 210000,
        highSeverityRisks: 1,
        playbookTopics: 2
      })
    );
  });
});