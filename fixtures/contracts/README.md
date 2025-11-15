# Contract Fixture Dataset

These fixtures seed the ingestion and analytics pipelines with representative contract data aligned to Corpus IQ, ToltIQ, and Keye feature expectations.

## File Inventory

- `saas-msa.json` – Enterprise SaaS master service agreement (Corpus IQ competitive baseline).
- `saas-dpa.json` – Data processing addendum with privacy + security benchmarks.
- `nil-athlete-agreement.json` – Student-athlete endorsement agreement mirroring Keye incentive tracking.
- `healthcare-baa.json` – HIPAA business associate agreement with breach escalation and subcontractor flow-down controls.
- `public-sector-sow.json` – State procurement statement of work with milestone funding and liquidated damages.

## Schema Overview

```jsonc
{
  "metadata": {
    "template": "string",
    "vertical": "saas" | "nil" | "healthcare" | "public-sector",
    "jurisdiction": "string",
    "renewal": {
      "type": "auto" | "manual",
      "termMonths": 12,
      "noticeDays": 60
    },
    "counterparties": [{
      "name": "string",
      "role": "vendor" | "customer" | "athlete" | "institution" | "agency" | "business-associate" | "covered-entity"
    }]
  },
  "financials": {
    "baseFee": {
      "amount": 180000,
      "currency": "USD",
      "billingFrequency": "annual | quarterly | milestone | n/a"
    },
    "milestones": [{
      "name": "string",
      "amount": 95000,
      "due": "2026-04-30"
    }],
    "incentives": [{
      "type": "performance" | "credit" | "holdback",
      "description": "string",
      "trigger": "string",
      "amount": 25000,
      "unit": "usd" | "percentage"
    }]
  },
  "clauses": [{
    "id": "pricing-tier",
    "category": "commercial",
    "text": "...",
    "benchmarkPercentile": 65,
    "riskPosture": "standard",
    "source": { "page": 12, "section": "4.2" },
    "playbook": {
      "fallback": "string",
      "impact": "medium",
      "stakeholders": ["procurement", "legal"]
    }
  }],
  "risks": [{
    "id": "renewal-notice",
    "severity": 3,
    "signal": "Notice window < 45 days",
    "recommendation": "Extend to 90 days"
  }],
  "obligations": [{
    "owner": "vendor",
    "description": "Provide SOC 2 report annually",
    "kpi": "compliance"
  }],
  "negotiation": {
    "playbook": [
      {
        "topic": "Liability Cap",
        "current": "1x ARR",
        "target": "2x ARR",
        "fallback": "1.5x ARR",
        "impact": "high"
      }
    ],
    "personaNotes": {
      "string": "Additional messaging guidance"
    }
  },
  "audit": {
    "sourceFile": "saas-msa-redacted.pdf",
    "confidence": {
      "overall": 0.92,
      "fields": {
        "financials.baseFee": 0.95,
        "clauses.liability-cap": 0.88
      }
    }
  }
}
```

## Usage

1. Feed JSON into the ingestion pipeline (FastAPI endpoint or CLI) to simulate uploads.
2. Emit `contract.processed` analytics events using `packages/analytics` helpers with the included `confidence` data.
3. Seed UI prototypes by loading `financials`, `clauses`, and `risks` into chart/storybook fixtures.

## Maintenance

- Version fixtures when benchmarks or playbooks change (`metadata.version`).
- Keep sensitive data out — use synthetic company and athlete names only.
- Align clause taxonomy with `rule-benchmarks.md`.