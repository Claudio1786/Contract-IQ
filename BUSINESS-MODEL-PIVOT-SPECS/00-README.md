# Contract IQ - Business Model Pivot Documentation

## 📋 Complete Specification Package for Factory.ai

**Version:** 1.0  
**Last Updated:** November 18, 2024  
**Purpose:** Zero-ambiguity documentation for implementing Customer Revenue Intelligence platform

---

## 🎯 Overview

This folder contains complete, gap-free specifications for pivoting Contract IQ from **Vendor/Procurement Management** (WRONG) to **Customer Revenue Intelligence** (CORRECT).

### The Critical Pivot

**What Changed:**
- **FROM:** Managing contracts we BUY (vendor contracts - procurement focus)
- **TO:** Managing contracts we SELL (customer contracts - revenue focus)

**Why This Matters:**
- Complete 180° business logic inversion
- Every term, risk calculation, UI element, and integration must flip perspective
- Factory.ai must implement with ZERO assumptions

---

## 📚 Documentation Index

### **TIER 1: CRITICAL** (Must Read Before Coding)

| Doc # | Document | Status | Purpose |
|-------|----------|--------|---------|
| 01 | [TERMINOLOGY-GLOSSARY.md](./01-TERMINOLOGY-GLOSSARY.md) | ✅ Complete | Eliminates all term ambiguity. Read FIRST. |
| 02 | [DATA-SCHEMA.md](./02-DATA-SCHEMA.md) | ✅ Complete | Complete database design with 10 sample records |
| 03 | [RISK-SCORING-ALGORITHM.md](./03-RISK-SCORING-ALGORITHM.md) | ✅ Complete | Exact churn risk formula with 5 worked examples |
| 04 | [UI-COMPONENT-LIBRARY.md](./04-UI-COMPONENT-LIBRARY.md) | ✅ Complete | Every screen, component, state specified |
| 05 | [AI-EXTRACTION-SYSTEM.md](./05-AI-EXTRACTION-SYSTEM.md) | ✅ Complete | Complete prompts, validation, error handling |

### **TIER 2: IMPORTANT** (Needed During Development)

| Doc # | Document | Status | Purpose |
|-------|----------|--------|---------|
| 06 | [INTEGRATION-SPECS.md](./06-INTEGRATION-SPECS.md) | ✅ Complete | Salesforce, Gainsight, Stripe, DocuSign specs |
| 07 | [ALERT-SYSTEM.md](./07-ALERT-SYSTEM.md) | ✅ Complete | All alert types with email/Slack templates |
| 08 | [CHART-SPECIFICATIONS.md](./08-CHART-SPECIFICATIONS.md) | ✅ Complete | All analytics visualizations with queries |
| 09 | [TEST-SCENARIOS.md](./09-TEST-SCENARIOS.md) | ✅ Complete | 30 test cases covering all logic |

### **TIER 3: REFERENCE** (Nice to Have)

| Doc # | Document | Status | Purpose |
|-------|----------|--------|---------|
| 10 | [EXPANSION-FRAMEWORK.md](./10-EXPANSION-FRAMEWORK.md) | ✅ Complete | Expansion opportunity detection logic |
| 11 | [MIGRATION-PLAN.md](./11-MIGRATION-PLAN.md) | ✅ Complete | Data migration strategy & validation |
| 12 | [COMPETITIVE-POSITIONING.md](./12-COMPETITIVE-POSITIONING.md) | ✅ Complete | Market positioning & battle cards |

---

## 🚀 Quick Start for Factory.ai

### Before You Start Coding

**1. Read These 3 Documents First (30 minutes):**
- `01-TERMINOLOGY-GLOSSARY.md` → Understand the complete business model flip
- `02-DATA-SCHEMA.md` → See the data structure
- `03-RISK-SCORING-ALGORITHM.md` → Understand core business logic

**2. Keep This Open While Coding:**
- `01-TERMINOLOGY-GLOSSARY.md` → Reference for EVERY naming decision

**3. Then Read Sequentially:**
- Tier 1 docs → Tier 2 docs → Tier 3 docs as needed

---

## 🎓 Key Concepts to Internalize

### Who is the "Customer"?
**Customer = Company that BUYS from us** (we are the seller/provider)

**NEVER** call them:
- ❌ Vendor
- ❌ Client  
- ❌ Supplier

**ALWAYS** call them:
- ✅ Customer
- ✅ Account

### Critical Inversions

| Concept | OLD (Vendor Model) | NEW (Customer Model) |
|---------|-------------------|---------------------|
| **Auto-Renewal** | BAD (we're locked in) | GOOD (they're committed) |
| **Termination for Convenience** | GOOD (we can leave) | BAD (they can leave) |
| **Pricing Gap** | We overpay = savings opp | They underpay = expansion opp |
| **Contract Management** | Reduce costs | Protect & grow revenue |

### Money Flow Direction
**OLD:** We pay → Vendor (outbound cash flow - cost)  
**NEW:** Customer pays → Us (inbound cash flow - revenue)

---

## 📊 What Each Document Contains

### 01-TERMINOLOGY-GLOSSARY.md
- Complete term mapping (OLD → NEW)
- 10 edge cases with solutions
- Ambiguous phrase clarifications
- Database naming conventions
- API response standards
- Quick reference card

### 02-DATA-SCHEMA.md
- Complete SQL database schema
- All tables with relationships
- 10 realistic sample customer contracts
- Field-by-field documentation
- Validation rules
- Migration mappings

### 03-RISK-SCORING-ALGORITHM.md
- Complete TypeScript implementation
- Weighted scoring by category (Contract 40%, Usage 30%, Relationship 20%, Financial 10%)
- 5 worked examples showing math
- Threshold definitions (0-40=LOW, 41-70=MEDIUM, 71-100=HIGH)
- Recommended actions per risk level

### 04-UI-COMPONENT-LIBRARY.md
- Design system (colors, typography, spacing)
- All 8 screens specified
- Every component with states
- Layout specifications
- Interaction patterns
- Responsive breakpoints

### 05-AI-EXTRACTION-SYSTEM.md
- Complete extraction prompts
- Field-by-field instructions
- Validation rules
- Confidence scoring
- Error handling
- Manual review triggers

### 06-INTEGRATION-SPECS.md
- Salesforce (OAuth2, field mappings, outbound actions)
- Gainsight (health scores, CSM assignments)
- Stripe (payment status, subscription sync)
- DocuSign (document webhooks, AI extraction)
- Error handling for each

### 07-ALERT-SYSTEM.md
- 10+ alert type configurations
- Trigger conditions for each
- Email templates (HTML)
- Slack templates (Blocks API)
- Throttling rules
- Escalation policies

### 08-CHART-SPECIFICATIONS.md
- Customer Renewal Waterfall
- ARR by Segment
- Churn Risk Distribution
- Expansion Funnel
- Health Score Trends
- Pricing Gap Heatmap
- SQL queries for each
- Interactivity specs

### 09-TEST-SCENARIOS.md
- 30 comprehensive test cases
- Churn risk calculations (5 tests)
- AI extraction (5 tests)
- Integration sync (5 tests)
- Alert triggering (5 tests)
- Expansion detection (5 tests)
- UI states (5 tests)

### 10-EXPANSION-FRAMEWORK.md
- 6 expansion opportunity types
- Detection logic for each
- Probability scoring
- Timing recommendations
- Recommended plays

### 11-MIGRATION-PLAN.md
- Phase 1: Import customer data
- Phase 2: Historical backfill
- Phase 3: Ongoing sync
- Data quality rules
- Validation checkpoints

### 12-COMPETITIVE-POSITIONING.md
- Primary competitors
- Differentiators
- Positioning statement
- Battle cards
- ICP definition

---

## ⚠️ Critical Warnings for Factory.ai

### DO NOT Start Coding Until You:

1. ✅ Read Tier 1 documents completely
2. ✅ Understand the business model inversion
3. ✅ Have Ray approve your understanding

### Common Mistakes to Avoid:

❌ **Mistake #1:** Using "vendor" instead of "customer"  
✅ **Solution:** Search-replace check against terminology glossary

❌ **Mistake #2:** Auto-renewal = bad (OLD vendor thinking)  
✅ **Solution:** Auto-renewal = GOOD (customer is committed, low churn risk)

❌ **Mistake #3:** Treating pricing gap as "we overpay"  
✅ **Solution:** Pricing gap = "they underpay" = expansion opportunity

❌ **Mistake #4:** Making assumptions about field definitions  
✅ **Solution:** Every field is explicitly defined in DATA-SCHEMA.md

❌ **Mistake #5:** Generic risk logic without weighted scoring  
✅ **Solution:** Exact algorithm provided in RISK-SCORING-ALGORITHM.md

### When You're Unsure:

1. **Search terminology glossary first**
2. **Check if there's an edge case documented**
3. **Look for worked examples**
4. **If still unclear → Ask Ray (don't assume)**

---

## 📦 Deliverable Checklist

Ray has provided:

### ✅ Documentation (Complete)
- [x] Terminology Glossary with 10 edge cases
- [x] Complete Data Schema with sample records
- [x] Risk Scoring Algorithm with worked examples
- [x] UI Component Library (all screens)
- [x] AI Extraction System with prompts
- [x] Integration Specifications (4 systems)
- [x] Alert System Configuration (10+ alerts)
- [x] Chart Specifications with SQL queries
- [x] 30 Test Scenarios
- [x] Expansion Framework
- [x] Migration Plan
- [x] Competitive Positioning

### ⚠️ Assets Ray Still Needs to Provide

- [ ] **Figma Designs** (or can use Component Library specs)
- [ ] **Sample Customer Contracts** (10 PDFs for AI training)
- [ ] **Current Rate Card** (what new customers pay today)
- [ ] **Salesforce Credentials** (for integration testing)
- [ ] **Brand Assets** (can use DESIGN-SYSTEM.md as reference)

### Factory.ai Can Start:

✅ **YES - Can start with these docs:**
- Database schema implementation
- Risk scoring algorithm
- UI component development (using specs)
- Alert system configuration

❌ **NOT YET - Need assets first:**
- AI extraction training (need sample contracts)
- Salesforce integration testing (need credentials)
- Pricing gap detection (need current rate card)

---

## 🏗️ Implementation Approach

### Phase 1: Foundation (Week 1)
1. Implement database schema (02-DATA-SCHEMA.md)
2. Seed with 10 sample records
3. Implement risk scoring algorithm (03-RISK-SCORING-ALGORITHM.md)
4. Write tests for risk calculations

### Phase 2: Core Features (Week 2)
1. Build UI components (04-UI-COMPONENT-LIBRARY.md)
2. Implement dashboard screens
3. Build contract detail pages
4. Add filtering & sorting

### Phase 3: Intelligence (Week 3)
1. Implement AI extraction (05-AI-EXTRACTION-SYSTEM.md)
2. Set up validation rules
3. Build manual review flow
4. Test with sample contracts (when Ray provides)

### Phase 4: Integrations (Week 4)
1. Salesforce connection (06-INTEGRATION-SPECS.md)
2. Gainsight/ChurnZero sync
3. Stripe payment status
4. DocuSign webhooks

### Phase 5: Alerts & Analytics (Week 5)
1. Alert system (07-ALERT-SYSTEM.md)
2. Email templates
3. Slack integration
4. Charts & dashboards (08-CHART-SPECIFICATIONS.md)

### Phase 6: Testing & Polish (Week 6)
1. Run all test scenarios (09-TEST-SCENARIOS.md)
2. Edge case handling
3. Performance optimization
4. Final QA

---

## 🧪 Validation Checklist

Before declaring "done", verify:

### Data Model
- [ ] All 15 tables created with correct schema
- [ ] Sample data loads successfully
- [ ] Foreign key relationships work
- [ ] Indexes created for performance

### Business Logic
- [ ] Risk scoring matches worked examples
- [ ] Expansion detection logic correct
- [ ] Alert triggers fire at right thresholds
- [ ] All edge cases handled

### UI/UX
- [ ] All 8 screens match specifications
- [ ] Color system matches DESIGN-SYSTEM.md
- [ ] Terminology is 100% correct (no "vendor")
- [ ] Risk indicators show correct colors

### Integrations
- [ ] Salesforce sync works both ways
- [ ] Payment status updates in real-time
- [ ] Health scores import from Gainsight
- [ ] Alerts send to Slack correctly

### AI System
- [ ] Extractions meet confidence thresholds
- [ ] Validation rules catch errors
- [ ] Manual review triggers appropriately
- [ ] 95%+ accuracy on sample contracts

---

## 📞 Questions & Support

### If You're Stuck:

**1. Search this documentation:**
```
grep -r "your question" BUSINESS-MODEL-PIVOT-SPECS/
```

**2. Check common issues:**
- Terminology confusion → 01-TERMINOLOGY-GLOSSARY.md
- Field naming → 02-DATA-SCHEMA.md, Section "Field Definitions"
- Risk calculation → 03-RISK-SCORING-ALGORITHM.md, "Worked Examples"
- UI behavior → 04-UI-COMPONENT-LIBRARY.md, "Component States"

**3. Still unclear?**
- Document exactly what's ambiguous
- Reference which doc you've checked
- Ask Ray with specific question

### What Ray Needs in Questions:

✅ **GOOD:** "In 03-RISK-SCORING-ALGORITHM.md, example #3 shows churn_risk_score = 50. But when I implement with same inputs, I get 52. Is my calculation wrong?"

❌ **BAD:** "The risk scoring doesn't work"

---

## 🎯 Success Criteria

### You'll know you succeeded when:

1. **Terminology Check:**
   - Zero instances of "vendor" in customer context
   - All fields named per glossary
   - No ambiguous terms

2. **Logic Check:**
   - Risk scores match worked examples
   - Auto-renewal = LOW risk (not HIGH)
   - Expansion opportunities detected correctly

3. **Data Check:**
   - Sample contracts load successfully
   - All relationships work
   - Churn risk calculated automatically

4. **UI Check:**
   - Dashboard shows "Customer Renewals" not "Vendor Renewals"
   - Risk badges use correct colors
   - All 8 screens functional

5. **Integration Check:**
   - Salesforce opportunities → customer contracts
   - Payment status syncs from Stripe
   - Alerts send to Slack

6. **Ray Says:**
   - "This is exactly what I specified"
   - "The business logic is correct"
   - "Ready to deploy"

---

## 📄 Document Conventions

### Status Indicators
- ✅ Complete and reviewed
- 🚧 In progress
- ⚠️ Needs Ray's input
- ❌ Blocked or incorrect

### Priority Levels
- 🔴 **CRITICAL** - Must have before starting
- 🟠 **HIGH** - Need during development
- 🟡 **MEDIUM** - Nice to have
- 🟢 **LOW** - Reference only

### Change Log
Each document has version history at bottom.  
Always use latest version.

---

## 🚀 Let's Build This Right

**Remember:**
- Customer = company buying FROM us
- Auto-renewal = GOOD for us
- Pricing gap = expansion opportunity
- When unsure → Check docs → Ask Ray

**Let's execute flawlessly.** 💪

---

**Version:** 1.0  
**Last Updated:** November 18, 2024  
**Next Review:** After Phase 1 completion
