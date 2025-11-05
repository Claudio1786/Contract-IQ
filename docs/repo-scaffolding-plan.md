## Repository Scaffolding & Tooling Plan

### 1. High-Level Structure
```
contract-iq/
├─ apps/
│  ├─ web/              # Next.js frontend
│  └─ api/              # FastAPI backend (served via uvicorn)
├─ packages/
│  ├─ ui/               # Shared UI components (Storybook-ready)
│  ├─ analytics/        # Event schema + client SDK
│  └─ prompts/          # Prompt templates & evaluation harness
├─ infra/
│  ├─ terraform/        # Cloud infra definitions (GCP default)
│  └─ k8s/              # Deployment manifests (for later stage)
├─ docs/                # Product documentation (current branch)
├─ scripts/             # One-off automation (migrations, data fixes)
├─ tests/               # Integration & contract parsing fixtures
├─ .github/workflows/   # CI pipelines (lint, test, build, deploy)
├─ turbo.json / nx.json # Monorepo task runner (Turborepo or Nx)
├─ package.json         # Root dependencies (lint-staged, husky, turbo)
└─ pyproject.toml       # Backend dependency definition (Poetry)
```

### 2. Technology Choices
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind. Add ShadCN for accessible primitives.
- **Backend:** FastAPI + Pydantic v2 + SQLAlchemy. Serve via Uvicorn; Celery/RQ for async tasks.
- **Database:** PostgreSQL 16 + `pgvector`. Use Prisma or SQLAlchemy ORM depending on team preference.
- **Storage:** GCS buckets (per environment) for raw documents + processed excerpts.
- **Queue:** Google Pub/Sub (or Redis Streams for local dev) for ingestion pipeline.
- **Model Access:** OpenAI + Anthropic SDKs behind internal orchestration service; add retry/backoff middleware.
- **Monorepo Tooling:** Turborepo with task caching; `prettier` + `eslint` for JS; `ruff` + `black` for Python.
- **Env Management:** Direnv or Doppler for secrets; `.env.example` maintained per app.

### 3. Branching & Environments
- `main`: production-ready code; protected branch.
- `develop` (optional): staging integration branch.
- `docs/*`: documentation changes.
- `feature/*`: feature-specific branches (include JIRA/Linear ticket ID).
- Environments: `dev`, `staging`, `prod` with separate cloud projects and secrets.

### 4. CI/CD Pipeline
1. **Lint & Format:** `turbo run lint` (ESLint/Ruff) + `turbo run format:check`.
2. **Type Check:** `turbo run typecheck` (TypeScript) + `poetry run mypy` for backend if adopted.
3. **Tests:** `turbo run test --filter=...` (Vitest/Playwright) + `poetry run pytest`.
4. **Build:** `turbo run build` (Next.js, FastAPI container image).
5. **Deploy:** Triggered on main merges; use Cloud Build or GitHub Actions to deploy to Cloud Run.

### 5. Developer Onboarding Checklist
- `git clone` → `pnpm install` (frontend) → `poetry install` (backend).
- Run `pnpm run dev` (web) + `poetry run uvicorn apps.api.main:app --reload` (API).
- Provision local Postgres via Docker Compose; seed with fixtures from `/tests/fixtures`.
- Configure environment values using `.env.local` and `.env.api` files.
- Run initial suite: `turbo run lint test` to ensure setup is healthy.

### 6. Documentation & Governance
- Maintain Architecture Decision Records (ADRs) under `docs/adr/`.
- Adopt Conventional Commits (enforced via commitlint).
- Use Renovate or Dependabot for dependency upgrades.
- Establish CODEOWNERS: frontend, backend, infrastructure, data.