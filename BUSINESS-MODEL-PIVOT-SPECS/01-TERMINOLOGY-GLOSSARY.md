# Contract IQ - Complete Terminology Glossary
## Business Model Pivot: Vendor Management → Customer Revenue Intelligence

**Version:** 1.0  
**Last Updated:** November 18, 2024  
**Purpose:** Eliminate all ambiguity in terminology for Factory.ai implementation

---

## Critical Context

**OLD MODEL (WRONG):** We built vendor/procurement contract management  
**NEW MODEL (CORRECT):** We are building customer revenue intelligence

**Who is the "Customer"?** The company that BUYS services FROM US (we are the seller/provider)

---

## Complete Term Mapping

| OLD TERM (Vendor Model) | NEW TERM (Customer Model) | DEFINITION | EDGE CASES & CLARIFICATIONS |
|------------------------|---------------------------|------------|---------------------------|
| **Vendor** | **Customer** | The company that purchases services FROM US | ⚠️ Never use "vendor" unless referring to OUR actual vendors (Stripe, AWS). In our system, "customer" always means "company buying from us". |
| **Vendor Contract** | **Customer Contract** | Legal agreement where WE sell to them | MSAs, Order Forms, SOWs where we are the SELLER |
| **Annual Spend** | **Annual Contract Value (ACV)** or **Annual Recurring Revenue (ARR)** | Yearly value of contract we SELL to customer | Use ACV for initial deal size, ARR for ongoing recurring revenue. NEVER use "spend" (implies we're spending). |
| **Monthly Spend** | **Monthly Recurring Revenue (MRR)** | Monthly subscription value FROM customer | Exclude one-time fees from MRR. This is recurring revenue only. |
| **Total Contract Value (TCV)** | **Total Contract Value (TCV)** | Total value over entire contract term | Multi-year deals: 3-year @ $100K/yr = $300K TCV. Context changes but term stays same. |
| **Cost Savings** | **Expansion Revenue** or **Revenue Protection** | Money gained/protected | Savings = finding expansion opportunities; Protection = preventing churn |
| **Overpayment** | **Underpriced Customer** or **Pricing Gap** | Customer pays LESS than current market rate | They pay $80K, new customers pay $100K = $20K expansion opportunity |
| **Market Rate** | **Current Rate Card** or **Current Market Rate** | What NEW customers pay us today | Use latest pricing tier, not historical rates |
| **Vendor Benchmark** | **Customer Pricing Tier** | Pricing level/package customer is on | Examples: "Enterprise 2021", "Growth 2024", "Legacy Grandfather" |
| **Procurement** | **Revenue Operations (RevOps)** | Business function managing revenue | RevOps, Customer Success Ops, Sales Ops |
| **Buyer** | **Seller** | Our role in the transaction | WE are selling TO the customer (we are the seller/provider) |
| **Supplier** | **Provider** or **Platform** | What we are to the customer | We provide/supply the service to our customers |
| **Purchase Order (PO)** | **Order Form** or **Sales Order** | Document customer signs to purchase | We RECEIVE Order Forms from customers (not send POs) |
| **Renewal Notice** | **Renewal Engagement** or **Renewal Conversation** | Activity around renewal | WE engage THEM for renewal (we're trying to retain them) |
| **Cancellation Deadline** | **Non-Renewal Deadline** or **Notice Deadline** | Date by which customer must notify to cancel | Customer's deadline to tell US they're not renewing |
| **Budget** | **ARR** or **Revenue** | Financial tracking metric | Track revenue we earn, not costs we spend |
| **Cost Center** | **Customer Segment** or **Vertical** | Customer categorization | Enterprise, Mid-Market, SMB or Healthcare, SaaS, Financial Services |
| **License Fee** | **Subscription Fee** or **Seat Cost** | What customer pays us | Per-seat, per-user, per-usage pricing model |
| **Overage Charges** | **Usage Overages** or **Excess Usage Fees** | When customer exceeds plan limits | Customer exceeds limits = overage revenue opportunity for us |
| **Service Level Agreement (SLA)** | **Service Level Agreement (SLA)** | Performance commitments | OUR commitments TO customer (uptime, support response times) |
| **Payment Terms** | **Payment Terms** | When customer pays | Net 30, Net 60, Annual Upfront, Monthly billing cycles |
| **Auto-Renewal Clause** (BAD for us as buyer) | **Auto-Renewal Clause** (GOOD for us as seller) | 🚨 CRITICAL INVERSION | No auto-renewal = HIGH churn risk (customer can walk away easily). Auto-renewal = LOW risk (customer committed). |
| **Termination for Convenience** (GOOD for us as buyer) | **Termination for Convenience** (BAD for us as seller) | 🚨 CRITICAL INVERSION | Customer can cancel anytime = HIGH churn risk. Termination for cause only = LOWER risk. |
| **Early Termination Penalty** (BAD for us as buyer) | **Early Termination Penalty** (GOOD for us as seller) | 🚨 CRITICAL INVERSION | Penalty protects OUR revenue from early customer departure |
| **Notice Period** (When WE must notify vendor) | **Notice Period** (When THEY must notify us) | Same concept, reversed parties | "Customer must give 90 days notice to terminate" means they tell us 90 days before leaving |

---

## Date Field Definitions (CRITICAL - Easy to Confuse)

| FIELD NAME | DEFINITION | EXAMPLE | CALCULATION LOGIC |
|-----------|------------|---------|------------------|
| **contract_start_date** | Date customer signed and contract became active | 2023-06-01 | From signature date or "effective date" in contract |
| **contract_end_date** | Date current contract term expires | 2025-05-31 | start_date + contract_term_months |
| **renewal_date** | Date when renewal decision happens | 2025-06-01 | Usually = contract_end_date + 1 day |
| **notice_deadline_date** | Last date customer can notify us they're NOT renewing | 2025-05-01 | renewal_date - notice_period_days |
| **last_renewal_date** | Date of most recent renewal (if renewed before) | 2024-06-01 | Historical: when they last renewed with us |

**CRITICAL RULE:** All dates must be stored as YYYY-MM-DD format in database.

---

## Financial Metrics Definitions

| METRIC | DEFINITION | CALCULATION | USE CASE | EXAMPLE |
|--------|------------|-------------|----------|---------|
| **ACV (Annual Contract Value)** | Annualized value of the contract | TCV ÷ contract_years | Initial deal size, benchmarking | 3-year deal @ $360K total = $120K ACV |
| **ARR (Annual Recurring Revenue)** | Recurring revenue component only (exclude one-time) | MRR × 12 | SaaS metrics, churn tracking | $10K/month MRR = $120K ARR |
| **MRR (Monthly Recurring Revenue)** | Monthly subscription value | ARR ÷ 12 | Cash flow, monthly tracking | $120K ARR = $10K MRR |
| **TCV (Total Contract Value)** | Total value over entire contract term | ACV × contract_years | Multi-year deals | $120K ACV × 3 years = $360K TCV |
| **Expansion Revenue** | Net new ARR from existing customer | New ACV - Previous ACV | Upsells, cross-sells, price increases | Customer had $80K, now $100K = $20K expansion |
| **Contraction Revenue** | Lost ARR from downgrades | Previous ACV - New ACV | Downgrades, seat reduction | Customer had $100K, now $80K = $20K contraction |
| **Churn Revenue** | Lost ARR from customers who left | Sum of churned customer ACVs | Churn tracking | 3 customers left totaling $150K ARR = $150K churned |
| **Net Revenue Retention (NRR)** | Revenue retained + expansion - churn | (Starting ARR + Expansion - Churn - Contraction) ÷ Starting ARR × 100% | SaaS health metric | Started with $1M, gained $200K expansion, lost $50K churn = 115% NRR |

---

## Risk-Related Terms

| TERM | DEFINITION | VALUES | INTERPRETATION |
|------|------------|--------|----------------|
| **Churn Risk Score** | 0-100 score predicting likelihood of non-renewal | 0-100 (integer) | 0-40 = LOW, 41-70 = MEDIUM, 71-100 = HIGH |
| **Churn Risk Level** | Categorical risk assessment | HIGH / MEDIUM / LOW | Derived from churn_risk_score thresholds |
| **Health Score** | Overall account health from CS platform | 0-100 (integer) | From Gainsight/ChurnZero. 80+ = Healthy, 60-79 = At Risk, <60 = Critical |
| **NPS Score** | Net Promoter Score | -100 to +100 (integer) | 9-10 = Promoter, 7-8 = Passive, 0-6 = Detractor |
| **At-Risk Account** | Customer with high churn likelihood | Boolean or categorical | Churn risk score > 70 OR critical health indicators |
| **ARR at Risk** | Total annual revenue that could be lost | Dollar amount | Sum of ACV for all HIGH risk customers |

---

## Expansion-Related Terms

| TERM | DEFINITION | TYPES | NOTES |
|------|------------|-------|-------|
| **Expansion Opportunity** | Potential to increase ARR from existing customer | pricing_gap, seat_expansion, tier_upgrade, cross_sell, usage_overages | Quantified in dollars, assigned probability |
| **Pricing Gap** | Difference between what they pay vs current rate | Dollar amount & percentage | Legacy customers paying old rates = expansion opportunity |
| **Seat Expansion** | Adding more users/seats to contract | Additional seats × price_per_seat | High usage (>90%) = expansion signal |
| **Tier Upgrade** | Moving customer to higher pricing tier | Difference between current and next tier | Usage near limits = upgrade opportunity |
| **Cross-Sell** | Selling additional products/modules | Separate SKU or add-on value | Analytics module, premium features, new product line |
| **Usage Overages** | Customer exceeding plan limits | Overage fees or upgrade opportunity | Consistently over limits = tier upgrade opportunity |

---

## Integration-Related Terms

| SYSTEM | PRIMARY OBJECTS | OUR MAPPING | NOTES |
|--------|----------------|-------------|-------|
| **Salesforce** | Opportunity, Account, Contact, Task | Opportunity (Type="New Customer" or "Renewal", Stage="Closed Won") → CustomerContract | Salesforce stores customer data and deals |
| **Gainsight / ChurnZero** | Company, Relationship, Health Score, Timeline | Company → Customer, Health Score → health_score field | Customer success platform with health metrics |
| **Stripe / Recurly** | Subscription, Invoice, Customer, Payment | Subscription → CustomerContract, Invoice → payment_status | Billing system with payment data |
| **DocuSign** | Envelope, Document, Recipient | Signed Envelope → source_document_id | Document signing platform |
| **Slack** | Channel, Message, User | Alert → Slack Message in #customer-success | Team communication for alerts |

---

## Common Edge Cases & How to Handle

### Edge Case #1: Multi-Year Deals
**Question:** 3-year deal @ $100K/year - what's the ACV vs TCV vs ARR?

**Answer:**
- TCV = $300K (total contract value over 3 years)
- ACV = $100K (annualized value)
- ARR = $100K (annual recurring revenue)
- MRR = $8,333 (monthly recurring)
- Renewal date = Year 3 anniversary (not annual)

### Edge Case #2: Contract Amendments
**Question:** Customer had $100K ACV, signed amendment for +$25K mid-year. How do we track?

**Answer:**
- Update `annual_contract_value` to $125K in database
- Create record in `expansion_history` table with:
  - expansion_date: date of amendment
  - previous_acv: $100K
  - new_acv: $125K
  - expansion_amount: $25K
  - expansion_type: "mid_term_expansion"
- `contract_type` = "Amendment" for the addendum document
- Keep original contract_start_date (don't change)

### Edge Case #3: Grandfather Clauses (Locked Pricing)
**Question:** Customer has pricing locked for 5 years at $80K. Current rate is $120K. How do we show this?

**Answer:**
- Their `pricing_tier` = "Enterprise 2020 (Locked until 2025)"
- `annual_contract_value` = $80,000 (what they actually pay)
- `current_market_rate` = $120,000 (what new customers pay)
- `pricing_gap_amount` = $40,000
- `pricing_gap_percentage` = 33.3%
- Note in `special_terms`: "Contractual price lock until December 2025"
- Expansion opportunity:
  - `has_expansion_opportunity` = true
  - `expansion_opportunity_amount` = $40,000
  - `expansion_timing` = "AT_RENEWAL" (can't change mid-term due to lock)
  - `expansion_probability` = "MEDIUM" (depends on value demonstration)

### Edge Case #4: Seat-Based Pricing with Tiered Rates
**Question:** Customer pays $100/seat for 150 seats ($15K). New tiered pricing: 1-100 seats = $120/seat, 101-500 seats = $100/seat. Is there a gap?

**Answer:**
- No pricing gap (they're at current rate for their tier: 150 seats = $100/seat tier)
- BUT if they're using 145+ seats (>95% utilization) → expansion opportunity
- `expansion_type` = "seat_expansion"
- `expansion_opportunity_amount` = 50 seats × $100 = $5,000 additional ARR
- `expansion_probability` = "HIGH" (capacity constraint)

### Edge Case #5: Usage-Based Pricing
**Question:** Customer has $50K base + $5 per 1K API calls. Usage varies month to month. How do we track ACV?

**Answer:**
- Calculate 12-month rolling average of total payments
- Example: $50K base + average $25K usage = $75K ACV
- `annual_contract_value` = $75,000 (based on trailing 12 months)
- `pricing_tier` = "Base + Usage 2024"
- Track `usage_tier_limit` = "Base: $50K + $5 per 1K API calls"
- Track `current_usage_level` = "Averaging 5M API calls/month"
- If consistently exceeding → expansion opportunity:
  - `expansion_type` = "tier_upgrade"
  - Recommend: "Upgrade to unlimited tier at $90K flat (save $60K based on current usage)"

### Edge Case #6: Payment Issues & Churn Risk
**Question:** Customer is 45 days past due on $18K annual contract. What's their churn risk?

**Answer:**
- `payment_status` = "past_due_60" (use closest bucket)
- `days_past_due` = 45
- This automatically adds 30-40 risk points to `churn_risk_score`
- Total churn risk calculation:
  - Payment issue: +35 points
  - Plus other factors (usage, relationship, contract terms)
  - Likely result: HIGH risk (75-95 range)
- Alert triggered: "Payment issue - high churn risk"
- Recommended actions:
  1. Contact customer finance immediately
  2. Understand reason for non-payment
  3. If financial distress → discuss downgrade options
  4. If dispute → resolve immediately
  5. If 60+ days past due → escalate to collections policy

### Edge Case #7: Company Acquisitions
**Question:** Customer "StartupCo" got acquired by "MegaCorp" mid-contract. How do we track?

**Answer:**
- Keep original `customer_name` = "StartupCo" (legal entity on contract)
- Add note in `internal_notes`: "Acquired by MegaCorp in October 2024. Primary contact now reports to MegaCorp IT."
- Monitor closely:
  - Acquisition = potential churn risk (new parent may consolidate vendors/cancel subscriptions)
  - Add risk points if: new decision makers, duplicate tools at parent company
  - Opportunity: If MegaCorp has other divisions → expansion/cross-sell opportunity
- Actions:
  1. Identify new decision makers at MegaCorp
  2. Schedule call to introduce value
  3. Position for expansion to other MegaCorp divisions
  4. Update contract if MegaCorp wants consolidated billing

### Edge Case #8: Evergreen Contracts (Auto-Renew Forever)
**Question:** Contract auto-renews forever with 90-day notice. What's the renewal_date?

**Answer:**
- `evergreen_clause` = true
- `auto_renewal` = true
- `auto_renewal_notice_days` = 90
- `renewal_date` = next anniversary date (e.g., if started Jan 1, 2023 → next is Jan 1, 2026)
- After each anniversary, automatically update:
  - `renewal_date` = add 1 year (Jan 1, 2027)
  - `contract_end_date` = add 1 year
  - `last_renewal_date` = previous renewal_date
- Churn risk typically LOW (they're locked in unless they proactively cancel)

### Edge Case #9: Free Trials Converting to Paid
**Question:** Customer in 90-day paid pilot @ $5K. Then converts to full $80K contract. How to track?

**Answer:**

**DURING PILOT:**
- Create contract with `contract_status` = "pilot"
- `annual_contract_value` = $20,000 (annualized pilot value: $5K × 4)
- `contract_start_date` = pilot start date
- `contract_end_date` = pilot end date (90 days later)
- Add field `pilot_details`:
  ```json
  {
    "is_pilot": true,
    "pilot_duration_days": 90,
    "pilot_total_value": 5000,
    "expected_full_acv": 80000,
    "conversion_deadline": "2024-12-15"
  }
  ```

**AFTER CONVERSION:**
- Update same contract record:
  - `contract_status` = "active"
  - `annual_contract_value` = $80,000
  - `contract_start_date` = conversion date (when they signed full contract)
  - `contract_end_date` = start + contract term
  - `original_acv` = $80,000
- Create expansion_history record:
  - `expansion_type` = "pilot_to_paid_conversion"
  - `previous_acv` = $20,000 (annualized pilot)
  - `new_acv` = $80,000
  - `expansion_amount` = $60,000

### Edge Case #10: One Customer, Multiple Contracts
**Question:** "GlobalCorp" has 3 separate Order Forms for 3 different divisions. How do we track?

**Answer:**

**CREATE 3 SEPARATE CONTRACT RECORDS:**

Contract 1:
- `customer_id` = globalcorp_uuid (same for all 3)
- `customer_name` = "GlobalCorp - North America Division"
- `annual_contract_value` = $150,000
- `contract_number` = "OF-2024-001"

Contract 2:
- `customer_id` = globalcorp_uuid (same customer_id)
- `customer_name` = "GlobalCorp - EMEA Division"
- `annual_contract_value` = $200,000
- `contract_number` = "OF-2024-087"

Contract 3:
- `customer_id` = globalcorp_uuid (same customer_id)
- `customer_name` = "GlobalCorp - APAC Division"
- `annual_contract_value` = $100,000
- `contract_number` = "OF-2024-134"

**IN CUSTOMERS TABLE:**
- Single record: `company_name` = "GlobalCorp"
- `current_arr` = $450,000 (sum of all contracts)
- `total_lifetime_value` = sum of all historical revenue

**REPORTING:**
- Contract-level: Track risk/expansion per division contract
- Customer-level: Roll up to show total GlobalCorp relationship
- If one division churns: doesn't lose entire customer, just that contract

**ACTIONS:**
- Coordinate CSMs across divisions (don't duplicate outreach)
- Use success in one division to expand to others
- If 2+ divisions are happy → position for enterprise-wide deal consolidation

---

## Ambiguous Phrases - Clarifications

| PHRASE | AMBIGUOUS MEANING | CORRECT INTERPRETATION | EXAMPLES |
|--------|------------------|----------------------|----------|
| "The customer" | Could mean THEIR customer (end user) | Always means the company buying FROM US | "The customer" = Acme Corp (who pays us), NOT Acme's end users |
| "Renewal date" | Could mean many dates | Specific date when renewal decision happens | If contract ends Dec 31, 2025 → renewal_date = Jan 1, 2026 |
| "At market rate" | Whose market? | Current rate WE charge NEW customers today | Market rate = our current pricing, not industry benchmarks |
| "Contract value" | Total or annual? | Specify: ACV (annual) or TCV (total) | Always clarify: "ACV of $100K" or "TCV of $300K over 3 years" |
| "Active user" | Logged in recently? | Someone actively using seats (not just licensed) | 800 seats purchased, 720 active = 720 people actually using product |
| "Auto-renewal" | Good or bad? | GOOD for us (customer committed) | No auto-renewal = HIGH RISK, Has auto-renewal = LOW RISK |
| "High risk" | Risk of what? | Risk of customer churning (not renewing with us) | High churn risk = likely to lose this customer's revenue |
| "Expansion" | Revenue or usage? | Revenue increase (more ARR from customer) | Expansion = customer pays us more money (upsell, price increase) |
| "Tier" | Pricing or customer segment? | Specify: "pricing tier" vs "customer segment" | Pricing tier = Enterprise plan; Customer segment = Enterprise company size |
| "Term" | Length or conditions? | Usually contract length/duration | "3-year term" = contract lasts 3 years |
| "Notice period" | Notice by whom? | Days customer must notify US to cancel | "60-day notice" = customer tells us 60 days before they want to leave |
| "Payment terms" | When or how? | When customer pays (Net 30, Annual, Quarterly) | "Annual upfront" = customer pays full year in advance |

---

## Critical "Inversion Rules" (OLD vs NEW Logic)

### Inversion Rule #1: Auto-Renewal Clauses

**OLD (Vendor Model) Logic:**
- Auto-renewal = BAD for us (we're locked in to paying vendor)
- No auto-renewal = GOOD (we have flexibility to leave)

**NEW (Customer Model) Logic:**
- Auto-renewal = GOOD for us (customer committed, lower churn risk)
- No auto-renewal = BAD (customer can easily walk away, higher churn risk)

**Risk Scoring:**
- No auto-renewal → Add 15 points to churn risk score
- Auto-renewal present → Add 0 points (reduces risk)

### Inversion Rule #2: Termination Rights

**OLD (Vendor Model) Logic:**
- Termination for convenience = GOOD (we can leave vendor anytime)
- Termination for cause only = BAD (we're stuck unless vendor breaches)

**NEW (Customer Model) Logic:**
- Termination for convenience = BAD (customer can leave anytime, high risk)
- Termination for cause only = GOOD (customer must have reason to leave)

**Risk Scoring:**
- Termination for convenience → Add 10 points to churn risk
- For cause only → Add 0 points

### Inversion Rule #3: Early Termination Penalties

**OLD (Vendor Model) Logic:**
- Early termination penalty = BAD (we have to pay to get out)
- No penalty = GOOD (we can leave without cost)

**NEW (Customer Model) Logic:**
- Early termination penalty = GOOD (protects our revenue if they leave early)
- No penalty = BAD (customer can leave without financial consequence)

**Risk Scoring:**
- No early termination penalty → Add 5 points to churn risk
- Penalty present → Subtract 5 points (reduces risk)

### Inversion Rule #4: Notice Periods

**OLD (Vendor Model) Logic:**
- Short notice period (30 days) = GOOD (we can leave quickly)
- Long notice period (90 days) = BAD (have to notify vendor far in advance)

**NEW (Customer Model) Logic:**
- Short notice period (30 days) = BAD (customer can surprise us with quick exit)
- Long notice period (90 days) = GOOD (gives us time to prevent churn)

**Risk Scoring:**
- Notice period < 30 days → Add 8 points
- Notice period 30-60 days → Add 5 points
- Notice period 60-90 days → Add 2 points
- Notice period > 90 days → Add 0 points

### Inversion Rule #5: Pricing Gaps

**OLD (Vendor Model) Logic:**
- We pay MORE than market rate = BAD (overpaying, cost savings opportunity)
- We pay LESS than market rate = GOOD (got a discount)

**NEW (Customer Model) Logic:**
- Customer pays MORE than our current rate = RISK (they may churn when they discover)
- Customer pays LESS than our current rate = OPPORTUNITY (expansion revenue potential)

**Expansion Logic:**
- Customer pays < current rate → Pricing gap expansion opportunity
- Customer pays > current rate → Monitor for churn risk (overpriced)

---

## UI Copy & Terminology Standards

### Screen Titles & Headings
❌ OLD: "Vendor Renewal Calendar"  
✅ NEW: "Customer Renewal Waterfall"

❌ OLD: "Cost Savings Opportunities"  
✅ NEW: "Expansion Revenue Opportunities"

❌ OLD: "Vendor Risk Dashboard"  
✅ NEW: "At-Risk Customer Dashboard"

❌ OLD: "Overpayment Analysis"  
✅ NEW: "Pricing Gap Analysis"

❌ OLD: "Upcoming Vendor Renewals"  
✅ NEW: "Upcoming Customer Renewals"

### Button & Action Labels
❌ OLD: "Reduce Spend"  
✅ NEW: "Protect Revenue"

❌ OLD: "Negotiate Better Terms"  
✅ NEW: "Engage for Renewal"

❌ OLD: "Find Overpayments"  
✅ NEW: "Identify Expansion Opportunities"

### Data Labels
❌ OLD: "Annual Spend: $250K"  
✅ NEW: "Annual Contract Value: $250K"

❌ OLD: "Vendor: Salesforce"  
✅ NEW: "Customer: Acme Corporation"

❌ OLD: "Your vendor contracts"  
✅ NEW: "Your customer contracts"

### Alert Messages
❌ OLD: "Salesforce renews in 30 days - time to negotiate"  
✅ NEW: "Acme Corp renews in 30 days - HIGH CHURN RISK"

❌ OLD: "You're overpaying by $50K"  
✅ NEW: "Customer underpaying by $50K - Expansion opportunity"

---

## Database Field Naming Conventions

**Use These Exact Names (Never Vary):**

✅ CORRECT:
- `customer_name` (not "client_name", "vendor_name", "company_name")
- `annual_contract_value` (not "acv_amount", "contract_value", "annual_spend")
- `churn_risk_score` (not "risk_score", "attrition_risk", "customer_risk")
- `renewal_date` (not "contract_renewal", "renew_by_date", "next_renewal")
- `expansion_opportunity_amount` (not "upsell_value", "growth_opportunity")

**Field Name Format:**
- Use `snake_case` for all database fields
- Use full words, not abbreviations (except standard: acv, arr, mrr, tcv)
- Be explicit: `days_until_renewal` not `days_to_renew`

---

## API Response Naming

**External API Responses (JSON):**

Use `camelCase` for API responses:

```json
{
  "customerId": "uuid",
  "customerName": "Acme Corporation",
  "annualContractValue": 120000,
  "renewalDate": "2026-01-01",
  "churnRiskScore": 78,
  "churnRiskLevel": "HIGH"
}
```

**Internal Database:** Keep `snake_case`

---

## Documentation Standards

When writing any spec, doc, or code comment:

1. **Always specify whose perspective:** 
   - ✅ "Customer can terminate..." 
   - ❌ "Termination allowed..." (by whom?)

2. **Use "customer" consistently:**
   - ✅ "The customer pays us..."
   - ❌ "The client pays us..."
   - ❌ "The vendor pays us..."

3. **Clarify direction of money flow:**
   - ✅ "Customer pays $120K to us annually"
   - ❌ "Annual payment: $120K" (who pays whom?)

4. **Specify whose benefit:**
   - ✅ "Auto-renewal protects our revenue"
   - ❌ "Auto-renewal is good" (good for whom?)

---

## Quick Reference Card

**Print this and keep visible during development:**

```
╔════════════════════════════════════════════════════════════╗
║          CONTRACT IQ - TERMINOLOGY QUICK REF              ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  WHO IS THE "CUSTOMER"?                                   ║
║  → Company that BUYS from US (we are the seller)          ║
║                                                            ║
║  NEVER SAY:                    ALWAYS SAY:                ║
║  ❌ Vendor contract            ✅ Customer contract        ║
║  ❌ Annual spend               ✅ Annual Contract Value    ║
║  ❌ Overpayment               ✅ Pricing gap               ║
║  ❌ Cost savings              ✅ Expansion revenue         ║
║                                                            ║
║  CRITICAL INVERSIONS:                                     ║
║  • Auto-renewal = GOOD (they're committed)                ║
║  • No auto-renewal = BAD (they can leave)                 ║
║  • Termination for convenience = BAD (high churn risk)    ║
║  • Customer paying LESS than current rate = EXPANSION OPP ║
║                                                            ║
║  WHEN CONFUSED, ASK:                                      ║
║  "Does this protect or grow OUR revenue?"                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-11-18 | Initial comprehensive glossary | Factory.ai Spec Team |

---

**END OF TERMINOLOGY GLOSSARY**

✅ This document eliminates ALL ambiguity for Factory.ai implementation.  
✅ Reference this document for EVERY naming decision during development.  
✅ When in doubt, search this document first before asking questions.
