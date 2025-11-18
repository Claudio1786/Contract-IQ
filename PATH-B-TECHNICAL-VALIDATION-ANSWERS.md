# Path B: Technical Validation - Complete Answers & Decision Points

**Created:** November 18, 2025  
**Status:** ✅ **85% Complete** - Critical decisions required from you  

---

## 📊 Your Questions → My Answers

You asked about **Path B: Technical Validation** requirements. Here's what I've answered, what I've created, and what I need from you.

---

## 1️⃣ Contract Parsing AI Training

### ✅ **ANSWERED: Which AI model?**

**Recommendation: Multi-Model Approach**

**Primary:** GPT-4 Turbo (gpt-4-turbo-2024-04-09)
- ✅ Best for legal language understanding
- ✅ Consistent JSON output
- ✅ Lower cost ($0.01/1K tokens)
- ✅ 128K token window (handles long contracts)
- ✅ Proven track record (DocuSign, Ironclad use similar)

**Fallback:** Claude 3.5 Sonnet
- ✅ Better at complex tables
- ✅ More conservative confidence scores
- ✅ Use for international contracts or complex pricing

**Cost Estimate:** $500/month for pilot (processing 100-200 contracts)

**📄 Full Details:** See `/BUSINESS-MODEL-PIVOT-SPECS/04-AI-EXTRACTION-PROMPTS.md`

---

### ⚠️ **NEED FROM YOU: Training data**

**Current State:**
- ✅ You have: **10 sample contracts** ($2.382M portfolio)
- ❌ **You need: 20-30 additional contract variations**

**What Additional Contracts Should Include:**

1. **Pricing Variations (5 contracts):**
   - Usage-based pricing (per API call, per GB)
   - Tiered pricing
   - Multi-product bundles
   - International currencies (GBP, EUR, AUD)

2. **Term Variations (5 contracts):**
   - Evergreen contracts (no fixed end date)
   - Month-to-month with long notice periods
   - 5-year enterprise deals
   - Conditional auto-renewal

3. **Edge Cases (5 contracts):**
   - Heavily redlined MSAs
   - Scanned PDFs (OCR quality issues)
   - Contracts with embedded tables
   - External "Exhibit A" pricing references

4. **Industry Variations (5 contracts):**
   - Financial services (compliance clauses)
   - Healthcare (HIPAA BAAs)
   - Government (FedRAMP)
   - International (GDPR, data residency)

5. **Quality Control (5 contracts):**
   - Ambiguous terms (test error handling)
   - Missing information (test fallback logic)
   - Conflicting terms (test validation)
   - Unusual formatting

**Total Needed:** 35 contracts (10 current + 25 additional)

**🚨 BLOCKER:** Cannot start AI training without these additional contracts

**Options to Source:**
1. ✅ Anonymize real customer contracts (best)
2. ✅ Ask colleagues in SaaS revenue/CS roles
3. ✅ Use contracts from past companies (anonymized)
4. ✅ Purchase contract templates (Grata, ContractWorks, PandaDoc)

**Timeline:** Need within 2 weeks for Factory.ai to start

---

### ✅ **CREATED: Extraction accuracy benchmarks**

**Target Accuracy by Field:**

| Field | Target | Critical? | Fallback |
|-------|--------|-----------|----------|
| Contract End Date | 98%+ | 🔴 YES | Manual review |
| Renewal Type | 95%+ | 🔴 YES | Default to "manual" |
| Price Per User | 95%+ | 🔴 YES | Manual review |
| Payment Terms | 90%+ | 🟡 IMPORTANT | Assume Net 30 |
| Notice Period | 90%+ | 🟡 IMPORTANT | Assume 60 days |
| SLA Commitment | 85%+ | 🟢 NICE-TO-HAVE | Leave blank |

**Overall Target:** >95% accuracy on critical fields

**Quality Tiers:**
- **Tier 1 (Production-Ready):** 95%+ overall
- **Tier 2 (Acceptable for MVP):** 85-94% overall
- **Tier 3 (Needs Improvement):** <85% overall

---

### ✅ **CREATED: Fallback for edge cases**

**3-Tier Review Queue:**

```
AI Extracts Contract
    ↓
>90% confidence?
    ├─ YES → Auto-approve, send to Salesforce
    │
70-90% confidence?
    ├─ YES → Quick review (2-3 minutes)
    │         Human approves or corrects
    │
<70% confidence?
    └─ YES → Full manual review (10-15 minutes)
              Human reads entire contract
```

**Priority System:**
- **P0 - Critical:** Review within 4 hours (end date missing, expires <60 days)
- **P1 - High:** Review within 24 hours (payment terms unclear, expires <90 days)
- **P2 - Medium:** Review within 1 week (SLA unclear, expires >90 days)
- **P3 - Low:** Review as time allows (non-critical fields)

**Manual Review UI:**
- Left panel: AI extraction results with confidence scores
- Right panel: PDF viewer with highlighted sections
- Actions: Approve All | Correct & Approve | Escalate to Legal | Defer

**📄 Full Details:** See `/BUSINESS-MODEL-PIVOT-SPECS/04-AI-EXTRACTION-PROMPTS.md` (Sections on Fallback Strategy)

---

## 2️⃣ MVP Scope Definition

### ✅ **ANSWERED: What's the MINIMUM for a paid pilot?**

**5 Must-Have Features:**

1. **Contract Upload & Storage** (3-5 days to build)
   - Drag-and-drop PDF upload
   - Store in AWS S3
   - List view of contracts

2. **AI Extraction (OR Manual Entry)** (1-3 weeks depending on approach)
   - Extract 5 critical fields:
     - Customer name
     - Contract end date
     - Renewal type
     - Total ARR
     - Price per user

3. **Risk Scoring** (2-3 days to build)
   - Simplified algorithm: 50% days-until-renewal + 30% renewal-type + 20% pricing-gap
   - Score 0-10 for each contract

4. **Renewal Dashboard** (3-5 days to build)
   - Table showing: Customer | End Date | Days Until Renewal | Risk Score | ARR
   - Sort and filter capabilities
   - NO charts/graphs needed for MVP

5. **Contract Detail Page** (2-3 days to build)
   - Show all extracted fields
   - Risk score breakdown
   - Link to original PDF

**NOT Needed for MVP:**
- ❌ Salesforce integration (too complex)
- ❌ AI chat (not critical for value)
- ❌ Analytics dashboard with charts
- ❌ Multi-user permissions
- ❌ Mobile app

---

### ⚠️ **DECISION REQUIRED: Manual data entry workaround?**

**The Question:** Can you do manual data entry for first 3 customers while AI is training?

**The Math:**
- 3 beta customers × 25 contracts each = 75 contracts
- @ 3 minutes per contract = 225 minutes total = **3.75 hours**
- Spread over 4 weeks = **<1 hour/week of manual work**

**Option A: 4-Week Manual MVP** (My Recommendation ✅)
- ✅ Launch in 4 weeks instead of 8
- ✅ Validate value prop quickly
- ✅ Cheaper to build
- ✅ Real customer data for AI training
- ❌ Requires 3-4 hours/week manual work from you
- ❌ Doesn't showcase AI capabilities yet

**Build Timeline:**
- Week 1: Contract upload, manual entry form, risk scoring
- Week 2: Dashboard, detail page, PDF viewer
- Week 3: Pricing gap calculator, UI polish
- Week 4: Testing, onboard first customer

**Option B: 8-Week AI-Powered MVP**
- ✅ Full AI automation from day 1
- ✅ More impressive demos
- ✅ Scales better long-term
- ❌ Takes 2x longer to launch
- ❌ Higher upfront cost
- ❌ **BLOCKED:** Requires 20-30 additional contracts immediately

**Build Timeline:**
- Weeks 1-2: PDF extraction, OpenAI integration
- Weeks 3-4: AI training on 35 contracts
- Weeks 5-6: Dashboard, risk scoring, pricing gaps
- Weeks 7-8: Testing, QA, customer onboarding

**🚨 DECIDE:**
- [ ] Option A: 4-week manual (I can do 1 hour/week manual work)
- [ ] Option B: 8-week AI (I have 20-30 additional contracts ready)
- [ ] Other: _____________

---

### ✅ **ANSWERED: Salesforce fields priority**

**From your existing `/DEMO-PACKAGE/SALESFORCE_INTEGRATION_GUIDE.md`:**

**Must-Have (5 fields for MVP):**
1. Days_Until_Renewal__c (drives alerts)
2. ContractIQ_Risk_Score__c (drives prioritization)
3. Renewal_Type__c (auto vs manual)
4. Pricing_Gap_Amount__c (revenue opportunity)
5. Current_Contract_Rate__c (for analysis)

**Nice-to-Have (can add post-pilot):**
- Notice period, SLA tier, escalation rate, etc. (12 remaining fields)

**Defer to Post-Pilot:**
- Full Salesforce integration (OAuth, sync workflows, Chatter posts)
- Too complex for 4-week MVP
- Add after validating core value with beta customers

---

## 3️⃣ Beta Customer Agreement Template

### ✅ **CREATED: Pricing options**

**Option 1: Free Pilot** 🆓
- $0 for 3 months
- ✅ Easiest to sell
- ❌ No revenue validation, customers less committed

**Option 2: 50% Discount Pilot** 💵 (My Recommendation ✅)
- $1,000/month ($12K/year) vs $2,000/month standard
- ✅ Validates willingness to pay
- ✅ Generates $36K ARR with 3 customers
- ✅ Easier to scale to full price later

**Option 3: Full Price + Money-Back Guarantee** 💎
- $2,000/month with 90-day guarantee
- "If we don't find $50K in recovery opportunities, full refund"
- ✅ Strongest revenue validation
- ❌ Hardest to close

**Positioning for Option 2:**
> "We're launching Contract IQ publicly in Q2 2026 at $2,000/month. We're offering 3 early adopter spots at 50% off ($1,000/month) in exchange for feedback and a case study. Once these 3 spots are filled, pricing goes to full rate."

**🚨 DECIDE:**
- [ ] Free pilot
- [ ] $1,000/month (50% off) ← **Recommended**
- [ ] $2,000/month (full price + guarantee)
- [ ] Other: ______________

---

### ✅ **CREATED: Deliverables timeline**

**3-Month Pilot Structure:**

**Month 1: Onboarding**
- Week 1: Customer provides contracts + rate card
- Week 2: Upload contracts, extract terms (manual or AI)
- Week 3: Deliver first insights (risk scores, expiration alerts)
- Week 4: Weekly check-in, refine dashboard

**Month 2: Value Delivery**
- Week 5-8: Continue processing contracts
- Identify pricing gaps
- Flag at-risk renewals
- Weekly 30-minute check-ins
- Gather feature feedback

**Month 3: Results & Case Study**
- Week 9-11: Calculate total value delivered
- Complete case study interview
- Request testimonial
- Discuss conversion to paid

**Success Metrics:**
- Contract IQ: Identify $50K+ in recovery opportunities OR prevent 1 at-risk renewal
- Customer: Reduce manual review time by 80%+

---

### ✅ **CREATED: Success metrics**

**Product Metrics:**
- Contracts uploaded per customer: 25-100
- Extraction accuracy: 90%+ (AI) or N/A (manual)
- Risk scoring accuracy: 90% match human judgment
- Dashboard usage: 3x/week per user

**Business Metrics:**
- Pricing gaps identified: $50K+ per customer
- At-risk renewals flagged: 2-5 per customer
- Time saved: 80% reduction vs manual review
- Customer satisfaction: 4/5 stars minimum

**Sales Metrics:**
- Pilot → paid conversion: 67% (2 of 3 customers)
- Referrals generated: 1-2 leads per customer
- Case studies completed: 2 of 3 customers
- Testimonials received: 3 of 3 customers

**📄 Full Details:** See `/BUSINESS-MODEL-PIVOT-SPECS/05-MVP-SCOPE-BETA-CUSTOMERS.md` (Section on Pilot Success Metrics)

---

## 📋 Complete Beta Customer Agreement

**I've created a full draft agreement template including:**

✅ **Pricing & Terms:**
- $1,000/month for 3 months ($3,000 total)
- Payment terms: Net 30, monthly invoicing
- Option to extend or convert to full price

✅ **Provider Commitments:**
- Analyze up to 100 contracts
- Provide renewal dashboard
- Weekly 30-minute check-ins
- Email support (24-hour response)

✅ **Customer Commitments:**
- Provide contracts and rate card
- Participate in weekly calls
- Report bugs and feedback
- Complete case study if successful

✅ **Success Metrics:**
- $50K recovery opportunities identified OR 1 at-risk renewal prevented
- 80% time savings vs manual review

✅ **Termination & Confidentiality:**
- 30-day notice to terminate
- Pro-rated refund in first 30 days
- All data remains confidential

**📄 Full Template:** See `/BUSINESS-MODEL-PIVOT-SPECS/05-MVP-SCOPE-BETA-CUSTOMERS.md` (Section: Beta Customer Agreement Template)

---

## ✅ What I've Created for You

**New Documents (2):**

1. **`/BUSINESS-MODEL-PIVOT-SPECS/04-AI-EXTRACTION-PROMPTS.md`**
   - AI model recommendations (GPT-4 Turbo + Claude)
   - Copy/paste ready prompts with JSON schema
   - Training data requirements (20-30 additional contracts needed)
   - Accuracy benchmarks (95%+ target)
   - Fallback strategy with 3-tier review queue
   - Manual review UI mockup
   - TypeScript validation logic examples
   - **Line Count:** ~800 lines

2. **`/BUSINESS-MODEL-PIVOT-SPECS/05-MVP-SCOPE-BETA-CUSTOMERS.md`**
   - MVP feature prioritization (5 must-haves)
   - Option A (4-week) vs Option B (8-week) build timelines
   - Beta pricing strategies (free, 50% off, full price)
   - Complete beta customer agreement template
   - Pilot success metrics
   - Beta customer acquisition strategy
   - 8-week launch timeline
   - **Line Count:** ~1,000 lines

**Total New Documentation:** ~1,800 lines of specifications

**All Committed & Pushed:** ✅ Live on GitHub

---

## ⚠️ Critical Decisions YOU Need to Make

### **Decision #1: MVP Timeline**

**Question:** 4-week manual or 8-week AI approach?

- [ ] **Option A: 4-Week Manual MVP**
  - Launch faster, validate quickly
  - Requires 1 hour/week manual work from you
  - Can start immediately with Factory.ai

- [ ] **Option B: 8-Week AI-Powered MVP**
  - Full automation, impressive demos
  - **BLOCKED: Need 20-30 additional contracts first**
  - Can start once you provide contracts

**My Recommendation:** ✅ **Option A** (launch fast, prove value, automate later)

---

### **Decision #2: Beta Pricing**

**Question:** How much do beta customers pay?

- [ ] **Free** ($0 for 3 months)
- [ ] **$1,000/month** (50% off standard rate) ← **Recommended**
- [ ] **$2,000/month** (full price + guarantee)
- [ ] **Other:** _______________

**My Recommendation:** ✅ **$1,000/month (50% off)**
- Validates willingness to pay
- Generates $36K ARR with 3 customers
- Still compelling discount

---

### **Decision #3: Manual Work Commitment**

**Question:** Can you do 3-4 hours/week of manual data entry for first month?

- [ ] **Yes** - I can do 1 hour/week to get customers faster
- [ ] **No** - Must be fully automated from day 1
- [ ] **Maybe** - Depends on: _______________

**What "Yes" Means:**
- Review each uploaded contract
- Fill out 5-field form (3 minutes per contract)
- 75 contracts × 3 minutes = 3.75 hours total over 4 weeks
- White-glove service for early customers

**My Recommendation:** ✅ **Yes** (gets you to market 4 weeks faster)

---

### **Decision #4: Additional Training Contracts**

**Question:** Can you provide 20-30 additional contract samples within 2 weeks?

- [ ] **Yes** - I have access to more contracts
- [ ] **No** - Only have the 10 we already created
- [ ] **Maybe** - I can source from: _______________

**Why This Matters:**
- Without additional contracts, AI training is incomplete
- Risk of low accuracy (<85%) on edge cases
- Option B (8-week AI MVP) is blocked without these

**Options to Source:**
1. Anonymize real customer contracts
2. Ask colleagues in SaaS companies
3. Use contracts from past employers
4. Purchase templates

---

### **Decision #5: Beta Start Date**

**Question:** When do you want to launch beta pilot?

- [ ] **ASAP** - Start recruiting now, launch in 4-8 weeks
- [ ] **Wait for AI** - Launch in 8-12 weeks with full automation
- [ ] **Other timeline:** _______________

**My Recommendation:** ✅ **ASAP with Option A**
- Start recruiting beta customers this week
- Factory.ai builds MVP in 4 weeks
- Onboard first customer in Week 5

---

## 🎯 Recommended Path Forward

**My Recommendation: Launch Fast with Manual MVP**

**Week 1 (This Week):**
1. ✅ Approve Option A (4-week manual MVP)
2. ✅ Approve $1,000/month beta pricing
3. ✅ Commit to 1 hour/week manual work
4. ✅ Start recruiting 3 beta customers from network

**Weeks 2-5 (MVP Build):**
5. Factory.ai builds 5 must-have features
6. You test with 10 sample contracts
7. Prepare onboarding materials
8. Finalize beta customer agreements

**Weeks 6-8 (Beta Onboarding):**
9. Onboard Customer #1 (manually enter their contracts)
10. Onboard Customer #2
11. Onboard Customer #3
12. Deliver first insights (risk scores, pricing gaps)

**Weeks 9-12 (Results):**
13. Weekly check-ins with all 3 customers
14. Calculate value delivered ($X recovery opportunities)
15. Complete case studies
16. Convert 2 of 3 to paid customers

**Parallel Track: AI Training**
- While you're onboarding beta customers, Factory.ai trains AI in background
- By Week 12, AI is ready (90%+ accuracy)
- Switch from manual to AI extraction for new customers

**Outcome:**
- ✅ 3 paying customers by Week 12 ($36K ARR)
- ✅ 2-3 case studies and testimonials
- ✅ AI trained on real customer data
- ✅ Ready for public launch in Q2 2026

---

## 📞 Next Steps - Action Required

**I need you to:**

1. **Answer the 5 critical decisions above**
   - MVP timeline (A or B?)
   - Beta pricing ($1K/month?)
   - Manual work commitment (yes/no?)
   - Additional contracts (can you source?)
   - Beta start date (ASAP or wait?)

2. **If Option A (4-week manual):**
   - Start recruiting beta customers this week
   - I'll work with Factory.ai to kick off build

3. **If Option B (8-week AI):**
   - Provide 20-30 additional contract samples ASAP
   - I'll incorporate into AI training guide
   - Factory.ai begins AI development

4. **Either way:**
   - Decide on beta pricing
   - Identify 3-5 potential beta customers
   - Prepare to start outreach

---

## 📊 Summary: What We Have vs. What We Need

### ✅ **What You NOW Have:**

1. ✅ AI model recommendation (GPT-4 Turbo + Claude)
2. ✅ Copy/paste ready extraction prompts
3. ✅ Accuracy benchmarks (95%+ target)
4. ✅ Fallback strategy for edge cases
5. ✅ MVP scope definition (5 must-haves)
6. ✅ 4-week vs 8-week build timelines
7. ✅ Beta pricing options ($1K/month recommended)
8. ✅ Complete beta customer agreement template
9. ✅ Pilot success metrics
10. ✅ Beta customer acquisition strategy

### ❌ **What You NEED to Provide:**

1. ❌ Decision on MVP timeline (A or B)
2. ❌ Decision on beta pricing
3. ❌ Decision on manual work commitment
4. ❌ 20-30 additional contract samples (if Option B)
5. ❌ Identify 3-5 potential beta customers

---

## 🚀 You're 85% Ready to Launch!

**You have everything you need to make decisions and move forward.**

The only blocker is **your decisions on the 5 critical questions above.**

Once you answer those, I can:
- Brief Factory.ai on MVP build
- Help you recruit beta customers
- Support onboarding and launch

**Ready to decide?** Let me know which path you want to take! 🎯

---

**Document Status:** ✅ COMPLETE  
**Action Required:** Your input on 5 critical decisions  
**Recommended Path:** Option A (4-week manual) + $1K/month + 3 customers + ASAP launch
