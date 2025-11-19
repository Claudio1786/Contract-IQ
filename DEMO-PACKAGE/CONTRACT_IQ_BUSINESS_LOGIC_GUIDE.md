# Contract IQ - Sample Contract Portfolio Analysis
## Business Logic Guide for RevenueSync Demo

---

## Overview
This portfolio represents **10 customer contracts** from RevenueSync's B2B SaaS customer base. Contract IQ analyzes these contracts to surface renewal intelligence, pricing gaps, and risk signals.

**Total Portfolio Value:** $2.382M ARR across 846 users

---

## Contract Breakdown by ICP

### 🏢 ENTERPRISE SEGMENT (5 Contracts - $1.956M ARR)

#### 1. **Acme Corporation** - HIGH RENEWAL RISK ⚠️
- **File:** `01_Acme_Corp_Enterprise_Legacy.pdf`
- **Contract #:** RSC-2022-1847
- **Term:** Jan 15, 2022 → Jan 14, 2025 (EXPIRING SOON)
- **ARR:** $180,000 (75 users @ $200/user/mo)
- **Renewal Type:** Manual - requires active negotiation
- **Payment Terms:** Net 60

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **Pricing Gap:** $91/user/mo below current enterprise rate ($291/mo)
- ✅ **Renewal Risk:** Manual renewal, no auto-renewal clause - needs proactive outreach
- ✅ **Upsell Opportunity:** No price escalation clause = potential $68K/year recovery at renewal
- ✅ **Timing Alert:** Expires in 2 months - immediate action required
- ✅ **Legacy Terms:** 2022 contract - likely outdated SLAs (99.5% vs current 99.9%)

**Demo Narrative:** *"Your Acme contract expires in 58 days with manual renewal required. They're paying 2022 rates - $91/user below current pricing. Renewal at current rates represents $68K ARR recovery opportunity. No auto-renewal means competitor risk - recommend immediate CSM engagement."*

---

#### 2. **TechScale Inc.** - HEALTHY, AUTO-RENEWING ✅
- **File:** `02_TechScale_Enterprise_Current.pdf`
- **Contract #:** RSC-2025-0341
- **Term:** Feb 1, 2025 → Jan 31, 2026
- **ARR:** $420,000 (120 users @ $291/user/mo)
- **Renewal Type:** Auto-renewal with 60-day notice
- **Payment Terms:** Net 30

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **Best Practice Contract:** Current pricing, auto-renewal, 5% annual escalation built in
- ✅ **Premium Support:** Includes $42K/year premium support tier
- ✅ **Low Risk:** Auto-renewal + current pricing = predictable revenue
- ✅ **Escalation Clause:** 5% annual increase = automatic $21K ARR growth on renewal
- ✅ **Strong SLA:** 99.9% uptime commitment with 10% credits

**Demo Narrative:** *"TechScale is on current pricing with auto-renewal. 5% escalation clause means $21K automatic ARR increase next February. Premium support tier at $42K shows high engagement. Low churn risk - maintain status quo."*

---

#### 3. **GlobalBank Systems Ltd.** - COMPLEX, HIGH VALUE 💎
- **File:** `08_GlobalBank_Enterprise_Complex.pdf`
- **Contract #:** RSC-2023-0892
- **Term:** Sep 1, 2023 → Aug 31, 2026
- **ARR:** $750,000 (250 users @ $250/user/mo) + $75K premium support
- **Renewal Type:** Manual with 180-day notice
- **Payment Terms:** Net 60

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **Largest Account:** $750K ARR - highest value contract in portfolio
- ✅ **Long Notice Period:** 180 days required - start renewal discussions by February 2026
- ✅ **Volume Discount:** $250/user shows enterprise pricing negotiation
- ✅ **International Terms:** UK jurisdiction, CPI-linked escalation (2%+ annually)
- ✅ **Custom Implementation:** $150K implementation fee = deep integration = sticky
- ✅ **Premium SLA:** 99.95% uptime + dedicated incident response

**Demo Narrative:** *"GlobalBank is your largest customer at $750K ARR with 250 users. Manual renewal requires 180-day notice - start discussions in early 2026. CPI escalation clause protects against inflation. High switching costs ($150K implementation) reduce churn risk. Maintain white-glove service."*

---

#### 4. **Legacy Systems International** - CRITICAL RENEWAL RISK 🚨
- **File:** `10_LegacySystems_Enterprise_HighRisk.pdf`
- **Contract #:** RSC-2023-1647
- **Term:** Dec 1, 2023 → Nov 30, 2025 (EXPIRING IN 14 DAYS!)
- **ARR:** $324,000 (135 users @ $200/user/mo)
- **Renewal Type:** Manual with 120-day notice
- **Payment Terms:** Net 60

**🎯 Key Insights Contract IQ Should Flag:**
- 🚨 **IMMEDIATE ACTION REQUIRED:** Expires in 14 days
- ✅ **Pricing Gap:** $91/user below current market rate
- ✅ **No Escalation Clause:** Locked at 2023 pricing - $147K/year recovery potential
- ✅ **Manual Renewal + No Escalation = Highest Risk:** Competitor vulnerable
- ✅ **120-Day Notice:** Should have started renewal talks 4 months ago - LATE
- ✅ **Semi-Annual Billing:** Different payment structure = unique handling

**Demo Narrative:** *"🚨 URGENT: Legacy Systems contract expires November 30 (14 days). Manual renewal + no follow-up detected. Paying $200/user vs current $291 = $147K ARR at risk. No price escalation means they're accustomed to flat pricing. Immediate executive engagement required to prevent churn."*

---

#### 5. **RocketShip AI** - HIGH GROWTH, AGGRESSIVE AUTO-RENEWAL 🚀
- **File:** `07_RocketShip_HighGrowth_Aggressive.pdf`
- **Contract #:** RSC-2024-2891
- **Term:** Apr 20, 2024 → Apr 19, 2027 (3-year initial)
- **ARR:** $288,000 (90 users @ $267/user/mo)
- **Renewal Type:** Auto-renewal for 2-year terms
- **Payment Terms:** Net 30 + quarterly true-ups

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **Aggressive Lock-In:** 3-year initial + 2-year auto-renewal = long commitment
- ✅ **Growth Pricing:** $267/user = custom growth discount (vs $291 standard)
- ✅ **Usage-Based:** Quarterly true-ups based on user count = expansion revenue built in
- ✅ **5% Annual Escalation:** Automatic ARR growth = $14.4K/year increase
- ✅ **High Exit Friction:** 75% early termination fee + 180-day notice = sticky
- ✅ **Expansion Tracking:** Monitor quarterly true-ups for user growth

**Demo Narrative:** *"RocketShip has aggressive retention terms: 3-year initial, 2-year auto-renewal, 75% termination fee. Quarterly true-ups mean automatic expansion revenue as they grow. 5% escalation = $14K ARR increase annually. Low churn risk, high expansion potential."*

---

### 📊 MID-MARKET SEGMENT (3 Contracts - $348K ARR)

#### 6. **GrowthLabs LLC** - STANDARD MID-MARKET ✅
- **File:** `03_GrowthLabs_MidMarket_Standard.pdf`
- **Contract #:** RSC-2024-2156
- **Term:** Mar 10, 2024 → Mar 9, 2026
- **ARR:** $96,000 (35 users @ $229/user/mo)
- **Renewal Type:** Auto-renewal (2-year initial, 1-year renewals)
- **Payment Terms:** Net 30, quarterly billing

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **Moderate Pricing:** $229/user = 2024 mid-market rate (vs $250-291 current)
- ✅ **3% Annual Escalation:** Conservative but protects margin
- ✅ **2-Year Initial Term:** Longer commitment = lower risk
- ✅ **Quarterly Billing:** Cash flow friendly for customer
- ✅ **Auto-Renewal:** Low risk, predictable revenue

**Demo Narrative:** *"GrowthLabs is a healthy mid-market account. Auto-renewal with 3% escalation = $2.9K automatic increase in March 2026. 2-year initial term shows commitment. Consider upsell to Professional Plus tier at next touchpoint."*

---

#### 7. **DataStream Solutions** - CUSTOM SLA, PRICING GAP ⚠️
- **File:** `04_DataStream_MidMarket_CustomSLA.pdf`
- **Contract #:** RSC-2023-1523
- **Term:** Jun 1, 2023 → May 31, 2026
- **ARR:** $144,000 (55 users @ $218/user/mo) + $18K premium support
- **Renewal Type:** Manual with 90-day notice
- **Payment Terms:** Net 45

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **Significant Pricing Gap:** $218/user = $73/user below current Professional rate
- ✅ **Custom SLA Commitment:** 99.95% uptime (enterprise-grade for mid-market)
- ✅ **Manual Renewal:** Requires proactive engagement by March 2026
- ✅ **CPI-Linked Escalation:** "Lesser of 3% or CPI" = inflation protection
- ✅ **Premium Support:** $18K/year shows high engagement needs
- ✅ **Upsell Opportunity:** $48K ARR recovery at renewal + potential tier upgrade

**Demo Narrative:** *"DataStream has custom enterprise SLAs but paying mid-market rates from 2023. $218/user vs current $250-291 = $48K ARR opportunity. High SLA commitment (99.95%) + premium support shows they're a demanding customer. Start renewal talks in February with tier upgrade pitch."*

---

#### 8. **FinTech Ventures** - MASSIVE PRICING GAP 🎯
- **File:** `09_FinTech_MidMarket_PricingGap.pdf`
- **Contract #:** RSC-2022-2134
- **Term:** Nov 10, 2022 → Nov 9, 2025 (EXPIRING SOON)
- **ARR:** $108,000 (60 users @ $150/user/mo)
- **Renewal Type:** Manual with 90-day notice
- **Payment Terms:** Net 45

**🎯 Key Insights Contract IQ Should Flag:**
- 🚨 **LARGEST PRICING GAP IN PORTFOLIO:** $150/user = $141/user below current rate
- ✅ **2022 Promotional Lock:** "Pricing locked for initial term" = they knew this was coming
- ✅ **Renewal Shock Risk:** 94% price increase required to reach current rates
- ✅ **Manual Renewal:** No auto-renewal = negotiation required
- ✅ **Price Sensitivity:** Clause says "renewal pricing subject to then-current rates" = expect pushback
- ✅ **$101K ARR Recovery:** Moving to $291/user = nearly doubling revenue

**Demo Narrative:** *"⚠️ FinTech Ventures is on a 2022 promotional rate ($150/user vs $291 current). Contract explicitly states renewal at 'then-current rates' = they accepted temporary discount. Expires Nov 9 - start discussions NOW. Frame as 'promotional period ending' not 'price increase.' $101K ARR recovery opportunity but expect negotiation."*

---

### 💼 SMB SEGMENT (2 Contracts - $72K ARR)

#### 9. **StartupFast Inc.** - MONTH-TO-MONTH, LOW COMMITMENT 📅
- **File:** `05_StartupFast_SMB_Monthly.pdf`
- **Contract #:** RSC-2024-3847
- **Term:** Aug 15, 2024 → Ongoing (month-to-month)
- **ARR:** $18,000 (8 users @ $187/user/mo)
- **Renewal Type:** Auto-renewal monthly
- **Payment Terms:** Auto-pay via credit card

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **High Churn Risk:** Month-to-month = can cancel anytime with 30 days notice
- ✅ **Low Commitment:** No early termination penalty
- ✅ **Auto-Pay:** Credit card = frictionless but also frictionless to cancel
- ✅ **SMB Pricing:** $187/user = starter tier appropriate for size
- ✅ **Upsell Path:** Monitor usage - if growing, migrate to annual for discount + retention
- ✅ **No SLA Credits:** "Best effort support" = lower service commitment

**Demo Narrative:** *"StartupFast is month-to-month with no commitment. $18K ARR but high churn risk. Auto-pay reduces friction but also makes cancellation easy. Watch for expansion signals - if they grow to 15+ users, pitch annual contract with 15% discount for commitment."*

---

#### 10. **QuickBiz Co.** - ANNUAL PREPAID, LOW RISK ✅
- **File:** `06_QuickBiz_SMB_AnnualPrepaid.pdf`
- **Contract #:** RSC-2025-0512
- **Term:** Jan 5, 2025 → Jan 4, 2026
- **ARR:** $54,000 (18 users @ $250/user/mo)
- **Renewal Type:** Auto-renewal with 30-day notice
- **Payment Terms:** Net 15, prepaid annually

**🎯 Key Insights Contract IQ Should Flag:**
- ✅ **Prepaid Annual:** Full year paid upfront = cash flow positive
- ✅ **15% Discount Applied:** $250/user = Professional tier with prepay discount
- ✅ **Price Commitment:** Willing to prepay shows financial stability
- ✅ **4% Annual Escalation:** Built into renewal terms
- ✅ **No Refund on Early Termination:** Sticky contract = low churn risk
- ✅ **Strong SMB Account:** 18 users + annual prepay = good fit

**Demo Narrative:** *"QuickBiz is a model SMB customer: annual prepay (15% discount), auto-renewal, 4% escalation. Full year paid upfront improves cash flow. No refund clause = committed customer. Low risk, predictable revenue. Maintain relationship and watch for expansion."*

---

## 📊 Portfolio Intelligence Summary

### Renewal Risk Matrix

| Risk Level | Count | Total ARR | Action Required |
|------------|-------|-----------|-----------------|
| 🚨 Critical (0-60 days) | 2 | $504,000 | IMMEDIATE outreach required |
| ⚠️ High (60-180 days) | 3 | $432,000 | Schedule renewal discussions |
| ✅ Medium (180+ days) | 3 | $1,368,000 | Monitor & maintain |
| 💚 Low Risk (Auto-renew) | 2 | $78,000 | Normal cadence |

### Pricing Gap Analysis

| Customer | Current Rate | Market Rate | Gap | ARR Recovery |
|----------|-------------|-------------|-----|--------------|
| FinTech Ventures | $150/user | $291/user | $141 | $101,520 |
| Acme Corporation | $200/user | $291/user | $91 | $68,400 |
| Legacy Systems | $200/user | $291/user | $91 | $147,420 |
| DataStream | $218/user | $291/user | $73 | $48,180 |
| GlobalBank | $250/user | $291/user | $41 | $123,000 |
| **TOTAL RECOVERY OPPORTUNITY** | | | | **$488,520/year** |

### Renewal Type Distribution

- **Auto-Renewal:** 5 contracts ($876K ARR) - 37% of portfolio
- **Manual Renewal:** 5 contracts ($1,506K ARR) - 63% of portfolio ⚠️

**⚠️ Risk Alert:** 63% of ARR requires active renewal negotiations - need proactive outreach process.

### Payment Terms Concentration

- **Net 30:** 4 contracts ($732K ARR)
- **Net 60:** 3 contracts ($1,254K ARR) - potential cash flow impact
- **Net 45:** 2 contracts ($252K ARR)
- **Net 15 / Auto-pay:** 1 contract ($72K ARR)

### Price Escalation Analysis

| Escalation Type | Count | Protected Revenue |
|-----------------|-------|-------------------|
| Fixed % (3-5%) | 5 contracts | $876K ARR |
| CPI-linked | 2 contracts | $894K ARR |
| None (locked pricing) | 3 contracts | $612K ARR ⚠️ |

**⚠️ Risk:** $612K ARR has no built-in escalation = margin compression risk.

---

## 🎯 Demo Talking Points for Contract IQ

### Core Value Propositions to Demonstrate:

1. **Renewal Risk Alerts**
   - "Contract IQ flagged 2 contracts expiring within 60 days requiring immediate action"
   - Show Legacy Systems + Acme as critical alerts with countdown timers

2. **Pricing Intelligence**
   - "We identified $488K in ARR recovery opportunity across 5 underpriced contracts"
   - Highlight FinTech Ventures as extreme example (94% increase potential)

3. **Renewal Type Risk**
   - "63% of your ARR is manual renewal - Contract IQ built a renewal playbook prioritized by expiration date"
   - Compare manual vs auto-renewal retention rates

4. **Escalation Gap**
   - "3 contracts totaling $612K have no price escalation clauses - margin at risk"
   - Show inflation impact over 3 years vs contracts with escalation

5. **Payment Terms Optimization**
   - "$1.254M in Net 60 terms = ~$104K in capital tied up compared to Net 30"
   - Pitch annual prepay discount program (QuickBiz model)

---

## 🔧 Integration Points for Salesforce

### Fields Contract IQ Should Push to SFDC:

1. **Renewal Risk Score** (1-10)
   - Legacy Systems: 9/10 (expires in 14 days, manual, no escalation)
   - Acme: 8/10 (expires in 58 days, manual, pricing gap)
   - FinTech: 7/10 (pricing shock risk)

2. **Pricing Gap Amount**
   - FinTech: +$101K opportunity
   - Legacy Systems: +$147K opportunity
   - Acme: +$68K opportunity

3. **Renewal Readiness Status**
   - Legacy Systems: "URGENT - Outreach overdue"
   - Acme: "Action Required - 58 days"
   - DataStream: "Plan - 6 months out"

4. **Auto-Renewal Flag**
   - Boolean: Yes/No
   - Use to segment renewal plays

5. **Days Until Renewal**
   - Countdown field for prioritization

6. **Contract Redline Status**
   - Track custom terms (SLAs, payment, etc.)
   - Highlight non-standard clauses

---

## 📋 Next Steps for Demo Build

1. **Create Current Rate Card** showing:
   - Enterprise: $291/user/mo
   - Professional: $250/user/mo
   - Starter: $187/user/mo
   - Volume discounts at 100+, 200+ users

2. **Build Demo Dashboard** showing:
   - Renewal pipeline by quarter
   - Pricing gap heatmap
   - Risk score distribution
   - Revenue recovery forecast

3. **Create Renewal Playbooks** for each scenario:
   - Standard auto-renewal (TechScale path)
   - Pricing gap negotiation (FinTech path)
   - High-risk save (Legacy Systems path)
   - Upsell expansion (RocketShip path)

4. **Salesforce Mock Data** to show integration:
   - Account objects with renewal dates
   - Opportunity records for at-risk accounts
   - Task creation for CSM follow-up

---

**This portfolio demonstrates all the critical patterns Contract IQ needs to handle in B2B SaaS contract management.**
