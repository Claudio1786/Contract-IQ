# Contract IQ - MVP Scope & Beta Customer Program

**Document Version:** 1.0  
**Created:** November 18, 2025  
**Purpose:** Define minimum viable product scope and beta customer acquisition strategy

---

## 🎯 Executive Summary

This document defines the **absolute minimum features** needed for a paid pilot program, manual workarounds for early customers, and beta customer acquisition strategy.

**Key Decisions Required:**
- ❌ **MVP Timeline:** 4 weeks? 8 weeks? 12 weeks?
- ❌ **Beta Pricing:** Free? 50% off? Full price with guarantee?
- ❌ **Customer Commitment:** How many beta customers? (Recommend 3-5)

---

## 🚀 MVP Scope: What's the MINIMUM for a Paid Pilot?

### **MVP Definition**

**Minimum Viable Product = The smallest feature set that:**
1. Solves the core problem (renewal blind spots + pricing drift)
2. Generates measurable value ($X in recovery opportunities identified)
3. Justifies customer payment (even at discounted rate)
4. Provides proof of concept for full product

---

## ✅ MVP Feature Set (4-8 Week Build)

### **Tier 1: Must-Have for ANY Pilot** 🔴

#### **1. Contract Upload & Storage**
**What it does:** Upload PDF contracts, store securely  
**Technical complexity:** Low  
**Build time:** 3-5 days  

**Implementation:**
- Simple file upload (drag-and-drop)
- Store in AWS S3 or similar
- Basic file validation (PDF only, <10MB)
- List view of uploaded contracts

**Workaround if not ready:** Customer emails contracts, you manually upload via admin panel

---

#### **2. AI Contract Extraction (Manual Fallback)**
**What it does:** Extract 5 critical fields from contracts  
**Technical complexity:** Medium-High  
**Build time:** 2-3 weeks (with AI) OR 1 week (manual workflow)  

**Critical Fields (Only 5 for MVP):**
1. Customer name
2. Contract end date
3. Renewal type (auto vs manual)
4. Total ARR
5. Price per user (if per-user model)

**Manual Workaround Strategy:**
```
Customer uploads contract
    ↓
AI attempts extraction (if ready)
    ↓
If AI confidence <90% OR AI not ready yet:
    ↓
Admin reviews contract in dashboard
    ↓
Admin fills out 5-field form manually
    ↓
Takes 2-3 minutes per contract
    ↓
Data entered into system
```

**🚨 CRITICAL DECISION REQUIRED:**

**Can you do manual data entry for first 3 customers while AI is training?**

**Estimate:**
- 3 beta customers × 25 contracts each = 75 contracts
- @ 3 minutes per contract = 225 minutes = **3.75 hours total**
- Spread over 4 weeks = **<1 hour/week of manual work**

**Recommendation:** ✅ **YES - Start with manual entry to get customers faster**

**Why this works:**
- Gets customers live in 1-2 weeks instead of 6-8 weeks
- Validates value prop before AI is perfect
- Creates real training data for AI improvement
- Builds customer relationships through white-glove service

---

#### **3. Risk Scoring (Basic Algorithm)**
**What it does:** Calculate risk score for each contract  
**Technical complexity:** Low  
**Build time:** 2-3 days  

**Simplified Formula for MVP:**
```
Risk Score (0-10) = 
  50% × Days Until Renewal Score +
  30% × Renewal Type Score +
  20% × Pricing Gap Score

Days Until Renewal Score:
  0-30 days = 10
  31-60 days = 8
  61-90 days = 6
  91-180 days = 4
  180+ days = 2

Renewal Type Score:
  Manual = 10
  Auto-renewal = 3

Pricing Gap Score:
  >50% gap = 10
  25-50% gap = 7
  10-25% gap = 4
  <10% gap = 2
```

**Workaround if not ready:** Show contracts in list sorted by expiration date

---

#### **4. Renewal Dashboard**
**What it does:** Show all contracts with risk scores and expiration dates  
**Technical complexity:** Low  
**Build time:** 3-5 days  

**MVP Dashboard Shows:**
- Table of all contracts
- Columns: Customer Name | End Date | Days Until Renewal | Risk Score | ARR
- Sort by: Risk Score (default) or End Date
- Filter by: Expiring in <30, <60, <90 days
- Click contract → See details page

**NO charts/graphs needed for MVP** - just data table

**Workaround if not ready:** Export CSV, customer uses Excel

---

#### **5. Contract Detail Page**
**What it does:** Show all extracted fields for one contract  
**Technical complexity:** Low  
**Build time:** 2-3 days  

**Shows:**
- Customer name
- Contract end date
- Days until renewal
- Renewal type
- ARR
- Price per user
- Risk score breakdown
- Link to original PDF

**NO AI chat needed for MVP**

---

### **Tier 2: Nice-to-Have (Adds Value, Not Critical)** 🟡

#### **6. Pricing Gap Analysis**
**What it does:** Compare customer's rate to your current rate card  
**Technical complexity:** Low  
**Build time:** 2-3 days  

**Requires:**
- Your current rate card (you have this in demo package)
- Compare contract rate vs current rate
- Calculate $ recovery opportunity

**Why nice-to-have:** Increases value per customer, but not required to prove concept

---

#### **7. Email Alerts (Manual Workaround)**
**What it does:** Email customer when contract entering renewal window  
**Technical complexity:** Medium  
**Build time:** 3-5 days  

**Manual Workaround:**
- Weekly: Export contracts expiring in next 90 days
- Manually email customer with list
- Takes 10 minutes/week

**Recommendation:** Start manual, automate after 3-4 weeks

---

### **Tier 3: Not Needed for MVP** 🟢

❌ **Salesforce Integration** - Too complex, defer to post-pilot  
❌ **AI Chat** - Nice feature, not critical for value  
❌ **Analytics Dashboard** - Charts/graphs not needed for proof  
❌ **Multi-user permissions** - Single login works for pilot  
❌ **Mobile app** - Desktop web only for pilot  

---

## 📋 MVP Build Timeline

### **Option A: 4-Week Aggressive MVP (Manual AI)**

**Week 1:**
- [ ] Contract upload & storage
- [ ] Admin manual entry form (5 fields)
- [ ] Basic risk scoring algorithm

**Week 2:**
- [ ] Renewal dashboard (table view)
- [ ] Contract detail page
- [ ] PDF viewer

**Week 3:**
- [ ] Pricing gap calculator
- [ ] Polish UI/UX
- [ ] Beta customer onboarding docs

**Week 4:**
- [ ] Bug fixes & testing
- [ ] Load first beta customer data
- [ ] Launch pilot

**Total Build Time:** 160 hours (1 senior full-stack dev)  
**AI Strategy:** Manual entry for first 75-100 contracts

---

### **Option B: 8-Week Full MVP (AI-Powered)**

**Weeks 1-2:**
- [ ] Contract upload & storage
- [ ] PDF text extraction pipeline
- [ ] OpenAI API integration
- [ ] Basic extraction prompts

**Weeks 3-4:**
- [ ] Train AI on 35 contracts
- [ ] Build manual review queue
- [ ] Implement confidence scoring
- [ ] Validation logic

**Weeks 5-6:**
- [ ] Renewal dashboard
- [ ] Contract detail page
- [ ] Risk scoring algorithm
- [ ] Pricing gap calculator

**Weeks 7-8:**
- [ ] Testing & QA
- [ ] Beta customer onboarding
- [ ] Load customer data
- [ ] Launch pilot

**Total Build Time:** 320 hours (1 senior full-stack dev)  
**AI Strategy:** 85%+ accuracy at launch

---

### **🚨 DECISION REQUIRED FROM YOU:**

**Which path do you prefer?**

**Option A (4 weeks):**
- ✅ Faster time to market
- ✅ Cheaper to build
- ✅ Validates value prop quickly
- ❌ Manual work for you (3-4 hours/week)
- ❌ Doesn't showcase AI capabilities

**Option B (8 weeks):**
- ✅ Full AI automation
- ✅ Scales better long-term
- ✅ More impressive demos
- ❌ Longer time to first customer
- ❌ Higher upfront cost
- ❌ AI accuracy risk

**My Recommendation:** **Option A (4 weeks)** - Launch fast, prove value, then automate

---

## 💰 Beta Customer Pricing Strategy

### **Pricing Options for Pilot Program**

#### **Option 1: Free Pilot** 🆓

**Pricing:** $0 for 3 months  
**Customer Commitment:** Provide feedback, testimonial, case study  

**Pros:**
- ✅ Easiest to sell
- ✅ Removes objections
- ✅ Gets customers quickly

**Cons:**
- ❌ No revenue validation
- ❌ Customers less committed
- ❌ Hard to transition to paid later
- ❌ Devalues product

**Recommended for:** If you need 10+ beta customers for data/feedback

---

#### **Option 2: 50% Discount Pilot** 💵

**Pricing:** 50% off first year, full price at renewal  
**Customer Commitment:** 6-month minimum, feedback, case study  

**Example:**
- Standard Price: $2,000/month ($24K/year)
- Pilot Price: $1,000/month ($12K/year)
- Discount: "Early adopter pricing - 50% off first year"

**Pros:**
- ✅ Validates willingness to pay
- ✅ Customers more committed
- ✅ Generates revenue
- ✅ Easier to scale to full price

**Cons:**
- ❌ Harder to close than free
- ❌ Need stronger value prop

**Recommended for:** If you want 3-5 high-quality beta customers

---

#### **Option 3: Full Price + Money-Back Guarantee** 💎

**Pricing:** Full price with 90-day money-back guarantee  
**Customer Commitment:** If we don't identify $X in recovery opportunities, full refund  

**Example:**
- Standard Price: $2,000/month
- Guarantee: "If we don't identify at least $50K in pricing recovery opportunities within 90 days, we'll refund 100% of your payment"

**Pros:**
- ✅ Strongest revenue validation
- ✅ Only works if product delivers value
- ✅ Removes buyer risk
- ✅ Easy to charge full price later

**Cons:**
- ❌ Hardest to close
- ❌ Risk of refunds if product underperforms

**Recommended for:** If you're confident in value delivery

---

### **🚨 DECISION REQUIRED FROM YOU:**

**Which pricing model do you want?**

**My Recommendation:**

**Option 2: 50% Discount Pilot**
- Sweet spot between validation and ease of sale
- $12K/year × 3 beta customers = $36K ARR during pilot
- Proves customers will pay
- Still offers compelling discount

**Positioning:**
"We're launching Contract IQ publicly in Q2 2026 at $2,000/month. We're offering 3 early adopter spots at 50% off ($1,000/month) in exchange for feedback and a case study. Once these 3 spots are filled, pricing goes to full rate."

---

## 🎯 Beta Customer Profile

### **Ideal Beta Customer Characteristics:**

**Company Profile:**
- ✅ B2B SaaS company with 50-500 customers
- ✅ $5M-$50M ARR (sweet spot for highest impact)
- ✅ Manual renewal process today (pain is obvious)
- ✅ Uses Salesforce (future integration benefit)
- ✅ Has revenue ops or CS ops leader (your champion)

**Contract Profile:**
- ✅ Mostly 1-3 year contracts (renewal cadence matters)
- ✅ Per-user or per-seat pricing (easier to calculate gaps)
- ✅ Mix of auto-renewal and manual (shows variety)
- ✅ 25-100 active customer contracts (manageable for pilot)

**Customer Mindset:**
- ✅ Willing to be early adopter
- ✅ Comfortable with manual workarounds
- ✅ Excited to provide feedback
- ✅ Sees strategic value, not just tactical fix

**Red Flags (Avoid These):**
- ❌ Enterprise with 1,000+ contracts (too complex for pilot)
- ❌ Complex pricing (usage-based, tiered, multi-product)
- ❌ Non-SaaS contracts (hardware, services, consulting)
- ❌ Expects 100% automation from day 1

---

## 📋 Beta Customer Agreement Template

### **Pilot Program Agreement (Draft)**

**Contract IQ Early Adopter Pilot Program**

**Parties:**
- Provider: [Your Company]
- Customer: [Beta Customer Name]

**Term:** 3 months (with option to extend)

**Pricing:**
- Early Adopter Rate: $1,000/month ($3,000 total for 3-month pilot)
- Standard Rate: $2,000/month (applies after pilot if customer continues)
- Payment Terms: Net 30, monthly invoicing

**Deliverables:**

**Provider Commits To:**
1. **Contract Analysis**
   - Upload and analyze up to 100 customer contracts
   - Extract critical terms (end dates, renewal types, pricing, ARR)
   - Calculate risk scores for all contracts
   - Identify pricing gap opportunities

2. **Renewal Dashboard**
   - Web-based dashboard showing all contracts
   - Risk scoring and prioritization
   - Expiration date tracking
   - Pricing gap analysis

3. **Weekly Check-ins**
   - 30-minute call every Friday
   - Review new insights
   - Gather feedback
   - Answer questions

4. **Support**
   - Email support (response within 24 business hours)
   - Bug fixes within 48 hours of report
   - Feature requests logged for future releases

**Customer Commits To:**
1. **Data Provision**
   - Provide up to 100 customer contracts (anonymized if needed)
   - Provide current rate card for pricing gap analysis
   - Grant access to 1-2 team members for training

2. **Feedback**
   - Participate in weekly check-in calls
   - Complete 2-minute survey after each major release
   - Report bugs and issues promptly

3. **Case Study** (if successful)
   - Agree to 30-minute interview for case study
   - Allow use of company name and logo in marketing
   - Provide testimonial quote
   - Optional: Present at user conference or webinar

**Success Metrics:**

Contract IQ success = Identify at least **$50,000 in pricing recovery opportunities** OR prevent **1 at-risk renewal** from slipping through cracks

Customer success = Reduce manual contract review time by **80%+**

**Termination:**
- Either party may terminate with 30 days notice
- Pro-rated refund if customer is unsatisfied in first 30 days
- No penalty for early termination

**Confidentiality:**
- All customer contract data remains confidential
- No data sharing with third parties
- Data deleted upon request after pilot ends

---

## 📊 Pilot Success Metrics

### **What You'll Measure:**

**Product Metrics:**
- [ ] Contracts uploaded per customer (target: 25-100)
- [ ] Extraction accuracy (manual: N/A, AI: target 90%+)
- [ ] Risk scoring accuracy (target: 90% match human judgment)
- [ ] Dashboard usage (target: 3x/week per user)

**Business Metrics:**
- [ ] Pricing gaps identified per customer (target: $50K+)
- [ ] At-risk renewals flagged (target: 2-5 per customer)
- [ ] Time saved vs manual review (target: 80% reduction)
- [ ] Customer satisfaction (target: 4/5 stars minimum)

**Sales Metrics:**
- [ ] Pilot → paid conversion rate (target: 67% = 2 of 3 customers)
- [ ] Referrals generated (target: 1-2 leads per customer)
- [ ] Case studies completed (target: 2 of 3 customers)
- [ ] Testimonials received (target: 3 of 3 customers)

---

## 🎯 Beta Customer Acquisition Strategy

### **Where to Find Beta Customers:**

**Option 1: Your Network** (Fastest)
- LinkedIn connections in revenue ops / CS ops roles
- Former colleagues at SaaS companies
- Founders you know from accelerators, events
- Target: 1-2 customers

**Option 2: Warm Introductions** (High Close Rate)
- Ask existing network for intros to revenue leaders
- Post on LinkedIn: "Looking for 3 early adopters for revenue intelligence tool"
- Reach out to CS/RevOps communities (Pavilion, RevGenius)
- Target: 1-2 customers

**Option 3: Cold Outreach** (Highest Volume)
- LinkedIn outreach to VP Revenue Ops, VP CS at 50-500 employee SaaS companies
- Email sequence (3-5 emails)
- Offer: "We're looking for 3 pilot customers for our contract intelligence tool. $1K/month (50% off) for 3 months. Interested?"
- Target: 10-20 outreach → 2-3 demos → 1 customer

**Option 4: Content Marketing** (Long-term)
- Write LinkedIn posts about renewal intelligence
- Create case study with hypothetical customer
- Share demo video on social media
- Target: 5-10 inbound leads/month (takes 2-3 months to build)

---

## 🚀 Beta Launch Timeline

### **Recommended 8-Week Launch Plan**

**Weeks 1-4: Build MVP (Option A: Manual AI)**
- Build core features
- Test with your 10 sample contracts
- Polish UI/UX

**Weeks 5-6: Beta Recruitment**
- Activate network for warm intros
- LinkedIn outreach to target customers
- Goal: 5-10 qualified leads
- Goal: 3 customers committed

**Week 7: Onboarding**
- Week 7: Onboard Customer #1
  - Upload contracts
  - Manual entry of terms
  - Train on dashboard
  - First insights delivered

**Week 8-10: Pilot Begins**
- Week 8: Onboard Customer #2
- Week 9: Onboard Customer #3
- Weekly check-ins with all 3
- Gather feedback, iterate quickly

**Weeks 11-12: Results & Case Studies**
- Calculate value delivered ($X recovery opportunities)
- Complete case study interviews
- Request testimonials
- Prepare conversion to paid

---

## ✅ Decisions Required From You

### **Critical Decisions (Need Answers to Proceed):**

1. **MVP Timeline**
   - [ ] Option A: 4-week manual AI approach
   - [ ] Option B: 8-week full AI approach
   - [ ] Other: _________

2. **Beta Pricing**
   - [ ] Free for 3 months
   - [ ] $1,000/month (50% off)
   - [ ] $2,000/month (full price + guarantee)
   - [ ] Other: _________

3. **Number of Beta Customers**
   - [ ] 3 customers (recommended)
   - [ ] 5 customers
   - [ ] 10 customers
   - [ ] Other: _________

4. **Manual Work Commitment**
   - [ ] Yes, I can do 3-4 hours/week of manual data entry for first month
   - [ ] No, must be fully automated from day 1
   - [ ] Maybe, depends on _________

5. **Beta Start Date**
   - [ ] ASAP (start recruiting now, launch in 4-8 weeks)
   - [ ] Wait for AI training (launch in 8-12 weeks)
   - [ ] Other timeline: _________

---

## 🎯 Next Steps

**If you choose Option A (4-week manual MVP):**

**This Week:**
1. Approve MVP scope (5 critical fields only)
2. Decide beta pricing ($1K/month recommended)
3. Start recruiting beta customers from network

**Next 4 Weeks:**
4. Factory.ai builds MVP (manual entry version)
5. Test with your 10 sample contracts
6. Prepare onboarding materials

**Weeks 5-8:**
7. Onboard 3 beta customers
8. Manually enter contract data (3-4 hours/week)
9. Deliver first insights
10. Gather feedback

**Weeks 9-12:**
11. Begin AI training in background
12. Complete case studies
13. Convert beta customers to paid
14. Launch publicly with AI automation

---

**If you choose Option B (8-week AI MVP):**

**This Week:**
1. Approve MVP scope
2. Decide beta pricing
3. **Provide 20-30 additional contract samples** (blocker!)

**Next 8 Weeks:**
4. Factory.ai trains AI on 35 contracts
5. Builds MVP with AI extraction
6. Achieves 90%+ accuracy

**Weeks 9-12:**
7. Onboard 3 beta customers
8. Deliver insights (AI-powered)
9. Complete case studies
10. Convert to paid

---

## 📞 Open Questions for You

1. **Do you already have 3-5 potential beta customers in mind?** If yes, who?
2. **What's your budget for MVP build?** ($20K? $50K? $100K?)
3. **What's your timeline pressure?** Need customers this quarter? Or okay to wait?
4. **How much time can you dedicate to manual work?** 5 hours/week? 10 hours/week? Zero?
5. **What's your comfort level with manual workarounds?** Prefer MVP fast or perfect product slow?

---

**Document Status:** ✅ COMPLETE - Ready for decision-making  
**Blockers:** Need your input on 5 critical decisions above

**Recommendation:** Option A (4-week manual MVP) + $1,000/month beta pricing + 3 customers from network
