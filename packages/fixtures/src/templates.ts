import saasMsa from "../../../fixtures/contracts/saas-msa.json";
import saasDpa from "../../../fixtures/contracts/saas-dpa.json";
import healthcareBaa from "../../../fixtures/contracts/healthcare-baa.json";
import publicSectorSow from "../../../fixtures/contracts/public-sector-sow.json";
import nilAthleteAgreement from "../../../fixtures/contracts/nil-athlete-agreement.json";

import type { ApiContractPayload, ApiContractProcessedResponse, ContractRecord } from "./types";

export const DEFAULT_FIXTURE_TEAM_ID = "demo-team";
export const DEFAULT_FIXTURE_PROCESSED_AT = "2025-11-06T00:00:00.000Z";

const RAW_PAYLOADS = {
  "saas-msa": saasMsa,
  "saas-dpa": saasDpa,
  "healthcare-baa": healthcareBaa,
  "public-sector-sow": publicSectorSow,
  "nil-athlete-agreement": nilAthleteAgreement
} as const satisfies Record<string, ApiContractPayload>;

export type ContractTemplateId = keyof typeof RAW_PAYLOADS;

export const CONTRACT_TEMPLATE_IDS = Object.freeze(
  Object.keys(RAW_PAYLOADS)
) as ContractTemplateId[];

const BASE_FIXTURES: Readonly<Record<ContractTemplateId, ContractRecord>> = Object.freeze(
  Object.fromEntries(
    Object.entries(RAW_PAYLOADS).map(([templateId, payload]) => [
      templateId,
      Object.freeze({
        contractId: `demo-${templateId}`,
        teamId: DEFAULT_FIXTURE_TEAM_ID,
        processedAt: DEFAULT_FIXTURE_PROCESSED_AT,
        payload: clonePayload(payload)
      } satisfies ContractRecord)
    ])
  ) as Record<ContractTemplateId, ContractRecord>
);

export interface ContractFixtureOverrides {
  contractId?: string;
  teamId?: string;
  processedAt?: string;
  payload?: Partial<ApiContractPayload>;
}

export function getContractFixture(
  templateId: ContractTemplateId,
  overrides: ContractFixtureOverrides = {}
): ContractRecord {
  const base = BASE_FIXTURES[templateId];

  if (!base) {
    throw new Error(`Unknown contract fixture template: ${templateId}`);
  }

  const payload = applyPayloadOverrides(base.payload, overrides.payload);

  return {
    contractId: overrides.contractId ?? base.contractId,
    teamId: overrides.teamId ?? base.teamId,
    processedAt: overrides.processedAt ?? base.processedAt,
    payload
  } satisfies ContractRecord;
}

export function createApiContractResponse(
  templateId: ContractTemplateId,
  overrides: ContractFixtureOverrides = {}
): ApiContractProcessedResponse {
  const fixture = getContractFixture(templateId, overrides);
  return {
    contract_id: fixture.contractId,
    team_id: fixture.teamId,
    processed_at: fixture.processedAt,
    payload: fixture.payload
  } satisfies ApiContractProcessedResponse;
}

export const contractFixtures: Readonly<Record<ContractTemplateId, ContractRecord>> = BASE_FIXTURES;

function applyPayloadOverrides(
  basePayload: ApiContractPayload,
  overrides: Partial<ApiContractPayload> | undefined
): ApiContractPayload {
  if (!overrides) {
    return clonePayload(basePayload);
  }

  const merged = clonePayload(basePayload);

  if (overrides.metadata) {
    merged.metadata = {
      ...merged.metadata,
      ...overrides.metadata
    };
  }

  if (overrides.financials !== undefined) {
    merged.financials = overrides.financials
      ? { ...overrides.financials }
      : overrides.financials;
  }

  if (overrides.clauses) {
    merged.clauses = overrides.clauses.map(clone);
  }

  if (overrides.risks) {
    merged.risks = overrides.risks.map(clone);
  }

  if (overrides.obligations) {
    merged.obligations = overrides.obligations.map(clone);
  }

  if (overrides.negotiation !== undefined) {
    merged.negotiation = overrides.negotiation ? clone(overrides.negotiation) : null;
  }

  if (overrides.audit !== undefined) {
    merged.audit = overrides.audit ? { ...overrides.audit } : null;
  }

  return merged;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function clonePayload(payload: ApiContractPayload): ApiContractPayload {
  return clone(payload);
}