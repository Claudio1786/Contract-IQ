# Contract IQ - AI Contract Extraction Prompts & Training Guide

**Document Version:** 1.0  
**Created:** November 18, 2025  
**Purpose:** Complete AI training specifications for contract term extraction

---

## 🎯 Executive Summary

This document provides exact AI prompts, training data requirements, and extraction specifications for Contract IQ's document intelligence engine. Use this to train AI models to extract critical contract terms with >95% accuracy.

---

## 🤖 Recommended AI Model Stack

### **Primary Recommendation: Multi-Model Approach**

**Document Processing Pipeline:**

```
PDF Upload
    ↓
Step 1: OCR & Text Extraction
    → Tesseract OCR (for scanned docs) + PyPDF2 (for native PDFs)
    ↓
Step 2: Structured Data Extraction
    → GPT-4 Turbo (gpt-4-turbo-2024-04-09) via OpenAI API
    → Claude 3.5 Sonnet as fallback (better at complex tables)
    ↓
Step 3: Validation & Confidence Scoring
    → Custom validation logic (TypeScript)
    ↓
Step 4: Manual Review Queue
    → Extractions with confidence <85% flagged for human review
```

### **Why GPT-4 Turbo as Primary?**

✅ **Pros:**
- Excellent at understanding legal language
- Handles multi-page context (128K token window)
- Consistent JSON output formatting
- Lower cost than Claude for high-volume processing ($0.01/1K tokens input)
- Strong performance on dates, currencies, percentages

✅ **Proven Use Cases:**
- DocuSign CLM uses GPT-4 for contract intelligence
- Ironclad uses similar OpenAI models
- Your 10 sample contracts are well within complexity range

### **Why Claude 3.5 Sonnet as Fallback?**

✅ **Pros:**
- Better at extracting data from complex tables
- More conservative confidence scores (fewer false positives)
- Excels at nuanced clause interpretation
- Handles ambiguous language better

**Usage Pattern:**
- Use GPT-4 for 90% of contracts
- Fallback to Claude if:
  - GPT-4 confidence score <85%
  - Contract has complex pricing tables
  - International terms (non-US jurisdiction)

---

## 📋 Required Training Data

### **Current State:**
✅ You have: **10 sample contracts** ($2.382M portfolio)
❌ You need: **20-30 additional contract variations**

### **What Additional Contracts Should Include:**

**Variations Needed:**

1. **Pricing Structures (5 contracts):**
   - Usage-based pricing (per API call, per GB storage)
   - Tiered pricing (different rates at volume thresholds)
   - Hybrid models (base fee + overage charges)
   - Multi-product bundles
   - International currencies (GBP, EUR, AUD)

2. **Term Variations (5 contracts):**
   - Evergreen contracts (no fixed end date)
   - Month-to-month with 90-day notice
   - 5-year enterprise deals
   - Contracts with multiple renewal options
   - Contracts with conditional auto-renewal

3. **Edge Cases (5 contracts):**
   - Heavily redlined MSAs (lots of custom terms)
   - Scanned PDFs with OCR quality issues
   - Contracts with embedded tables/schedules
   - Contracts referencing external "Exhibit A" pricing
   - Master agreements with multiple SOWs

4. **Industry Variations (5 contracts):**
   - Financial services (extra compliance clauses)
   - Healthcare (HIPAA BAAs)
   - Government (FedRAMP requirements)
   - International (GDPR, data residency)
   - Non-profit (special payment terms)

5. **Quality Control (5 contracts):**
   - Intentionally ambiguous terms (test error handling)
   - Contracts missing key information (test fallback logic)
   - Contracts with conflicting terms (test validation)
   - Contracts with unusual formatting
   - Contracts in different templates (DocuSign, PandaDoc, manual Word)

**Total Needed:** 10 (current) + 25 (additional) = **35 contracts for robust training**

### **🚨 ACTION REQUIRED FROM YOU:**

**Can you provide 20-30 additional contract samples?**

**Options:**
1. **Anonymize real customer contracts** (best for accuracy)
2. **Source from colleagues in SaaS revenue/CS roles**
3. **Use contracts from past companies** (anonymized)
4. **Purchase contract templates** (Grata, ContractWorks, PandaDoc library)

**Timeline:** Need within 2 weeks for Factory.ai to start AI training

---

## 📝 AI Extraction Prompts (Copy/Paste Ready)

### **Master System Prompt**

```
You are a B2B SaaS contract intelligence AI. Your job is to extract specific terms from customer Master Service Agreements (MSAs) to help revenue operations teams identify renewal risks and pricing optimization opportunities.

Extract the following fields from the contract document. Return results as JSON.

CRITICAL RULES:
1. Extract EXACT text from the document - do not infer or assume
2. If a field is not found or is ambiguous, return null with a confidence score
3. Include confidence score (0-100) for each extracted field
4. Highlight any contradictions or ambiguities in the "notes" field
5. For dates, return in ISO 8601 format (YYYY-MM-DD)
6. For currency, always include currency code (USD, GBP, EUR)
7. For percentages, return as decimal (e.g., 5% = 0.05)

CONTEXT:
- This is a CUSTOMER contract (revenue intelligence, not procurement)
- "Customer" = the company paying us (the SaaS vendor)
- "Vendor" or "Provider" = us (the SaaS company)
- Renewal dates and pricing are CRITICAL - highest accuracy required
```

### **Field Extraction Prompt (Structured Output)**

```
Extract the following fields from the contract:

{
  "contract_metadata": {
    "contract_number": "string | null",
    "contract_title": "string | null",
    "execution_date": "YYYY-MM-DD | null",
    "parties": {
      "customer_legal_name": "string | null",
      "customer_short_name": "string | null",
      "vendor_legal_name": "string | null"
    }
  },
  
  "term_details": {
    "start_date": "YYYY-MM-DD | null",
    "end_date": "YYYY-MM-DD | null",
    "initial_term_months": "integer | null",
    "renewal_type": "auto-renewal | manual | evergreen | null",
    "renewal_term_months": "integer | null",
    "notice_period_days": "integer | null",
    "notice_deadline_date": "YYYY-MM-DD | null (calculated from end_date - notice_period)"
  },
  
  "pricing": {
    "pricing_model": "per-user | usage-based | tiered | flat-fee | hybrid | null",
    "price_per_user_monthly": "number | null",
    "total_annual_value": "number | null",
    "currency": "USD | GBP | EUR | etc. | null",
    "committed_users": "integer | null",
    "payment_terms": "Net 30 | Net 60 | Prepaid | etc. | null",
    "payment_frequency": "monthly | quarterly | annually | null",
    "price_escalation_clause": {
      "has_escalation": "boolean",
      "escalation_type": "fixed-percentage | CPI-linked | none | null",
      "escalation_rate": "decimal | null (e.g., 0.05 for 5%)"
    }
  },
  
  "service_levels": {
    "sla_tier": "Standard | Professional | Premium | Enterprise | null",
    "uptime_commitment": "decimal | null (e.g., 0.999 for 99.9%)",
    "support_level": "Email | Business Hours | 24/7 | Dedicated CSM | null",
    "response_time_hours": "integer | null"
  },
  
  "termination_clauses": {
    "early_termination_allowed": "boolean | null",
    "early_termination_fee": "string | null (describe fee structure)",
    "termination_notice_days": "integer | null",
    "termination_for_convenience": "boolean | null"
  },
  
  "custom_terms": {
    "has_custom_redlines": "boolean",
    "custom_clauses": ["array of strings describing non-standard terms"],
    "jurisdiction": "string | null (e.g., 'Delaware, USA' or 'England and Wales')",
    "data_residency": "string | null (e.g., 'US-only' or 'EU')"
  },
  
  "confidence_scores": {
    "overall_confidence": "integer (0-100)",
    "field_confidence": {
      "end_date": "integer (0-100)",
      "renewal_type": "integer (0-100)",
      "price_per_user": "integer (0-100)",
      "payment_terms": "integer (0-100)"
    }
  },
  
  "extraction_notes": {
    "ambiguities": ["array of strings describing unclear terms"],
    "contradictions": ["array of strings describing conflicting clauses"],
    "missing_critical_info": ["array of strings listing key fields not found"],
    "requires_manual_review": "boolean",
    "manual_review_reason": "string | null"
  }
}
```

### **Example: Prompt for Acme Corp Contract**

**Input to AI:**

```
Contract Document: [Full text of 01_Acme_Corp_Enterprise_Legacy.docx]

Extract contract terms using the structured format provided. Pay special attention to:
1. Contract end date (critical for renewal alert timing)
2. Renewal type (auto vs manual)
3. Price per user per month
4. Notice period for renewal

Return JSON output.
```

**Expected Output:**

```json
{
  "contract_metadata": {
    "contract_number": "RSC-2022-1847",
    "contract_title": "Master Service Agreement",
    "execution_date": "2022-01-15",
    "parties": {
      "customer_legal_name": "Acme Corporation",
      "customer_short_name": "Acme Corp",
      "vendor_legal_name": "RevenueSync Inc."
    }
  },
  "term_details": {
    "start_date": "2022-01-15",
    "end_date": "2025-01-14",
    "initial_term_months": 36,
    "renewal_type": "manual",
    "renewal_term_months": null,
    "notice_period_days": 90,
    "notice_deadline_date": "2024-10-16"
  },
  "pricing": {
    "pricing_model": "per-user",
    "price_per_user_monthly": 200.00,
    "total_annual_value": 180000.00,
    "currency": "USD",
    "committed_users": 75,
    "payment_terms": "Net 60",
    "payment_frequency": "monthly",
    "price_escalation_clause": {
      "has_escalation": false,
      "escalation_type": "none",
      "escalation_rate": null
    }
  },
  "service_levels": {
    "sla_tier": "Standard",
    "uptime_commitment": 0.995,
    "support_level": "Business Hours",
    "response_time_hours": 24
  },
  "termination_clauses": {
    "early_termination_allowed": false,
    "early_termination_fee": "Not permitted during initial term",
    "termination_notice_days": null,
    "termination_for_convenience": false
  },
  "custom_terms": {
    "has_custom_redlines": false,
    "custom_clauses": [],
    "jurisdiction": "Delaware, USA",
    "data_residency": "US-only"
  },
  "confidence_scores": {
    "overall_confidence": 95,
    "field_confidence": {
      "end_date": 100,
      "renewal_type": 95,
      "price_per_user": 100,
      "payment_terms": 100
    }
  },
  "extraction_notes": {
    "ambiguities": [],
    "contradictions": [],
    "missing_critical_info": [],
    "requires_manual_review": false,
    "manual_review_reason": null
  }
}
```

---

## 🎯 Extraction Accuracy Benchmarks

### **Target Accuracy by Field (Minimum for Production)**

| Field | Target Accuracy | Critical? | Fallback if Low Confidence |
|-------|----------------|-----------|----------------------------|
| **Contract End Date** | 98%+ | 🔴 YES | Flag for manual review |
| **Renewal Type** | 95%+ | 🔴 YES | Default to "manual" (safer) |
| **Price Per User** | 95%+ | 🔴 YES | Flag for manual review |
| **Payment Terms** | 90%+ | 🟡 IMPORTANT | Assume Net 30 (industry standard) |
| **Notice Period** | 90%+ | 🟡 IMPORTANT | Assume 60 days (common default) |
| **SLA Commitment** | 85%+ | 🟢 NICE-TO-HAVE | Leave blank |
| **Escalation Clause** | 85%+ | 🟡 IMPORTANT | Default to "none" |
| **Custom Terms** | 70%+ | 🟢 NICE-TO-HAVE | Flag for legal review |

### **Overall Extraction Quality Tiers**

**Tier 1: Production-Ready (95%+ overall)**
- All critical fields extracted with high confidence
- Risk scoring can be automated
- Salesforce sync can run unattended
- Manual review queue <5% of contracts

**Tier 2: Acceptable (85-94% overall)**
- Most fields extracted correctly
- ~10-15% of contracts need manual review
- Risk scoring mostly automated with human validation
- Acceptable for MVP/pilot

**Tier 3: Needs Improvement (<85% overall)**
- Too many false positives or missed fields
- Manual review queue >20%
- Not suitable for production without human oversight

### **How to Measure Accuracy**

**Testing Protocol:**

1. **Ground Truth Dataset:**
   - Manually review 35 training contracts
   - Create "answer key" spreadsheet with correct values for all fields
   - Have 2 people independently verify (inter-rater reliability >90%)

2. **Extraction Testing:**
   - Run all 35 contracts through AI extraction
   - Compare AI output to ground truth
   - Calculate accuracy by field: `(Correct Extractions / Total Contracts) * 100`

3. **Confidence Calibration:**
   - For fields with confidence >90%, accuracy should be >95%
   - For fields with confidence 70-90%, accuracy should be >80%
   - For fields with confidence <70%, accuracy <70% is expected (flag for review)

4. **Continuous Improvement:**
   - Weekly: Review manual correction queue
   - Monthly: Retrain prompts based on common errors
   - Quarterly: Expand training data with new contract patterns

---

## 🔄 Fallback Strategy for Edge Cases

### **Decision Tree for Low-Confidence Extractions**

```
AI Extracts Contract Terms
    ↓
Overall Confidence Score?
    ↓
├─ >90% confidence
│   └─ Auto-approve → Send to Salesforce
│
├─ 70-90% confidence
│   └─ Flag for quick review → Show AI extraction + original text
│       └─ Human reviews in 2-3 minutes → Approve or correct
│
└─ <70% confidence
    └─ Flag for full manual review
        └─ Human reads entire contract (10-15 minutes)
            └─ Enter all fields manually
```

### **Manual Review Queue Implementation**

**Priority Scoring for Review Queue:**

**P0 - Critical (Review within 4 hours):**
- Contract end date missing or low confidence (<80%)
- Renewal type unclear (auto vs manual)
- Price per user not found
- Contract expires within 60 days

**P1 - High (Review within 24 hours):**
- Payment terms unclear
- Notice period missing
- Price escalation clause unclear
- Contract expires within 90 days

**P2 - Medium (Review within 1 week):**
- SLA commitment unclear
- Custom terms need clarification
- Contract expires >90 days

**P3 - Low (Review as time allows):**
- Non-critical fields missing
- Context/notes fields
- Secondary pricing details

### **Manual Review UI Mockup**

**Show reviewer:**
1. **AI Extraction Results** (left panel)
   - All extracted fields with confidence scores
   - Fields with <70% highlighted in yellow
   - Missing fields highlighted in red

2. **Original Contract** (right panel)
   - PDF viewer with relevant sections highlighted
   - Jump-to links for each field (clicking "End Date" scrolls to that section)

3. **Quick Actions** (bottom toolbar)
   - "Approve All" button (if extraction looks correct)
   - "Correct & Approve" button (opens inline edit mode)
   - "Escalate to Legal" button (for complex clauses)
   - "Defer Review" button (moves to P3 queue)

**Target Time:**
- P0 reviews: 3-5 minutes per contract
- P1 reviews: 5-10 minutes per contract
- P2 reviews: 10-15 minutes per contract

---

## 🧪 Validation Logic (TypeScript)

### **Example: Validate End Date Extraction**

```typescript
interface ContractExtraction {
  term_details: {
    end_date: string | null;
    start_date: string | null;
    initial_term_months: number | null;
  };
  confidence_scores: {
    field_confidence: {
      end_date: number;
    };
  };
}

function validateEndDate(extraction: ContractExtraction): {
  isValid: boolean;
  confidence: number;
  issues: string[];
} {
  const issues: string[] = [];
  let adjustedConfidence = extraction.confidence_scores.field_confidence.end_date;

  // Check 1: End date exists
  if (!extraction.term_details.end_date) {
    issues.push("End date not found in contract");
    return { isValid: false, confidence: 0, issues };
  }

  // Check 2: End date is in the future (or recently past for renewal scenarios)
  const endDate = new Date(extraction.term_details.end_date);
  const today = new Date();
  const daysDiff = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < -365) {
    issues.push("Contract ended over a year ago - likely wrong date extracted");
    adjustedConfidence = Math.min(adjustedConfidence, 50);
  }

  // Check 3: Cross-validate with start date + initial term
  if (extraction.term_details.start_date && extraction.term_details.initial_term_months) {
    const startDate = new Date(extraction.term_details.start_date);
    const expectedEndDate = new Date(startDate);
    expectedEndDate.setMonth(expectedEndDate.getMonth() + extraction.term_details.initial_term_months);

    const dateDiffDays = Math.abs(
      (endDate.getTime() - expectedEndDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dateDiffDays > 30) {
      issues.push(
        `End date (${extraction.term_details.end_date}) doesn't match start date + term ` +
        `(expected ~${expectedEndDate.toISOString().split('T')[0]})`
      );
      adjustedConfidence = Math.min(adjustedConfidence, 70);
    }
  }

  // Check 4: Confidence threshold
  const isValid = adjustedConfidence >= 85 && issues.length === 0;

  return { isValid, confidence: adjustedConfidence, issues };
}
```

### **Example: Validate Renewal Type**

```typescript
function validateRenewalType(extraction: ContractExtraction): {
  isValid: boolean;
  confidence: number;
  suggestion: string | null;
} {
  const renewalType = extraction.term_details.renewal_type;
  const confidence = extraction.confidence_scores.field_confidence.renewal_type;

  // If confidence is low, default to "manual" (safer assumption)
  if (confidence < 70) {
    return {
      isValid: false,
      confidence: confidence,
      suggestion: "manual (defaulting to safer option for low confidence)"
    };
  }

  // Auto-renewal should have renewal term specified
  if (renewalType === "auto-renewal" && !extraction.term_details.renewal_term_months) {
    return {
      isValid: false,
      confidence: Math.min(confidence, 60),
      suggestion: "Auto-renewal specified but renewal term not found - verify contract"
    };
  }

  return { isValid: true, confidence: confidence, suggestion: null };
}
```

---

## 📊 Training Progress Tracking

### **Metrics to Monitor During Training**

**Week 1-2: Initial Training**
- [ ] Process all 35 contracts
- [ ] Measure baseline accuracy by field
- [ ] Identify top 5 error patterns
- [ ] Adjust prompts based on errors

**Week 3-4: Iterative Improvement**
- [ ] Reprocess contracts with updated prompts
- [ ] Measure accuracy improvement
- [ ] Target: >85% overall accuracy
- [ ] Document remaining edge cases

**Week 5-6: Production Readiness**
- [ ] Achieve >95% accuracy on critical fields
- [ ] Manual review queue <10% of contracts
- [ ] Confidence calibration tested
- [ ] Fallback logic validated

### **Success Criteria for Production Launch**

✅ **Critical Fields (Must Have >95% Accuracy):**
- Contract end date
- Renewal type (auto vs manual)
- Price per user
- Total ARR

✅ **Important Fields (Must Have >90% Accuracy):**
- Payment terms
- Notice period
- Price escalation clause

✅ **System Performance:**
- Processing time <30 seconds per contract
- API costs <$0.50 per contract
- Manual review queue <10% of contracts

✅ **Quality Control:**
- False positive rate <5%
- False negative rate <2%
- User satisfaction >4/5 stars

---

## 🚨 Critical Warnings

### **1. Training Data Privacy** 🔒
**Risk:** Real customer contracts contain sensitive information  
**Solution:**
- Anonymize all customer names, employee names, proprietary terms
- Use fake company names (Acme Corp, TechScale, etc.)
- Redact any references to confidential pricing strategies
- Never train on contracts without permission

### **2. Prompt Injection Attacks** ⚠️
**Risk:** Malicious contracts could contain instructions to manipulate AI  
**Solution:**
- Sanitize all input text before sending to AI
- Validate AI output against expected schema
- Never execute code or commands from AI responses
- Implement rate limiting on API calls

### **3. Model Drift** 📉
**Risk:** AI accuracy degrades over time as contract language evolves  
**Solution:**
- Monthly accuracy audits
- Quarterly retraining with new contract samples
- Monitor confidence scores for trending downward
- Alert if accuracy drops below 90% for critical fields

---

## 🎯 Next Steps for Factory.ai

### **Week 1: Setup**
1. **Provision OpenAI API Access**
   - Create OpenAI account
   - Get API key for GPT-4 Turbo
   - Set spending limits ($500/month for pilot)
   - Test API connection

2. **Prepare Training Data**
   - Load 10 existing sample contracts
   - ⚠️ **Wait for 20-30 additional contracts from customer**
   - Create ground truth spreadsheet
   - Set up version control for prompts

### **Week 2-3: Initial Training**
3. **Implement Extraction Pipeline**
   - Build PDF → text extraction
   - Implement AI API calls with prompts above
   - Parse JSON responses
   - Store in database

4. **Measure Baseline Accuracy**
   - Run all contracts through extraction
   - Calculate accuracy by field
   - Identify error patterns
   - Document edge cases

### **Week 4-5: Iterative Improvement**
5. **Refine Prompts**
   - Adjust prompts based on errors
   - Test confidence score calibration
   - Implement validation logic
   - Build manual review queue

6. **Production Testing**
   - Achieve >95% accuracy on critical fields
   - Test with 100 contract load
   - Measure processing time and costs
   - Validate fallback logic

---

## ✅ Summary: What You Have vs. What You Need

### **What You HAVE:**
✅ Master system prompt (copy/paste ready)
✅ Structured JSON schema for extraction
✅ Example extraction (Acme Corp)
✅ Validation logic (TypeScript)
✅ Accuracy benchmarks (95%+ target)
✅ Fallback strategy for edge cases
✅ Manual review queue design
✅ Training progress checklist

### **What You NEED:**
❌ **20-30 additional contract samples** (Priority #1)
❌ Decision on AI model (GPT-4 recommended)
❌ OpenAI API budget approval ($500/month pilot)
❌ Ground truth dataset (manual review of all 35 contracts)

---

**Document Status:** ✅ COMPLETE - Ready for Factory.ai AI training  
**Blocker:** Need 20-30 additional contract samples to proceed

**Action Required:** Provide additional training contracts within 2 weeks
