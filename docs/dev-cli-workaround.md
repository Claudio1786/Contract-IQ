## Windows CLI Workarounds

These steps ensure local scripts succeed on Windows PowerShell where global `node` bin resolution can break `pnpm` and `turbo`.

### Install Dependencies

```powershell
pnpm install --frozen-lockfile
```

### Package-Level Commands

Run the following from each package directory (e.g. `packages/ui`, `packages/analytics`, `packages/prompts`, `apps/web`). Adjust the glob pattern for non-React packages as needed.

| Task        | Command |
|-------------|---------|
| Lint        | `node ./node_modules/eslint/bin/eslint.js "src/**/*.{ts,tsx}"` |
| Test        | `node ./node_modules/vitest/vitest.mjs run` |
| Build       | `node ./node_modules/typescript/bin/tsc --project tsconfig.build.json` |
| Typecheck   | `node ./node_modules/typescript/bin/tsc --noEmit` |

> For `apps/web`, substitute the lint glob with `"**/*.{ts,tsx}"` and use `node ./node_modules/next/dist/bin/next build` for production builds.

### Workspace Validations

Because `turbo` defers to `pnpm.cmd`, run composite checks manually:

1. UI package (lint, test, build, typecheck)
2. Analytics package (lint, test, build, typecheck)
3. Prompts package (lint, test, build, typecheck)
4. Web app (lint, test, build, typecheck)

### Python API

Poetry is not installed on the Windows host by default. Install it before running backend checks:

```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
poetry install --no-root
poetry run pytest
```

Re-run tests after any dependency or code change. Remove generated build artifacts (`.next`, `dist`) before committing.