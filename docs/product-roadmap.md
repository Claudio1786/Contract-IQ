## Product Roadmap (0–12 Months)

### Status Checkpoint — 2025-11-05
| Phase | What We Delivered | Status | Evidence |
| --- | --- | --- | --- |
| Foundation | Monorepo scaffolded (Next.js app, FastAPI API, shared packages, fixtures, Turbo workspace). | ✅ Complete | Commit `2c1dbea`, pnpm install/Poetry install passing. |
| Core Intelligence MVP | Ingestion endpoint, clause intelligence UI, negotiation playbooks, portfolio dashboard with SaaS/NIL/Healthcare/Public Sector coverage. | ✅ Core slice live | Commit `ff9a47a`, Vitest + Pytest suites green. |
| Portfolio Intelligence & Collaboration | Portfolio KPI dashboards available; alert scheduler and collaboration loops pending. | ⏳ In progress | Alerts UI shipped; API scheduler tracked in iteration plan. |
| Growth & Defensibility | Pending future milestones. | ⬜ Not started | — |

#### Backlog Ledger (as of 2025-11-05)
- ✅ Monorepo workspace established with lint/test/build tooling (`2c1dbea`).
- ✅ Multi-vertical fixture ingestion and dashboard metrics (`ff9a47a`).
- ✅ Demo seeding CLI (`pnpm demo:seed`) with snapshot output.
- ✅ Updated demo/QA documentation (`docs/demo-environment-plan.md`, `docs/status/2025-11-05-qa-audit.md`).
- ⏳ Outbound alerting + notification routing (tracked in iteration plan).
- ⏳ Infrastructure deployment workflows (Terraform + CI runners).
- ⏳ UX research backlog for portfolio/dashboard polish (captured in iteration plan).

#### Upcoming Focus (Iteration 2025-11-05 → 2025-11-19)
- Operationalize alert delivery (Slack/email) and background schedulers.
- Stand up Terraform scaffolding + CI pipelines for API/Web deploys.
- Validate demo environment runbook end-to-end using `pnpm demo:seed` snapshot.
- Launch structured UX evaluation: dashboard information architecture, dossier navigation flow, playbook usability tests.

### Phase 0 — Foundation (Weeks 0–2)
- Confirm vertical focus via founder-market fit scorecard and live pipeline validation.
- Form legal entity, banking, data privacy policies, and SOC 2 readiness plan.
- Launch manual contract-audit pilot (≥5 active prospects) to seed the dataset and message.

### Phase 1 — Core Intelligence MVP (Weeks 3–8)
- Build ingestion pipeline: file upload/connectors → OCR → LLM extraction → schema mapping → confidence scoring.
- Stand up Postgres + `pgvector` with multi-tenant guards, version history, and manual review queue.
- Ship critical UI flows: onboarding wizard, processing dashboard, contract detail with insight cards and citations.

### Phase 2 — Portfolio Intelligence & Collaboration (Weeks 9–16)
- Release portfolio command center (renewal waterfall, conflict heatmap, KPI cards).
- Add multi-user collaboration (comments, tasks, audit log) and exportable negotiation playbooks.
- Deliver vertical-specific rule engines (SaaS auto-renewal/liability; Sports compliance/conflict detection).

### Phase 3 — Growth & Defensibility (Months 5–8)
- Launch data contribution incentives and referral loops to enrich benchmarks.
- Expand benchmark coverage to ≥70% of target clause categories; monitor accuracy nightly.
- Harden security posture (encryption policies, role-based access, zero-retention controls) toward SOC 2 Type II.

### Phase 4 — Scale & GTM Acceleration (Months 9–12)
- Instrument product analytics (activation funnels, retention, ROI impact) and build internal dashboards.
- Ship integrations: Slack/email alerts, export APIs, and CLM/ERP connectors for target personas.
- Prepare fundraising materials (metrics narrative, customer case studies, data moat proof) for pre-seed/seed.