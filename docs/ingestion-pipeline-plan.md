## Ingestion Pipeline – Next-Step Implementation Tasks

### Phase 1: Scaffolding (Week 1)
1. **Set Up Storage Buckets**
   - Create `contract-iq-{env}-raw` and `contract-iq-{env}-processed` buckets.
   - Enforce object versioning and CMEK encryption.
2. **File Intake Service (FastAPI)**
   - Endpoint: `POST /contracts` accepting file upload or external URL.
   - Persist metadata to `contracts` table (status = `uploaded`).
   - Publish message to `ingestion.jobs` queue with contract ID + source info.
3. **Local Dev Tooling**
   - Docker Compose service for MinIO (S3-compatible) and Redis Streams.
   - Seed scripts to load sample PDFs for tests.

### Phase 2: Processing Pipeline (Weeks 2–3)
1. **Worker Service**
   - Subscribe to queue; update status to `processing`.
   - Run OCR (Google Document AI / Tesseract fallback); store text chunks in processed bucket.
2. **Extraction Orchestrator**
   - Chunk documents (cascade: contract-level → section → clause) with token limits.
   - Invoke LLM extraction prompts; capture raw JSON + confidence score per field.
   - Retry logic with exponential backoff; push failures to `ingestion.deadletter` queue.
3. **Manual Review Queue**
   - Persist low-confidence fields (<85%) to `extraction_issues` table.
   - Build admin endpoint to list outstanding reviews.

### Phase 3: Normalization & Benchmarks (Weeks 4–5)
1. **Schema Mapping**
   - Map extracted fields into canonical models (pricing, term, liability, compliance).
   - Validate enums (e.g., currency, renewal cadence) via Pydantic.
2. **Benchmark Enrichment**
   - Call benchmark service to compute percentile/peer comparisons.
   - Store snapshots in `contract_metrics` table with versioning.
3. **Rule Engine Hooks**
   - Evaluate rule library (auto-renewal, exclusivity, compliance) and emit risk flags.

### Phase 4: Notifications & Observability (Week 6)
1. **Event Bus Integration**
   - Publish `contract.processed`, `contract.flagged`, `contract.failed` events.
   - Wire into Slack/email notification service.
2. **Monitoring & Alerts**
   - Metrics: processing latency, success rate, queue depth, extraction accuracy.
   - Set up dashboards (Grafana/Cloud Monitoring) + alert thresholds.

### Phase 5: Hardening (Weeks 7–8)
1. **Backfill Utility**
   - CLI script to reprocess contracts with improved prompts/models.
2. **Prompt Evaluation Harness**
   - Track extraction accuracy vs. gold datasets; support A/B testing of prompt revisions.
3. **Security Review**
   - Pen-test ingestion endpoints, verify signed URL expiration, audit logging coverage.

### Deliverables & Owners
- **Tech Lead:** Owns storage/queue configuration, monitors success metrics.
- **Backend Engineer:** Implements API/worker code, database migrations.
- **ML Engineer:** Designs extraction prompts, evaluation harness, accuracy tracking.
- **Ops/Platform:** Handles observability stack, secret management, runbooks.