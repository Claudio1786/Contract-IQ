#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const DEFAULT_TEMPLATE_IDS = [
  'saas-msa',
  'saas-dpa',
  'healthcare-baa',
  'public-sector-sow',
  'nil-athlete-agreement'
];

const API_BASE_URL = process.env.CONTRACT_IQ_API_URL ?? 'http://localhost:8000';
const OUTPUT_PATH = resolve(process.cwd(), process.env.CONTRACT_IQ_DEMO_OUTPUT ?? 'tmp/demo-portfolio.json');

const cliArgs = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const templates = cliArgs.length > 0 ? cliArgs : DEFAULT_TEMPLATE_IDS;

const timestamp = new Date().toISOString();

async function main() {
  console.log(`Seeding demo portfolio via ${API_BASE_URL}`);
  const contractRecords = [];

  for (const templateId of templates) {
    const record = await ingestTemplate(templateId);
    contractRecords.push(record);
    console.log(`  • ${templateId} → ${record.contractId}`);
  }

  const metrics = computePortfolioMetrics(contractRecords);
  await persistSnapshot({
    createdAt: timestamp,
    apiBaseUrl: API_BASE_URL,
    templates,
    metrics,
    records: contractRecords
  });

  printSummary(metrics);
}

async function ingestTemplate(templateId) {
  const response = await fetch(`${API_BASE_URL}/contracts/ingest`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      template_id: templateId,
      team_id: 'demo-seed-team',
      ingest_source: 'demo-seed-script'
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to ingest ${templateId}: ${response.status} ${response.statusText}\n${text}`);
  }

  const payload = await response.json();

  return {
    contractId: payload.contract_id ?? templateId,
    teamId: payload.team_id ?? 'demo-seed-team',
    processedAt: payload.processed_at ?? timestamp,
    payload: payload.payload
  };
}

async function persistSnapshot(snapshot) {
  const directory = dirname(OUTPUT_PATH);
  await mkdir(directory, { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot written to ${OUTPUT_PATH}`);
}

function computePortfolioMetrics(records) {
  const now = new Date();

  const summary = {
    totalContracts: records.length,
    annualizedValue: 0,
    highRiskContracts: 0,
    upcomingRenewalCount: 0,
    averageConfidence: null,
    totalPlaybookTopics: 0
  };

  const alerts = [];
  const verticalMap = new Map();
  const confidenceValues = [];

  for (const record of records) {
    const payload = record.payload ?? {};
    const metadata = payload.metadata ?? {};
    const vertical = normalizeVertical(metadata.vertical);
    const templateName = typeof metadata.template === 'string' ? metadata.template : undefined;

    const breakdown = ensureVertical(verticalMap, vertical);

    const annualized = extractAnnualizedValue(payload.financials);
    summary.annualizedValue += annualized;
    breakdown.annualizedValue += annualized;
    breakdown.contracts += 1;

    const confidence = extractConfidence(payload.audit);
    if (confidence !== null) {
      confidenceValues.push(confidence);
    }

    const playbookTopics = extractPlaybookTopicCount(payload.negotiation);
    summary.totalPlaybookTopics += playbookTopics;
    breakdown.playbookTopics += playbookTopics;

    const renewal = metadata.renewal ?? {};
    const noticeDays = extractNumber(renewal.noticeDays);
    if (noticeDays !== null && noticeDays < 60) {
      summary.upcomingRenewalCount += 1;
      alerts.push({
        type: 'renewal',
        contractId: record.contractId,
        template: templateName,
        label: 'Renewal notice window',
        detail: `Notice window ${noticeDays} days (< 60)`,
        severity: noticeDays <= 30 ? 'critical' : 'warning'
      });
    }

    const risks = Array.isArray(payload.risks) ? payload.risks : [];
    let highRiskFlagged = false;
    for (const risk of risks) {
      const severity = extractNumber(risk?.severity);
      if (severity !== null && severity >= 4) {
        highRiskFlagged = true;
        breakdown.highSeverityRisks += 1;
        alerts.push({
          type: 'risk',
          contractId: record.contractId,
          template: templateName,
          label: risk.signal,
          detail: `Severity ${severity}/5 — ${risk.recommendation}`,
          severity: severity >= 5 ? 'critical' : 'warning'
        });
      }
    }
    if (highRiskFlagged) {
      summary.highRiskContracts += 1;
    }

    const obligations = Array.isArray(payload.obligations) ? payload.obligations : [];
    for (const obligation of obligations) {
      if (!obligation?.due) continue;
      const dueDate = parseDate(obligation.due);
      if (!dueDate) continue;
      const diffDays = differenceInDays(dueDate, now);
      if (diffDays <= 45) {
        const detail =
          diffDays < 0
            ? `Overdue by ${Math.abs(diffDays)} days (was due ${formatDate(dueDate)})`
            : `Due in ${diffDays} days (${formatDate(dueDate)})`;
        alerts.push({
          type: 'obligation',
          contractId: record.contractId,
          template: templateName,
          label: obligation.description,
          detail,
          severity: diffDays <= 14 ? 'critical' : 'warning',
          dueDate: dueDate.toISOString()
        });
      }
    }
  }

  if (confidenceValues.length > 0) {
    const total = confidenceValues.reduce((acc, value) => acc + value, 0);
    summary.averageConfidence = Number((total / confidenceValues.length).toFixed(2));
  }

  const verticals = Array.from(verticalMap.values()).sort((a, b) => b.annualizedValue - a.annualizedValue);

  return {
    summary,
    alerts: alerts.sort(alertComparator),
    verticals
  };
}

function ensureVertical(map, vertical) {
  if (map.has(vertical)) {
    return map.get(vertical);
  }

  const created = {
    vertical,
    contracts: 0,
    annualizedValue: 0,
    highSeverityRisks: 0,
    playbookTopics: 0
  };

  map.set(vertical, created);
  return created;
}

function extractAnnualizedValue(financials) {
  if (!financials || typeof financials !== 'object') {
    return 0;
  }

  const baseFee = financials.baseFee ?? {};
  const amount = extractNumber(baseFee.amount);
  if (amount === null) {
    return 0;
  }

  const frequency = typeof baseFee.billingFrequency === 'string' ? baseFee.billingFrequency : undefined;
  return normalizeAnnualAmount(amount, frequency);
}

function normalizeAnnualAmount(amount, frequency) {
  if (!frequency) {
    return amount;
  }

  switch (frequency.toLowerCase()) {
    case 'annual':
    case 'annually':
    case 'yearly':
      return amount;
    case 'quarterly':
      return amount * 4;
    case 'monthly':
      return amount * 12;
    default:
      return amount;
  }
}

function extractConfidence(audit) {
  if (!audit || typeof audit !== 'object') {
    return null;
  }

  const confidence = audit.confidence;
  if (confidence && typeof confidence.overall === 'number') {
    return confidence.overall;
  }

  return null;
}

function extractPlaybookTopicCount(negotiation) {
  if (!negotiation || typeof negotiation !== 'object') {
    return 0;
  }

  const topics = negotiation.playbook;
  if (!Array.isArray(topics)) {
    return 0;
  }

  return topics.length;
}

function extractNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return null;
}

function normalizeVertical(value) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim().toLowerCase();
  }
  return 'unclassified';
}

function parseDate(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function differenceInDays(target, base) {
  const diffMs = target.getTime() - base.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(value) {
  return value.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function alertComparator(a, b) {
  const severityOrder = severityRank(b.severity) - severityRank(a.severity);
  if (severityOrder !== 0) {
    return severityOrder;
  }

  const typeOrder = a.type.localeCompare(b.type);
  if (typeOrder !== 0) {
    return typeOrder;
  }

  return a.contractId.localeCompare(b.contractId);
}

function severityRank(severity) {
  switch (severity) {
    case 'critical':
      return 2;
    case 'warning':
      return 1;
    default:
      return 0;
  }
}

function printSummary(metrics) {
  const { summary, alerts, verticals } = metrics;
  console.log('\nPortfolio Summary');
  console.log(`  Total contracts: ${summary.totalContracts}`);
  console.log(`  Annualized value: $${summary.annualizedValue.toLocaleString()}`);
  console.log(`  High risk contracts: ${summary.highRiskContracts}`);
  console.log(`  Upcoming renewals (<60d): ${summary.upcomingRenewalCount}`);
  console.log(`  Playbook topics: ${summary.totalPlaybookTopics}`);
  console.log(`  Avg confidence: ${summary.averageConfidence ?? 'N/A'}`);

  if (alerts.length > 0) {
    console.log('\nTop Alerts');
    for (const alert of alerts.slice(0, 6)) {
      console.log(`  [${alert.severity}] ${alert.type} • ${alert.contractId} — ${alert.label}`);
      console.log(`      ${alert.detail}`);
    }
  }

  if (verticals.length > 0) {
    console.log('\nVertical Breakdown');
    for (const segment of verticals) {
      console.log(
        `  ${segment.vertical}: ${segment.contracts} contracts, $${segment.annualizedValue.toLocaleString()} annualized, ${segment.highSeverityRisks} high-severity risks, ${segment.playbookTopics} topics`
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});