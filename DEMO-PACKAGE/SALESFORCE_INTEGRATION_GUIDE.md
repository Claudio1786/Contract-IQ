# Contract IQ → Salesforce Integration Guide
## Field Mapping & Data Flow Specification

---

## Overview

Contract IQ acts as an **intelligence layer** that enriches Salesforce with contract-derived insights. This document defines the bidirectional data flow between Contract IQ and Salesforce.

**Integration Type:** REST API (Salesforce REST API v58.0)  
**Authentication:** OAuth 2.0 with refresh token  
**Sync Frequency:** Real-time for critical alerts, hourly for batch updates

---

## Data Flow Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Contract IQ   │ ◄─────► │  Salesforce API  │ ◄─────► │   Salesforce    │
│  (AI Analysis)  │         │   (REST/Bulk)    │         │      CRM        │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │                            │
        │ Pull: Account data         │ Push: Contract insights    │
        │ Pull: Renewal dates        │ Push: Risk scores         │
        │ Pull: ARR values          │ Push: Pricing gaps        │
        │                            │ Create: Tasks/Opps        │
```

---

## 1. Data Pull from Salesforce (Contract IQ ← SFDC)

Contract IQ pulls basic account and contract data to enrich its analysis.

### Account Object Fields

| Salesforce Field | API Name | Purpose | Update Frequency |
|------------------|----------|---------|------------------|
| Account Name | `Name` | Match to contract documents | Initial sync only |
| Account ID | `Id` | Primary key for integration | Initial sync only |
| Account Owner | `OwnerId` | Route alerts to correct rep | Daily |
| Account Status | `AccountStatus__c` | Filter active accounts | Daily |
| Industry | `Industry` | Segment analysis | Weekly |
| Number of Employees | `NumberOfEmployees` | Size-based insights | Weekly |

### Opportunity Object Fields

| Salesforce Field | API Name | Purpose | Update Frequency |
|------------------|----------|---------|------------------|
| Opportunity Name | `Name` | Link renewals to opps | Real-time |
| Opportunity ID | `Id` | Create renewal opps | Real-time |
| Close Date | `CloseDate` | Renewal timeline | Real-time |
| Stage | `StageName` | Track renewal progress | Real-time |
| Amount | `Amount` | Validate against contract ARR | Real-time |
| Account ID | `AccountId` | Link to account | Real-time |
| Type | `Type` | Filter for renewals | Real-time |

### Contract Object Fields (Standard Salesforce Contract)

| Salesforce Field | API Name | Purpose | Update Frequency |
|------------------|----------|---------|------------------|
| Contract Number | `ContractNumber` | Match to Contract IQ docs | Initial sync |
| Start Date | `StartDate` | Calculate contract age | Initial sync |
| End Date | `EndDate` | Renewal alert timing | Daily |
| Contract Term | `ContractTerm` | Analyze term patterns | Initial sync |
| Status | `Status` | Filter active contracts | Daily |
| Account ID | `AccountId` | Link to account | Initial sync |

### Custom Contract Fields (If Available)

| Custom Field | API Name | Purpose | Update Frequency |
|--------------|----------|---------|------------------|
| Annual Recurring Revenue | `ARR__c` | Pricing gap calculation | Daily |
| Monthly Recurring Revenue | `MRR__c` | Alternative to ARR | Daily |
| Auto Renewal | `Auto_Renewal__c` | Risk scoring factor | Daily |
| Price Per User | `Price_Per_User__c` | Pricing gap analysis | Daily |
| User Count | `User_Count__c` | Calculate total ARR | Daily |

---

## 2. Data Push to Salesforce (Contract IQ → SFDC)

Contract IQ enriches Salesforce with AI-derived intelligence from contract documents.

### New Custom Fields to Create on Account Object

These fields should be added to the Account object in Salesforce:

| Field Name | API Name | Type | Description |
|------------|----------|------|-------------|
| Contract IQ Risk Score | `ContractIQ_Risk_Score__c` | Number (2 decimal places) | 0-10 risk score for renewal |
| Risk Level | `ContractIQ_Risk_Level__c` | Picklist | Critical, High, Medium, Low |
| Days Until Renewal | `Days_Until_Renewal__c` | Number | Countdown to renewal date |
| Renewal Type | `Renewal_Type__c` | Picklist | Auto-Renewal, Manual, Expired |
| Pricing Gap Amount | `Pricing_Gap_Amount__c` | Currency | ARR recovery opportunity |
| Pricing Gap Percentage | `Pricing_Gap_Percentage__c` | Percent | % below current market rate |
| Current Contract Rate | `Current_Contract_Rate__c` | Currency | $/user/month from contract |
| Market Rate | `Market_Rate__c` | Currency | Current standard rate for tier |
| Last Contract Analysis | `Last_Contract_Analysis__c` | Date/Time | Timestamp of last AI analysis |
| Contract Redline Count | `Contract_Redline_Count__c` | Number | # of non-standard clauses |
| Has Price Escalation | `Has_Price_Escalation__c` | Checkbox | Does contract have escalation? |
| Escalation Rate | `Escalation_Rate__c` | Percent | Annual price increase % |
| Payment Terms | `Payment_Terms__c` | Text | Net 30, Net 60, etc. |
| Notice Period Days | `Notice_Period_Days__c` | Number | Days notice required |
| Contract Complexity Score | `Contract_Complexity_Score__c` | Number | 1-5 complexity rating |
| SLA Tier | `SLA_Tier__c` | Picklist | Standard, Premium, Enterprise |
| Uptime Commitment | `Uptime_Commitment__c` | Percent | Contractual uptime SLA |

### New Custom Fields on Opportunity Object

For renewal opportunities created by Contract IQ:

| Field Name | API Name | Type | Description |
|------------|----------|------|-------------|
| Source System | `Source_System__c` | Text | "Contract IQ" |
| Renewal Insight | `Renewal_Insight__c` | Long Text Area | AI-generated renewal notes |
| Pricing Strategy | `Pricing_Strategy__c` | Picklist | Standard, Bridge, Phased, Hold |
| Competitor Risk | `Competitor_Risk__c` | Picklist | None, Low, Medium, High |
| Expansion Opportunity | `Expansion_Opportunity__c` | Checkbox | Upsell/cross-sell potential |
| Pricing Gap Recovery | `Pricing_Gap_Recovery__c` | Currency | Potential ARR increase |

---

## 3. Integration Workflows

### Workflow 1: Daily Contract Analysis Sync

**Trigger:** Scheduled daily at 6:00 AM (customer timezone)  
**Process:**
1. Contract IQ pulls updated account/opportunity data from SFDC
2. Analyzes all contracts with renewals in next 365 days
3. Updates risk scores, pricing gaps, and renewal insights
4. Pushes updated fields back to SFDC Account object
5. Logs sync summary to Activity object

**SFDC API Calls:**
- `GET /services/data/v58.0/query` (pull accounts)
- `PATCH /services/data/v58.0/sobjects/Account/{Id}` (batch update)

---

### Workflow 2: Real-Time Renewal Alert Creation

**Trigger:** Contract enters 90/60/30 day renewal window  
**Process:**
1. Contract IQ detects approaching renewal date
2. Creates Task in SFDC assigned to Account Owner
3. If no renewal opportunity exists, creates Opportunity
4. Sends notification to CSM via SFDC Chatter

**Task Creation Payload:**
```json
{
  "Subject": "Renewal Alert: {Account Name} - {Days} Days",
  "Description": "Contract IQ Risk Score: {score}/10\nPricing Gap: ${amount}\nRenewal Type: {type}\n\nRecommended Actions:\n- {action1}\n- {action2}",
  "ActivityDate": "{renewal_date - 90 days}",
  "Priority": "High",
  "Status": "Not Started",
  "WhoId": "{Account Owner Id}",
  "WhatId": "{Account Id}",
  "Type": "Contract Renewal"
}
```

**Opportunity Creation Payload:**
```json
{
  "Name": "{Account Name} - Renewal {Year}",
  "AccountId": "{Account Id}",
  "Type": "Renewal",
  "Amount": "{Current ARR + Pricing Gap}",
  "CloseDate": "{Contract End Date}",
  "StageName": "Qualification",
  "Source_System__c": "Contract IQ",
  "Renewal_Insight__c": "{AI-generated insight}",
  "Pricing_Gap_Recovery__c": "{Pricing gap amount}"
}
```

---

### Workflow 3: Critical Risk Alert (Real-Time)

**Trigger:** Risk score ≥ 8/10 or contract expires in <30 days with manual renewal  
**Process:**
1. Contract IQ flags critical risk condition
2. Creates high-priority Task for Account Owner
3. Posts to Chatter on Account record
4. Sends email alert to Account Owner + CSM Manager
5. Updates Account risk fields immediately

**Chatter Post Template:**
```
🚨 CRITICAL RENEWAL ALERT
Account: {Account Name}
Risk Score: {score}/10
Expires: {days} days ({date})

Key Issues:
• {risk_factor_1}
• {risk_factor_2}
• {risk_factor_3}

Recommended Actions:
{action_list}

Generated by Contract IQ
```

---

### Workflow 4: Pricing Gap Report (Weekly)

**Trigger:** Every Monday at 8:00 AM  
**Process:**
1. Contract IQ aggregates all pricing gaps across portfolio
2. Creates SFDC Report with sortable fields
3. Updates custom dashboard with visualizations
4. Sends executive summary email to Revenue Ops

**Dashboard Metrics:**
- Total ARR at Risk
- Total Pricing Gap Recovery Opportunity
- Risk Distribution (Critical/High/Medium/Low)
- Renewal Pipeline by Quarter
- Top 10 Accounts by Recovery Opportunity

---

## 4. Field Mapping Examples

### Example 1: High-Risk Legacy Account

**Contract:** Acme Corporation (from sample contracts)

**Salesforce Updates:**
```javascript
{
  "Id": "001Dn00000ABC123",
  "ContractIQ_Risk_Score__c": 8.0,
  "ContractIQ_Risk_Level__c": "High",
  "Days_Until_Renewal__c": 58,
  "Renewal_Type__c": "Manual",
  "Pricing_Gap_Amount__c": 68400.00,
  "Pricing_Gap_Percentage__c": 45.5,
  "Current_Contract_Rate__c": 200.00,
  "Market_Rate__c": 291.00,
  "Last_Contract_Analysis__c": "2025-11-17T10:30:00Z",
  "Contract_Redline_Count__c": 2,
  "Has_Price_Escalation__c": false,
  "Payment_Terms__c": "Net 60",
  "Notice_Period_Days__c": 90,
  "SLA_Tier__c": "Standard",
  "Uptime_Commitment__c": 99.5
}
```

**Task Created:**
- Subject: "URGENT: Acme Corp Renewal - 58 Days"
- Priority: High
- Due Date: Contract End Date - 30 days
- Description: Full risk analysis + recommended actions

---

### Example 2: Healthy Auto-Renewal Account

**Contract:** TechScale Inc.

**Salesforce Updates:**
```javascript
{
  "Id": "001Dn00000DEF456",
  "ContractIQ_Risk_Score__c": 2.5,
  "ContractIQ_Risk_Level__c": "Low",
  "Days_Until_Renewal__c": 431,
  "Renewal_Type__c": "Auto-Renewal",
  "Pricing_Gap_Amount__c": 0.00,
  "Pricing_Gap_Percentage__c": 0.0,
  "Current_Contract_Rate__c": 291.00,
  "Market_Rate__c": 291.00,
  "Last_Contract_Analysis__c": "2025-11-17T10:30:00Z",
  "Contract_Redline_Count__c": 0,
  "Has_Price_Escalation__c": true,
  "Escalation_Rate__c": 5.0,
  "Payment_Terms__c": "Net 30",
  "Notice_Period_Days__c": 60,
  "SLA_Tier__c": "Premium",
  "Uptime_Commitment__c": 99.9
}
```

**No Task Created** (low risk, auto-renewal, current pricing)

---

## 5. API Authentication & Security

### OAuth 2.0 Setup

**Step 1: Create Connected App in Salesforce**
- App Name: "Contract IQ"
- Callback URL: `https://contractiq.ai/auth/callback`
- OAuth Scopes:
  - `api` - Access Salesforce APIs
  - `refresh_token` - Maintain persistent access
  - `offline_access` - Refresh tokens

**Step 2: Grant Permissions**
- System Administrator profile
- Custom Permission Set:
  - Read: Account, Opportunity, Contract, Task
  - Create: Task, Opportunity, Chatter Post
  - Edit: Account (custom fields only), Opportunity

**Step 3: Token Management**
- Store encrypted refresh token in Contract IQ
- Rotate access token every 24 hours
- Monitor API limits (5,000 calls/day for Enterprise)

---

## 6. Error Handling & Logging

### API Error Codes

| Error | SFDC Code | Contract IQ Response |
|-------|-----------|----------------------|
| Invalid Auth | `401` | Refresh token and retry |
| Rate Limit | `REQUEST_LIMIT_EXCEEDED` | Queue for next hour sync |
| Field Not Found | `INVALID_FIELD` | Log warning, skip field |
| Duplicate Record | `DUPLICATE_VALUE` | Update existing record |

### Logging Strategy

**Log to SFDC Activity Object:**
- Integration success/failure
- Records updated count
- API response time
- Error messages

**Log to Contract IQ:**
- Full API request/response
- Field-level update tracking
- Sync performance metrics

---

## 7. Demo Configuration

### Mock Salesforce Data for Demo

Create these sample Account records in SFDC:

```csv
Name, ARR__c, User_Count__c, Price_Per_User__c, Auto_Renewal__c, Contract_End_Date__c
Acme Corporation, 180000, 75, 200, FALSE, 2025-01-14
TechScale Inc., 420000, 120, 291, TRUE, 2026-01-31
GrowthLabs LLC, 96000, 35, 229, TRUE, 2026-03-09
DataStream Solutions, 144000, 55, 218, FALSE, 2026-05-31
Legacy Systems Intl, 324000, 135, 200, FALSE, 2025-11-30
```

### Demo Dashboard Components

**Salesforce Dashboard: "Contract IQ Intelligence"**

1. **Renewal Risk Heatmap** (Matrix Chart)
   - X-axis: Days Until Renewal
   - Y-axis: Risk Score
   - Size: ARR
   - Color: Risk Level

2. **Pricing Gap Leaderboard** (Table)
   - Columns: Account Name, Current Rate, Market Rate, Gap $, Gap %
   - Sort by Gap $ DESC

3. **Revenue at Risk** (Gauge Chart)
   - Total ARR with Risk Score > 5
   - Target: <15% of total portfolio

4. **Renewal Pipeline** (Funnel Chart)
   - Stage: Qualification → Negotiation → Closed Won
   - Filter: Renewal opportunities only

---

## 8. Testing Checklist

### Pre-Demo Verification

- [ ] Contract IQ can authenticate to SFDC sandbox
- [ ] All custom fields created on Account/Opportunity
- [ ] Sample accounts populated with baseline data
- [ ] Dashboard installed and shared with demo users
- [ ] Tasks/Opportunities create successfully
- [ ] Chatter posts appear on Account records
- [ ] Risk scores update in real-time
- [ ] Pricing gap calculations match manually calculated values

### Demo Flow Test

1. **Initial Sync**
   - Run full account sync
   - Verify 10 accounts updated with risk scores

2. **Critical Alert**
   - Manually trigger alert for Legacy Systems
   - Verify Task created + Chatter post + email sent

3. **Pricing Gap Analysis**
   - Open pricing gap report
   - Show FinTech Ventures as top opportunity
   - Drill into account to see contract details

4. **Renewal Opportunity Creation**
   - Show Contract IQ auto-created renewal opp
   - Verify Amount = Current ARR + Pricing Gap

---

## 9. Post-Demo: Actual Integration Setup

When ready to connect to real SFDC instance:

**Required from Customer:**
1. Salesforce Edition (Enterprise, Unlimited, etc.)
2. System Administrator credentials
3. Production vs Sandbox preference
4. Custom object/field naming conventions
5. Existing contract management process
6. CSM team structure (for task routing)

**Implementation Timeline:**
- Week 1: Connected App setup + OAuth config
- Week 2: Field mapping + custom field creation
- Week 3: Workflow configuration + testing
- Week 4: Dashboard build + user training

---

## Appendix: Sample API Calls

### Pull Accounts with Renewal Data
```bash
curl https://yourInstance.salesforce.com/services/data/v58.0/query \
  -H "Authorization: Bearer {access_token}" \
  -G \
  --data-urlencode "q=SELECT Id, Name, ARR__c, User_Count__c, Price_Per_User__c, Auto_Renewal__c, Contract_End_Date__c FROM Account WHERE Contract_End_Date__c <= NEXT_N_DAYS:365 AND Contract_End_Date__c >= TODAY"
```

### Update Account with Risk Score
```bash
curl https://yourInstance.salesforce.com/services/data/v58.0/sobjects/Account/001Dn00000ABC123 \
  -X PATCH \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "ContractIQ_Risk_Score__c": 8.0,
    "ContractIQ_Risk_Level__c": "High",
    "Days_Until_Renewal__c": 58,
    "Pricing_Gap_Amount__c": 68400.00
  }'
```

### Create Renewal Task
```bash
curl https://yourInstance.salesforce.com/services/data/v58.0/sobjects/Task \
  -X POST \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "Subject": "Renewal Alert: Acme Corp - 58 Days",
    "Priority": "High",
    "Status": "Not Started",
    "ActivityDate": "2025-01-14",
    "WhatId": "001Dn00000ABC123"
  }'
```

---

**Document Version:** 1.0  
**Last Updated:** November 17, 2025  
**Author:** Contract IQ Integration Team
