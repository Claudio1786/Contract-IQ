# Contract Fixtures

This directory contains synthetic contract fixtures used for testing and demo purposes.

## Purpose

These fixtures simulate real-world contracts processed through Contract IQ, providing:

1. **Consistent test data** for automated QA pipelines
2. **Demo data** for showcasing Contract IQ capabilities
3. **Golden examples** of contract structure and analysis

## Fixture Categories

### Core Templates (New - Comprehensive)

| File | Template ID | Vertical | Description |
|------|-------------|----------|-------------|
| `nda-simple.json` | nda-simple | General | Basic NDA with standard confidentiality terms |
| `msa-standard.json` | msa-standard | Technology | Technology MSA with SLA, liability caps, auto-renewal |
| `dpa-gdpr.json` | dpa-gdpr | Data Privacy | GDPR-compliant DPA with sub-processor clauses |
| `sow-consulting.json` | sow-consulting | Professional Services | Consulting SOW with deliverables and payment milestones |

### Existing Templates (Legacy)

| File | Template ID | Vertical | Description |
|------|-------------|----------|-------------|
| `saas-msa.json` | saas-msa | SaaS | Enterprise SaaS agreement with usage tiers |
| `healthcare-baa.json` | healthcare-baa | Healthcare | HIPAA Business Associate Agreement |
| `nil-athlete-agreement.json` | nil-athlete-agreement | Sports/NIL | Name, image, likeness endorsement agreement |
| `public-sector-sow.json` | public-sector-sow | Government | Public sector statement of work |

## Fixture Structure

Each fixture follows the Contract IQ canonical schema:

```json
{
  "metadata": {
    "template": "template-id",
    "version": "2025.11",
    "vertical": "industry-vertical",
    "jurisdiction": "Legal jurisdiction",
    "renewal": {
      "type": "auto|fixed|coterminous",
      "termMonths": 12,
      "noticeDays": 60
    },
    "counterparties": [...]
  },
  "financials": { ... },
  "clauses": [ ... ],
  "risks": [ ... ],
  "obligations": [ ... ],
  "negotiation": {
    "playbook": [ ... ]
  },
  "audit": {
    "confidence": 0.85,
    "extractedAt": "2025-11-15T08:00:00Z",
    "model": "gemini-2.5-flash",
    "reviewRequired": false
  }
}
```

## Key Contract Elements

### 1. Metadata
- **Template ID**: Matches fixture filename (e.g., `nda-simple`)
- **Vertical**: Industry categorization (SaaS, Healthcare, Data Privacy, etc.)
- **Jurisdiction**: Legal governing law
- **Renewal Terms**: Auto-renewal, fixed term, or coterminous

### 2. Financials
- **Base Fees**: Annual or monthly recurring charges
- **Usage Bands**: Tiered pricing based on consumption (API calls, users, etc.)
- **Incentives**: Service credits, rebates, penalties

### 3. Clauses
- **Risk Clauses**: Liability caps, indemnification, warranties
- **Performance Clauses**: SLAs, uptime guarantees
- **Compliance Clauses**: GDPR, HIPAA, SOC 2 certifications
- **Exit Clauses**: Termination rights, data deletion

### 4. Risks
- **Severity Levels**: low, medium, high
- **Risk Categories**: Financial, compliance, operational, reputational
- **Mitigation Strategies**: Actionable recommendations

### 5. Obligations
- **Party**: Who is obligated (vendor, customer, processor, controller)
- **Action**: What must be done
- **Deadline**: When it must be done
- **Recurring**: One-time or ongoing obligation

### 6. Negotiation Playbook
- **Topics**: Contract terms to negotiate
- **Current/Target/Fallback**: Position spectrum
- **Talking Points**: Persuasive arguments
- **Risk Callouts**: Potential pitfalls

## Using Fixtures in Tests

### Pipeline Tests

```python
from contract_iq.services.ingestion import ContractIngestionService, IngestionConfig

# Load fixture
service = ContractIngestionService(config=...)
request = ContractIngestRequest(
    template_id="nda-simple",  # Matches filename
    team_id="test-team",
    ingest_source="test"
)

response = service.process_contract(request)
assert response.payload.metadata["template"] == "nda-simple"
```

### API Integration Tests

```bash
curl -X POST http://localhost:8000/contracts/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "msa-standard",
    "team_id": "demo-team",
    "ingest_source": "api-test"
  }'
```

## Adding New Fixtures

1. **Create JSON file** in this directory with descriptive name (e.g., `vendor-agreement.json`)
2. **Follow canonical schema** (use existing fixtures as templates)
3. **Set template ID** to match filename (without `.json`)
4. **Include all required sections**: metadata, clauses, risks, obligations, negotiation
5. **Add to README table** above
6. **Update test plan** in `/docs/qa/contract-demo-test-plan.md`

## Fixture Validation

Fixtures should be validated against:

- **Schema compliance**: All required fields present
- **Business logic**: Realistic financial terms, risk severities, confidence scores
- **Completeness**: Negotiation playbook with 1-3 topics
- **Consistency**: Audit metadata matches contract content

## Golden Outputs (Future)

For automated testing, we maintain "expected outputs" in `/fixtures/expected/`:

```
fixtures/
  contracts/          ← Input fixtures (what we ingest)
    nda-simple.json
    msa-standard.json
    
  expected/           ← Expected outputs (what we validate against)
    nda-simple.json
    msa-standard.json
```

Expected outputs define:
- Required field presence
- Value ranges (e.g., confidence 0.7-1.0)
- Minimum counts (e.g., ≥ 2 obligations)
- Fuzzy matching keywords for AI-generated text

## Confidentiality Notice

**All fixtures are synthetic and do not contain real contract data.**

These fixtures are designed for testing and demo purposes only. They simulate realistic contract structures but do not reflect actual agreements.

---

**Last Updated:** November 15, 2025  
**Maintained By:** Engineering & QA Team
