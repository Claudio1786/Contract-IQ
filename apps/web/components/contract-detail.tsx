'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buildPlaybookPrompt } from '@contract-iq/prompts';
import { Pill } from '@contract-iq/ui';

import { ContractRecord, ApiClause, severityToVariant, ApiRisk, ApiObligation, ApiPlaybookTopic } from '../lib/contracts';
import { analytics } from '../lib/analytics';
import {
  requestNegotiationGuidance,
  NegotiationGuidance,
  NegotiationContextPayload,
  NegotiationApiError,
  NegotiationMetadataPayload
} from '../lib/ai';

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
            contractId={contract.contractId}
            contractName={contractTitle}
            contractType={metadata.vertical?.toString()}
            templateId={templateId}
            vertical={vertical}
            metadata={metadata}
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
  contractId: string;
  contractName: string;
  contractType?: string;
  templateId?: string;
  vertical?: string;
  metadata: Metadata;
  onPromptGenerated: (payload: { topic: string; impact?: string; clauseId?: string }) => void;
}

function PlaybookPanel({
  negotiation,
  clauses,
  risks,
  contractId,
  contractName,
  contractType,
  templateId,
  vertical,
  metadata,
  onPromptGenerated
}: PlaybookPanelProps) {
  const topics = Array.isArray(negotiation?.playbook) ? (negotiation?.playbook as ApiPlaybookTopic[]) : [];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5" aria-live="polite">
      <h2 className="text-lg font-semibold text-slate-100">Negotiation playbook</h2>
      <p className="text-sm text-slate-400">
        Align counterparties on targets, fallbacks, and impact to accelerate approvals.
      </p>
      {topics.length ? (
        <div className="mt-4 space-y-4">
          <GeminiGuidancePanel
            topics={topics}
            clauses={clauses}
            risks={risks}
            contractId={contractId}
            templateId={templateId ?? 'generic-template'}
            contractName={contractName}
            contractType={contractType}
            metadata={metadata}
            vertical={vertical ?? contractType}
          />
          {topics.map((topic) => {
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
          })}
        </div>
      ) : (
        <div className="mt-4">
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
        </div>
      )}
    </section>
  );
}

interface GeminiGuidancePanelProps {
  topics: ApiPlaybookTopic[];
  clauses: ApiClause[];
  risks: ApiRisk[];
  contractId: string;
  templateId: string;
  contractName: string;
  contractType?: string;
  metadata: Metadata;
  vertical?: string;
}

function GeminiGuidancePanel({
  topics,
  clauses,
  risks,
  contractId,
  templateId,
  contractName,
  contractType,
  metadata,
  vertical
}: GeminiGuidancePanelProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(topics[0]?.topic);
  const [guidanceByTopic, setGuidanceByTopic] = useState<Record<string, NegotiationGuidance>>({});
  const [errorByTopic, setErrorByTopic] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!topics.length) {
      setSelectedTopicId(undefined);
      return;
    }

    if (!selectedTopicId || !topics.some((topic) => topic.topic === selectedTopicId)) {
      setSelectedTopicId(topics[0]?.topic);
    }
  }, [selectedTopicId, topics]);

  useEffect(() => () => {
    abortRef.current?.abort();
  }, []);

  const selectedTopic = selectedTopicId ? topics.find((topic) => topic.topic === selectedTopicId) : undefined;
  const associatedClause = selectedTopic ? findClauseForTopic(selectedTopic, clauses) : undefined;
  const associatedRisk = associatedClause
    ? risks.find((item) => item.linkedClause === associatedClause.id)
    : undefined;
  const currentGuidance = selectedTopic ? guidanceByTopic[selectedTopic.topic] : undefined;
  const currentError = selectedTopic ? errorByTopic[selectedTopic.topic] : undefined;

  const handleGenerate = useCallback(async () => {
    if (!selectedTopic) {
      return;
    }

    const clause = associatedClause;
    const risk = associatedRisk;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const cached = Boolean(guidanceByTopic[selectedTopic.topic]);
    const payload = buildNegotiationContextPayload({
      topic: selectedTopic,
      clause,
      risk,
      contractId,
      templateId,
      contractName,
      contractType,
      metadata,
      vertical
    });

    setIsGenerating(true);
    setLastLatencyMs(null);
    setErrorByTopic((previous) => {
      const next = { ...previous };
      delete next[selectedTopic.topic];
      return next;
    });

    analytics.capture('playbook.gemini.requested', {
      contractId,
      templateId,
      vertical: vertical ?? null,
      topic: selectedTopic.topic,
      cached,
      stakeholdersCount: payload.stakeholders?.length ?? 0,
      impact: selectedTopic.impact ?? null,
      riskSignal: risk?.signal ?? null
    });

    const start = performance.now();

    try {
      const guidance = await requestNegotiationGuidance(payload, { signal: controller.signal });

      setGuidanceByTopic((previous) => ({ ...previous, [selectedTopic.topic]: guidance }));
      const measuredLatency = performance.now() - start;
      const effectiveLatency = guidance.latencyMs ?? measuredLatency;
      setLastLatencyMs(effectiveLatency);

      analytics.capture('playbook.gemini.generated', {
        contractId,
        templateId,
        vertical: vertical ?? null,
        topic: selectedTopic.topic,
        latencyMs: Math.round(effectiveLatency),
        cached: guidance.cached,
        model: guidance.model ?? null
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      const message = normalizeGeminiError(error);
      setErrorByTopic((previous) => ({ ...previous, [selectedTopic.topic]: message }));

      analytics.capture('playbook.gemini.errored', {
        contractId,
        templateId,
        vertical: vertical ?? null,
        topic: selectedTopic.topic,
        message
      });
    } finally {
      if (!controller.signal.aborted) {
        setIsGenerating(false);
      }
      abortRef.current = null;
    }
  }, [associatedClause, associatedRisk, contractId, contractType, guidanceByTopic, metadata, selectedTopic, templateId, vertical]);

  if (!selectedTopic) {
    return null;
  }

  const hasError = Boolean(currentError);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Gemini negotiation guidance</h3>
          <p className="text-xs text-slate-400">
            Generate tailored counter positions using Google Gemini Flash with contextual playbook data.
          </p>
        </div>
        <label className="flex flex-col text-xs text-slate-400 sm:w-60">
          <span className="mb-1 font-semibold text-slate-300">Topic</span>
          <select
            className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            value={selectedTopicId ?? ''}
            onChange={(event) => setSelectedTopicId(event.target.value || topics[0]?.topic)}
            disabled={isGenerating}
          >
            {topics.map((topic) => (
              <option key={topic.topic} value={topic.topic}>
                {topic.topic}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900/40 disabled:text-slate-500"
          >
            {isGenerating ? 'Generating…' : 'Generate with Gemini'}
          </button>
          {lastLatencyMs !== null ? (
            <span className="text-[11px] text-slate-400">Generated in {formatLatency(lastLatencyMs)}</span>
          ) : null}
        </div>
        {currentGuidance?.model ? (
          <span className="text-[11px] text-slate-500">Model: {currentGuidance.model}</span>
        ) : null}
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        {isGenerating ? (
          <div className="animate-pulse space-y-2 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <div className="h-4 w-2/3 rounded bg-slate-800/70" />
            <div className="h-3 w-full rounded bg-slate-800/50" />
            <div className="h-3 w-5/6 rounded bg-slate-800/40" />
          </div>
        ) : null}

        {hasError ? (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-100">
            {currentError}
          </div>
        ) : null}

        {!isGenerating && !hasError && !currentGuidance ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
            Tap <span className="font-semibold text-amber-200">Generate with Gemini</span> to craft a counter position grounded in
            your playbook, clause text, and risk posture.
          </div>
        ) : null}

        {currentGuidance ? (
          <GeminiGuidanceResult guidance={currentGuidance} />
        ) : null}
      </div>
    </section>
  );
}

function GeminiGuidanceResult({ guidance }: { guidance: NegotiationGuidance }) {
  const talkingPoints = Array.isArray(guidance.talkingPoints) ? guidance.talkingPoints : [];
  const riskCallouts = Array.isArray(guidance.riskCallouts) ? guidance.riskCallouts : [];
  const fallbackRecommendation = guidance.fallbackRecommendation;
  const prompt = guidance.generatedPrompt;
  const documentationUrl = guidance.documentationUrl;

  const confidencePercent = Number.isFinite(guidance.confidence)
    ? Math.round(guidance.confidence * 100)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
        <span>{guidance.cached ? 'Served from cache' : 'Fresh generation'}</span>
        {confidencePercent !== null ? <span>Confidence {confidencePercent}%</span> : null}
        <span>Latency {formatLatency(guidance.latencyMs)}</span>
        {guidance.model ? <span>Model {guidance.model}</span> : null}
      </div>

      {guidance.summary ? (
        <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Summary</h4>
          <p className="mt-2 text-sm text-slate-200">{guidance.summary}</p>
        </section>
      ) : null}

      {talkingPoints.length ? (
        <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Key talking points</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {talkingPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-amber-300" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {fallbackRecommendation ? (
        <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Fallback recommendation</h4>
          <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
            {fallbackRecommendation}
          </pre>
        </section>
      ) : null}

      {riskCallouts.length ? (
        <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500">Risk callouts</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {riskCallouts.map((callout) => (
              <li key={callout} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-rose-300" />
                <span>{callout}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {documentationUrl ? (
        <a
          href={documentationUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-200 underline-offset-2 hover:text-amber-100 hover:underline"
        >
          View reference documentation
        </a>
      ) : null}

      {prompt ? (
        <details className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-xs font-semibold text-slate-200">
            View generated prompt
          </summary>
          <pre className="mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-200">{prompt}</pre>
        </details>
      ) : null}
    </div>
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

interface BuildNegotiationContextOptions {
  topic: ApiPlaybookTopic;
  clause?: ApiClause;
  risk?: ApiRisk;
  contractId: string;
  templateId: string;
  contractName: string;
  contractType?: string;
  metadata: Metadata;
  vertical?: string;
}

interface BuildMetadataPayloadOptions {
  contractName: string;
  contractType?: string;
  metadata: Metadata;
  vertical?: string;
  risk?: ApiRisk;
  topicConfidence?: number;
}

function buildNegotiationContextPayload(options: BuildNegotiationContextOptions): NegotiationContextPayload {
  const { topic, clause, risk, contractId, templateId, contractName, contractType, metadata, vertical } = options;

  const clausePlaybook = clause?.playbook as { fallback?: unknown; stakeholders?: unknown } | null | undefined;
  const fallbackCandidates = [compactString(topic.fallback), compactString(clausePlaybook?.fallback)];
  const fallbackPosition = fallbackCandidates.find((value): value is string => Boolean(value)) ?? null;

  const stakeholders = gatherStakeholders(topic, clausePlaybook);

  const currentPosition = compactString(topic.current) ?? compactString(clause?.text) ?? 'Current position not provided.';
  const targetPosition = compactString(topic.target) ?? currentPosition;
  const impact = compactString(topic.impact);

  const metadataPayload = buildMetadataPayload({
    contractName,
    contractType,
    metadata,
    vertical,
    risk,
    topicConfidence: typeof topic.confidence === 'number' ? topic.confidence : undefined
  });

  const context: NegotiationContextPayload = {
    topic: topic.topic,
    contract_id: contractId,
    template_id: templateId,
    vertical: vertical ?? null,
    current_position: currentPosition,
    target_position: targetPosition,
    impact: impact ?? null,
    risk_signal: risk?.signal ?? null,
    ...(fallbackPosition ? { fallback_position: fallbackPosition } : {}),
    ...(stakeholders.length ? { stakeholders } : {}),
    ...(metadataPayload ? { metadata: metadataPayload } : {})
  };

  return context;
}

function buildMetadataPayload(options: BuildMetadataPayloadOptions): NegotiationMetadataPayload | undefined {
  const { contractName, contractType, metadata, vertical, risk, topicConfidence } = options;
  const payload: NegotiationMetadataPayload = {};

  const normalizedContractName = compactString(contractName);
  if (normalizedContractName) {
    payload.contract_name = normalizedContractName;
  }

  const normalizedContractType = compactString(contractType);
  if (normalizedContractType) {
    payload.contract_type = normalizedContractType;
  }

  const counterparty = getPrimaryCounterparty(metadata);
  if (counterparty) {
    payload.counterparty = counterparty;
  }

  const jurisdiction = compactString(metadata.jurisdiction);
  if (jurisdiction) {
    payload.jurisdiction = jurisdiction;
  }

  const additionalContext: Record<string, unknown> = {};

  if (metadata.version) {
    additionalContext.version = metadata.version;
  }

  if (metadata.renewal) {
    additionalContext.renewal = metadata.renewal;
  }

  if (vertical) {
    additionalContext.vertical = vertical;
  }

  if (risk?.id) {
    additionalContext.riskId = risk.id;
  }

  if (typeof topicConfidence === 'number') {
    additionalContext.topicConfidence = topicConfidence;
  }

  if (Object.keys(additionalContext).length > 0) {
    payload.additional_context = additionalContext;
  }

  return Object.keys(payload).length > 0 ? payload : undefined;
}

function gatherStakeholders(
  topic: ApiPlaybookTopic,
  clausePlaybook: { stakeholders?: unknown } | null | undefined
): string[] {
  const stakeholders = new Set<string>();

  const clauseStakeholders = clausePlaybook?.stakeholders;
  if (Array.isArray(clauseStakeholders)) {
    clauseStakeholders.forEach((stakeholder) => {
      const normalized = compactString(stakeholder);
      if (normalized) {
        stakeholders.add(normalized);
      }
    });
  }

  const topicStakeholders = (topic as unknown as { stakeholders?: unknown }).stakeholders;
  if (Array.isArray(topicStakeholders)) {
    topicStakeholders.forEach((stakeholder) => {
      const normalized = compactString(stakeholder);
      if (normalized) {
        stakeholders.add(normalized);
      }
    });
  }

  return Array.from(stakeholders);
}

function normalizeGeminiError(error: unknown): string {
  if (error instanceof NegotiationApiError) {
    if (error.status === 429) {
      return 'Gemini rate limit reached. Please retry shortly.';
    }

    if ((error.status ?? 0) >= 500) {
      return 'Gemini service is unavailable right now. Try again in a few moments.';
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error while generating Gemini guidance. Please retry.';
}

function formatLatency(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    return '—';
  }

  if (value < 1000) {
    return `${Math.max(0, Math.round(value))}ms`;
  }

  const seconds = value / 1000;
  if (seconds >= 10) {
    return `${Math.round(seconds)}s`;
  }

  return `${seconds.toFixed(1)}s`;
}

function compactString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function getPrimaryCounterparty(metadata: Metadata): string | null {
  if (!Array.isArray(metadata.counterparties)) {
    return null;
  }

  for (const counterparty of metadata.counterparties) {
    const name = compactString(counterparty?.name);
    if (name) {
      return name;
    }
  }

  return null;
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