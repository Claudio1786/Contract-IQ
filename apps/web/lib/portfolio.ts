import { fetchContract, type ContractRecord, type FetchContractOptions } from './contracts';

export interface PortfolioSummary {
  totalContracts: number;
  annualizedValue: number;
  highRiskContracts: number;
  upcomingRenewalCount: number;
  averageConfidence: number | null;
  totalPlaybookTopics: number;
}

export type PortfolioAlertType = 'renewal' | 'risk' | 'obligation';

export interface PortfolioAlert {
  type: PortfolioAlertType;
  contractId: string;
  template?: string;
  label: string;
  detail: string;
  severity: 'warning' | 'critical';
  dueDate?: string;
}

export interface PortfolioVerticalBreakdown {
  vertical: string;
  contracts: number;
  annualizedValue: number;
  highSeverityRisks: number;
  playbookTopics: number;
}

export interface PortfolioMetrics {
  summary: PortfolioSummary;
  alerts: PortfolioAlert[];
  verticals: PortfolioVerticalBreakdown[];
}

export interface FetchPortfolioOptions extends FetchContractOptions {
  templateIds?: string[];
}

const DEFAULT_TEMPLATE_IDS = [
  'saas-msa',
  'saas-dpa',
  'healthcare-baa',
  'public-sector-sow',
  'nil-athlete-agreement'
];
const UPCOMING_RENEWAL_THRESHOLD_DAYS = 60;
const OBLIGATION_ALERT_THRESHOLD_DAYS = 45;

export async function fetchPortfolioMetrics(options: FetchPortfolioOptions = {}): Promise<PortfolioMetrics> {
  const templateIds = options.templateIds ?? DEFAULT_TEMPLATE_IDS;
  const contracts = await Promise.all(templateIds.map((id) => fetchContract(id, options)));
  return computePortfolioMetrics(contracts);
}

export function computePortfolioMetrics(contracts: ContractRecord[]): PortfolioMetrics {
  const now = new Date();

  const summary: PortfolioSummary = {
    totalContracts: contracts.length,
    annualizedValue: 0,
    highRiskContracts: 0,
    upcomingRenewalCount: 0,
    averageConfidence: null,
    totalPlaybookTopics: 0
  };

  const alerts: PortfolioAlert[] = [];
  const verticalMap = new Map<string, PortfolioVerticalBreakdown>();
  const confidenceValues: number[] = [];

  contracts.forEach((contract) => {
    const payload = contract.payload ?? {};
    const metadata = (payload.metadata ?? {}) as Record<string, unknown>;
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

    // Renewal alerts
    const renewal = metadata.renewal as Record<string, unknown> | undefined;
    const noticeDays = extractNumber(renewal?.noticeDays);
    if (noticeDays !== null && noticeDays < UPCOMING_RENEWAL_THRESHOLD_DAYS) {
      summary.upcomingRenewalCount += 1;
      alerts.push({
        type: 'renewal',
        contractId: contract.contractId,
        template: templateName,
        label: 'Renewal notice window',
        detail: `Notice window ${noticeDays} days (< ${UPCOMING_RENEWAL_THRESHOLD_DAYS})`,
        severity: noticeDays <= 30 ? 'critical' : 'warning'
      });
    }

    // Risk alerts
    const risks = Array.isArray(payload.risks) ? payload.risks : [];
    const hasHighRisk = risks.some((risk) => extractNumber(risk?.severity) !== null && extractNumber(risk?.severity)! >= 4);
    if (hasHighRisk) {
      summary.highRiskContracts += 1;
    }
    risks.forEach((risk) => {
      const severity = extractNumber(risk?.severity);
      if (severity !== null && severity >= 4) {
        breakdown.highSeverityRisks += 1;
        alerts.push({
          type: 'risk',
          contractId: contract.contractId,
          template: templateName,
          label: risk.signal,
          detail: `Severity ${severity}/5 — ${risk.recommendation}`,
          severity: severity >= 5 ? 'critical' : 'warning'
        });
      }
    });

    // Obligation alerts
    const obligations = Array.isArray(payload.obligations) ? payload.obligations : [];
    obligations.forEach((obligation) => {
      if (!obligation?.due) {
        return;
      }

      const dueDate = parseDate(obligation.due);
      if (!dueDate) {
        return;
      }

      const diffDays = differenceInDays(dueDate, now);
      if (diffDays <= OBLIGATION_ALERT_THRESHOLD_DAYS) {
        const detail =
          diffDays < 0
            ? `Overdue by ${Math.abs(diffDays)} days (was due ${formatDate(dueDate)})`
            : `Due in ${diffDays} days (${formatDate(dueDate)})`;
        alerts.push({
          type: 'obligation',
          contractId: contract.contractId,
          template: templateName,
          label: obligation.description,
          detail,
          severity: diffDays <= 14 ? 'critical' : 'warning',
          dueDate: dueDate.toISOString()
        });
      }
    });
  });

  if (confidenceValues.length > 0) {
    const totalConfidence = confidenceValues.reduce((acc, value) => acc + value, 0);
    summary.averageConfidence = Number((totalConfidence / confidenceValues.length).toFixed(2));
  }

  const verticals = Array.from(verticalMap.values()).sort((a, b) => b.annualizedValue - a.annualizedValue);

  return {
    summary,
    alerts: alerts.sort(alertComparator),
    verticals
  };
}

function ensureVertical(
  map: Map<string, PortfolioVerticalBreakdown>,
  vertical: string
): PortfolioVerticalBreakdown {
  const existing = map.get(vertical);
  if (existing) {
    return existing;
  }

  const created: PortfolioVerticalBreakdown = {
    vertical,
    contracts: 0,
    annualizedValue: 0,
    highSeverityRisks: 0,
    playbookTopics: 0
  };

  map.set(vertical, created);
  return created;
}

function extractAnnualizedValue(financials: unknown): number {
  if (!financials || typeof financials !== 'object') {
    return 0;
  }

  const baseFee = (financials as Record<string, unknown>).baseFee as Record<string, unknown> | undefined;
  const amount = extractNumber(baseFee?.amount);
  if (amount === null) {
    return 0;
  }

  const frequency = typeof baseFee?.billingFrequency === 'string' ? baseFee.billingFrequency : undefined;
  return normalizeAnnualAmount(amount, frequency);
}

function normalizeAnnualAmount(amount: number, frequency?: string): number {
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
    case 'one-time':
    case 'onetime':
    case 'one time':
    case 'n/a':
      return amount;
    default:
      return amount;
  }
}

function extractConfidence(audit: unknown): number | null {
  if (!audit || typeof audit !== 'object') {
    return null;
  }

  const confidence = (audit as Record<string, unknown>).confidence as Record<string, unknown> | undefined;
  if (!confidence) {
    return null;
  }

  const value = confidence.overall;
  if (typeof value === 'number') {
    return value;
  }

  return null;
}

function extractPlaybookTopicCount(negotiation: unknown): number {
  if (!negotiation || typeof negotiation !== 'object') {
    return 0;
  }

  const topics = (negotiation as Record<string, unknown>).playbook;
  if (!Array.isArray(topics)) {
    return 0;
  }

  return topics.length;
}

function extractNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return null;
}

function normalizeVertical(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    return value.trim().toLowerCase();
  }
  return 'unclassified';
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function differenceInDays(target: Date, base: Date): number {
  const diffMs = target.getTime() - base.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(value: Date): string {
  return value.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function alertComparator(a: PortfolioAlert, b: PortfolioAlert): number {
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

function severityRank(severity: PortfolioAlert['severity']): number {
  switch (severity) {
    case 'critical':
      return 2;
    case 'warning':
      return 1;
    default:
      return 0;
  }
}