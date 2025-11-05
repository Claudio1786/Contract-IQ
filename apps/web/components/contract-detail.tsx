import React from 'react';

import { buildPlaybookPrompt } from '@contract-iq/prompts';
import { Pill } from '@contract-iq/ui';

import { ContractRecord, ApiClause, severityToVariant, ApiRisk, ApiObligation, ApiPlaybookTopic } from '../lib/contracts';

interface ContractDetailProps {
  contract: ContractRecord;
}

interface Metadata {
  template?: string;
  version?: string;
  vertical?: string;
  jurisdiction?: string;
  renewal?: {
    type?: string;
    termMonths?: number;
    noticeDays?: number;
  };
  counterparties?: Array<{
    name?: string;
    role?: string;
  }>;
}

interface BaseFee {
  amount?: number;
  currency?: string;
  billingFrequency?: string;
}

interface Financials {
  baseFee?: BaseFee;
}

export function ContractDetail({ contract }: ContractDetailProps) {
  const metadata = contract.payload.metadata as Metadata;
  const financials = contract.payload.financials as Financials | undefined;
  const processedDate = new Date(contract.processedAt);
  const contractTitle = metadata.template ? humanize(metadata.template) : 'Contract Intelligence Briefing';

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header className="space-y-3">
        <Pill label={metadata.vertical ? metadata.vertical.toString().toUpperCase() : 'CONTRACT'} />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{contractTitle}</h1>
          <div className="text-sm text-slate-400">
            Processed{' '}
            <time dateTime={contract.processedAt}>
              {processedDate.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </time>
          </div>
        </div>
        <p className="max-w-2xl text-base text-slate-300">
          Auto-generated dossier summarizing risk posture, clause benchmarks, and negotiation playbook
          recommendations for this agreement.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          <SummaryCard metadata={metadata} financials={financials} contractId={contract.contractId} />

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Clause intelligence</h2>
              <p className="text-sm text-slate-400">
                Benchmark coverage, fallback guidance, and impacted stakeholders for the highest-signal
                clauses detected in this agreement.
              </p>
            </div>
            <div className="space-y-4">
              {contract.payload.clauses.map((clause) => (
                <ClauseCard key={clause.id} clause={clause} />
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <RiskPanel risks={contract.payload.risks} />
          <PlaybookPanel
            negotiation={contract.payload.negotiation}
            clauses={contract.payload.clauses}
            risks={contract.payload.risks}
            contractName={contractTitle}
            contractType={metadata.vertical?.toString()}
          />
          <ObligationsPanel obligations={contract.payload.obligations} />
        </aside>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  metadata: Metadata;
  financials?: Financials;
  contractId: string;
}

function SummaryCard({ metadata, financials, contractId }: SummaryCardProps) {
  const counterparties = Array.isArray(metadata.counterparties)
    ? metadata.counterparties
    : [];
  const renewal = metadata.renewal ?? {};
  const baseFee = financials?.baseFee;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Engagement overview</h2>
          <p className="text-sm text-slate-400">Contract ID {contractId}</p>
        </div>
        <div className="flex gap-2">
          {counterparties.map((party) => (
            <Pill
              key={`${party.name}-${party.role}`}
              label={`${capitalize(party.role ?? '')}: ${party.name ?? 'Unknown'}`}
            />
          ))}
        </div>
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Version" value={metadata.version ? metadata.version.toString() : '—'} />
        <Metric
          label="Renewal term"
          value={renewal.termMonths ? `${renewal.termMonths} months (${renewal.type ?? 'auto'})` : '—'}
          description={
            renewal.noticeDays ? `Notice: ${renewal.noticeDays} days` : undefined
          }
        />
        <Metric
          label="Base fee"
          value={
            baseFee?.amount !== undefined
              ? formatCurrency(baseFee.amount, baseFee.currency ?? 'USD')
              : '—'
          }
          description={baseFee?.billingFrequency ? capitalize(baseFee.billingFrequency) : undefined}
        />
      </dl>
    </section>
  );
}

interface MetricProps {
  label: string;
  value: string;
  description?: string;
}

function Metric({ label, value, description }: MetricProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</dt>
      <dd className="mt-2 text-lg font-semibold text-slate-100">{value}</dd>
      {description ? <p className="text-xs text-slate-500">{description}</p> : null}
    </div>
  );
}

function ClauseCard({ clause }: { clause: ApiClause }) {
  const riskVariant = variantFromPosture(clause.riskPosture);

  return (
    <article className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Pill label={clause.category.toUpperCase()} />
          {typeof clause.benchmarkPercentile === 'number' ? (
            <span className="text-xs font-medium text-slate-400">
              P{clause.benchmarkPercentile}
            </span>
          ) : null}
        </div>
        {clause.riskPosture ? (
          <Pill label={`Risk: ${capitalize(clause.riskPosture)}`} variant={riskVariant} />
        ) : null}
      </div>
      <p className="text-sm text-slate-200">{clause.text}</p>
      {clause.playbook?.fallback ? (
        <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-amber-300">Fallback</h3>
          <p className="mt-1 text-sm text-amber-100/90">{clause.playbook.fallback}</p>
          {Array.isArray(clause.playbook.stakeholders) ? (
            <p className="mt-2 text-xs text-amber-200/80">
              Stakeholders: {clause.playbook.stakeholders.join(', ')}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function RiskPanel({ risks }: { risks: ApiRisk[] }) {
  if (!risks.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
      <h2 className="text-lg font-semibold text-rose-100">Risk posture</h2>
      <p className="text-sm text-rose-200/80">
        Severity-scored alerts requiring escalation or playbook execution.
      </p>
      <div className="mt-4 space-y-4">
        {risks.map((risk) => (
          <div key={risk.id} className="rounded-xl border border-rose-500/20 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between">
              <Pill label={`Severity ${risk.severity}/5`} variant={severityToVariant(risk.severity)} />
              {risk.linkedClause ? (
                <span className="text-xs text-rose-200/70">Clause: {risk.linkedClause}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-rose-50">{risk.signal}</p>
            <p className="text-xs text-rose-200/80">{risk.recommendation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface PlaybookPanelProps {
  negotiation: ContractRecord['payload']['negotiation'];
  clauses: ApiClause[];
  risks: ApiRisk[];
  contractName: string;
  contractType?: string;
}

function PlaybookPanel({ negotiation, clauses, risks, contractName, contractType }: PlaybookPanelProps) {
  const topics = negotiation?.playbook ?? [];
  if (!topics.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="text-lg font-semibold text-slate-100">Negotiation playbook</h2>
      <p className="text-sm text-slate-400">
        Align counterparties on targets, fallbacks, and impact to accelerate approvals.
      </p>
      <div className="mt-4 space-y-4">
        {topics.map((topic) => {
          const clause = findClauseForTopic(topic, clauses);
          const risk = clause ? risks.find((item) => item.linkedClause === clause.id) : undefined;
          const stakeholdersCandidate = clause?.playbook?.stakeholders;
          const stakeholders = Array.isArray(stakeholdersCandidate) ? (stakeholdersCandidate as string[]) : [];
          const prompt = buildPlaybookPrompt({
            contractName,
            contractType,
            topic: topic.topic,
            currentPosition: topic.current,
            targetPosition: topic.target ?? 'Not specified',
            fallbackPosition: topic.fallback ?? (clause?.playbook?.fallback as string | undefined),
            impactLevel: asImpactLevel(topic.impact),
            stakeholders,
            riskSignal: risk?.signal,
            clauseSynopsis: clause?.text,
            confidence: topic.confidence,
          });

          return (
            <div key={topic.topic} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">{topic.topic}</h3>
                {topic.impact ? (
                  <Pill label={`Impact: ${capitalize(topic.impact)}`} variant={impactToVariant(topic.impact)} />
                ) : null}
              </div>
              <dl className="mt-3 grid gap-2 text-xs text-slate-300">
                {topic.current ? <PlaybookMeta label="Current" value={topic.current} /> : null}
                {topic.target ? <PlaybookMeta label="Target" value={topic.target} /> : null}
                {topic.fallback ? <PlaybookMeta label="Fallback" value={topic.fallback} /> : null}
              </dl>
              {typeof topic.confidence === 'number' ? (
                <p className="mt-3 text-xs text-slate-500">
                  Confidence {Math.round(topic.confidence * 100)}%
                </p>
              ) : null}
              <div className="mt-4 space-y-2">
                <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">LLM negotiation prompt</h4>
                <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-[11px] leading-relaxed text-slate-200">
                  {prompt}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PlaybookMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-slate-200">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

function ObligationsPanel({ obligations }: { obligations: ApiObligation[] }) {
  if (!obligations.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
      <h2 className="text-lg font-semibold text-emerald-100">Operational obligations</h2>
      <p className="text-sm text-emerald-200/80">Keep teams aligned on action items and due dates.</p>
      <ul className="mt-4 space-y-3">
        {obligations.map((obligation) => (
          <li key={`${obligation.owner}-${obligation.description}`} className="rounded-xl border border-emerald-500/20 bg-slate-950/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Pill label={capitalize(obligation.owner)} variant="success" />
              {obligation.kpi ? (
                <span className="text-xs text-emerald-200/70">KPI: {capitalize(obligation.kpi)}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-emerald-50">{obligation.description}</p>
            {obligation.due ? (
              <p className="text-xs text-emerald-200/70">
                Due {new Date(obligation.due).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function variantFromPosture(posture?: string): 'default' | 'success' | 'warning' | 'danger' {
  if (!posture) {
    return 'default';
  }

  const value = posture.toLowerCase();
  if (value === 'standard') {
    return 'success';
  }

  if (value === 'watch' || value === 'elevated') {
    return 'warning';
  }

  if (value === 'critical') {
    return 'danger';
  }

  return 'default';
}

function impactToVariant(impact: string): 'default' | 'success' | 'warning' | 'danger' {
  const value = impact.toLowerCase();
  if (value === 'high') {
    return 'danger';
  }
  if (value === 'medium') {
    return 'warning';
  }
  if (value === 'low') {
    return 'success';
  }
  return 'default';
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function humanize(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function capitalize(value: string) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function findClauseForTopic(topic: ApiPlaybookTopic, clauses: ApiClause[]) {
  const normalizedTopic = topic.topic.toLowerCase();
  const normalizedWithDashes = normalizedTopic.replace(/\s+/g, '-');

  return clauses.find((clause) => {
    if (!clause.id) {
      return false;
    }

    const clauseId = clause.id.toLowerCase();
    const clauseHumanized = humanize(clause.id).toLowerCase();
    return clauseId === normalizedWithDashes || clauseHumanized === normalizedTopic;
  });
}

function asImpactLevel(value: string | undefined): 'low' | 'medium' | 'high' | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') {
    return normalized;
  }

  return undefined;
}