## Iteration Plan — 2025-11-05 → 2025-11-19

### Mission
Deliver the first usable AI wrapper increment by wiring ingestion, intelligence surfaces, and negotiation guidance end-to-end for SaaS, NIL, Healthcare HIPAA, and Public Sector procurement fixtures.

### Sprint Goals
1. Process a contract fixture through FastAPI, map it to structured schema, and emit analytics event. **Status: ✅ (2025-11-05)**
2. Display clause cards, risk badges, and negotiation prompts in the web app using real processed data. **Status: ✅ (2025-11-05)**
3. Capture at least one alert/notification flow (renewal or compliance) triggered from processed data. **Status: ✅ (2025-11-05)** — Alert scheduler service now evaluates portfolio fixtures and exposes manual trigger/status APIs with pytest coverage.

### Workstreams & Epics

#### 1. Contract Ingestion & Processing — **Completed**
- Build `/contracts/ingest` POST endpoint (FastAPI) accepting PDF placeholder + metadata.
- Introduce ingestion pipeline module that:
  - Loads fixture JSON for current milestone (file-backed until storage is ready).
  - Invokes prompt builder to assemble extraction call (implement stub LLM service returning fixture data).
  - Persists structured contract snapshot (in-memory repository, ready to swap for Postgres).
- Emit `contract.processed` analytics event via `createContractProcessedEvent` and log to stdout as interim sink.
- Add integration tests with Poetry hitting endpoint and asserting schema output + analytics emission.
- **Result:** Endpoint live with fixture-backed processing, analytics events verified via tests (2025-11-05).

#### 2. Intelligence Surfaces (Web App) — **Completed**
- Create contracts overview route (e.g., `/contracts/[id]`).
- Render clause cards with benchmark percentile, risk posture, and source citations.
- Display risk panel with severity badges and recommendations.
- Surface negotiation playbook entries with impact and fallback guidance.
- Use Next.js server actions to fetch from API (temporary fetch from local JSON if API unavailable).
- **Result:** `/contracts/[templateId]` route renders structured intelligence with fixture-backed data and Vitest coverage.

#### 3. Negotiation Playbook Automation — **Completed**
- Extend prompts package to support `buildPlaybookPrompt` using fixture negotiation data.
- Add Vitest coverage for new prompt builder.
- Update analytics package (or new module) to log `playbook.recommended` events when playbook generated.
- Wire web UI action button to call API endpoint triggering playbook generation (stub response for now).
- **Result:** Playbook prompts displayed in UI; ingestion pipeline emits `playbook.recommended` events with tests covering both packages.

#### 4. Portfolio Dashboard & Alerts — **Completed**
- Create dashboard route with summary KPIs (renewals, ARR risk, compliance incidents).
- Integrate Healthcare BAA and Public Sector SOW fixtures into portfolio aggregation plus Vitest coverage.
- Render alerts feed (renewal, risk, obligations) and vertical breakdown (SaaS, Healthcare, Public Sector, NIL) in dashboard UI.
- **Next:** Wire Slack/Email transport integrations and surface scheduler health in deployment telemetry.

#### 5. Infrastructure Enablement (parallelizable) — **In Progress**
- Scaffolded `infra/terraform` root stack plus container_app, postgres, and key_vault modules (Azure Container Apps + Flexible Server + Key Vault) with managed identity access policy.
- Draft GitHub Actions workflows for API (build→pytest→deploy) and web (Vercel CLI stub).
- Add scripts for loading fixtures to Azure Blob Storage (local CLI placeholder). **Update:** Local demo seeding script (`pnpm demo:seed`) now available to populate fixtures + metrics snapshot.

### Sprint Cadence
- **Daily**: run package QA suite (lint/test/build) + API pytest.
- **Twice weekly**: demo progress using fixtures; update burndown in docs.
- **End of Sprint**: regression pass across ingestion → intelligence → alerts flow.

### Definition of Done
- Feature has automated tests (unit + integration where applicable).
- Updated documentation (API contract, UI behavior, runbooks).
- No lint/type/test regressions across workspace.
- Analytics events emitted for new flows and captured in logs.
- Demo script updated to include new capability.

### Backlog Checkpoint — 2025-11-05 *(validated 2025-11-06)*
| Backlog Item | Status | Evidence |
| --- | --- | --- |
| Monorepo scaffold (web, API, shared packages, fixtures) | ✅ Done | Commit `2c1dbea`; `pnpm install --frozen-lockfile`, `py -m poetry install --no-root`. |
| Contract ingestion + intelligence surfaces (SaaS/NIL/Healthcare/Public Sector) | ✅ Done | Commit `ff9a47a`; `node ../../node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.0/node_modules/vitest/vitest.mjs run`, `py -m poetry run pytest`. |
| Demo seeding CLI + documentation refresh | ✅ Done | `pnpm demo:seed`, `docs/demo-environment-plan.md`, `docs/status/2025-11-05-qa-audit.md`. |
| Outbound alerting orchestration | ⏳ Open | Scheduler service merged; Slack/email transports and persistence still outstanding. |
| Deployment workflows (Terraform + CI) | ⏳ Open | Terraform modules ready; GitHub Actions plan/apply and app deploy workflows still outstanding. |
| UX research & IA improvements for dashboard/dossier | ⏳ Open | See UX discovery plan below. |
| Iteration validation sanity pass | ✅ Done (2025-11-06) | Vitest (`packages/ui`, `packages/prompts`, `packages/analytics`, `apps/web`) via pnpm-installed binary; `py -m poetry run pytest`. |

> Latest validation run executed 2025-11-06 22:32 PT; see `docs/status/2025-11-05-qa-audit.md` for command transcripts, Next.js build logs, landing page sanity output, and Contract Intelligence UI hardening plan.

### In-Flight Focus — Contract Intelligence UI Hardening (Captured 2025-11-06 22:32 PT)
**Objective:** Bolster `/contracts/[templateId]` dossier to production-readiness using live ingest fixtures.

**Scope**
- **Data contracts & fixtures**: Invoke `/contracts/ingest` for SaaS MSA, Healthcare BAA, Public Sector SOW, and NIL templates; document schema and gaps; generate typed fixture helpers for Vitest.
- **UX hardening**: Add server-side try/catch with meaningful not-found/error messaging, introduce Suspense/loading skeletons, and ensure clause/risk/playbook/obligation cards render gracefully when values are missing or null.
- **Instrumentation**: Define analytics events for clause expansions, playbook prompt views, and alert follow-ups to feed launch dashboards.
- **Testing**: Extend Vitest coverage for `fetchContract` error paths and UI guardrails; snapshot `ContractDetail` with fixture mocks; evaluate Playwright smoke test for dossier flow.
- **Docs**: Update QA audit, runbook, and iteration plan upon completion (Definition of Done requirement).

**Definition of Ready**
- Schema inventory completed and reviewed with design/PM stakeholders.
- Fixture helpers/mocks checked into repo for deterministic tests.
- UX acceptance criteria agreed (loading skeleton style, error tone, analytics payload fields).

**Definition of Done**
- All demo templates render without console warnings; loading/error states verified.
- Analytics events captured locally (PostHog stub) and documented.
- Automated tests cover new states; CI target for dossier snapshot passes.
- Documentation refreshed with outcomes and follow-ups.

**UX Acceptance Criteria (Captured 2025-11-06 22:45 PT)**
- **Skeleton styling**: use pill shimmer placeholders matching clause/risk card layout (animate via Tailwind `animate-pulse`, contrast-compliant against slate background, minimum height 120 px for clause cards, 80 px for side panels).
- **Inline retry affordance**: error boundary presents descriptive copy, `Try again` button (primary-secondary pattern) that retries `fetchContract` with exponential backoff and surfaces support contact if three consecutive failures occur.
- **Analytics event taxonomy**: emit PostHog-friendly events — `contract.dossier.viewed`, `clause.card.expanded`, `playbook.prompt.generated`, `risk.card.escalated`, including payload fields `{ templateId, clauseId?, impactLevel?, severity?, error?:string }`.
- **Accessibility requirements**: maintain focus states for retry button and card accordions (3:1 contrast), ensure skeletons announce as “loading” via `aria-busy`, provide semantic headings (`h1`–`h4`) and `aria-live="polite"` for refreshed playbook content.
- **Empty/null state messaging**: each panel displays guidance copy (“No obligations surfaced yet”) and links to ingest documentation when arrays are empty.

### Path to QA & Demo Readiness (Next Iteration)
1. **Contract Intelligence UI Hardening** – Complete scope above to unlock sprint goal #2 and demo readiness.
2. **Alerts & Notifications** – Extend scheduler with Slack/email delivery, persist alert dispatch history, and monitor health endpoints.
3. **Infrastructure & CI** – Apply Terraform stack, wire GitHub Actions for plan/apply plus API & web deploy pipelines with smoke tests.
4. **Demo Runbook Validation** – Execute `pnpm demo:seed` against deployed API, capture portfolio snapshot, and rehearse demo script end-to-end.
5. **Regression Automation** – Add Turbo targets for `test`, `lint`, `build`; integrate into CI to block regressions before QA sign-off.
6. **Service Hardening** – Migrate FastAPI lifecycle hooks to lifespan handlers; replace ad-hoc Vitest binary path with scripted runner for Windows CI.

### Validation Notes — 2025-11-06
- Run UI/prompts/analytics/web Vitest suites via `node ../../node_modules/.pnpm/vitest@2.1.9_@types+node@22.19.0/node_modules/vitest/vitest.mjs run` from each package root (CJS API warning persists).
- Web app production build now green with `.\\node_modules\\.bin\\next build`; landing page verified via `Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing`.
- API pytest (`py -m poetry run pytest`) remains green; FastAPI `on_event` deprecation warnings logged—scheduled for lifespan migration.
- Validation outputs archived in QA audit doc to anchor regression triage during QA handoff.

### UX & UI Discovery Plan
- Conduct heuristic review of dashboard layout: evaluate KPI hierarchy, alert readability, and drill-down affordances.
- Schedule 30-minute internal walkthrough to capture friction points in `/contracts/[templateId]` dossier navigation.
- Prototype quick wins (e.g., vertical filters, clause card grouping) in Figma and validate with stakeholders.
- Instrument PostHog events for key navigation actions to gather usage heuristics once demo environment is live.

#### Competitive UX Benchmark (2025-11-06 22:50 PT)
| Platform | Strengths Observed | Gaps vs. Contract IQ | Brand-Adjusted Actions |
| --- | --- | --- | --- |
| **Ironclad Insights** | Timeline view of clause approvals, bright pill statuses, contextual AI suggestions inline with clauses. | Limited dark-mode support; analytics tucked behind modals. | Preserve pill language but apply our slate-amber palette; surface analytics inline through risk + playbook panels; add timeline-inspired “Processed at” subheader and optional history drawer (future).
| **LinkSquares Analyze** | Left-rail navigation with quick clause filters, prominent risk badges, CSV export. | Dense tables sacrifice readability; weak storytelling for negotiation prompts. | Keep our grid layout but add quick-filter chips above clause cards for parity; lean on storytelling copy and gradient headers to differentiate.
| **Icertis Contract Intelligence** | KPI hero band with renewal/risk meters, compliance callouts, heavy use of icons. | Legacy styling feels corporate, interactions slow. | Introduce subtle iconography (outline icons from Contract IQ asset kit) for risks/obligations while maintaining minimalist motion; ensure all icons meet 3:1 contrast on slate background.
| **Agiloft CLM** | Configurable dashboards, inline task assignments, accessible color choices. | UI cluttered; no guided negotiation flows. | Emulate accessibility rigor (focus rings, aria labels), but keep layout restrained; maintain dedicated negotiation panel with our LLM prompt copy.
| **SpotDraft Playbooks** | Conversation-style fallback prompts, Slack handoff CTAs, animation micro-interactions. | Reliant on chat UI; limited portfolio context. | Blend micro-interactions (200 ms fade/slide) into our side panels; keep structured cards for enterprise clarity; add Slack/email CTAs in playbook panel for future automation.

**Brand directives applied:** retain deep-navy gradient background (`bg-slate-950` with subtle overlays), use Contract IQ accent tokens (amber for fallbacks, emerald for obligations, rose for risks), and incorporate typography scale from demo kit (`Inter 16/24 body, 20/28 subheaders, 32/40 hero`). Align skeleton shimmer and focus states with these tokens for consistency.

#### Implementation Task Breakdown (2025-11-06 22:55 PT)
1. **Schema & Fixture Audit**
   - ✅ Triggered `/contracts/ingest` for SaaS MSA, Healthcare BAA, Public Sector SOW, NIL, and SaaS DPA fixtures; responses mirrored in deterministic helpers.
   - ✅ Documented schema nuances (stakeholder arrays, null `obligations[].due`, NIL `personaNotes`) in QA audit checklist.
   - ✅ Generated typed helpers (`getContractFixture`, `createApiContractResponse`) under `packages/fixtures` with Vitest coverage.
2. **Loading & Error States**
   - Extract `ContractSkeleton` component (height discipline: 120 px clause cards, 80 px panels) using Tailwind `animate-pulse` shimmer on slate background.
   - Wrap dossier fetch in Suspense boundary + `ErrorBoundary` with `Try again` CTA using exponential backoff (250 ms → 500 ms → 1000 ms) and inline support link after third failure.
3. **Navigation Enhancements**
   - Add quick-filter chip bar referencing LinkSquares pattern (`All`, `High impact`, `Renewals`, `Compliance`) with amber active state and accessible focus ring.
   - Prepare timeline/history placeholder drawer (Ironclad-inspired) behind feature flag for future iteration.
4. **Analytics Instrumentation**
   - Emit PostHog events `contract.dossier.viewed`, `clause.card.expanded`, `playbook.prompt.generated`, `risk.card.escalated`, ensuring payload shape matches taxonomy and brand tokens drive color props for event metadata.
   - Update analytics package with typed event creators and extend Vitest coverage.
5. **Accessibility & QA**
   - Enforce `aria-busy`, `aria-live="polite"`, focus outlines (`outline-amber-400/70`) across new components.
   - Snapshot test `ContractDetail` states (loading, success, empty, error) and extend Playwright smoke scenario for quick-filter chip interactions.
6. **Documentation & Evidence**
   - Capture build/test outputs post-implementation (Vitest, Next build, pytest) and update QA audit + demo runbook with timestamps and brand-specific notes.

### Risks & Mitigations
- **LLM latency / costs** – use fixtures + logs for first iteration; integrate providers behind interface later.
- **Windows vitest path issues** – continue using direct pnpm-installed binary (`node ../../node_modules/.pnpm/.../vitest.mjs run`) until a scripted alias is added to tooling.
- **FastAPI event lifecycle** – replace `@app.on_event` startup/shutdown hooks with lifespan implementation to remove deprecation warnings.
- **Data persistence** – start with in-memory repositories; design with interface to swap for Postgres when infra ready.
