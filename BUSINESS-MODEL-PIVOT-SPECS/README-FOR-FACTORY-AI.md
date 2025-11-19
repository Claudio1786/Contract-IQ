# 🚀 CONTRACT IQ - FACTORY.AI IMPLEMENTATION GUIDE

**Start Here:** This is your master navigation document for implementing Contract IQ.

---

## 📋 WHAT YOU'RE BUILDING

**Contract IQ** = B2B SaaS Revenue Intelligence Platform  
**Users:** RevOps, Customer Success teams, CFOs  
**Purpose:** Prevent customer churn & identify expansion opportunities using AI contract analysis

### ⚠️ CRITICAL BUSINESS LOGIC

**You are building a CUSTOMER revenue intelligence platform, NOT a vendor management tool.**

This means:
- **Customer** = Companies that BUY FROM US (we are the seller)
- **Risk** = Risk of THEM churning (we lose revenue)
- **Auto-renewal** = GOOD for us (they're committed)
- **Expansion** = THEM paying us MORE

**If you build the inverted model (vendor/procurement), the entire product is backwards.**

---

## 📚 DOCUMENTATION STRUCTURE

### ✅ TIER 1 - CRITICAL (Read First - Implementation Blockers)

| Document | Purpose | Read Time | Status |
|----------|---------|-----------|--------|
| **01-TERMINOLOGY-GLOSSARY.md** | Every term defined - prevents confusion | 15 min | ✅ Complete |
| **02-DATA-SCHEMA.md** | Complete database design + 10 sample customers | 30 min | ✅ Complete |
| **03-RISK-SCORING-ALGORITHM.md** | Churn risk formula + TypeScript implementation | 20 min | ✅ Complete |
| **HANDOFF-TO-FACTORY.md** | Implementation blueprint, phases, validation | 20 min | ✅ Complete |

**Total Tier 1 reading: ~85 minutes**

### 🟡 TIER 2 - IMPORTANT (Reference During Development)

| Document | Purpose | When Needed |
|----------|---------|-------------|
| **05-AI-EXTRACTION-SYSTEM.md** | AI contract extraction prompts & validation | Week 5-6 (AI phase) |
| **06-INTEGRATION-SPECS.md** | Salesforce, Stripe, Gainsight, DocuSign mappings | Week 7-8 (Integration phase) |
| **07-ALERT-SYSTEM.md** | Alert configurations, email/Slack templates | Week 3-4 (Core features) |
| **09-TEST-SCENARIOS.md** | 30 test cases to validate | Throughout development |

### 🔵 TIER 3 - REFERENCE (Nice to Have)

| Document | Purpose | When Needed |
|----------|---------|-------------|
| **08-CHART-SPECIFICATIONS.md** | Analytics visualizations | Week 9-10 (Polish phase) |
| **10-EXPANSION-FRAMEWORK.md** | Expansion opportunity logic | Week 3-4 (Core features) |
| **12-COMPETITIVE-POSITIONING.md** | Market positioning | Sales/marketing context |

---

## 🎯 QUICK START (Your First 2 Hours)

### Hour 1: Understanding

1. **Read 01-TERMINOLOGY-GLOSSARY.md** (15 min)
   - Focus on: "Inversion Rules" section
   - Print the "Quick Reference Card"
   - Quiz yourself: Is auto-renewal good or bad?

2. **Skim HANDOFF-TO-FACTORY.md** (10 min)
   - Read "Critical Business Model Flip" section
   - Review the 4-question validation quiz
   - Check implementation timeline

3. **Review 02-DATA-SCHEMA.md sample data** (20 min)
   - Study the 10 customer examples
   - Compare HIGH vs LOW risk customers
   - Understand the customer_contracts table structure

4. **Read 03-RISK-SCORING-ALGORITHM.md overview** (15 min)
   - Understand the 40/30/20/10 weight split
   - Review worked examples (don't implement yet)

### Hour 2: Setup

1. **Set up development environment** (30 min)
   - Clone repo
   - Install dependencies
   - Configure database (PostgreSQL recommended)
   - Test connection

2. **Create database schema** (20 min)
   - Run migrations from 02-DATA-SCHEMA.md
   - Load sample data
   - Verify queries work

3. **Plan Week 1 work** (10 min)
   - Review Phase 1 checklist in HANDOFF doc
   - Flag any questions for Ray

---

## 📊 WHAT'S PROVIDED

### ✅ Complete Specifications

You have **ZERO ambiguity** on:
- ✅ Every database table, field, relationship, constraint
- ✅ Complete risk scoring algorithm (copy-paste TypeScript)
- ✅ 10 realistic sample customers with calculated risk scores
- ✅ Exact field mappings for Salesforce/Stripe/Gainsight integrations
- ✅ Complete Claude AI prompts for contract extraction
- ✅ Alert trigger conditions and email/Slack templates
- ✅ 30 test scenarios with expected outcomes
- ✅ Design system (colors, typography, spacing, components)

### 🔄 What Ray Will Provide Later

- **10 Sample Contract PDFs** (for AI training) - Week 5
- **Current Rate Card** (for pricing gap detection) - Week 3
- **Salesforce Access** (for integration testing) - Week 7
- **Brand Assets** (optional, design system already provided)

**You can start building immediately - these are not blockers.**

---

## 🏗️ IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
**Goal:** Database, auth, basic CRUD working

**Deliverables:**
- [ ] All 15 tables created with constraints
- [ ] Multi-tenant security (org isolation)
- [ ] User signup/login working
- [ ] Can manually create a customer contract
- [ ] Landing page live

**Validation:** User can sign up, create a contract, data is isolated per org.

---

### Phase 2: Core Features (Week 3-4)
**Goal:** Risk scoring, dashboard, contract pages

**Deliverables:**
- [ ] Risk algorithm implemented (matches examples)
- [ ] Dashboard with 4 KPI cards
- [ ] Contract list with filters
- [ ] Contract detail page (all tabs)
- [ ] In-app alert system

**Validation:** Dashboard shows correct metrics, risk scores match provided examples, alerts trigger for HIGH risk.

---

### Phase 3: AI & Automation (Week 5-6)
**Goal:** AI contract extraction working

**Deliverables:**
- [ ] Claude API integration
- [ ] PDF upload and processing
- [ ] Field extraction (customer name, ACV, dates, terms)
- [ ] Confidence scoring + manual review flow
- [ ] Basic AI chat interface

**Validation:** Upload sample PDF → Extract fields with >85% confidence → Create contract.

**Note:** Ray will provide 10 sample contracts at start of this phase.

---

### Phase 4: Integrations (Week 7-8)
**Goal:** Connect to external systems

**Deliverables:**
- [ ] Salesforce OAuth + sync
- [ ] Stripe webhook integration
- [ ] Gainsight API sync
- [ ] DocuSign webhook integration
- [ ] Slack notifications

**Validation:** Import opportunities from Salesforce, payment status updates from Stripe, health scores from Gainsight.

**Note:** Ray will provide test credentials at start of this phase.

---

### Phase 5: Analytics & Polish (Week 9-10)
**Goal:** Production-ready

**Deliverables:**
- [ ] All 6 analytics charts
- [ ] Export functionality (CSV, PDF)
- [ ] Team management
- [ ] Email notifications
- [ ] Mobile responsive
- [ ] Performance optimized

**Validation:** All 30 test scenarios pass, performance benchmarks met, Ray approves.

---

## ⚡ CRITICAL SUCCESS FACTORS

### 1. Get the Business Logic Right

**Validate Understanding NOW:**

Q1: Who is the "customer" in this system?  
✅ Correct: Company buying FROM us (we are the seller)  
❌ Wrong: Vendor we buy from

Q2: Is auto-renewal good or bad for us?  
✅ Correct: GOOD (customer committed, lowers churn risk)  
❌ Wrong: BAD (we're locked in)

Q3: Customer pays $80K, market rate is $120K. Is this:  
✅ Correct: Expansion opportunity (+$40K potential)  
❌ Wrong: Overpayment problem

Q4: What does "churn risk" mean?  
✅ Correct: Risk of losing customer's revenue (they don't renew)  
❌ Wrong: Risk of spending too much

**If you got ANY wrong, stop and re-read 01-TERMINOLOGY-GLOSSARY.md.**

---

### 2. Match the Worked Examples Exactly

The risk scoring algorithm has 5 worked examples:
1. Acme Corp: Score ~78-82 (HIGH risk)
2. Globex Industries: Score ~10-15 (LOW risk)
3. Initech Solutions: Score ~50-55 (MEDIUM risk)
4. Pied Piper: Score ~83-88 (HIGH risk)
5. Aviato Corp: Score ~18-22 (LOW risk)

**Your implementation MUST produce the same scores (±5 points acceptable).**

Test with the sample data in 02-DATA-SCHEMA.md. If your scores differ significantly, your algorithm is wrong.

---

### 3. Use the Exact Field Names

Every field is specified in 02-DATA-SCHEMA.md. Use those names EXACTLY:

✅ Correct: `annual_contract_value`, `churn_risk_score`, `auto_renewal`  
❌ Wrong: `ACV`, `riskScore`, `autoRenew`

This ensures consistency and makes debugging easier.

---

### 4. Don't Skip Multi-Tenant Security

**EVERY database query MUST filter by `organization_id`.**

```sql
-- ✅ CORRECT
SELECT * FROM customer_contracts 
WHERE organization_id = $user_org_id 
AND churn_risk_level = 'HIGH';

-- ❌ WRONG - Data leak!
SELECT * FROM customer_contracts 
WHERE churn_risk_level = 'HIGH';
```

Test this rigorously. Create 2 test orgs, verify you cannot see the other org's data.

---

## 🧪 TESTING REQUIREMENTS

### Must Pass Before Launch

**30 Test Scenarios** (see 09-TEST-SCENARIOS.md):
- 5 risk calculation tests (must match examples)
- 5 AI extraction tests (accuracy >85%)
- 5 integration tests (Salesforce, Stripe sync)
- 5 alert tests (triggers fire correctly)
- 5 expansion detection tests
- 5 UI/UX tests (all screens functional)

**Performance Benchmarks:**
- Dashboard loads in <3 seconds
- Contract list (100 items) <300ms
- AI extraction <15 seconds per PDF
- Risk recalculation (1000 contracts) <5 minutes

**Security Audit:**
- Multi-tenant isolation verified
- No SQL injection vulnerabilities
- XSS prevention validated
- Sensitive data encrypted

---

## 📞 WHEN YOU'RE STUCK

### 1. Search Documentation First
```bash
cd BUSINESS-MODEL-PIVOT-SPECS
grep -r "your question" *
```

### 2. Check These Common Issues

**"Is auto-renewal good or bad?"**  
→ 01-TERMINOLOGY-GLOSSARY.md, "Inversion Rules"

**"What color should HIGH risk be?"**  
→ HANDOFF-TO-FACTORY.md, "Design System" (Red: #EF4444)

**"How do I calculate seat utilization?"**  
→ 02-DATA-SCHEMA.md, "Auto-Calculated Fields"

**"What does 'for_convenience' mean?"**  
→ 01-TERMINOLOGY-GLOSSARY.md, "Termination Rights"

### 3. Ask Ray with Specifics

✅ **GOOD Question:**  
"In 03-RISK-SCORING-ALGORITHM.md example #3, Metro Financial gets 50 points. When I run with the same inputs, I get 55. My calculation: [show math]. Am I missing something?"

❌ **BAD Question:**  
"Risk scoring doesn't work"

---

## 🎯 DEFINITION OF DONE

A feature is "done" when:

✅ Code written per specifications  
✅ Unit tests pass (where applicable)  
✅ Manual testing completed  
✅ Works in dark mode  
✅ Mobile responsive  
✅ No console errors  
✅ Performance benchmarks met  
✅ Security validated  
✅ Deployed to staging

**The whole project is "done" when:**

✅ All 30 test scenarios pass  
✅ All 5 risk score examples match  
✅ All Phase 1-5 deliverables complete  
✅ Performance benchmarks met  
✅ Security audit passed  
✅ **Ray approves**

---

## 📦 TECHNICAL STACK (Recommended)

### Frontend
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui components
- Recharts

### Backend
- Next.js API Routes
- PostgreSQL 15+
- Prisma ORM
- Supabase (recommended for DB + Auth + Storage)

### AI/ML
- Anthropic Claude API (claude-sonnet-4)
- pdf-parse for PDF processing

### Integrations
- Salesforce: jsforce library
- Stripe: stripe-node SDK
- Slack: @slack/bolt

### Deployment
- Vercel (frontend/backend)
- Supabase or Railway (database)
- Sentry (error tracking)

---

## 🚀 YOU'RE READY

You have everything you need:
- ✅ Complete specifications with zero ambiguity
- ✅ Working sample data to test with
- ✅ Exact algorithms with worked examples
- ✅ Clear validation checkpoints
- ✅ Comprehensive test scenarios

**Next Steps:**
1. Read Tier 1 docs (85 minutes)
2. Set up dev environment
3. Create database schema
4. Start Phase 1 implementation

**Let's build something great!** 💪

---

## 📧 CONTACT

**Product Owner:** Ray  
**Project:** Contract IQ - Customer Revenue Intelligence Platform  
**Communication:** Weekly syncs for questions, demos, validation

**Remember:** When in doubt, refer to specs. If specs are unclear, document assumption and continue. We'll refine in weekly syncs.

---

**Version:** 1.0  
**Status:** ✅ Complete Handoff Package Ready  
**Next Action:** Start reading 01-TERMINOLOGY-GLOSSARY.md

🎯 **Your mission: Execute these specifications flawlessly. Ray has eliminated all ambiguity. Your job: Build it.**
