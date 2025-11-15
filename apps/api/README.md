# Contract IQ API

FastAPI service providing ingestion, enrichment, and rule evaluation endpoints for Contract IQ.

## Local development

```bash
poetry install
poetry run uvicorn contract_iq.main:app --reload
```

Run tests with:

```bash
poetry run pytest
```