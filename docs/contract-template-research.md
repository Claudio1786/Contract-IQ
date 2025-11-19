## Contract Template Research & Dummy Dataset Plan

### Competitive Benchmarks

| Platform   | Key Utility Patterns | Gaps We Must Match |
|------------|----------------------|--------------------|
| **Corpus IQ** | Clause-grade benchmarking dashboards, automated renewal risk heatmaps, in-contract annotation widgets. | Need clause-level metadata (risk posture, benchmark percentile, source page) and renewal triggers for each template. |
| **ToltIQ** | Negotiation playbooks tied to extracted terms, template variants per vertical (SaaS, logistics), structured fallback clauses. | Include variant tags, fallback recommendations, and negotiation impact scoring in our sample data. |
| **Keye** | OCR + AI summary cards with compliance alerts, athlete contract focus for NIL deals, incentive tracking. | Capture compliance flags, incentive schedules, and persona-specific KPIs (e.g., AD compliance team). |

### Template Coverage Strategy

We are seeding two vertical tracks to cover the highest-value early adopters:

1. **SaaS Procurement** – Master Service Agreement, Data Processing Addendum, Mutual NDA.
2. **NIL / Sports Operations** – Student-Athlete Agreement, Brand Sponsorship Addendum.

Each template includes:

- `metadata`: version, jurisdiction, renewal cadence, vertical segment, counterparty archetype.
- `financials`: payment schedules, incentives, escalators, termination fees.
- `obligations`: obligations grouped by owner (vendor, customer, athlete, institution).
- `clauses`: structured clause records with taxonomy tags, extracted text snippet, benchmark percentile, and playbook guidance.
- `risks`: risk flags, severity score (1–5), remediation guidance, and monitoring signals.
- `negotiation`: recommended fallback language, impact assessments, and key stakeholder notes.
- `audit`: source PDF filename, page references, extraction confidence.

### Dummy Dataset Deliverables

- JSON fixtures per template located under `fixtures/contracts/`.
- Consistent schema for ingestion + analytics packages.
- Coverage of at least one primary, one secondary clause category per template.
- Embedded benchmark values (e.g., liability caps) aligned with Corpus IQ/ToltIQ positioning.
- NIL templates include NCAA compliance references and incentive tracking fields to mirror Keye.

### Usage Pathways

1. **Extraction Pipeline Validation** – Feed fixtures through the ingestion service to validate schema mapping and analytics event flows.
2. **Playbook Generation** – Ensure `negotiation` nodes power prompts in `packages/prompts` for LLM response scaffolding.
3. **Dashboard Mocking** – Use `financials` and `risks` to seed UI charts and analytics tests.

### Next Steps

1. Create JSON fixtures for `saas-msa`, `saas-dpa`, and `nil-athlete-agreement`.
2. Add companion README for fixture usage and schema evolution.
3. Update analytical tests to exercise fixtures once backend ingestion wiring is ready.