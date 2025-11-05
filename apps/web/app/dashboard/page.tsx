import React from 'react';
import Link from 'next/link';

import { Pill } from '@contract-iq/ui';

import saasMsa from '../../../../fixtures/contracts/saas-msa.json';
import saasDpa from '../../../../fixtures/contracts/saas-dpa.json';
import healthcareBaa from '../../../../fixtures/contracts/healthcare-baa.json';
import publicSectorSow from '../../../../fixtures/contracts/public-sector-sow.json';
import nilAgreement from '../../../../fixtures/contracts/nil-athlete-agreement.json';
import { computePortfolioMetrics, type PortfolioAlert } from '../../lib/portfolio';
import type { ContractRecord } from '../../lib/contracts';

const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const PERCENT_FORMATTER = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const FIXTURE_RECORDS: ContractRecord[] = [
  buildFixtureRecord('saas-msa', saasMsa),
  buildFixtureRecord('saas-dpa', saasDpa),
  buildFixtureRecord('healthcare-baa', healthcareBaa),
  buildFixtureRecord('public-sector-sow', publicSectorSow),
  buildFixtureRecord('nil-athlete-agreement', nilAgreement)
];

export default function PortfolioDashboardPage() {
  const metrics = computePortfolioMetrics(FIXTURE_RECORDS);

  const summaryCards = [
    {
      label: 'Contracts in portfolio',
      value: metrics.summary.totalContracts.toString(),
      helper: `${metrics.summary.totalPlaybookTopics} playbook topics tracked`
    },
    {
      label: 'Annualized contract value',
      value: CURRENCY_FORMATTER.format(metrics.summary.annualizedValue),
      helper: 'Includes SaaS base fees and NIL compensation'
    },
    {
      label: 'Contracts with severity ≥4 risk',
      value: metrics.summary.highRiskContracts.toString(),
      helper: `${metrics.alerts.filter((alert) => alert.type === 'risk').length} risk alerts tracked`
    },
    {
      label: 'Renewals with short notice',
      value: metrics.summary.upcomingRenewalCount.toString(),
      helper: `${metrics.alerts.filter((alert) => alert.type === 'renewal').length} renewal alerts`
    },
    {
      label: 'Average extraction confidence',
      value:
        metrics.summary.averageConfidence !== null
          ? PERCENT_FORMATTER.format(metrics.summary.averageConfidence)
          : '—',
      helper: 'Pooled across processed fixtures'
    }
  ];

  const visibleAlerts = metrics.alerts.slice(0, 6);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-3">
        <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Portfolio dashboard</span>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Contract health across SaaS and NIL templates
        </h1>
        <p className="max-w-3xl text-sm text-slate-400">
          Aggregated intelligence from fixture ingestion runs. Each KPI updates automatically as new
          agreements are processed and risk posture shifts.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.helper}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">Alerts & playbook escalations</h2>
            <Link
              href="/contracts/saas-msa"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-200"
            >
              View dossier →
            </Link>
          </div>

          <div className="space-y-3">
            {visibleAlerts.length === 0 ? (
              <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
                No active alerts. Monitor ingestion events to populate the portfolio feed.
              </p>
            ) : (
              visibleAlerts.map((alert) => (
                <article
                  key={`${alert.contractId}-${alert.label}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                        {alert.type}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-100">{alert.label}</h3>
                    </div>
                    <Pill label={alertSeverityLabel(alert)} variant={severityToVariant(alert.severity)} />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{alert.detail}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Contract {alert.contractId}
                    {alert.template ? ` · ${humanize(alert.template)}` : ''}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Vertical coverage</h2>
            <p className="text-xs text-slate-500">Annualized value and high-severity risk density by vertical.</p>
          </div>
          <div className="space-y-3">
            {metrics.verticals.map((segment) => (
              <div
                key={segment.vertical}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-100">{humanize(segment.vertical)}</h3>
                  <Pill label={`${segment.contracts} contracts`} variant="default" />
                </div>
                <dl className="mt-3 grid gap-2 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <dt className="uppercase tracking-[0.2em]">Annualized value</dt>
                    <dd className="text-slate-200">
                      {CURRENCY_FORMATTER.format(segment.annualizedValue)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="uppercase tracking-[0.2em]">Severity ≥4 risks</dt>
                    <dd className="text-slate-200">{segment.highSeverityRisks}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="uppercase tracking-[0.2em]">Playbook topics</dt>
                    <dd className="text-slate-200">{segment.playbookTopics}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

function buildFixtureRecord(id: string, payload: unknown): ContractRecord {
  return {
    contractId: id,
    teamId: 'demo-team',
    processedAt: new Date().toISOString(),
    payload: payload as ContractRecord['payload']
  };
}

function severityToVariant(severity: PortfolioAlert['severity']): 'danger' | 'warning' {
  return severity === 'critical' ? 'danger' : 'warning';
}

function alertSeverityLabel(alert: PortfolioAlert): string {
  if (alert.type === 'renewal') {
    return alert.severity === 'critical' ? 'Critical renewal' : 'Renewal risk';
  }

  if (alert.type === 'obligation') {
    return alert.severity === 'critical' ? 'Obligation urgent' : 'Obligation due soon';
  }

  return alert.severity === 'critical' ? 'Critical risk' : 'Elevated risk';
}

function humanize(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}