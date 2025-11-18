# 📊 Complete Data Schema Specification

**Document:** 02-DATA-SCHEMA.md  
**Version:** 1.0  
**Status:** ✅ COMPLETE - Ready for Implementation  
**Dependencies:** 01-TERMINOLOGY-GLOSSARY.md

---

## 🎯 Overview

This document provides the **complete database schema** for Contract IQ's customer revenue intelligence platform. Every table, field, relationship, and constraint is explicitly defined with:

- Exact field names (matching terminology glossary)
- Data types and constraints
- Relationships and foreign keys
- Indexes for performance
- **10 realistic sample customer records** showing actual data

**Critical Rule:** Customer = company buying FROM us (we are the seller)

---

## 📐 Database Architecture

**Database Type:** PostgreSQL 14+  
**ORM:** Prisma (recommended)  
**Total Tables:** 15  
**Sample Data:** 10 customer contracts with related records

### Schema Organization

```
CORE ENTITIES (5 tables)
├── organizations          # Multi-tenant support
├── users                  # Team members
├── customers              # Companies that buy FROM us
├── customer_contracts     # Main table - contracts we SOLD
└── churn_risk_factors     # Risk breakdown per contract

ACTIVITY & HISTORY (4 tables)
├── renewal_activities     # Renewal timeline events
├── expansion_history      # Upsells & price increases
├── alerts                 # Alert history & status
└── uploaded_documents     # Contract PDFs & files

INTEGRATIONS (3 tables)
├── integrations           # Connection status
├── salesforce_sync_log    # Salesforce sync history
└── webhook_events         # Inbound webhook queue

ANALYTICS (3 tables)
├── contract_snapshots     # Daily snapshots for trend analysis
├── revenue_forecasts      # Projected ARR calculations
└── expansion_opportunities # Detected upsell opportunities
```

---

## 🗄️ Table Definitions

### 1. organizations

**Purpose:** Multi-tenant support (each company using Contract IQ is an organization)

```sql
CREATE TABLE organizations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(255) NOT NULL,
  subdomain             VARCHAR(100) UNIQUE NOT NULL,
  plan                  VARCHAR(50) NOT NULL DEFAULT 'trial', -- trial, starter, professional, enterprise
  status                VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, cancelled
  max_users             INTEGER NOT NULL DEFAULT 5,
  max_contracts         INTEGER NOT NULL DEFAULT 100,
  
  -- Branding
  logo_url              TEXT,
  primary_color         VARCHAR(7), -- Hex color
  
  -- Settings
  timezone              VARCHAR(100) DEFAULT 'America/New_York',
  currency              VARCHAR(3) DEFAULT 'USD',
  date_format           VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  
  -- Billing
  stripe_customer_id    VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  billing_email         VARCHAR(255),
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  cancelled_at          TIMESTAMP
);

CREATE INDEX idx_org_subdomain ON organizations(subdomain);
CREATE INDEX idx_org_status ON organizations(status);
```

**Sample Data:** See Section "Complete Sample Data" below

---

### 2. users

**Purpose:** Team members who use Contract IQ (RevOps, CS Ops, etc.)

```sql
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Identity
  email                 VARCHAR(255) NOT NULL UNIQUE,
  name                  VARCHAR(255) NOT NULL,
  avatar_url            TEXT,
  
  -- Auth
  password_hash         TEXT, -- For email/password auth
  google_id             VARCHAR(255), -- For Google OAuth
  
  -- Role & Permissions
  role                  VARCHAR(50) NOT NULL DEFAULT 'member', -- admin, manager, member, viewer
  permissions           JSONB DEFAULT '[]', -- Array of permission strings
  
  -- Status
  status                VARCHAR(50) NOT NULL DEFAULT 'active', -- active, invited, suspended
  last_login_at         TIMESTAMP,
  
  -- Preferences
  notification_email    BOOLEAN DEFAULT true,
  notification_slack    BOOLEAN DEFAULT false,
  slack_user_id         VARCHAR(255),
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

---

### 3. customers

**Purpose:** Companies that buy FROM us (they are OUR customers)

```sql
CREATE TABLE customers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Company Info
  customer_name         VARCHAR(255) NOT NULL, -- "Acme Corp", "Globex Industries"
  domain                VARCHAR(255), -- "acme.com"
  industry              VARCHAR(100), -- "Healthcare", "Financial Services"
  segment               VARCHAR(50), -- "Enterprise", "Mid-Market", "SMB"
  
  -- Size Indicators
  company_size          VARCHAR(50), -- "1-50", "51-200", "201-1000", "1000+"
  annual_revenue        DECIMAL(15,2), -- Their company revenue (not what they pay us)
  
  -- Location
  country               VARCHAR(2), -- ISO country code
  state                 VARCHAR(100),
  city                  VARCHAR(100),
  
  -- Relationships
  csm_user_id           UUID REFERENCES users(id), -- Customer Success Manager assigned
  account_owner_user_id UUID REFERENCES users(id), -- Account Executive who sold
  
  -- External IDs
  salesforce_account_id VARCHAR(255),
  gainsight_account_id  VARCHAR(255),
  stripe_customer_id    VARCHAR(255),
  
  -- Metadata
  logo_url              TEXT,
  website_url           TEXT,
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_org ON customers(organization_id);
CREATE INDEX idx_customers_name ON customers(customer_name);
CREATE INDEX idx_customers_segment ON customers(segment);
CREATE INDEX idx_customers_csm ON customers(csm_user_id);
CREATE INDEX idx_customers_salesforce ON customers(salesforce_account_id);
```

---

### 4. customer_contracts ⭐ MAIN TABLE

**Purpose:** Contracts we SOLD to our customers (the heart of the system)

```sql
CREATE TABLE customer_contracts (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id           UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id               UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Contract Identity
  contract_number           VARCHAR(100), -- "CNT-2024-001"
  contract_name             VARCHAR(255), -- "Acme Corp - Enterprise Plan"
  status                    VARCHAR(50) NOT NULL DEFAULT 'active', -- active, renewed, churned, expired
  
  -- Financial Terms
  annual_contract_value     DECIMAL(12,2) NOT NULL, -- ACV: What they pay per year
  total_contract_value      DECIMAL(12,2), -- TCV: Total over contract term
  billing_frequency         VARCHAR(50), -- annual, quarterly, monthly
  payment_terms             VARCHAR(100), -- "Net 30", "Net 60"
  currency                  VARCHAR(3) DEFAULT 'USD',
  
  -- Contract Term
  contract_start_date       DATE NOT NULL,
  contract_end_date         DATE NOT NULL,
  renewal_date              DATE NOT NULL, -- Key field for churn risk!
  contract_term_months      INTEGER NOT NULL, -- 12, 24, 36
  
  -- Renewal Terms
  auto_renewal              BOOLEAN NOT NULL DEFAULT false, -- KEY: false = HIGH RISK
  auto_renewal_notice_days  INTEGER, -- Days notice required to cancel
  termination_rights        VARCHAR(100), -- 'for_convenience', 'for_cause_only', 'none'
  termination_notice_days   INTEGER, -- Days notice required to terminate
  
  -- Product/Service Details
  product_tier              VARCHAR(100), -- "Starter", "Professional", "Enterprise"
  seats_purchased           INTEGER, -- Number of user licenses
  seats_utilized            INTEGER, -- Actual usage
  seat_utilization_pct      DECIMAL(5,2), -- Auto-calculated: utilized/purchased * 100
  
  -- Usage Metrics
  monthly_active_users      INTEGER,
  feature_adoption_score    DECIMAL(5,2), -- 0-100 score
  average_logins_per_month  INTEGER,
  last_login_date           DATE,
  
  -- Relationship Health
  health_score              DECIMAL(5,2), -- 0-100 from Gainsight/ChurnZero
  nps_score                 INTEGER, -- 0-10 Net Promoter Score
  last_qbr_date             DATE, -- Last Quarterly Business Review
  days_since_last_qbr       INTEGER, -- Auto-calculated
  executive_sponsor         VARCHAR(255), -- Name of exec champion
  csm_touchpoints_30d       INTEGER, -- CSM interactions last 30 days
  
  -- Payment Status
  payment_status            VARCHAR(50) DEFAULT 'current', -- current, past_due, failed
  days_past_due             INTEGER DEFAULT 0,
  last_payment_date         DATE,
  
  -- Churn Risk (Auto-Calculated)
  churn_risk_score          INTEGER, -- 0-100 calculated by algorithm
  churn_risk_level          VARCHAR(20), -- LOW, MEDIUM, HIGH
  churn_risk_last_calc      TIMESTAMP, -- When score was last calculated
  
  -- Expansion Opportunity
  expansion_opportunity_value DECIMAL(12,2), -- Potential additional ARR
  expansion_likelihood        VARCHAR(20), -- LOW, MEDIUM, HIGH
  pricing_gap_pct             DECIMAL(5,2), -- % below current rate card
  
  -- Document References
  signed_contract_url       TEXT, -- Link to signed PDF
  docusign_envelope_id      VARCHAR(255),
  
  -- External IDs
  salesforce_opportunity_id VARCHAR(255),
  stripe_subscription_id    VARCHAR(255),
  gainsight_relationship_id VARCHAR(255),
  
  -- Metadata
  notes                     TEXT,
  tags                      JSONB DEFAULT '[]', -- ["at-risk", "expansion-ready"]
  
  created_at                TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by_user_id        UUID REFERENCES users(id),
  updated_by_user_id        UUID REFERENCES users(id)
);

-- Critical Indexes for Performance
CREATE INDEX idx_contracts_org ON customer_contracts(organization_id);
CREATE INDEX idx_contracts_customer ON customer_contracts(customer_id);
CREATE INDEX idx_contracts_renewal_date ON customer_contracts(renewal_date);
CREATE INDEX idx_contracts_churn_risk ON customer_contracts(churn_risk_level);
CREATE INDEX idx_contracts_status ON customer_contracts(status);
CREATE INDEX idx_contracts_renewal_risk ON customer_contracts(renewal_date, churn_risk_level); -- Composite
CREATE INDEX idx_contracts_salesforce ON customer_contracts(salesforce_opportunity_id);
CREATE INDEX idx_contracts_stripe ON customer_contracts(stripe_subscription_id);
```

**Key Fields Explained:**

| Field | Why It Matters | Good vs Bad |
|-------|----------------|-------------|
| `auto_renewal` | FALSE = customer can walk away easily | TRUE = GOOD (locked in) |
| `termination_rights` | 'for_convenience' = HIGH RISK | 'for_cause_only' = LOW RISK |
| `seat_utilization_pct` | <60% = not getting value = churn risk | >80% = engaged |
| `churn_risk_score` | 0-100 weighted calculation | 0-40=LOW, 41-70=MED, 71-100=HIGH |
| `expansion_opportunity_value` | Potential upsell ARR | Used for pipeline forecasting |

---

### 5. churn_risk_factors

**Purpose:** Breakdown of WHY a contract has its churn risk score

```sql
CREATE TABLE churn_risk_factors (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_contract_id        UUID NOT NULL REFERENCES customer_contracts(id) ON DELETE CASCADE,
  
  -- Risk Breakdown (all 0-100 scale)
  contract_risk_score         INTEGER, -- 40% weight: renewal terms, auto-renewal
  usage_risk_score            INTEGER, -- 30% weight: seat util, feature adoption
  relationship_risk_score     INTEGER, -- 20% weight: QBRs, NPS, CSM touch
  financial_risk_score        INTEGER, -- 10% weight: payment issues
  
  -- Detailed Factors (for UI display)
  factors                     JSONB, -- Array of {factor: "No auto-renewal", points: 15, category: "contract"}
  
  -- Recommendations
  recommendations             JSONB, -- Array of action items for CSM
  
  calculated_at               TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_factors_contract ON churn_risk_factors(customer_contract_id);
```

**Sample `factors` JSONB:**
```json
[
  {"factor": "No auto-renewal clause", "points": 15, "category": "contract", "severity": "high"},
  {"factor": "Termination allowed for convenience", "points": 10, "category": "contract", "severity": "high"},
  {"factor": "Renewal in 28 days", "points": 12, "category": "contract", "severity": "critical"},
  {"factor": "Seat utilization only 55%", "points": 10, "category": "usage", "severity": "medium"},
  {"factor": "No QBR in 145 days", "points": 8, "category": "relationship", "severity": "high"}
]
```

**Sample `recommendations` JSONB:**
```json
[
  {"action": "Schedule QBR immediately", "priority": "critical", "owner": "CSM"},
  {"action": "Review seat optimization opportunities", "priority": "high", "owner": "CSM"},
  {"action": "Negotiate auto-renewal in next contract", "priority": "medium", "owner": "Account Manager"}
]
```

---

### 6. renewal_activities

**Purpose:** Timeline of actions related to contract renewal

```sql
CREATE TABLE renewal_activities (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_contract_id  UUID NOT NULL REFERENCES customer_contracts(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_type         VARCHAR(100) NOT NULL, -- 'qbr_scheduled', 'pricing_sent', 'contract_signed', 'renewal_at_risk'
  activity_date         TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Content
  title                 VARCHAR(255) NOT NULL,
  description           TEXT,
  outcome               VARCHAR(100), -- 'completed', 'scheduled', 'cancelled'
  
  -- People
  performed_by_user_id  UUID REFERENCES users(id),
  attendees             JSONB, -- Array of participant names/emails
  
  -- Attachments
  attachment_url        TEXT,
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_renewal_activities_contract ON renewal_activities(customer_contract_id);
CREATE INDEX idx_renewal_activities_date ON renewal_activities(activity_date);
```

---

### 7. expansion_history

**Purpose:** Track upsells, seat additions, price increases over time

```sql
CREATE TABLE expansion_history (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_contract_id  UUID NOT NULL REFERENCES customer_contracts(id) ON DELETE CASCADE,
  customer_id           UUID NOT NULL REFERENCES customers(id),
  
  -- Expansion Details
  expansion_type        VARCHAR(100) NOT NULL, -- 'seat_expansion', 'tier_upgrade', 'add_on_purchase', 'price_increase'
  expansion_date        DATE NOT NULL,
  
  -- Financial Impact
  previous_arr          DECIMAL(12,2) NOT NULL,
  new_arr               DECIMAL(12,2) NOT NULL,
  arr_increase          DECIMAL(12,2) NOT NULL, -- Auto-calculated: new_arr - previous_arr
  arr_increase_pct      DECIMAL(5,2), -- % increase
  
  -- Details
  description           TEXT, -- "Added 25 seats", "Upgraded to Enterprise tier"
  reason                VARCHAR(255), -- "Team growth", "New department onboarding"
  
  -- People
  closed_by_user_id     UUID REFERENCES users(id),
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expansion_contract ON expansion_history(customer_contract_id);
CREATE INDEX idx_expansion_customer ON expansion_history(customer_id);
CREATE INDEX idx_expansion_date ON expansion_history(expansion_date);
```

---

### 8. alerts

**Purpose:** Alert history and current alert status

```sql
CREATE TABLE alerts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_contract_id  UUID REFERENCES customer_contracts(id) ON DELETE CASCADE,
  customer_id           UUID REFERENCES customers(id),
  
  -- Alert Classification
  alert_type            VARCHAR(100) NOT NULL, -- 'churn_risk_critical', 'payment_overdue', 'qbr_overdue'
  severity              VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
  
  -- Content
  title                 VARCHAR(255) NOT NULL,
  message               TEXT NOT NULL,
  recommended_actions   JSONB, -- Array of action items
  
  -- Status
  status                VARCHAR(50) NOT NULL DEFAULT 'active', -- active, acknowledged, resolved, snoozed
  acknowledged_at       TIMESTAMP,
  acknowledged_by_user_id UUID REFERENCES users(id),
  resolved_at           TIMESTAMP,
  resolved_by_user_id   UUID REFERENCES users(id),
  snoozed_until         TIMESTAMP,
  
  -- Notification Status
  email_sent            BOOLEAN DEFAULT false,
  email_sent_at         TIMESTAMP,
  slack_sent            BOOLEAN DEFAULT false,
  slack_sent_at         TIMESTAMP,
  slack_message_ts      VARCHAR(255), -- For threading replies
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_org ON alerts(organization_id);
CREATE INDEX idx_alerts_contract ON alerts(customer_contract_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
```

---

### 9. uploaded_documents

**Purpose:** Store references to uploaded contract PDFs and related files

```sql
CREATE TABLE uploaded_documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  customer_contract_id  UUID REFERENCES customer_contracts(id) ON DELETE SET NULL,
  
  -- File Details
  filename              VARCHAR(255) NOT NULL,
  file_size_bytes       BIGINT NOT NULL,
  mime_type             VARCHAR(100) NOT NULL,
  storage_url           TEXT NOT NULL, -- S3, GCS, etc.
  
  -- Document Type
  document_type         VARCHAR(100), -- 'signed_contract', 'amendment', 'sow', 'other'
  
  -- AI Extraction Status
  extraction_status     VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed, manual_review
  extraction_confidence DECIMAL(5,2), -- 0-100 confidence score
  extracted_data        JSONB, -- Extracted fields from AI
  extraction_error      TEXT, -- Error message if failed
  
  -- Processing
  processed_at          TIMESTAMP,
  reviewed_by_user_id   UUID REFERENCES users(id),
  reviewed_at           TIMESTAMP,
  
  -- Metadata
  uploaded_by_user_id   UUID NOT NULL REFERENCES users(id),
  uploaded_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_org ON uploaded_documents(organization_id);
CREATE INDEX idx_documents_contract ON uploaded_documents(customer_contract_id);
CREATE INDEX idx_documents_status ON uploaded_documents(extraction_status);
CREATE INDEX idx_documents_uploaded_by ON uploaded_documents(uploaded_by_user_id);
```

---

### 10. integrations

**Purpose:** Track connection status for external systems

```sql
CREATE TABLE integrations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Integration Details
  integration_type      VARCHAR(100) NOT NULL, -- 'salesforce', 'gainsight', 'stripe', 'docusign', 'slack'
  status                VARCHAR(50) NOT NULL DEFAULT 'disconnected', -- connected, disconnected, error, syncing
  
  -- Connection Info
  connected_at          TIMESTAMP,
  connected_by_user_id  UUID REFERENCES users(id),
  last_sync_at          TIMESTAMP,
  last_sync_status      VARCHAR(50), -- success, failed, partial
  next_sync_at          TIMESTAMP,
  
  -- Credentials (encrypted)
  credentials           JSONB, -- Encrypted tokens, API keys
  
  -- Sync Settings
  sync_frequency        VARCHAR(50) DEFAULT 'hourly', -- realtime, hourly, daily, manual
  sync_enabled          BOOLEAN DEFAULT true,
  
  -- Stats
  total_records_synced  INTEGER DEFAULT 0,
  last_error_message    TEXT,
  error_count_24h       INTEGER DEFAULT 0,
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_integrations_org ON integrations(organization_id);
CREATE INDEX idx_integrations_type ON integrations(integration_type);
CREATE INDEX idx_integrations_status ON integrations(status);
```

---

### 11. salesforce_sync_log

**Purpose:** Detailed sync history for Salesforce integration

```sql
CREATE TABLE salesforce_sync_log (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id           UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Sync Details
  sync_started_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  sync_completed_at         TIMESTAMP,
  sync_status               VARCHAR(50) NOT NULL, -- running, completed, failed
  
  -- Stats
  opportunities_processed   INTEGER DEFAULT 0,
  contracts_created         INTEGER DEFAULT 0,
  contracts_updated         INTEGER DEFAULT 0,
  errors_count              INTEGER DEFAULT 0,
  
  -- Details
  error_details             JSONB, -- Array of error objects
  
  -- Trigger
  triggered_by              VARCHAR(50), -- scheduled, manual, webhook
  triggered_by_user_id      UUID REFERENCES users(id)
);

CREATE INDEX idx_sf_sync_org ON salesforce_sync_log(organization_id);
CREATE INDEX idx_sf_sync_started ON salesforce_sync_log(sync_started_at);
```

---

### 12. webhook_events

**Purpose:** Queue for processing inbound webhooks (Stripe, DocuSign, etc.)

```sql
CREATE TABLE webhook_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Event Details
  source                VARCHAR(100) NOT NULL, -- 'stripe', 'docusign', 'gainsight'
  event_type            VARCHAR(100) NOT NULL, -- 'charge.failed', 'envelope.completed'
  event_id              VARCHAR(255), -- External event ID for deduplication
  
  -- Payload
  payload               JSONB NOT NULL, -- Full webhook payload
  
  -- Processing Status
  status                VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  processed_at          TIMESTAMP,
  error_message         TEXT,
  retry_count           INTEGER DEFAULT 0,
  
  received_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_org ON webhook_events(organization_id);
CREATE INDEX idx_webhooks_status ON webhook_events(status);
CREATE INDEX idx_webhooks_event_id ON webhook_events(event_id);
CREATE INDEX idx_webhooks_received ON webhook_events(received_at);
```

---

### 13. contract_snapshots

**Purpose:** Daily snapshots for trend analysis (ARR over time, risk changes)

```sql
CREATE TABLE contract_snapshots (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_contract_id  UUID NOT NULL REFERENCES customer_contracts(id) ON DELETE CASCADE,
  
  -- Snapshot Date
  snapshot_date         DATE NOT NULL,
  
  -- Financial Snapshot
  arr_snapshot          DECIMAL(12,2),
  mrr_snapshot          DECIMAL(12,2),
  
  -- Risk Snapshot
  churn_risk_score      INTEGER,
  churn_risk_level      VARCHAR(20),
  
  -- Usage Snapshot
  seat_utilization_pct  DECIMAL(5,2),
  health_score          DECIMAL(5,2),
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_snapshots_contract ON contract_snapshots(customer_contract_id);
CREATE INDEX idx_snapshots_date ON contract_snapshots(snapshot_date);
CREATE UNIQUE INDEX idx_snapshots_contract_date ON contract_snapshots(customer_contract_id, snapshot_date);
```

---

### 14. revenue_forecasts

**Purpose:** Projected ARR calculations for financial planning

```sql
CREATE TABLE revenue_forecasts (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id           UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Forecast Period
  forecast_month            DATE NOT NULL, -- First day of month
  
  -- Projected Revenue
  projected_arr             DECIMAL(15,2),
  projected_renewals_arr    DECIMAL(15,2),
  projected_churn_arr       DECIMAL(15,2),
  projected_expansion_arr   DECIMAL(15,2),
  
  -- Confidence
  confidence_level          VARCHAR(20), -- HIGH, MEDIUM, LOW
  
  -- Breakdown by Risk
  low_risk_arr              DECIMAL(15,2),
  medium_risk_arr           DECIMAL(15,2),
  high_risk_arr             DECIMAL(15,2),
  
  calculated_at             TIMESTAMP NOT NULL DEFAULT NOW(),
  calculated_by             VARCHAR(100) -- 'system', 'manual_override'
);

CREATE INDEX idx_forecast_org ON revenue_forecasts(organization_id);
CREATE INDEX idx_forecast_month ON revenue_forecasts(forecast_month);
CREATE UNIQUE INDEX idx_forecast_org_month ON revenue_forecasts(organization_id, forecast_month);
```

---

### 15. expansion_opportunities

**Purpose:** Detected upsell/expansion opportunities

```sql
CREATE TABLE expansion_opportunities (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_contract_id  UUID NOT NULL REFERENCES customer_contracts(id) ON DELETE CASCADE,
  customer_id           UUID NOT NULL REFERENCES customers(id),
  organization_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Opportunity Details
  opportunity_type      VARCHAR(100) NOT NULL, -- 'seat_expansion', 'tier_upgrade', 'pricing_gap_correction'
  estimated_arr_increase DECIMAL(12,2) NOT NULL,
  likelihood            VARCHAR(20), -- LOW, MEDIUM, HIGH
  
  -- Reasoning
  detected_reason       TEXT, -- "Customer is 40% below current rate card pricing"
  supporting_data       JSONB, -- Evidence for the opportunity
  
  -- Status
  status                VARCHAR(50) DEFAULT 'identified', -- identified, presented, negotiating, closed_won, closed_lost
  assigned_to_user_id   UUID REFERENCES users(id),
  
  -- Tracking
  presented_date        DATE,
  closed_date           DATE,
  actual_arr_increase   DECIMAL(12,2), -- Actual result if closed_won
  
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expansion_contract ON expansion_opportunities(customer_contract_id);
CREATE INDEX idx_expansion_customer ON expansion_opportunities(customer_id);
CREATE INDEX idx_expansion_org ON expansion_opportunities(organization_id);
CREATE INDEX idx_expansion_status ON expansion_opportunities(status);
CREATE INDEX idx_expansion_likelihood ON expansion_opportunities(likelihood);
```

---

## 📝 Complete Sample Data: 10 Customer Contracts

### Organization & Users

```sql
-- Sample Organization
INSERT INTO organizations (id, name, subdomain, plan, status) VALUES
('org-001', 'Demo Company Inc', 'demo', 'professional', 'active');

-- Sample Users
INSERT INTO users (id, organization_id, email, name, role) VALUES
('user-001', 'org-001', 'sarah.chen@demo.com', 'Sarah Chen', 'admin'),
('user-002', 'org-001', 'mike.johnson@demo.com', 'Mike Johnson', 'manager'),
('user-003', 'org-001', 'amy.rodriguez@demo.com', 'Amy Rodriguez', 'member');
```

---

### 10 Sample Customers with Complete Contract Data

#### 1. Acme Corporation - HIGH RISK 🔴

```sql
-- Customer
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-001', 'org-001', 'Acme Corporation', 'acme.com', 'Manufacturing', 'Enterprise', 'user-002');

-- Contract
INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights, termination_notice_days,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr,
  payment_status, days_past_due,
  churn_risk_score, churn_risk_level
) VALUES (
  'contract-001', 'org-001', 'cust-001',
  'CNT-2023-001', 'Acme Corp - Enterprise Plan', 'active',
  120000.00, 'annual',
  '2023-03-15', '2025-03-14', '2025-03-15', 24,
  false, 'for_convenience', 60, -- ⚠️ HIGH RISK: No auto-renewal, can leave anytime
  50, 28, 56.00, -- ⚠️ LOW utilization
  45.00, 5, '2024-07-10', 131, -- ⚠️ Poor health, detractor NPS, no recent QBR
  'current', 0,
  82, 'HIGH' -- 🔴 CRITICAL CHURN RISK
);

-- Risk Factors
INSERT INTO churn_risk_factors (
  customer_contract_id, contract_risk_score, usage_risk_score, 
  relationship_risk_score, financial_risk_score,
  factors, recommendations
) VALUES (
  'contract-001', 40, 25, 17, 0,
  '[
    {"factor": "No auto-renewal", "points": 15, "category": "contract", "severity": "high"},
    {"factor": "Termination for convenience allowed", "points": 10, "category": "contract", "severity": "high"},
    {"factor": "Renewal in 118 days", "points": 15, "category": "contract", "severity": "critical"},
    {"factor": "Seat utilization only 56%", "points": 10, "category": "usage", "severity": "medium"},
    {"factor": "Low feature adoption 42%", "points": 10, "category": "usage", "severity": "medium"},
    {"factor": "No QBR in 131 days", "points": 8, "category": "relationship", "severity": "high"},
    {"factor": "Detractor NPS score of 5", "points": 3, "category": "relationship", "severity": "medium"},
    {"factor": "No executive sponsor", "points": 6, "category": "relationship", "severity": "high"}
  ]'::jsonb,
  '[
    {"action": "Emergency QBR within 7 days", "priority": "critical", "owner": "CSM"},
    {"action": "Executive alignment meeting", "priority": "critical", "owner": "VP Customer Success"},
    {"action": "Review seat optimization", "priority": "high", "owner": "CSM"},
    {"action": "Product training session", "priority": "high", "owner": "CSM"}
  ]'::jsonb
);

-- Alert
INSERT INTO alerts (
  organization_id, customer_contract_id, customer_id,
  alert_type, severity, title, message, status
) VALUES (
  'org-001', 'contract-001', 'cust-001',
  'churn_risk_critical', 'CRITICAL',
  'Acme Corp at Critical Churn Risk - Renewal in 118 Days',
  'High-value contract ($120K ARR) showing multiple risk indicators: no auto-renewal, low utilization (56%), poor health score (45), and overdue QBR. Immediate action required.',
  'active'
);
```

**Why Acme is HIGH RISK:**
- ❌ No auto-renewal (they can walk away)
- ❌ Can terminate for convenience
- ❌ Only using 56% of seats
- ❌ Poor health score (45/100)
- ❌ Detractor NPS (5/10)
- ❌ No QBR in 131 days
- ❌ Renewal in 118 days

---

#### 2. Globex Industries - LOW RISK 🟢

```sql
-- Customer
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-002', 'org-001', 'Globex Industries', 'globex.com', 'Technology', 'Enterprise', 'user-001');

-- Contract
INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights, termination_notice_days,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr, executive_sponsor,
  payment_status,
  churn_risk_score, churn_risk_level,
  expansion_opportunity_value, expansion_likelihood
) VALUES (
  'contract-002', 'org-001', 'cust-002',
  'CNT-2023-045', 'Globex Industries - Enterprise Plus', 'active',
  245000.00, 'annual',
  '2023-08-01', '2026-07-31', '2026-08-01', 36,
  true, 'for_cause_only', 90, -- ✅ LOW RISK: Auto-renews, can only terminate for cause
  100, 94, 94.00, -- ✅ HIGH utilization
  92.00, 9, '2024-09-15', 64, 'Jennifer Wu, CTO', -- ✅ Great health, promoter, exec sponsor
  'current',
  15, 'LOW', -- 🟢 HEALTHY CONTRACT
  50000.00, 'MEDIUM' -- Expansion opportunity!
);

-- Expansion Opportunity
INSERT INTO expansion_opportunities (
  customer_contract_id, customer_id, organization_id,
  opportunity_type, estimated_arr_increase, likelihood,
  detected_reason, status, assigned_to_user_id
) VALUES (
  'contract-002', 'cust-002', 'org-001',
  'seat_expansion', 50000.00, 'MEDIUM',
  'Customer at 94% seat utilization. Strong health score (92) and promoter NPS (9) indicate readiness for expansion. Recommended: +20 seats.',
  'identified', 'user-001'
);
```

**Why Globex is LOW RISK:**
- ✅ Auto-renewal enabled
- ✅ Can only terminate for cause (high bar)
- ✅ 94% seat utilization (fully engaged)
- ✅ Excellent health score (92/100)
- ✅ Promoter NPS (9/10)
- ✅ Recent QBR (64 days ago)
- ✅ Executive sponsor identified
- 💡 BONUS: Expansion opportunity ($50K)

---

#### 3. Initech Solutions - MEDIUM RISK 🟡

```sql
-- Customer
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-003', 'org-001', 'Initech Solutions', 'initech.com', 'Financial Services', 'Mid-Market', 'user-003');

-- Contract
INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights, termination_notice_days,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr,
  payment_status, days_past_due,
  churn_risk_score, churn_risk_level
) VALUES (
  'contract-003', 'org-001', 'cust-003',
  'CNT-2024-012', 'Initech - Professional Plan', 'active',
  48000.00, 'annual',
  '2024-02-01', '2025-01-31', '2025-02-01', 12,
  false, 'for_cause_only', 30, -- ⚠️ SOME RISK: No auto-renewal but harder to leave
  25, 18, 72.00, -- Mixed utilization
  68.00, 7, '2024-08-20', 90, -- Decent health, passive NPS
  'past_due', 18, -- ⚠️ Payment 18 days overdue
  52, 'MEDIUM' -- 🟡 MODERATE RISK
);

-- Alert
INSERT INTO alerts (
  organization_id, customer_contract_id, customer_id,
  alert_type, severity, title, message, status
) VALUES (
  'org-001', 'contract-003', 'cust-003',
  'payment_overdue', 'HIGH',
  'Initech Solutions - Payment 18 Days Overdue',
  'Payment of $48,000 is 18 days past due. Contract also shows moderate churn risk (52 score). CSM should reach out to check on billing issue and account health.',
  'active'
);
```

**Why Initech is MEDIUM RISK:**
- ⚠️ No auto-renewal
- ✅ But can only terminate for cause (barrier to exit)
- ⚠️ 72% utilization (decent but not great)
- ⚠️ Passive NPS (7/10)
- ⚠️ QBR 90 days ago (approaching overdue)
- ❌ Payment 18 days overdue (financial stress signal)

---

#### 4. Hooli Technologies - LOW RISK 🟢

```sql
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-004', 'org-001', 'Hooli Technologies', 'hooli.xyz', 'Technology', 'Enterprise', 'user-002');

INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr, executive_sponsor,
  payment_status,
  churn_risk_score, churn_risk_level
) VALUES (
  'contract-004', 'org-001', 'cust-004',
  'CNT-2022-089', 'Hooli - Enterprise', 'active',
  180000.00, 'annual',
  '2022-11-15', '2025-11-14', '2025-11-15', 36,
  true, 'for_cause_only',
  75, 68, 90.67,
  88.00, 9, '2024-10-01', 48, 'Richard Hendricks, VP Engineering',
  'current',
  18, 'LOW'
);
```

---

#### 5. Pied Piper Inc - HIGH RISK 🔴

```sql
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-005', 'org-001', 'Pied Piper Inc', 'piedpiper.com', 'Technology', 'SMB', 'user-003');

INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights, termination_notice_days,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr,
  payment_status, days_past_due,
  churn_risk_score, churn_risk_level
) VALUES (
  'contract-005', 'org-001', 'cust-005',
  'CNT-2024-078', 'Pied Piper - Starter Plan', 'active',
  18000.00, 'monthly',
  '2024-04-01', '2025-03-31', '2025-04-01', 12,
  false, 'for_convenience', 30,
  10, 4, 40.00, -- ⚠️ VERY LOW utilization
  32.00, 4, '2024-05-15', 187, -- ⚠️ Poor health, very old QBR
  'past_due', 45, -- ❌ Payment significantly overdue
  88, 'HIGH' -- 🔴 VERY HIGH RISK
);

INSERT INTO alerts (
  organization_id, customer_contract_id, customer_id,
  alert_type, severity, title, message, status
) VALUES (
  'org-001', 'contract-005', 'cust-005',
  'churn_risk_critical', 'CRITICAL',
  'Pied Piper - Critical Risk: Payment 45 Days Overdue',
  'Customer shows severe distress signals: 45 days past due, 40% utilization, health score 32, no QBR in 187 days. High likelihood of non-renewal. Consider escalation to collections.',
  'active'
);
```

---

#### 6. Aviato Corp - LOW RISK 🟢

```sql
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-006', 'org-001', 'Aviato Corp', 'aviato.com', 'Travel & Hospitality', 'Mid-Market', 'user-001');

INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr, executive_sponsor,
  payment_status,
  churn_risk_score, churn_risk_level,
  expansion_opportunity_value, expansion_likelihood, pricing_gap_pct
) VALUES (
  'contract-006', 'org-001', 'cust-006',
  'CNT-2023-134', 'Aviato - Professional Plus', 'active',
  72000.00, 'annual',
  '2023-06-01', '2025-05-31', '2025-06-01', 24,
  true, 'for_cause_only',
  40, 38, 95.00,
  85.00, 8, '2024-09-10', 69, 'Erlich Bachman, CEO',
  'current',
  22, 'LOW',
  28000.00, 'HIGH', 38.89 -- 🎯 Customer paying 39% below current rate!
);

INSERT INTO expansion_opportunities (
  customer_contract_id, customer_id, organization_id,
  opportunity_type, estimated_arr_increase, likelihood,
  detected_reason, status, assigned_to_user_id
) VALUES (
  'contract-006', 'cust-006', 'org-001',
  'pricing_gap_correction', 28000.00, 'HIGH',
  'Customer is 38.89% below current rate card pricing. Current ACV: $72K, Market rate: $100K. Strong health (85), promoter NPS (8), and high utilization (95%) indicate pricing power. Recommended approach: Tier upgrade to justify increase.',
  'identified', 'user-001'
);
```

---

#### 7. Raviga Capital - MEDIUM RISK 🟡

```sql
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-007', 'org-001', 'Raviga Capital', 'raviga.vc', 'Financial Services', 'Enterprise', 'user-002');

INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights, termination_notice_days,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr,
  payment_status,
  churn_risk_score, churn_risk_level
) VALUES (
  'contract-007', 'org-001', 'cust-007',
  'CNT-2024-023', 'Raviga - Enterprise Plan', 'active',
  156000.00, 'quarterly',
  '2024-01-15', '2026-01-14', '2026-01-15', 24,
  true, 'for_convenience', 90, -- ⚠️ Auto-renews BUT can terminate for convenience
  60, 42, 70.00,
  58.00, 6, '2024-06-20', 152, -- ⚠️ Passive/detractor, very old QBR
  'current',
  48, 'MEDIUM'
);
```

---

#### 8. Bachmanity LLC - LOW RISK 🟢

```sql
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-008', 'org-001', 'Bachmanity LLC', 'bachmanity.io', 'Technology', 'SMB', 'user-003');

INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr, executive_sponsor,
  payment_status,
  churn_risk_score, churn_risk_level
) VALUES (
  'contract-008', 'org-001', 'cust-008',
  'CNT-2024-091', 'Bachmanity - Professional', 'active',
  36000.00, 'annual',
  '2024-05-01', '2025-04-30', '2025-05-01', 12,
  true, 'for_cause_only',
  15, 14, 93.33,
  90.00, 10, '2024-10-15', 34, 'Nelson Bighetti, CTO',
  'current',
  12, 'LOW'
);
```

---

#### 9. Maleant Data Systems - HIGH RISK 🔴

```sql
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-009', 'org-001', 'Maleant Data Systems', 'maleant.com', 'Healthcare', 'Enterprise', 'user-002');

INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights, termination_notice_days,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr,
  payment_status,
  churn_risk_score, churn_risk_level
) VALUES (
  'contract-009', 'org-001', 'cust-009',
  'CNT-2023-167', 'Maleant - Enterprise Healthcare', 'active',
  210000.00, 'annual',
  '2023-09-01', '2024-08-31', '2024-09-01', 12,
  false, 'for_convenience', 60, -- ❌ Already past original renewal! (likely on auto month-to-month)
  80, 45, 56.25, -- ⚠️ LOW utilization
  42.00, 5, '2024-03-10', 254, -- ❌ No QBR in 254 days!
  'current',
  76, 'HIGH'
);

INSERT INTO alerts (
  organization_id, customer_contract_id, customer_id,
  alert_type, severity, title, message, status
) VALUES (
  'org-001', 'contract-009', 'cust-009',
  'contract_expired_no_renewal', 'CRITICAL',
  'Maleant Data Systems - Contract Expired, On Month-to-Month',
  'High-value contract ($210K ARR) expired 78 days ago and is now month-to-month. Customer can terminate with 60 days notice at any time. No QBR in 254 days. URGENT: Engage for multi-year renewal negotiation.',
  'active'
);
```

---

#### 10. Intersite Analytics - MEDIUM RISK 🟡

```sql
INSERT INTO customers (id, organization_id, customer_name, domain, industry, segment, csm_user_id) VALUES
('cust-010', 'org-001', 'Intersite Analytics', 'intersite.io', 'Technology', 'Mid-Market', 'user-001');

INSERT INTO customer_contracts (
  id, organization_id, customer_id,
  contract_number, contract_name, status,
  annual_contract_value, billing_frequency,
  contract_start_date, contract_end_date, renewal_date, contract_term_months,
  auto_renewal, termination_rights, termination_notice_days,
  seats_purchased, seats_utilized, seat_utilization_pct,
  health_score, nps_score, last_qbr_date, days_since_last_qbr, executive_sponsor,
  payment_status,
  churn_risk_score, churn_risk_level,
  expansion_opportunity_value, expansion_likelihood
) VALUES (
  'contract-010', 'org-001', 'cust-010',
  'CNT-2024-045', 'Intersite - Professional Plus', 'active',
  64000.00, 'annual',
  '2024-03-01', '2025-02-28', '2025-03-01', 12,
  false, 'for_cause_only', 60,
  32, 28, 87.50, -- ✅ Good utilization
  72.00, 8, '2024-08-30', 81, 'David Lee, VP Operations', -- ✅ Good health, promoter
  'current',
  38, 'MEDIUM', -- Medium only due to no auto-renewal and renewal timing
  16000.00, 'MEDIUM' -- Could expand to Enterprise tier
);

INSERT INTO expansion_opportunities (
  customer_contract_id, customer_id, organization_id,
  opportunity_type, estimated_arr_increase, likelihood,
  detected_reason, status, assigned_to_user_id
) VALUES (
  'contract-010', 'cust-010', 'org-001',
  'tier_upgrade', 16000.00, 'MEDIUM',
  'Customer at 87.5% seat utilization with strong health (72) and promoter NPS (8). Good candidate for Enterprise tier upgrade during renewal. Current: $64K Professional Plus, Target: $80K Enterprise.',
  'identified', 'user-003'
);
```

---

## 📊 Sample Data Summary

| Customer | ACV | Risk Level | Risk Score | Key Issues | Opportunity |
|----------|-----|------------|------------|------------|-------------|
| **Acme Corp** | $120K | 🔴 HIGH | 82 | No auto-renewal, low util (56%), no QBR | - |
| **Globex Industries** | $245K | 🟢 LOW | 15 | None - healthy! | $50K seat expansion |
| **Initech Solutions** | $48K | 🟡 MEDIUM | 52 | Payment 18 days overdue, no auto-renewal | - |
| **Hooli Technologies** | $180K | 🟢 LOW | 18 | None - healthy! | - |
| **Pied Piper** | $18K | 🔴 HIGH | 88 | Payment 45d overdue, 40% util, no QBR 187d | - |
| **Aviato Corp** | $72K | 🟢 LOW | 22 | None - healthy! | $28K pricing gap |
| **Raviga Capital** | $156K | 🟡 MEDIUM | 48 | No QBR 152d, detractor NPS | - |
| **Bachmanity LLC** | $36K | 🟢 LOW | 12 | None - healthy! | - |
| **Maleant Data** | $210K | 🔴 HIGH | 76 | Contract expired, no QBR 254d | - |
| **Intersite Analytics** | $64K | 🟡 MEDIUM | 38 | No auto-renewal (renewal approaching) | $16K tier upgrade |

**Portfolio Totals:**
- **Total ARR:** $1,149,000
- **High Risk ARR:** $348,000 (30.3%)
- **Medium Risk ARR:** $268,000 (23.3%)
- **Low Risk ARR:** $533,000 (46.4%)
- **Expansion Pipeline:** $94,000

---

## 🔗 Relationships & Foreign Keys

### Entity Relationship Diagram (ERD)

```
organizations (1) ─── (many) users
     │
     └─ (many) customers (1) ─── (many) customer_contracts
                                         │
                                         ├─ (many) churn_risk_factors
                                         ├─ (many) renewal_activities
                                         ├─ (many) expansion_history
                                         ├─ (many) alerts
                                         ├─ (many) uploaded_documents
                                         ├─ (many) contract_snapshots
                                         └─ (many) expansion_opportunities
```

### Critical Relationships

1. **Multi-Tenancy:** Every record (except `users`) ties back to `organization_id` for isolation
2. **Customer Hierarchy:** customers → customer_contracts (1-to-many)
3. **Contract Dependencies:** All activity tables reference `customer_contract_id`
4. **User Assignments:** CSM, Account Owner references in customers and contracts
5. **External System IDs:** Salesforce, Stripe, Gainsight IDs for sync

---

## ⚡ Performance Indexes

### Critical Indexes Already Defined

**High-Traffic Queries:**
```sql
-- Dashboard: "Show renewals in next 90 days with high risk"
idx_contracts_renewal_risk ON (renewal_date, churn_risk_level)

-- Contracts Library: "Filter by risk level"
idx_contracts_churn_risk ON (churn_risk_level)

-- Customer Lookup: "Show all contracts for customer"
idx_contracts_customer ON (customer_id)

-- Alert Feed: "Show active critical alerts"
idx_alerts_status ON (status)
idx_alerts_severity ON (severity)
```

### Additional Recommended Indexes (After Load Testing)

```sql
-- If filtering by renewal date range is slow:
CREATE INDEX idx_contracts_renewal_window ON customer_contracts(renewal_date) 
WHERE status = 'active';

-- If searching contracts by name is slow:
CREATE INDEX idx_contracts_name_search ON customer_contracts 
USING gin(to_tsvector('english', contract_name));

-- If customer search by name is slow:
CREATE INDEX idx_customers_name_search ON customers 
USING gin(to_tsvector('english', customer_name));
```

---

## 🔄 Auto-Calculated Fields

### Fields That Should Be Calculated by Application

**In `customer_contracts`:**
1. `seat_utilization_pct` = (seats_utilized / seats_purchased) * 100
2. `days_since_last_qbr` = TODAY - last_qbr_date
3. `days_past_due` = TODAY - payment_due_date (if past_due)
4. `churn_risk_score` = Complex algorithm (see 03-RISK-SCORING-ALGORITHM.md)
5. `churn_risk_level` = 'LOW' if score 0-40, 'MEDIUM' if 41-70, 'HIGH' if 71-100
6. `expansion_opportunity_value` = Pricing gap calculation or seat expansion math

**Calculation Triggers:**
- Run churn risk calculation: Daily (via cron job) + On data change
- Update seat utilization: On sync from product usage tracking
- Update days_past_due: Daily
- Update days_since_last_qbr: Daily

---

## 🛡️ Data Validation Rules

### Required Field Combinations

**customer_contracts:**
- If `auto_renewal = true`, must have `auto_renewal_notice_days`
- If `termination_rights != 'none'`, must have `termination_notice_days`
- `contract_end_date` must be after `contract_start_date`
- `renewal_date` typically equals `contract_end_date` (unless amended)
- `annual_contract_value` must be > 0
- `churn_risk_score` must be 0-100

### Logical Constraints

```sql
-- Contract dates must be logical
ALTER TABLE customer_contracts ADD CONSTRAINT check_dates 
CHECK (contract_end_date > contract_start_date);

-- Risk score must be 0-100
ALTER TABLE customer_contracts ADD CONSTRAINT check_risk_score 
CHECK (churn_risk_score >= 0 AND churn_risk_score <= 100);

-- Seat utilization can't exceed 100%
ALTER TABLE customer_contracts ADD CONSTRAINT check_seat_util 
CHECK (seat_utilization_pct <= 100);

-- NPS must be 0-10
ALTER TABLE customer_contracts ADD CONSTRAINT check_nps 
CHECK (nps_score >= 0 AND nps_score <= 10);

-- Health score must be 0-100
ALTER TABLE customer_contracts ADD CONSTRAINT check_health 
CHECK (health_score >= 0 AND health_score <= 100);
```

---

## 🔐 Security & Privacy

### Multi-Tenant Isolation

**CRITICAL:** Every query MUST filter by `organization_id` to prevent data leaks

```sql
-- ✅ CORRECT
SELECT * FROM customer_contracts 
WHERE organization_id = $user_org_id 
AND churn_risk_level = 'HIGH';

-- ❌ WRONG - Data leak!
SELECT * FROM customer_contracts 
WHERE churn_risk_level = 'HIGH';
```

### Sensitive Fields (Encrypt at Rest)

- `integrations.credentials` - API keys, OAuth tokens
- `users.password_hash` - User passwords
- `customer_contracts.signed_contract_url` - May contain SSN, bank info

### PII (GDPR/CCPA Compliance)

**Personal Data:**
- `users.email`, `users.name`
- `customers.customer_name` (company name, not personal)
- `alerts.message` (may contain names)

**Retention Policy:**
- Active contracts: Retain indefinitely
- Churned contracts: Retain 7 years (financial records requirement)
- User data: Delete 30 days after account closure (with legal hold exceptions)

---

## 📥 Data Migration Strategy

### Import from Existing Systems

**Phase 1: Salesforce Import**
1. Pull all Opportunities (Type="New Customer", Stage="Closed Won")
2. Map to `customer_contracts` table
3. Create corresponding `customers` records
4. Run initial churn risk calculation

**Phase 2: Health Score Enrichment**
1. Connect Gainsight/ChurnZero
2. Match customers by domain or external ID
3. Update health_score, nps_score, last_qbr_date

**Phase 3: Payment Data**
1. Connect Stripe
2. Match subscriptions to contracts
3. Update payment_status, days_past_due

**Phase 4: Historical Documents**
1. Bulk upload signed PDFs to S3
2. Create `uploaded_documents` records
3. Run AI extraction on backlog

### Sample Migration Script (Conceptual)

```typescript
// Salesforce → Contract IQ migration
async function migrateSalesforceOpportunities() {
  const opportunities = await salesforce.query(`
    SELECT Id, AccountId, Account.Name, Amount, CloseDate, 
           StageName, ContractTerm__c, AutoRenewal__c
    FROM Opportunity 
    WHERE Type = 'New Customer' 
    AND StageName = 'Closed Won'
  `);

  for (const opp of opportunities) {
    // Create or get customer
    const customer = await getOrCreateCustomer({
      salesforce_account_id: opp.AccountId,
      customer_name: opp.Account.Name,
    });

    // Create contract
    await createContract({
      customer_id: customer.id,
      salesforce_opportunity_id: opp.Id,
      annual_contract_value: opp.Amount,
      contract_start_date: opp.CloseDate,
      contract_term_months: opp.ContractTerm__c || 12,
      auto_renewal: opp.AutoRenewal__c || false,
      // ... calculate renewal_date, etc.
    });
  }

  // Trigger churn risk calculation for all new contracts
  await calculateChurnRiskForAll();
}
```

---

## ✅ Implementation Checklist

### Database Setup

- [ ] Create all 15 tables in order (organizations first, then cascading)
- [ ] Add all foreign key constraints
- [ ] Create all indexes
- [ ] Add check constraints for data validation
- [ ] Set up multi-tenant RLS (Row Level Security) policies
- [ ] Configure automated backups (daily, 30-day retention)

### Sample Data Loading

- [ ] Load sample organization and users
- [ ] Load 10 sample customers
- [ ] Load 10 sample contracts with realistic data
- [ ] Load sample churn_risk_factors for each contract
- [ ] Load sample alerts for high-risk contracts
- [ ] Load sample expansion_opportunities

### Testing & Validation

- [ ] Verify foreign key relationships work
- [ ] Test multi-tenant isolation (can't access other org's data)
- [ ] Validate all check constraints prevent bad data
- [ ] Test index performance on large datasets (simulate 1000+ contracts)
- [ ] Verify churn_risk_score calculations match sample data
- [ ] Test soft delete / cascade delete behavior

### Documentation

- [ ] Document all custom field meanings for team
- [ ] Create data dictionary for business users
- [ ] Document backup/restore procedures
- [ ] Create runbook for common queries

---

## 🎓 Key Terminology Reminders

**From 01-TERMINOLOGY-GLOSSARY.md:**

| Term | Correct Usage | WRONG Usage |
|------|---------------|-------------|
| **Customer** | Company buying FROM us | Company we buy from |
| **Contract** | Agreement we SOLD | Agreement we signed to buy something |
| **ACV** | Annual value of contract THEY pay US | Our annual spend |
| **Churn Risk** | Risk THEY don't renew (we lose revenue) | Risk we overpay |
| **Auto-Renewal** | GOOD (they're locked in) | BAD (we're locked in) |
| **Expansion** | THEM paying us MORE | Us buying more from vendor |

**Keep 01-TERMINOLOGY-GLOSSARY.md open while implementing!**

---

## 📞 Questions?

**Before asking Ray:**
1. Check if terminology is defined in 01-TERMINOLOGY-GLOSSARY.md
2. Review sample data above for examples
3. Check relationship diagram for foreign keys

**Good Questions:**
- "Should `days_past_due` be nullable if `payment_status = 'current'`?"
- "Does `seat_utilization_pct` auto-calculate or manual entry?"
- "For multi-tenant isolation, should we use RLS policies or application-level filtering?"

**Questions Answered Here:**
- ✅ All field names and types defined
- ✅ All relationships explained
- ✅ Sample data provided for 10 customers
- ✅ Indexes specified

---

**Version:** 1.0  
**Status:** ✅ COMPLETE  
**Next Doc:** 03-RISK-SCORING-ALGORITHM.md

Ready for Factory.ai implementation. 🚀
