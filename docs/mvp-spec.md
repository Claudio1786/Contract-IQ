## MVP Specification

### In-Scope Functionality
1. **Ingestion & Extraction**
   - Upload + connector support (Google Drive, Dropbox roadmap).
   - OCR → LLM extraction pipeline with schema mapping and confidence scoring.
   - Manual review queue for low-confidence fields, version tracking, dedupe.

2. **Contract Intelligence Layer**
   - Clause cards (pricing, term, exclusivity, liability) with source citations.
   - Benchmark comparisons by peer group; risk scoring with severity badges.
   - Negotiation playbook generator (talking points, fallback clauses, impact estimates).

3. **Portfolio Command Center**
   - Renewal waterfall, ARR-at-risk, conflict heatmap, spend distribution.
   - Filtering by team, vendor/athlete segment, risk severity.
   - Alert system (email + Slack) for renewals, conflicts, review-needed items.

4. **Collaboration & Reporting**
   - Comments, assignments, activity log, audit trail.
   - Export to PDF/Google Doc; CSV export for data warehouse sync.
   - Outcome logging (won/lost, savings, compliance incidents) to feed benchmarks.

5. **Security & Admin Guardrails**
   - RBAC, SSO-ready authentication, encryption in transit/at rest.
   - Zero-retention option, data deletion workflow, audit logs.

### Explicitly Out of Scope (MVP)
- Full contract authoring/CLM workflows, document generation, or e-signature.
- Managed legal services or autopilot negotiation.
- Payment rails, marketplace matching, or deliverables management.
- Deep integrations beyond Slack/email and basic API endpoints.

### Success Metrics
- Time-to-first-insight < 14 days from onboarding.
- Extraction accuracy ≥ 90% across high-priority fields.
- Pilot-to-paid conversion ≥ 60%; weekly active usage ≥ 65% of seats.
- Alert acknowledgment ≥ 50%; benchmark coverage ≥ 70% of targeted clauses.