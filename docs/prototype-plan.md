## Prototype Execution Plan

### Week 1 — Design Sprint
- Translate screen inventory into low-fidelity wireframes (onboarding wizard, contract detail, portfolio dashboard).
- Run 3–5 walkthrough sessions with target personas; capture missing steps and language.
- Finalize data schemas required per vertical and align with engineering.

### Weeks 2–3 — Technical Foundation
- Scaffold backend (FastAPI/Node) + frontend (Next.js) within monorepo structure.
- Implement authentication, multi-tenant workspace creation, storage buckets, Postgres + `pgvector`.
- Build ingestion skeleton (file upload, queue, mocked extraction output) and QA logging.

### Weeks 4–6 — Intelligence Layer MVP
- Integrate OCR + extraction prompts; surface confidence scoring and manual review flow.
- Implement benchmark engine + rule checks for top 3 clause categories per vertical.
- Ship contract detail UI with citation popovers, benchmark charts, and export to PDF.

### Weeks 7–8 — Portfolio & Collaboration
- Deliver portfolio dashboard (renewal waterfall, risk heatmap, ARR-at-risk cards).
- Add comments, assignments, audit trail, Slack/email alerts.
- Wire analytics instrumentation events and internal dashboards.

### Weeks 9–10 — Pilot Deployment
- Onboard manual-audit customers into the product; observe usage and record ROI outcomes.
- Iterate benchmarks/rule weights, capture missing data fields, refine onboarding copy.
- Prepare narrative: case studies, ROI stats, data moat metrics for GTM + fundraising.

### Ongoing
- Nightly data QA, prompt tuning, security posture reviews, and roadmap reprioritization based on pilot feedback.