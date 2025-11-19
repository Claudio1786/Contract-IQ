# Manual MVP Feature Specification
**Created:** November 18, 2025  
**Target:** Factory.ai 4-Week Manual MVP Build  
**Purpose:** Crystal-clear requirements for Weeks 2-5 development

---

## 🎯 MVP GOAL

**Build the simplest version of Contract IQ that delivers value to beta customers WITHOUT AI automation.**

**Success criteria:**  
✅ Beta customers can see their contract renewal dates in Salesforce  
✅ Beta customers receive automated alerts 90/60/30 days before renewals  
✅ You (founder) can manually extract contract data via admin form  
✅ System syncs data to Salesforce bidirectionally  
✅ Zero AI/ML dependencies (all extraction done manually)  

---

## ⚙️ THE 5 MUST-HAVE FEATURES

### Feature #1: Contract Upload Interface
**User Story:** *"As a beta customer, I want to upload my contracts (PDFs/Word docs) so the Contract IQ team can extract key dates."*

#### Requirements:
- [ ] Simple web form: "Upload Your Contracts"
- [ ] Accepts: PDF, Word (.docx), Google Docs link
- [ ] Max file size: 10MB per contract
- [ ] Bulk upload: 20 contracts at once
- [ ] Progress indicator: "Uploading 5 of 20 contracts..."
- [ ] Confirmation email: "We received your 20 contracts. We'll extract the data within 48 hours."

#### Technical Specs:
- **Storage:** AWS S3 or Vercel Blob Storage
- **File naming:** `{customer_id}_{contract_name}_{timestamp}.pdf`
- **Metadata captured:** Customer ID, upload timestamp, file name, file size, file type

#### UI Mockup (Text Description):
```
┌─────────────────────────────────────────────────────┐
│  Contract IQ - Upload Your Contracts                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📁 Drag & drop files here, or click to browse      │
│  (Accepts: PDF, Word, Google Docs links)            │
│                                                      │
│  Files uploaded: 5 of 20                            │
│  [████████░░░░░░░░] 40%                             │
│                                                      │
│  ✅ Enterprise_SaaS_Agreement_Acme.pdf (2.3MB)      │
│  ✅ MSA_BetaCorp_2024.docx (1.1MB)                  │
│  ⏳ Uploading... Renewal_Contract_XYZ.pdf           │
│                                                      │
│  [Upload More Files]  [Done]                        │
└─────────────────────────────────────────────────────┘
```

---

### Feature #2: Manual Data Entry Form (Admin-Only)
**User Story:** *"As the founder, I want a simple form to manually enter contract data after reviewing the uploaded PDFs."*

#### Requirements:
- [ ] Admin-only access (password-protected or behind /admin route)
- [ ] Form fields (exactly matching BUSINESS-MODEL-PIVOT-SPECS/02-DATA-SCHEMA.md):
  - Customer Name (dropdown, auto-populated from Salesforce)
  - Contract Name (text)
  - Contract Type (dropdown: Enterprise, Mid-Market, SMB)
  - Start Date (date picker)
  - End Date (date picker)
  - **Renewal Date** (date picker) ← CRITICAL FIELD
  - Auto-Renewal (Yes/No toggle)
  - Notice Period (text: "30 days", "60 days", "90 days")
  - Annual Contract Value (ACV) (number: $XX,XXX)
  - Total Contract Value (TCV) (number: $XX,XXX)
  - Payment Terms (dropdown: Annual, Quarterly, Monthly)
  - Seats/Licenses (number)
  - Risk Score (auto-calculated, read-only)

- [ ] "Save & Sync to Salesforce" button
- [ ] Confirmation message: "Contract saved! Syncing to Salesforce..."
- [ ] Error handling: If Salesforce sync fails, show error + retry button

#### Technical Specs:
- **Backend:** Next.js API route (`/api/admin/contracts/create`)
- **Database:** PostgreSQL (write to `contracts` table)
- **Validation:** Zod schema matching database schema
- **Salesforce Sync:** POST to Salesforce API after DB write

#### UI Mockup (Text Description):
```
┌─────────────────────────────────────────────────────┐
│  Contract IQ Admin - Manual Data Entry              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Customer Name:  [Dropdown: Acme Corp ▾]            │
│  Contract Name:  [Enterprise SaaS Agreement 2024]   │
│  Contract Type:  [Dropdown: Enterprise ▾]           │
│                                                      │
│  Start Date:     [01/01/2024 📅]                    │
│  End Date:       [12/31/2024 📅]                    │
│  Renewal Date:   [12/31/2024 📅] ← CRITICAL         │
│                                                      │
│  Auto-Renewal:   [Yes ✓] [No ○]                     │
│  Notice Period:  [60 days ▾]                        │
│                                                      │
│  Annual Contract Value: [$120,000]                  │
│  Total Contract Value:  [$360,000 (3 years)]        │
│  Payment Terms: [Annual ▾]                          │
│  Seats/Licenses: [50]                               │
│                                                      │
│  Risk Score: 65/100 (Medium Risk) [Auto-calculated] │
│                                                      │
│  [Save & Sync to Salesforce]  [Cancel]              │
└─────────────────────────────────────────────────────┘
```

---

### Feature #3: Salesforce Sync (Bidirectional)
**User Story:** *"As a beta customer, I want contract data to appear in Salesforce automatically so my AEs can see renewal dates."*

#### Requirements:
- [ ] **Write to Salesforce:** When founder saves contract via admin form, sync to Salesforce custom object (`Contract__c`)
- [ ] **Read from Salesforce:** Pull customer list from Salesforce `Account` object to populate dropdown in admin form
- [ ] **Bidirectional updates:** If customer updates a field in Salesforce, sync back to Contract IQ database (via webhook or polling)

#### Salesforce Custom Object: `Contract__c`
(Matches DEMO-PACKAGE/SALESFORCE-INTEGRATION-GUIDE.md)

| Field Name | API Name | Type | Description |
|------------|----------|------|-------------|
| Contract Name | `Name` | Text | Primary field |
| Account | `Account__c` | Lookup | Link to Account object |
| Renewal Date | `Renewal_Date__c` | Date | **CRITICAL FIELD** |
| Auto-Renewal | `Auto_Renewal__c` | Checkbox | Yes/No |
| Notice Period | `Notice_Period_Days__c` | Number | Days (30/60/90) |
| Annual Contract Value | `ACV__c` | Currency | $XX,XXX |
| Total Contract Value | `TCV__c` | Currency | $XX,XXX |
| Payment Terms | `Payment_Terms__c` | Picklist | Annual/Quarterly/Monthly |
| Seats | `Seats__c` | Number | License count |
| Risk Score | `Risk_Score__c` | Number | 0-100 |
| Contract Start Date | `Start_Date__c` | Date | Start |
| Contract End Date | `End_Date__c` | Date | End |

#### Technical Specs:
- **Salesforce API:** Use JSForce library (Node.js)
- **Authentication:** OAuth 2.0 (use Salesforce Connected App)
- **Sync frequency:** Real-time on save (webhook trigger)
- **Fallback:** If webhook fails, run nightly batch sync (cron job)

#### API Endpoints:
- `POST /api/salesforce/sync-contract` (write to Salesforce)
- `GET /api/salesforce/customers` (read customer list)
- `POST /api/salesforce/webhook` (receive updates from Salesforce)

---

### Feature #4: Automated Alerts (90/60/30 Days Before Renewal)
**User Story:** *"As a beta customer, I want automated email alerts 90, 60, and 30 days before a renewal so my AEs can reach out proactively."*

#### Requirements:
- [ ] **Daily cron job** checks all contracts in database
- [ ] **Trigger rules:**
  - Send alert if `renewal_date - today = 90 days`
  - Send alert if `renewal_date - today = 60 days`
  - Send alert if `renewal_date - today = 30 days`
- [ ] **Email template:**
  - Subject: `🔔 Renewal Alert: [Customer Name] contract expires in [X] days`
  - Body: Contract details + link to Salesforce record
- [ ] **Recipients:** Account owner (pulled from Salesforce) + beta customer email
- [ ] **Fallback:** If Salesforce API down, send to fallback email (founder@contractiq.com)

#### Technical Specs:
- **Email service:** Resend or SendGrid
- **Cron job:** Vercel Cron or AWS Lambda (runs daily at 9 AM)
- **Database query:** `SELECT * FROM contracts WHERE renewal_date - CURRENT_DATE IN (90, 60, 30)`

#### Email Template (Text):
```
Subject: 🔔 Renewal Alert: Acme Corp contract expires in 60 days

Hi [Account Owner Name],

This is a friendly reminder that the Acme Corp contract is coming up for renewal in 60 days.

**Contract Details:**
- Customer: Acme Corp
- Renewal Date: December 31, 2024
- Annual Contract Value: $120,000
- Auto-Renewal: Yes (requires 60-day notice to cancel)

**Next Steps:**
1. Review the contract in Salesforce: [Link to Salesforce record]
2. Reach out to the customer to discuss renewal
3. If you need help, reply to this email

Best,
Contract IQ Team

---

This is an automated alert from Contract IQ. To unsubscribe, contact support@contractiq.com.
```

---

### Feature #5: Simple Dashboard (Read-Only for Beta Customers)
**User Story:** *"As a beta customer, I want a dashboard showing all my contracts and upcoming renewals."*

#### Requirements:
- [ ] **Table view:**
  - Columns: Customer Name, Renewal Date, ACV, Risk Score, Days Until Renewal
  - Sortable by: Renewal Date (ascending), ACV (descending), Risk Score (descending)
  - Filterable by: Risk Score (High/Medium/Low), Contract Type (Enterprise/Mid-Market/SMB)
- [ ] **Summary cards (top of dashboard):**
  - Total Contracts: 20
  - Total ARR: $2.38M
  - Renewals This Quarter: 5 ($500K ARR)
  - High-Risk Renewals: 3 ($150K ARR at risk)
- [ ] **Upcoming Renewals (next 90 days):**
  - Timeline view showing contracts expiring soon
- [ ] **Export button:** Download as CSV

#### Technical Specs:
- **Backend:** Next.js API route (`/api/dashboard`)
- **Database query:** `SELECT * FROM contracts WHERE customer_id = :customer_id ORDER BY renewal_date ASC`
- **Frontend:** React + TailwindCSS (match existing v3.1 design system)
- **Export:** Generate CSV on-demand via `/api/export-contracts`

#### UI Mockup (Text Description):
```
┌─────────────────────────────────────────────────────────────────────┐
│  Contract IQ - Dashboard                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Total    │  │ Total    │  │ Renewals │  │ High-Risk│           │
│  │ Contracts│  │ ARR      │  │ Q4 2024  │  │ Renewals │           │
│  │   20     │  │ $2.38M   │  │   5      │  │   3      │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                      │
│  Upcoming Renewals (Next 90 Days)                                   │
│  ────────────────────────────────────────────────────────────────  │
│  Customer         Renewal Date    ACV        Risk    Days Left     │
│  ─────────────────────────────────────────────────────────────────│
│  Acme Corp        Dec 31, 2024    $120K     Medium   60 days       │
│  BetaCo           Nov 15, 2024    $80K      Low      15 days       │
│  TechStart        Jan 10, 2025    $200K     High     100 days      │
│  ...                                                                 │
│                                                                      │
│  [Export to CSV]  [Filter by Risk ▾]  [Sort by Date ▾]             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚫 OUT OF SCOPE (NOT in Manual MVP)

**Do NOT build these features yet (save for AI-enabled version):**

❌ **AI-powered contract extraction** (manual only for now)  
❌ **Slack integration** (email alerts only)  
❌ **Mobile app** (web-only)  
❌ **Multi-user roles** (founder = admin, beta customer = read-only viewer)  
❌ **Contract version history** (single version only)  
❌ **Advanced analytics** (simple dashboard only)  
❌ **API for third-party integrations** (Salesforce only)  
❌ **Custom alert logic** (90/60/30 days only, no customization)  

---

## 📊 DATABASE SCHEMA (Manual MVP)

### Table: `contracts`
(Simplified from BUSINESS-MODEL-PIVOT-SPECS/02-DATA-SCHEMA.md)

```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  salesforce_contract_id VARCHAR(18), -- Salesforce ID (18-char)
  
  -- Contract basics
  contract_name VARCHAR(255) NOT NULL,
  contract_type VARCHAR(50), -- Enterprise, Mid-Market, SMB
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  renewal_date DATE NOT NULL, -- CRITICAL FIELD
  
  -- Renewal terms
  auto_renewal BOOLEAN DEFAULT false,
  notice_period_days INTEGER, -- 30, 60, 90
  
  -- Financial
  acv DECIMAL(12, 2), -- Annual Contract Value
  tcv DECIMAL(12, 2), -- Total Contract Value
  payment_terms VARCHAR(50), -- Annual, Quarterly, Monthly
  seats INTEGER,
  
  -- Risk scoring
  risk_score INTEGER, -- 0-100 (calculated via algorithm)
  risk_category VARCHAR(20), -- Low, Medium, High
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP, -- Last Salesforce sync
  
  -- File reference
  uploaded_file_url TEXT -- S3/Blob Storage URL
);
```

### Table: `customers`
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salesforce_account_id VARCHAR(18), -- Salesforce Account ID
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `alerts`
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id),
  alert_type VARCHAR(20), -- 90_days, 60_days, 30_days
  sent_at TIMESTAMP,
  recipient_email VARCHAR(255),
  status VARCHAR(20) -- sent, failed, pending
);
```

---

## 🔧 TECH STACK

**Frontend:**
- Next.js 14 (App Router)
- React + TypeScript
- TailwindCSS (use existing v3.1 design system)

**Backend:**
- Next.js API Routes
- PostgreSQL (Supabase or Vercel Postgres)
- Prisma ORM

**External Services:**
- **Salesforce:** JSForce library (OAuth 2.0)
- **Email:** Resend or SendGrid
- **File Storage:** Vercel Blob or AWS S3
- **Cron Jobs:** Vercel Cron

**Deployment:**
- Vercel (same as current v3.1 deployment)

---

## ✅ ACCEPTANCE CRITERIA (How to Know It's Done)

**Feature #1: Contract Upload**
- [ ] Beta customer can upload 20 PDFs at once
- [ ] Founder receives email notification when contracts uploaded
- [ ] Files stored in S3/Blob Storage with correct naming

**Feature #2: Manual Data Entry Form**
- [ ] Founder can access /admin route (password-protected)
- [ ] Form validates all required fields (renewal date, customer name, ACV)
- [ ] "Save & Sync" button writes to database AND Salesforce
- [ ] Error handling: If Salesforce sync fails, show retry button

**Feature #3: Salesforce Sync**
- [ ] New contract appears in Salesforce within 10 seconds of save
- [ ] Customer dropdown in admin form pulls from Salesforce Accounts
- [ ] If customer updates field in Salesforce, it syncs back to Contract IQ within 24 hours

**Feature #4: Automated Alerts**
- [ ] Cron job runs daily at 9 AM
- [ ] Alerts sent exactly 90, 60, and 30 days before renewal
- [ ] Email includes contract details + Salesforce link
- [ ] If Salesforce API down, fallback email sent to founder

**Feature #5: Simple Dashboard**
- [ ] Beta customer can log in and see all their contracts
- [ ] Table is sortable by renewal date and ACV
- [ ] Summary cards show correct totals (Total Contracts, ARR, etc.)
- [ ] Export button downloads CSV with all contract data

---

## 🧪 TESTING REQUIREMENTS

**Before launching to beta customers:**

1. **Upload 3 test contracts** (PDF, Word, Google Docs link)
2. **Manually enter data for 5 contracts** via admin form
3. **Verify Salesforce sync** (check that all 5 contracts appear in Salesforce)
4. **Test automated alerts** (manually set renewal dates to trigger 90/60/30-day alerts)
5. **Load dashboard with 10+ contracts** (verify sorting, filtering, export)

**Success = All 5 features working end-to-end with zero manual errors.**

---

## 📅 WEEK-BY-WEEK BUILD PLAN (see next doc: 07-BUILD-SCHEDULE.md)

---

**Next Steps:**
1. Share this spec with Factory.ai
2. Schedule kickoff meeting to walk through requirements
3. Assign Factory.ai to build Week 2-5
4. Founder focuses on beta customer recruitment during build phase 🎯
