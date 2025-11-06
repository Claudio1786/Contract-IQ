'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { buildPlaybookPrompt } from '@contract-iq/prompts';
import { Pill } from '@contract-iq/ui';

import { ContractRecord, ApiClause, severityToVariant, ApiRisk, ApiObligation, ApiPlaybookTopic } from '../lib/contracts';
import { analytics } from '../lib/analytics';

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
  const templateId = typeof metadata.template === 'string' ? metadata.template : undefined;
  const vertical = typeof metadata.vertical === 'string' ? metadata.vertical : undefined;
  const clauseCount = contract.payload.clauses.length;
  const riskCount = contract.payload.risks.length;
  const playbookCount = Array.isArray(contract.payload.negotiation?.playbook)
    ? contract.payload.negotiation?.playbook?.length
    : 0;

  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    analytics.capture('contract.dossier.viewed', {
      contractId: contract.contractId,
      templateId,
      vertical,
      clauseCount,
      riskCount,
      playbookCount
    });
  }, [clauseCount, contract.contractId, playbookCount, riskCount, templateId, vertical]);

  const handleClauseExpanded = useCallback(
    (clause: ApiClause) => {
      analytics.capture('clause.card.expanded', {
        contractId: contract.contractId,
        templateId,
        vertical,
        clauseId: clause.id,
        category: clause.category,
        riskPosture: clause.riskPosture,
        hasFallback: Boolean(clause.playbook && (clause.playbook as { fallback?: unknown }).fallback)
      });
    },
    [contract.contractId, templateId, vertical]
  );

  const handleRiskEscalated = useCallback(
    (risk: ApiRisk) => {
      analytics.capture('risk.card.escalated', {
        contractId: contract.contractId,
        templateId,
        vertical,
        riskId: risk.id,
        severity: risk.severity,
        linkedClause: risk.linkedClause
      });
    },
    [contract.contractId, templateId, vertical]
  );

  const handlePromptGenerated = useCallback(
    (payload: { topic: string; impact?: string; clauseId?: string }) => {
      analytics.capture('playbook.prompt.generated', {
        contractId: contract.contractId,
        templateId,
        vertical,
        topic: payload.topic,
        impact: payload.impact,
        clauseId: payload.clauseId
      });
    },
    [contract.contractId, templateId, vertical]
  );

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
            <div className="space-y-4" aria-live="polite">
              {contract.payload.clauses.length ? (
                contract.payload.clauses.map((clause) => (
                  <ClauseCard
                    key={clause.id}
                    clause={clause}
                    onExpand={handleClauseExpanded}
                  />
                ))
              ) : (
                <EmptyMessage
                  title="No clause intelligence yet"
                  description={
                    <>
                      We could not detect clause benchmarks for this dossier. Ensure the ingest payload includes
                      clause metadata or{' '}
                      <a
                        href="https://docs.contractiq.ai/ingest-guides"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline"
                      >
                        review the ingest guide
                      </a>{' '}
                      for formatting tips.
                    </>
                  }
                />
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <RiskPanel risks={contract.payload.risks} onEscalate={handleRiskEscalated} />
          <PlaybookPanel
            negotiation={contract.payload.negotiation}
            clauses={contract.payload.clauses}
            risks={contract.payload.risks}
            contractName={contractTitle}
            contractType={metadata.vertical?.toString()}
            onPromptGenerated={handlePromptGenerated}
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

function ClauseCard({ clause, onExpand }: { clause: ApiClause; onExpand: (clause: ApiClause) => void }) {
  const riskVariant = variantFromPosture(clause.riskPosture);
  const playbook = clause.playbook as
    | {
        fallback?: unknown;
        stakeholders?: unknown;
      }
    | undefined;
  const fallback = typeof playbook?.fallback === 'string' ? playbook.fallback : undefined;
  const stakeholders = Array.isArray(playbook?.stakeholders)
    ? playbook.stakeholders.filter((value): value is string => typeof value === 'string')
    : undefined;
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((previous) => {
      const next = !previous;
      if (next) {
        onExpand(clause);
      }
      return next;
    });
  };

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
      {fallback ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleToggle}
            className="text-xs font-semibold text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? 'Hide fallback guidance' : 'View fallback guidance'}
          </button>
          {expanded ? (
            <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-300">Fallback</h3>
              <p className="mt-1 text-sm text-amber-100/90">{fallback}</p>
              {stakeholders?.length ? (
                <p className="mt-2 text-xs text-amber-200/80">Stakeholders: {stakeholders.join(', ')}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function RiskPanel({ risks, onEscalate }: { risks: ApiRisk[]; onEscalate: (risk: ApiRisk) => void }) {
  return (
    <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5" aria-live="polite">
      <h2 className="text-lg font-semibold text-rose-100">Risk posture</h2>
      <p className="text-sm text-rose-200/80">
        Severity-scored alerts requiring escalation or playbook execution.
      </p>
      <div className="mt-4 space-y-4">
        {risks.length ? (
          risks.map((risk) => <RiskCard key={risk.id} risk={risk} onEscalate={onEscalate} />)
        ) : (
          <EmptyMessage
            title="No risks flagged"
            description={
              <>
                We didn’t identify any risk alerts for this contract. Configure threshold rules in the ingestion
                pipeline or{' '}
                <a
                  href="https://docs.contractiq.ai/risk-tuning"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-rose-200 underline-offset-2 hover:text-rose-100 hover:underline"
                >
                  review risk tuning guidance
                </a>{' '}
                to surface escalations.
              </>
            }
            tone="rose"
          />
        )}
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
  onPromptGenerated: (payload: { topic: string; impact?: string; clauseId?: string }) => void;
}

function PlaybookPanel({ negotiation, clauses, risks, contractName, contractType, onPromptGenerated }: PlaybookPanelProps) {
  const topics = Array.isArray(negotiation?.playbook) ? (negotiation?.playbook as ApiPlaybookTopic[]) : [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5" aria-live="polite">
      <h2 className="text-lg font-semibold text-slate-100">Negotiation playbook</h2>
      <p className="text-sm text-slate-400">
        Align counterparties on targets, fallbacks, and impact to accelerate approvals.
      </p>
      <div className="mt-4 space-y-4">
        {topics.length ? (
          topics.map((topic) => {
            const clause = findClauseForTopic(topic, clauses);
            const risk = clause ? risks.find((item) => item.linkedClause === clause.id) : undefined;
            return (
              <PlaybookTopicCard
                key={topic.topic}
                topic={topic}
                clause={clause}
                risk={risk}
                contractName={contractName}
                contractType={contractType}
                onPromptGenerated={onPromptGenerated}
              />
            );
          })
        ) : (
          <EmptyMessage
            title="No negotiation topics"
            description={
              <>
                We didn’t identify any negotiation playbook entries. Adjust extraction prompts in the fixtures or{' '}
                <a
                  href="https://docs.contractiq.ai/playbook-instrumentation"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline"
                >
                  review the playbook instrumentation guide
                </a>{' '}
                for setup instructions.
              </>
            }
            tone="amber"
          />
        )}
      </div>
    </section>
  );
}

function RiskCard({ risk, onEscalate }: { risk: ApiRisk; onEscalate: (risk: ApiRisk) => void }) {
  const [escalated, setEscalated] = useState(false);

  const handleEscalate = () => {
    if (escalated) {
      return;
    }

    onEscalate(risk);
    setEscalated(true);
  };

  return (
    <div className="space-y-3 rounded-xl border border-rose-500/20 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <Pill label={`Severity ${risk.severity}/5`} variant={severityToVariant(risk.severity)} />
        {risk.linkedClause ? (
          <span className="text-xs text-rose-200/70">Clause: {risk.linkedClause}</span>
        ) : null}
      </div>
      <p className="text-sm text-rose-50">{risk.signal}</p>
      <p className="text-xs text-rose-200/80">{risk.recommendation}</p>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleEscalate}
          disabled={escalated}
          className="text-xs font-semibold text-rose-200 underline-offset-2 hover:text-rose-100 hover:underline disabled:cursor-not-allowed disabled:text-rose-200/60"
        >
          {escalated ? 'Escalated' : 'Escalate risk'}
        </button>
        {escalated ? <span className="text-[11px] text-rose-200/70">Escalation logged</span> : null}
      </div>
    </div>
  );
}

interface PlaybookTopicCardProps {
  topic: ApiPlaybookTopic;
  clause?: ApiClause;
  risk?: ApiRisk;
  contractName: string;
  contractType?: string;
  onPromptGenerated: (payload: { topic: string; impact?: string; clauseId?: string }) => void;
}

function PlaybookTopicCard({
  topic,
  clause,
  risk,
  contractName,
  contractType,
  onPromptGenerated
}: PlaybookTopicCardProps) {
  const stakeholdersCandidate = clause?.playbook?.stakeholders;
  const stakeholders = useMemo(
    () =>
      Array.isArray(stakeholdersCandidate)
        ? (stakeholdersCandidate as string[])
        : [],
    [stakeholdersCandidate]
  );

  const prompt = useMemo(
    () =>
      buildPlaybookPrompt({
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
        confidence: topic.confidence
      }),
    [clause?.playbook?.fallback, clause?.text, contractName, contractType, risk?.signal, stakeholders, topic.confidence, topic.current, topic.fallback, topic.impact, topic.target, topic.topic]
  );

  const [copied, setCopied] = useState(false);

  const handlePromptClick = useCallback(async () => {
    onPromptGenerated({ topic: topic.topic, impact: topic.impact, clauseId: clause?.id });

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  }, [clause?.id, onPromptGenerated, prompt, topic.impact, topic.topic]);

  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-100">{topic.topic}</h3>
        {topic.impact ? (
          <Pill label={`Impact: ${capitalize(topic.impact)}`} variant={impactToVariant(topic.impact)} />
        ) : null}
      </div>
      <dl className="grid gap-2 text-xs text-slate-300">
        {topic.current ? <PlaybookMeta label="Current" value={topic.current} /> : null}
        {topic.target ? <PlaybookMeta label="Target" value={topic.target} /> : null}
        {topic.fallback ? <PlaybookMeta label="Fallback" value={topic.fallback} /> : null}
      </dl>
      {typeof topic.confidence === 'number' ? (
        <p className="text-xs text-slate-500">Confidence {Math.round(topic.confidence * 100)}%</p>
      ) : null}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">LLM negotiation prompt</h4>
          <button
            type="button"
            onClick={handlePromptClick}
            className="text-xs font-semibold text-amber-300 underline-offset-2 hover:text-amber-200 hover:underline"
          >
            {copied ? 'Copied!' : 'Copy prompt'}
          </button>
        </div>
        <pre className="whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-[11px] leading-relaxed text-slate-200">
          {prompt}
        </pre>
      </div>
    </div>
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
  return (
    <section className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5" aria-live="polite">
      <h2 className="text-lg font-semibold text-emerald-100">Operational obligations</h2>
      <p className="text-sm text-emerald-200/80">Keep teams aligned on action items and due dates.</p>
      {obligations.length ? (
        <ul className="mt-4 space-y-3">
          {obligations.map((obligation) => (
            <li
              key={`${obligation.owner}-${obligation.description}`}
              className="rounded-xl border border-emerald-500/20 bg-slate-950/40 p-4"
            >
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
      ) : (
        <EmptyMessage
          title="No obligations surfaced"
          description={
            <>
              We didn’t find follow-up tasks tied to this contract. Add obligation extraction to your ingest pipeline or{' '}
              <a
                href="https://docs.contractiq.ai/obligation-tracking"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-200 underline-offset-2 hover:text-emerald-100 hover:underline"
              >
                review obligation tracking tips
              </a>{' '}
              for configuration guidance.
            </>
          }
          tone="emerald"
        />
      )}
    </section>
  );
}

type EmptyTone = 'default' | 'rose' | 'amber' | 'emerald';

function EmptyMessage({
  title,
  description,
  tone = 'default'
}: {
  title: string;
  description: React.ReactNode;
  tone?: EmptyTone;
}) {
  const toneStyles: Record<EmptyTone, { container: string; heading: string; body: string }> = {
    default: {
      container: 'border-slate-800 bg-slate-900/40',
      heading: 'text-slate-200',
      body: 'text-slate-400'
    },
    rose: {
      container: 'border-rose-500/30 bg-rose-500/10',
      heading: 'text-rose-100',
      body: 'text-rose-200/80'
    },
    amber: {
      container: 'border-amber-500/30 bg-amber-500/10',
      heading: 'text-amber-200',
      body: 'text-amber-200/80'
    },
    emerald: {
      container: 'border-emerald-500/30 bg-emerald-500/10',
      heading: 'text-emerald-100',
      body: 'text-emerald-200/80'
    }
  };

  const styles = toneStyles[tone];

  return (
    <div className={`rounded-xl border ${styles.container} p-4`} role="region" aria-live="polite">
      <p className={`text-sm font-semibold ${styles.heading}`}>{title}</p>
      <p className={`text-sm ${styles.body}`}>{description}</p>
    </div>
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