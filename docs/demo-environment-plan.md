## Demo Environment Plan

### Goals
- Mirror competitor-grade utility: instant contract ingestion, clause insights, negotiation playbooks, and portfolio KPI dashboards.
- Provide deterministic walkthrough for AE + Solutions Engineer pairs.
- Support hot-swapping between SaaS procurement, Healthcare HIPAA compliance, Public Sector procurement, and NIL athlete scenarios.

### Target Architecture
1. **Frontend (apps/web)** – Next.js App Router deployed to Vercel preview; Storybook (future) for component showcase.
2. **Backend API (apps/api)** – FastAPI on Azure Container Apps with managed Postgres (Neon) for persistence.
3. **Vector + Cache** – Qdrant (managed) + Redis Cloud for prompt augmentation and session state.
4. **LLM Orchestration** – OpenAI GPT-4.1 + Anthropic Sonnet fallback via LangSmith router (stubbed today).
5. **Analytics** – PostHog cloud project capturing `contract.processed`, `playbook.recommended`, and dashboard interactions.

### Environments
| Stage | Purpose | Data | Access Model |
|-------|---------|------|--------------|
| **Local** | Developer validation | Synthetic fixtures | Individual credentials |
| **Demo** | Sales/demo loops | Synthetic + curated anonymized PDFs | Shared service account with RBAC |
| **Pilot** | Early design partners | Real customer data | Per-tenant isolation |

### Provisioning Steps
1. **Infrastructure Repo**
   - Create `infra/` directory with Terraform (Azure) definitions for API + Postgres + Key Vault.
   - Parameterize environment via `demo.tfvars`.
2. **Secrets Management**
   - Store API keys (LLM, PostHog) in Azure Key Vault; expose to FastAPI via managed identity.
3. **Backend Deployment Pipeline**
   - GitHub Actions workflow: build Docker image (`apps/api`), run pytest, push to Azure Container Registry, deploy to Container Apps.
   - Seed Postgres schema with Alembic migrations (to be built).
4. **Frontend Deployment**
   - Vercel project with `VERCEL_ENV=production` for demo branch.
   - Environment variables: `NEXT_PUBLIC_POSTHOG_KEY`, `API_BASE_URL`, `NEXT_PUBLIC_DEMO_MODE=true`.
   - Build command `pnpm install --frozen-lockfile && pnpm --filter web build` (update once Turbo issue resolved).
5. **Data Loading**
   - Upload fixtures from `fixtures/contracts/` into Azure Blob Storage `demo-contracts` container.
   - Batch ingest via FastAPI `/contracts/ingest` endpoint using `pnpm demo:seed` (writes `tmp/demo-portfolio.json` snapshot).
6. **Observability**
   - Enable Application Insights on Container App.
   - PostHog dashboards: `Demo Conversion`, `Clause Interactions`, `Playbook Adoption`.

### Demo Seeding Script
- Run `pnpm demo:seed` from the repository root to ingest the default SaaS, Healthcare, Public Sector, and NIL fixtures into the FastAPI service.
- Optionally pass template IDs to scope the run (e.g., `pnpm demo:seed saas-msa healthcare-baa`).
- Override the API endpoint via `CONTRACT_IQ_API_URL` and the output file via `CONTRACT_IQ_DEMO_OUTPUT`.
- Script output includes a console summary plus a JSON snapshot at `tmp/demo-portfolio.json` for QA replay.

### Demo Script (Happy Path)
1. Upload anonymized contract PDF (SaaS, Healthcare BAA, Public Sector SOW, or NIL variant).
2. Show extraction summary – clause cards, benchmark percentiles, and risk badges.
3. Trigger negotiation playbook – generate fallback language and impact estimate.
4. Pivot to Portfolio dashboard – filter by risk severity, renewal status, and vertical (SaaS, Healthcare, Public Sector, NIL).
5. Demonstrate alert creation – send Slack notification for upcoming renewal.

### Open Items
- Build ingestion endpoint + storage wiring (FastAPI + Azure Blob SDK) for file uploads (fixtures covered by `demo:seed`).
- Implement Postgres schema and event logging.
- Create `demo` Git branch with config overrides.
- Automate fixture refresh and runbook documentation.

### Timeline
- **Week 0** – Finalize infra IaC, provision demo resources.
- **Week 1** – Wire deployment pipelines, implement ingestion endpoint.
- **Week 2** – Seed fixtures, run dry-run demos, capture feedback.