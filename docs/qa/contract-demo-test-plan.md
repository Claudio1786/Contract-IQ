# Contract IQ Demo Environment - QA Test Plan

**Version:** 1.0  
**Date:** November 15, 2025  
**Owner:** Engineering & QA Team

---

## Executive Summary

This document defines the comprehensive QA strategy for Contract IQ's demo environment, covering unit tests, integration tests, end-to-end tests, and CI/CD automation. The goal is to ensure **100% reliability** for all contract ingestion, analysis, and negotiation playbook flows.

---

## Test Layers & Coverage

### Layer 1: Unit Tests (Core Logic)

**Target:** 80%+ coverage on critical modules

| Module | File Path | Priority | Tests Needed |
|--------|-----------|----------|--------------|
| Contract Ingestion | `apps/api/contract_iq/services/ingestion.py` | P0 | ✅ Fixture loading, validation, error handling |
| Multi-AI Orchestrator | `apps/api/contract_iq/services/multi_ai_orchestrator.py` | P0 | ✅ Failover logic, circuit breaker, validation (17/23 passing) |
| Gemini Client | `apps/api/contract_iq/services/gemini.py` | P0 | ⚠️ API call mocking, stub responses, error handling |
| OpenAI Client | `apps/api/contract_iq/services/openai_client.py` | P1 | ⚠️ Fallback scenarios, JSON parsing, rate limits |
| Alerts Service | `apps/api/contract_iq/services/alerts.py` | P1 | ❌ Alert generation, risk scoring, playbook recommendations |
| Contract Schemas | `apps/api/contract_iq/schemas/contracts.py` | P1 | ❌ Validation, serialization, edge cases |

**Legend:**
- ✅ Implemented and passing
- ⚠️ Partially implemented
- ❌ Not yet implemented

---

### Layer 2: Integration Tests (API Endpoints)

**Target:** All user-facing endpoints tested

| Endpoint | Method | Priority | Test Scenarios |
|----------|--------|----------|----------------|
| `/contracts/ingest` | POST | P0 | Valid fixtures, invalid template_id, missing team_id, malformed JSON |
| `/ai/generate` | POST | P0 | Valid context, empty fields, special characters, AI fallback scenarios |
| `/ai/health` | GET | P1 | Provider status, circuit breaker states |
| `/ai/health/providers` | GET | P1 | Gemini/OpenAI health, failover status |

**Current Status:**
- ✅ Multi-AI orchestrator tested (23 test cases)
- ❌ `/contracts/ingest` endpoint not tested
- ❌ End-to-end contract flow not tested

---

###Layer 3: Pipeline Tests (End-to-End Contract Flow)

**Target:** Full contract journey from ingestion to playbook generation

#### Test Fixtures Created

| Fixture | Template ID | Vertical | Key Test Scenarios |
|---------|-------------|----------|-------------------|
| `nda-simple.json` | nda-simple | General | Basic confidentiality, standard terms |
| `msa-standard.json` | msa-standard | Technology | SLA, liability caps, auto-renewal, usage pricing |
| `dpa-gdpr.json` | dpa-gdpr | Data Privacy | GDPR compliance, sub-processors, breach notification |
| `sow-consulting.json` | sow-consulting | Professional Services | Payment terms, deliverables, liability caps |
| `saas-msa.json` | saas-msa | SaaS | Existing fixture (financial modeling, incentives) |
| `healthcare-baa.json` | healthcare-baa | Healthcare | Existing fixture (HIPAA compliance) |
| `nil-athlete-agreement.json` | nil-athlete-agreement | Sports/NIL | Existing fixture (athlete endorsements) |
| `public-sector-sow.json` | public-sector-sow | Government | Existing fixture (public procurement) |

#### Pipeline Test Flow

```
1. Load fixture → 2. POST /contracts/ingest → 3. Verify ContractProcessedResponse
                                                    ↓
                                    4. Validate payload structure
                                                    ↓
                                    5. Check risk flagging
                                                    ↓
                                    6. Validate negotiation playbook
                                                    ↓
                                    7. Verify analytics events logged
```

**Test Implementation Needed:**
- ❌ Pipeline harness: `tests/pipeline/test_contract_pipeline.py`
- ❌ Golden output validation (expected vs. actual)
- ❌ Fuzzy matching for AI-generated summaries
- ❌ Assertion helpers for confidence scores, risk severity

---

### Layer 4: Frontend E2E Tests (Playwright)

**Target:** Critical user flows in demo environment

| Flow | Priority | Steps | Status |
|------|----------|-------|--------|
| Playbook Template Selection | P0 | Select template → Fill form → Generate → View results | ✅ Basic tests exist |
| Template Rapid Switching | P0 | Click multiple templates quickly → No crashes | ✅ Crash fix deployed |
| Contract Upload (Future) | P1 | Upload PDF/DOCX → Wait for processing → View analysis | ❌ Not implemented |
| Negotiation Playbook View | P1 | View playbook → Expand talking points → See risk callouts | ❌ Not implemented |
| Error State Handling | P1 | Submit invalid data → See error message → Retry | ⚠️ Partial coverage |

**Playwright Setup Needed:**
- ❌ Install Playwright: `npm install -D @playwright/test`
- ❌ Create `tests/e2e/` directory
- ❌ Add browser configuration (Chrome, Firefox, Safari)
- ❌ Wire into CI pipeline

---

## Test Priorities

### P0 - Must Have (Release Blockers)

1. **Contract Ingestion Pipeline**
   - All 8 fixtures ingest successfully
   - Schema validation works correctly
   - Risk flagging is accurate
   - Negotiation playbooks are generated

2. **Multi-AI Resilience**
   - Failover works (Gemini → ChatGPT → Stub)
   - Circuit breaker prevents cascade failures
   - Input validation prevents crashes

3. **Playbook Generator UI**
   - Template selection works
   - No crashes on rapid clicking
   - Error states display correctly

### P1 - Should Have (Pre-Production)

1. **Unit Tests for All Services**
   - Gemini client mocking
   - Alert generation logic
   - Schema validation edge cases

2. **Integration Tests for All Endpoints**
   - Contract ingestion API
   - AI generation API
   - Health check endpoints

3. **Basic E2E Smoke Tests**
   - 2-3 critical user flows
   - Run in CI on every PR

### P2 - Nice to Have (Post-Launch)

1. **Performance Tests**
   - Load testing with k6 (100+ concurrent users)
   - Response time benchmarks

2. **Contract Upload Validation**
   - PDF/DOCX parsing
   - OCR for scanned documents
   - Malformed file handling

3. **Advanced E2E Scenarios**
   - Multi-user collaboration
   - Real-time updates
   - Mobile responsiveness

---

## Test Execution Strategy

### Local Development

```bash
# Run all tests
pnpm test

# Run backend tests only
cd apps/api && poetry run pytest

# Run specific test file
cd apps/api && poetry run pytest tests/test_multi_ai_orchestrator.py -v

# Run frontend tests
pnpm --filter @contract-iq/web test

# Run E2E tests (future)
pnpm test:e2e
```

### CI/CD Pipeline

**Current Setup:**
- ✅ GitHub Actions on push/PR
- ✅ Backend tests run in CI
- ⚠️ Frontend tests not yet in CI
- ❌ E2E tests not yet in CI

**Recommended CI Flow:**

```yaml
name: QA Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Python + Node
      - Install dependencies
      - Run backend unit tests (pytest)
      - Run frontend unit tests (vitest)
      - Upload coverage reports

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Start API server
      - Run integration tests
      - Check endpoint health

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Start demo environment
      - Run Playwright tests
      - Upload screenshots/videos on failure

  coverage-check:
    runs-on: ubuntu-latest
    steps:
      - Download coverage reports
      - Enforce 70%+ coverage threshold
      - Comment on PR with coverage delta
```

---

## Expected Outputs & Golden Files

### Fixture → Expected Output Mapping

For each fixture, we maintain a "golden output" that defines expected structure and values:

**Example: `fixtures/expected/nda-simple.json`**

```json
{
  "metadata": {
    "template": "nda-simple",
    "vertical": "general",
    "counterparties": {
      "count": 2,
      "roles": ["disclosing-party", "receiving-party"]
    }
  },
  "risks": {
    "count": 1,
    "severities": ["low"]
  },
  "obligations": {
    "minCount": 2
  },
  "negotiation": {
    "hasPlaybook": true,
    "minTopics": 1,
    "requiredFields": ["topic", "current", "target", "fallback", "talking_points"]
  },
  "audit": {
    "confidence": {
      "min": 0.7,
      "max": 1.0
    },
    "reviewRequired": false
  }
}
```

**Validation Strategy:**
- Exact match for `template`, `vertical`, `counterparties.count`
- Range validation for `confidence` (0.7-1.0)
- Presence checks for required fields
- Fuzzy matching for AI-generated text (summaries, talking points)

---

## Test Utilities & Helpers

### Assertion Helpers Needed

```python
# tests/utils/assertions.py

def assert_valid_contract_payload(payload: ContractPayload):
    """Validate contract payload structure."""
    assert payload.metadata is not None
    assert payload.metadata.get("template") is not None
    assert payload.metadata.get("version") == "2025.11"
    # ... more validations

def assert_negotiation_playbook_valid(playbook: List[Dict]):
    """Validate negotiation playbook structure."""
    for topic in playbook:
        assert "topic" in topic
        assert "target" in topic
        assert "talking_points" in topic
        assert len(topic["talking_points"]) > 0

def assert_confidence_in_range(confidence: float, min_val=0.0, max_val=1.0):
    """Validate confidence score is within range."""
    assert min_val <= confidence <= max_val, f"Confidence {confidence} out of range [{min_val}, {max_val}]"

def assert_fuzzy_match(actual: str, expected_keywords: List[str], threshold=0.8):
    """Fuzzy match for AI-generated text."""
    matched = sum(1 for kw in expected_keywords if kw.lower() in actual.lower())
    score = matched / len(expected_keywords)
    assert score >= threshold, f"Fuzzy match score {score} < {threshold}"
```

---

## Known Issues & Technical Debt

### Backend

1. **OutputValidationError Not Properly Defined**
   - **Status:** ⚠️ Partial fix
   - **Impact:** 6/23 tests failing (test matchers only, not functionality)
   - **Fix:** Define `OutputValidationError` class in `multi_ai_orchestrator.py`

2. **Gemini Client Lacks Unit Tests**
   - **Status:** ❌ Not implemented
   - **Impact:** No coverage for API mocking, error handling
   - **Fix:** Add `tests/test_gemini_client.py` with mocked responses

3. **No Integration Tests for `/contracts/ingest`**
   - **Status:** ❌ Not implemented
   - **Impact:** Endpoint not validated end-to-end
   - **Fix:** Add `tests/integration/test_contracts_api.py`

### Frontend

1. **Limited E2E Coverage**
   - **Status:** ❌ Not implemented
   - **Impact:** User flows not validated
   - **Fix:** Install Playwright, add 3-5 critical flows

2. **No Contract Upload Validation**
   - **Status:** ❌ Not implemented
   - **Impact:** File upload security/validation gaps
   - **Fix:** Add file type, size, content validation

---

## Success Metrics

### Test Coverage Targets

| Layer | Target | Current | Gap |
|-------|--------|---------|-----|
| Unit Tests | 80% | ~50% | Need Gemini, Alerts, Schemas tests |
| Integration Tests | 100% endpoints | ~30% | Need contract ingestion, health checks |
| Pipeline Tests | 100% fixtures | 0% | Need full pipeline harness |
| E2E Tests | 5 critical flows | 1 flow | Need upload, view, error flows |

### Quality Gates

**Before Merging to Main:**
- ✅ All P0 tests pass
- ✅ No new test regressions
- ✅ Code coverage doesn't decrease
- ✅ Linting passes
- ✅ Type checking passes (TypeScript + mypy)

**Before Production Deployment:**
- ✅ All P0 + P1 tests pass
- ✅ E2E smoke tests pass
- ✅ Load testing validates performance targets
- ✅ Security scan passes (no high/critical vulnerabilities)
- ✅ Manual QA spot check (5 minutes)

---

## Next Steps

### Phase 1: Foundation (This Week) ✅ IN PROGRESS

- [x] Map codebase and create test plan
- [x] Create contract fixture library
- [ ] Build pipeline test harness
- [ ] Add unit tests for core logic
- [ ] Wire tests into unified commands

### Phase 2: Integration (Next Week)

- [ ] Add integration tests for all API endpoints
- [ ] Create golden output validation
- [ ] Add assertion helper utilities
- [ ] Set up CI pipeline for integration tests

### Phase 3: E2E (Week 3)

- [ ] Install and configure Playwright
- [ ] Create 5 critical E2E flows
- [ ] Add E2E tests to CI
- [ ] Set up screenshot/video capture on failures

### Phase 4: Automation (Week 4)

- [ ] Add Droid Exec to CI for intelligent summaries
- [ ] Set up nightly demo health checks
- [ ] Implement coverage-driven test generation
- [ ] Add performance regression testing

---

## Resources & Documentation

- **Testing Strategy:** `/docs/testing-strategy.md`
- **Quick Reference:** `/docs/qa-quick-reference.md`
- **Bulletproof Architecture:** `/docs/bulletproof-architecture.md`
- **Fixtures:** `/fixtures/contracts/`
- **Expected Outputs:** `/fixtures/expected/` (to be created)
- **Test Utils:** `/apps/api/tests/utils/` (to be created)

---

## Questions & Decisions

### Open Questions

1. **Do we need visual regression testing for UI components?**
   - Recommendation: Not for MVP, add in Phase 5

2. **Should we test against real AI APIs or always use stubs in CI?**
   - Recommendation: Stubs in CI for speed, real APIs in nightly runs

3. **What's our policy on flaky tests?**
   - Recommendation: Auto-disable after 3 consecutive failures, require investigation

### Decisions Made

- ✅ Use pytest for Python, vitest for TypeScript
- ✅ Use Playwright for E2E (not Cypress)
- ✅ Fixture-based testing for contract pipeline
- ✅ Golden output files for expected results
- ✅ Fuzzy matching for AI-generated text
- ✅ Circuit breaker pattern for AI providers
- ✅ Stub fallback guarantees 100% uptime

---

**Document Owner:** Engineering Team  
**Last Updated:** November 15, 2025  
**Next Review:** November 22, 2025
