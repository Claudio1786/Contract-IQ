# Contract IQ Demo Package - Complete Business Logic
## RevenueSync B2B SaaS Customer Contract Portfolio

---

## 📦 Package Contents

This package contains everything needed to build a fully functional Contract IQ demo with accurate B2B SaaS business logic:

### ✅ Deliverable #1: Sample Customer Contracts (10 PDFs)
**Location:** `/sample_contracts/` folder

Ten realistic anonymized customer MSAs representing different ICPs:

1. **01_Acme_Corp_Enterprise_Legacy.pdf** - High renewal risk, pricing gap, manual renewal
2. **02_TechScale_Enterprise_Current.pdf** - Healthy account, current pricing, auto-renewal
3. **03_GrowthLabs_MidMarket_Standard.pdf** - Standard mid-market, auto-renewal
4. **04_DataStream_MidMarket_CustomSLA.pdf** - Custom SLA requirements, pricing gap
5. **05_StartupFast_SMB_Monthly.pdf** - Month-to-month, high churn risk
6. **06_QuickBiz_SMB_AnnualPrepaid.pdf** - Annual prepaid, low risk
7. **07_RocketShip_HighGrowth_Aggressive.pdf** - Aggressive retention terms, expansion tracking
8. **08_GlobalBank_Enterprise_Complex.pdf** - Largest account, international terms
9. **09_FinTech_MidMarket_PricingGap.pdf** - MASSIVE pricing gap (2022 promo rates)
10. **10_LegacySystems_Enterprise_HighRisk.pdf** - CRITICAL: Expires in 14 days

**Total Portfolio Value:** $2.382M ARR across 846 users

---

### ✅ Deliverable #2: Current Rate Card
**File:** `RevenueSync_Rate_Card_2025.pdf`

Comprehensive 2-page rate card showing:
- Standard pricing tiers (Starter: $187, Professional: $250, Enterprise: $291)
- Volume discounts (10-20% for 250+ users)
- Historical pricing (2022-2025) for renewal analysis
- Add-on services pricing
- Payment terms and SLA commitments
- Renewal scenario examples

**Purpose:** Contract IQ uses this to calculate pricing gaps and recovery opportunities.

---

### ✅ Deliverable #3: Business Logic Guide
**File:** `CONTRACT_IQ_BUSINESS_LOGIC_GUIDE.md`

50+ page comprehensive guide including:
- Detailed breakdown of all 10 contracts
- Key insights Contract IQ should flag for each
- Demo talking points and narratives
- Portfolio intelligence summary (renewal risk matrix, pricing gaps, etc.)
- Renewal type distribution analysis
- Payment terms concentration
- Price escalation analysis
- $488K total ARR recovery opportunity breakdown

**Use Case:** Master reference for understanding what Contract IQ should detect and surface in each scenario.

---

### ✅ Deliverable #4: Salesforce Integration Guide
**File:** `SALESFORCE_INTEGRATION_GUIDE.md`

Technical specification including:
- Complete field mapping (Salesforce ↔ Contract IQ)
- 17 new custom fields to create on Account object
- 6 new custom fields for Opportunity object
- Integration workflows (daily sync, real-time alerts, weekly reports)
- API authentication setup (OAuth 2.0)
- Sample API calls and payloads
- Error handling and logging strategy
- Demo dashboard components
- Pre-demo testing checklist

**Use Case:** Exact specification for what data flows between systems and how.

---

## 🎯 How to Use This Package

### Phase 1: Understanding the Business Model
1. Read `CONTRACT_IQ_BUSINESS_LOGIC_GUIDE.md` thoroughly
2. Understand the 3 ICP segments (Enterprise, Mid-Market, SMB)
3. Study the pricing gap analysis methodology
4. Review renewal risk scoring factors

### Phase 2: Building Demo Data
1. Upload the 10 PDF contracts to Contract IQ for AI training
2. Ensure AI can extract:
   - Renewal type (auto vs manual)
   - Contract end dates
   - Pricing per user
   - Payment terms
   - SLA commitments
   - Notice periods
   - Price escalation clauses

### Phase 3: Demo Scenarios
Use these pre-built scenarios to demonstrate Contract IQ's value:

**Scenario A: Critical Renewal Alert**
- Contract: Legacy Systems International
- Show: 14-day expiration alert, $147K recovery opportunity
- Demo: Real-time task creation in Salesforce, CSM notification

**Scenario B: Pricing Gap Discovery**
- Contract: FinTech Ventures
- Show: 94% pricing gap ($150 vs $291/user), renewal negotiation strategy
- Demo: Pricing gap leaderboard, phased increase recommendation

**Scenario C: Portfolio Intelligence**
- Show: $488K total recovery opportunity across 5 contracts
- Demo: Risk heatmap, renewal pipeline by quarter, revenue at risk gauge

**Scenario D: Auto-Renewal Monitoring**
- Contract: TechScale Inc.
- Show: Low-risk account with 5% escalation clause = $21K automatic increase
- Demo: Set-it-and-forget-it monitoring for healthy accounts

### Phase 4: Salesforce Integration Demo
1. Show Account record BEFORE Contract IQ (basic fields only)
2. Run "sync" in Contract IQ
3. Show Account record AFTER (17 new enriched fields populated)
4. Show auto-created Tasks for high-risk renewals
5. Show Dashboard with risk heatmap and pricing gap charts

---

## 📊 Key Demo Metrics to Highlight

### Portfolio Snapshot
- **Total ARR:** $2.382M
- **Number of Contracts:** 10
- **Total Users:** 846
- **Renewal Risk Distribution:**
  - 🚨 Critical (0-60 days): 2 contracts, $504K ARR
  - ⚠️ High (60-180 days): 3 contracts, $432K ARR
  - ✅ Medium (180+ days): 3 contracts, $1.368M ARR
  - 💚 Low Risk: 2 contracts, $78K ARR

### Revenue Intelligence
- **Total Pricing Gap Recovery:** $488,520/year
- **Largest Single Opportunity:** FinTech Ventures ($101K)
- **Average Pricing Gap:** $97K per underpriced contract
- **Contracts Without Escalation:** 3 ($612K ARR at risk)

### Operational Efficiency
- **Manual Renewal Contracts:** 63% of portfolio ($1.506M) ⚠️
- **Net 60 Terms:** $1.254M tied up in receivables
- **Average Notice Period:** 78 days

---

## 💡 Demo Talking Points

### Opening: The Problem
"B2B SaaS companies managing hundreds of customer contracts face three critical challenges:
1. **Renewal Blind Spots** - 63% of revenue requires manual renewal negotiation
2. **Pricing Drift** - Customers on 2-3 year old rates leave $488K on the table
3. **Scattered Data** - Contract terms buried in PDFs, not in Salesforce"

### The Solution: Contract IQ
"Contract IQ is not a contract lifecycle tool - it's a **revenue intelligence layer** that:
1. **Reads** all your customer contracts with AI
2. **Extracts** renewal terms, pricing, SLAs, custom clauses
3. **Analyzes** risk patterns and pricing gaps
4. **Alerts** your team proactively before renewals slip
5. **Enriches** Salesforce with actionable contract intelligence"

### The Impact
"In this demo portfolio of $2.4M ARR:
- We identified $488K in pricing recovery opportunities
- We flagged 2 critical renewals expiring within 60 days
- We automated risk scoring across all 10 accounts
- We eliminated manual contract review by 90%"

---

## 🔧 Technical Implementation Notes

### AI Training Data
The 10 PDF contracts demonstrate these patterns Contract IQ must handle:
- ✅ Auto-renewal vs manual renewal detection
- ✅ Price per user extraction across different formats
- ✅ Notice period calculation (30, 60, 90, 120, 180 days)
- ✅ Payment terms parsing (Net 30, Net 60, prepaid)
- ✅ SLA commitment extraction (99.0%, 99.5%, 99.9%, 99.95%)
- ✅ Price escalation clause detection (fixed %, CPI-linked, none)
- ✅ Custom redline identification
- ✅ Implementation fee vs recurring revenue separation

### Risk Scoring Algorithm
Based on the business logic guide, risk scores should weight:
- **Days until renewal** (50% of score)
  - <30 days = 10/10
  - 30-60 days = 8/10
  - 60-90 days = 6/10
  - 90-180 days = 4/10
  - 180+ days = 2/10
  
- **Renewal type** (30% of score)
  - Manual renewal = +3 points
  - Auto-renewal = +0 points
  
- **Pricing gap** (20% of score)
  - 50%+ gap = +2 points
  - 25-50% gap = +1.5 points
  - 10-25% gap = +1 point
  - <10% gap = +0 points

### Pricing Gap Calculation
```
Current Market Rate = Rate Card lookup based on tier + user count
Contract Rate = Extracted from Schedule A in PDF
Pricing Gap $ = (Market Rate - Contract Rate) × Users × 12 months
Pricing Gap % = ((Market Rate - Contract Rate) / Market Rate) × 100
```

Example: Acme Corporation
- Market Rate: $291/user/month
- Contract Rate: $200/user/month
- Users: 75
- Gap $ = ($291 - $200) × 75 × 12 = $81,900/year
- Gap % = (($291 - $200) / $291) × 100 = 31.3%

---

## 🎬 Demo Flow Recommendation

### Act 1: The Problem (2 minutes)
1. Open Salesforce, show basic Account records
2. Point out: "All we know is ARR and renewal date"
3. "But what are the actual terms? Manual or auto-renewal? What SLAs did we commit to? Are they on current pricing?"
4. "That intel is buried in these PDFs" (show folder of contracts)

### Act 2: The Analysis (3 minutes)
1. Upload contracts to Contract IQ
2. Show AI extraction in progress
3. Display results dashboard:
   - Risk heatmap
   - Pricing gap leaderboard
   - Renewal pipeline

### Act 3: The Intelligence (3 minutes)
1. Drill into Legacy Systems account
2. Show: "Expires in 14 days, manual renewal, $147K recovery opportunity"
3. Display extracted contract terms side-by-side with Rate Card
4. Show recommended action: "Immediate CSM engagement, bridge pricing strategy"

### Act 4: The Integration (2 minutes)
1. Switch to Salesforce
2. Show Account record now has 17 new fields populated
3. Show auto-created high-priority Task
4. Show Chatter post with alert
5. Show Dashboard updated with real-time data

### Closing: The ROI (1 minute)
"Contract IQ just turned 10 static PDF contracts into:
- $488K in identified revenue recovery
- 2 critical alerts preventing churn
- 17 enriched data points per account in Salesforce
- Zero manual contract review

This is contract intelligence at scale."

---

## 📋 Pre-Demo Checklist

- [ ] All 10 PDF contracts generated and available
- [ ] Rate Card PDF created
- [ ] Business Logic Guide reviewed
- [ ] Salesforce sandbox configured with custom fields
- [ ] Sample Account records created in SFDC
- [ ] Contract IQ can authenticate to Salesforce
- [ ] Dashboard installed and tested
- [ ] Demo script rehearsed
- [ ] Backup plan if API fails (screenshots prepared)

---

## 🚀 Next Steps After Demo

### For Hot Prospects:
1. **Pilot Program Setup**
   - Upload customer's actual contracts (5-10 samples)
   - Run initial analysis
   - Generate custom insights report
   - 30-day trial period

2. **Technical Discovery**
   - Salesforce edition and customizations
   - Contract storage location (Google Drive, SharePoint, etc.)
   - CSM team structure
   - Renewal cadence and process

3. **Implementation Plan**
   - Week 1-2: Data integration setup
   - Week 3-4: AI training on customer's contracts
   - Week 5-6: Salesforce field mapping and testing
   - Week 7-8: CSM team training and rollout

### Pricing Guidance:
- **Base Platform:** $2K-5K/month depending on contract volume
- **Salesforce Integration:** Included
- **AI Analysis:** 100 contracts included, $10/contract over limit
- **Professional Services:** Custom implementation available

---

## 📞 Questions & Support

For questions about this demo package or implementation:
- **Business Logic:** Refer to CONTRACT_IQ_BUSINESS_LOGIC_GUIDE.md
- **Technical Integration:** See SALESFORCE_INTEGRATION_GUIDE.md
- **Demo Scenarios:** Follow recommendations in this README

---

**Demo Package Version:** 1.0  
**Created:** November 17, 2025  
**Total Deliverables:** 14 files (10 PDFs + 4 guides)  
**Demo Duration:** 10-15 minutes recommended  

---

## Appendix: File Structure

```
contract-iq-demo-package/
├── README.md (this file)
├── CONTRACT_IQ_BUSINESS_LOGIC_GUIDE.md
├── SALESFORCE_INTEGRATION_GUIDE.md
├── RevenueSync_Rate_Card_2025.pdf
└── sample_contracts/
    ├── 01_Acme_Corp_Enterprise_Legacy.pdf
    ├── 02_TechScale_Enterprise_Current.pdf
    ├── 03_GrowthLabs_MidMarket_Standard.pdf
    ├── 04_DataStream_MidMarket_CustomSLA.pdf
    ├── 05_StartupFast_SMB_Monthly.pdf
    ├── 06_QuickBiz_SMB_AnnualPrepaid.pdf
    ├── 07_RocketShip_HighGrowth_Aggressive.pdf
    ├── 08_GlobalBank_Enterprise_Complex.pdf
    ├── 09_FinTech_MidMarket_PricingGap.pdf
    └── 10_LegacySystems_Enterprise_HighRisk.pdf
```

**Ready to demo Contract IQ with real B2B SaaS business logic. 🚀**
