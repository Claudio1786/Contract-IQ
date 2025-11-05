## Iteration Plan — 2025-11-05 → 2025-11-19

### Mission
Deliver the first usable AI wrapper increment by wiring ingestion, intelligence surfaces, and negotiation guidance end-to-end for SaaS, NIL, Healthcare HIPAA, and Public Sector procurement fixtures.

### Sprint Goals
1. Process a contract fixture through FastAPI, map it to structured schema, and emit analytics event. **Status: ✅ (2025-11-05)**
2. Display clause cards, risk badges, and negotiation prompts in the web app using real processed data. **Status: ✅ (2025-11-05)**
3. Capture at least one alert/notification flow (renewal or compliance) triggered from processed data. **Status: ⏳ Pending** (UI alerts and obligations in place; outbound notification still pending)

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

#### 4. Portfolio Dashboard & Alerts — **Completed (UI layer)**
- Create dashboard route with summary KPIs (renewals, ARR risk, compliance incidents).
- Integrate Healthcare BAA and Public Sector SOW fixtures into portfolio aggregation plus Vitest coverage.
- Render alerts feed (renewal, risk, obligations) and vertical breakdown (SaaS, Healthcare, Public Sector, NIL) in dashboard UI.
- **Next:** Implement alert scheduler service in API (cron-esque background task) to drive outbound notifications.

#### 5. Infrastructure Enablement (parallelizable) — **Pending**
- Scaffold `infra/` Terraform project: Azure Container Apps + Postgres + Key Vault.
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

### Risks & Mitigations
- **LLM latency / costs** – use fixtures + logs for first iteration; integrate providers behind interface later.
- **Windows path issues** – continue using direct `node`/Poetry commands documented in `dev-cli-workaround.md` until resolved.
- **Data persistence** – start with in-memory repositories; design with interface to swap for Postgres when infra ready.