## Product Roadmap (0–12 Months)

### Status Checkpoint — 2025-11-06
| Phase | What We Delivered | Status | Evidence |
| --- | --- | --- | --- |
| Foundation | Monorepo scaffolded (Next.js app, FastAPI API, shared packages, fixtures, Turbo workspace). | ✅ Complete | Commit `2c1dbea`, `pnpm install --frozen-lockfile`, `py -m poetry install --no-root`. |
| Core Intelligence MVP | SaaS/vendor MSA ingestion endpoint, clause intelligence UI, negotiation playbooks, portfolio dashboard with initial SaaS/NIL/Healthcare/Public Sector coverage. | ✅ Core slice live | Commit `ff9a47a`; 2025-11-06 Vitest + Pytest validation run recorded in QA audit. |
| Assisted Operations (Gemini Stage 1) | Disk-backed negotiation guidance persistence, `/ai/negotiation/history` API, Contract Detail history UI, Gemini upgraded to `gemini-1.5-flash-latest`. | ⏳ Validation in progress | Branch `feature/gemini-stage1-assisted-ops`; Stage 1 tests/documentation updates pending final validation run. |
| Portfolio Intelligence & Collaboration | Portfolio KPI dashboards available; alert scheduler service shipped with tests; collaboration loops pending. | ⏳ In progress | `apps/api/contract_iq/services/alerts.py`, `apps/api/tests/test_alert_scheduler.py`; Slack/email transports + persistence outstanding. |
| Growth & Defensibility | Pending future milestones. | ⬜ Not started | — |

#### Backlog Ledger (as of 2025-11-06)
- ✅ Monorepo workspace established with lint/test/build tooling (`2c1dbea`).
- ✅ Multi-vertical fixture ingestion and dashboard metrics (`ff9a47a`).
- ✅ Demo seeding CLI (`pnpm demo:seed`) with snapshot output.
- ✅ Updated demo/QA documentation (`docs/demo-environment-plan.md`, `docs/status/2025-11-05-qa-audit.md`).
- ✅ Terraform Azure scaffold (Container App, Postgres, Key Vault) (`infra/terraform/**/*`).
- ⏳ Gemini Stage 1 persistence + history UI integration (backend repository, FastAPI history endpoint, Contract Detail history panel, Vitest coverage) awaiting final validation + commit (`feature/gemini-stage1-assisted-ops`).
- ✅ Iteration validation sanity pass (2025-11-06) documented in QA audit (Vitest across packages/web + API pytest).
- ⏳ SaaS/Vendor MSA excellence pack (taxonomy, clause benchmarks, fallback library) aligned with investor narrative (see `docs/vendor-msa-market.md`).
- ⏳ Sports contract taxonomy & research (HS → college → pro) aligned with Contract IQ expansion plan (see `docs/sports-contract-market.md`).
- ✅ Next.js production build + landing page sanity check (2025-11-06) captured in QA audit (`.\\node_modules\\.bin\\next build`, `Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing`).
- ⏳ Contract Intelligence UI hardening for `/contracts/[templateId]` (DoR/DoD captured 2025-11-06 in QA audit & iteration plan).
- ⏳ Outbound alerting delivery channels (Slack/email) and persistence (scheduler service complete).
- ⏳ Infrastructure deployment workflows (Terraform plan/apply automation + CI runners).
- ⏳ UX research backlog for portfolio/dashboard polish (captured in iteration plan).

#### Upcoming Focus (Iteration 2025-11-05 → 2025-11-19)
- Harden Contract Intelligence dossier with SaaS MSA-first heuristics (schema inventory, fallback copy, analytics events, Vitest coverage, snapshot baselines).
- Close out Gemini Stage 1 validation (pytest + pnpm lint/test/build), publish QA evidence, and prep PR for assisted-ops delivery.
- Operationalize alert delivery (Slack/email) and background schedulers.
- Apply Terraform scaffold & stand up CI pipelines for API/Web deploys.
- Validate demo environment runbook end-to-end using `pnpm demo:seed` snapshot.
- Launch structured UX evaluation prioritizing vendor/MSA workflows (dashboard information architecture, dossier navigation flow, playbook usability tests).
- Service hardening: migrate FastAPI lifecycle hooks to lifespan handlers and automate Vitest runner path for Windows/CI.
- Conduct sports contract segmentation research (NIL, coaching, pro rookie, endorsements) to parallel SaaS/vendor roadmap and feed schema updates (secondary priority).

#### Launch Readiness Checklist (Updated 2025-11-06)
- **Definitions of Ready/Done** documented for Contract Intelligence UI (see QA audit & iteration plan) and referenced in sprint reviews.
- **Analytics instrumentation plan** drafted — clause interactions, playbook prompt views, alert acknowledgements feed PostHog dashboards.
- **Regression safety net**: Vitest suites, Next.js build, API pytest run nightly; dossier snapshot test pending.
- **Documentation**: QA audit, iteration plan, and demo runbook updated with timestamps after each validation pass.
- **Operational handoff**: Demo environment runbook aligns with Terraform + CI roadmap; outstanding items flagged in backlog ledger.

### Phase 0 — Foundation (Weeks 0–2)
- Confirm vertical focus via founder-market fit scorecard and live pipeline validation.
- Form legal entity, banking, data privacy policies, and SOC 2 readiness plan.
- Launch manual contract-audit pilot (≥5 active prospects) to seed the dataset and message.

### Phase 1 — Core Intelligence MVP (Weeks 3–8)
- Build ingestion pipeline: file upload/connectors → OCR → LLM extraction → schema mapping → confidence scoring, optimized for SaaS/vendor MSAs and DPAs.
- Stand up Postgres + `pgvector` with multi-tenant guards, version history, and manual review queue.
- Ship critical UI flows: onboarding wizard, processing dashboard, contract detail with insight cards and citations anchored in MSA clause taxonomy.
- Launch SaaS/vendor research sprint to finalize MSA fallback library; maintain sports/NIL backlog for next iteration.

### Phase 2 — Portfolio Intelligence & Collaboration (Weeks 9–16)
- Release portfolio command center (renewal waterfall, conflict heatmap, KPI cards) tuned for SaaS renewal management.
- Add multi-user collaboration (comments, tasks, audit log) and exportable negotiation playbooks with MSA playbook templates.
- Deliver vertical-specific rule engines (SaaS auto-renewal/liability; Sports compliance/conflict detection as opt-in track).
- Expand coverage beyond MSAs to SOWs, order forms, data processing addenda; maintain sports roadmap as parallel track.

### Phase 3 — Growth & Defensibility (Months 5–8)
- Launch data contribution incentives and referral loops to enrich SaaS clause benchmarks; layer sports contributors second.
- Expand benchmark coverage to ≥70% of target clause categories across MSA, SOW, DPA; monitor accuracy nightly.
- Harden security posture (encryption policies, role-based access, zero-retention controls) toward SOC 2 Type II.
- Enable cross-vertical analytics (Sports ↔ SaaS/Vendor) with shared clause intelligence and market comparables.

### Phase 4 — Scale & GTM Acceleration (Months 9–12)
- Instrument product analytics (activation funnels, retention, ROI impact) and build internal dashboards.
- Ship integrations: Slack/email alerts, export APIs, and CLM/ERP connectors for target personas.
- Prepare fundraising materials (metrics narrative, customer case studies, data moat proof) for pre-seed/seed.