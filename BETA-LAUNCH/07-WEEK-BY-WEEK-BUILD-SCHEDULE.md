# Week-by-Week Build Schedule
**Created:** November 18, 2025  
**Target:** Factory.ai 4-Week Manual MVP Development (Weeks 2-5)  
**Purpose:** Day-by-day breakdown of what to build and when

---

## 📅 OVERVIEW: 4-WEEK SPRINT

| Week | Focus | Deliverables | Owner |
|------|-------|--------------|-------|
| **Week 1** | Beta customer recruitment | 3 beta customers signed | Founder |
| **Week 2** | Database + Salesforce setup | DB schema, Salesforce integration | Factory.ai |
| **Week 3** | Admin forms + file upload | Manual data entry, file storage | Factory.ai |
| **Week 4** | Dashboard + automated alerts | Customer dashboard, email alerts | Factory.ai |
| **Week 5** | Testing + beta customer onboarding | QA, first beta customer live | Founder + Factory.ai |

---

## 🗓️ WEEK 1: Beta Customer Recruitment (Founder)

**Goal:** Sign 3 beta customers by Friday

### Monday-Tuesday:
- [ ] Send 10-15 pitch emails (use BETA-LAUNCH/01-PITCH-EMAILS.md)
- [ ] Post beta announcement on LinkedIn (use BETA-LAUNCH/02-LINKEDIN-OUTREACH.md)
- [ ] Send 10-15 LinkedIn connection requests

### Wednesday-Thursday:
- [ ] Follow up with prospects who opened emails (3-day rule)
- [ ] Schedule 5-10 intro calls with interested prospects
- [ ] Send beta program one-pager to prospects who request more info

### Friday:
- [ ] Close 3 beta customers (signed agreements + payment info)
- [ ] Send welcome email with onboarding timeline
- [ ] Schedule Week 5 onboarding calls with each beta customer

**Success metric:** 3 signed beta customers by end of Week 1

---

## 🗓️ WEEK 2: Database + Salesforce Setup (Factory.ai)

**Goal:** Set up database schema, Salesforce integration, and API endpoints

### Day 1 (Monday):
- [ ] **Kickoff meeting** (Founder + Factory.ai)
  - Walk through BETA-LAUNCH/06-MANUAL-MVP-SPEC.md
  - Confirm tech stack (Next.js, PostgreSQL, Salesforce, Vercel)
  - Assign tickets/tasks in project management tool

- [ ] **Set up development environment:**
  - [ ] Create new branch: `feature/manual-mvp`
  - [ ] Set up PostgreSQL database (Vercel Postgres or Supabase)
  - [ ] Install dependencies: Prisma, JSForce, Resend/SendGrid

### Day 2 (Tuesday):
- [ ] **Create database schema:**
  - [ ] `contracts` table (see BETA-LAUNCH/06-MANUAL-MVP-SPEC.md)
  - [ ] `customers` table
  - [ ] `alerts` table
  - [ ] Run Prisma migrations

- [ ] **Set up Salesforce Connected App:**
  - [ ] Create OAuth 2.0 app in Salesforce
  - [ ] Generate client ID + secret
  - [ ] Test authentication via JSForce

### Day 3 (Wednesday):
- [ ] **Build Salesforce sync API endpoints:**
  - [ ] `POST /api/salesforce/sync-contract` (write to Salesforce)
  - [ ] `GET /api/salesforce/customers` (read customer list)
  - [ ] `POST /api/salesforce/webhook` (receive updates from Salesforce)

- [ ] **Test Salesforce integration:**
  - [ ] Write 1 test contract to Salesforce
  - [ ] Verify it appears in Salesforce `Contract__c` object
  - [ ] Pull customer list from Salesforce

### Day 4 (Thursday):
- [ ] **Set up file storage (Vercel Blob or AWS S3):**
  - [ ] Configure storage bucket
  - [ ] Create upload endpoint: `POST /api/upload-contract`
  - [ ] Test file upload (PDF, Word doc)

- [ ] **Build admin authentication:**
  - [ ] Password-protected `/admin` route
  - [ ] Simple login form (username + password)
  - [ ] Store admin credentials in environment variables

### Day 5 (Friday):
- [ ] **End-of-week testing:**
  - [ ] Test database schema (insert test contract)
  - [ ] Test Salesforce sync (write + read)
  - [ ] Test file upload (PDF + Word doc)

- [ ] **Demo to founder:**
  - [ ] Show working Salesforce integration
  - [ ] Confirm database schema matches spec

**Success metric:** Database + Salesforce integration working end-to-end

---

## 🗓️ WEEK 3: Admin Forms + File Upload (Factory.ai)

**Goal:** Build manual data entry form and contract upload interface

### Day 1 (Monday):
- [ ] **Build contract upload interface (Feature #1):**
  - [ ] Create `/upload` page
  - [ ] Drag-and-drop file upload (PDF, Word, Google Docs link)
  - [ ] Progress indicator (5 of 20 files uploaded)
  - [ ] Confirmation email when upload complete

### Day 2 (Tuesday):
- [ ] **Build admin manual data entry form (Feature #2):**
  - [ ] Create `/admin/contracts/new` page
  - [ ] Form fields:
    - Customer Name (dropdown, pulls from Salesforce)
    - Contract Name (text)
    - Contract Type (dropdown: Enterprise, Mid-Market, SMB)
    - Start/End/Renewal Dates (date pickers)
    - Auto-Renewal (toggle)
    - Notice Period (dropdown: 30/60/90 days)
    - ACV, TCV, Payment Terms, Seats (number inputs)
  - [ ] Risk Score (auto-calculated, read-only)

### Day 3 (Wednesday):
- [ ] **Build "Save & Sync to Salesforce" logic:**
  - [ ] Create API route: `POST /api/admin/contracts/create`
  - [ ] Validate form data (Zod schema)
  - [ ] Write to `contracts` table in database
  - [ ] Sync to Salesforce via `POST /api/salesforce/sync-contract`
  - [ ] Show success message: "Contract saved! Syncing to Salesforce..."

- [ ] **Error handling:**
  - [ ] If Salesforce sync fails, show error + retry button
  - [ ] If validation fails, highlight invalid fields

### Day 4 (Thursday):
- [ ] **Test admin form end-to-end:**
  - [ ] Manually enter 5 test contracts
  - [ ] Verify all 5 appear in Salesforce
  - [ ] Test error handling (disconnect Salesforce, try to save)

- [ ] **Build contract list page (Admin-only):**
  - [ ] Create `/admin/contracts` page
  - [ ] Show table of all contracts (sortable by date, customer)
  - [ ] "Edit" button (links to `/admin/contracts/[id]/edit`)

### Day 5 (Friday):
- [ ] **End-of-week testing:**
  - [ ] Upload 10 test contracts via `/upload` page
  - [ ] Manually enter data for all 10 via admin form
  - [ ] Verify all 10 contracts sync to Salesforce

- [ ] **Demo to founder:**
  - [ ] Show contract upload flow
  - [ ] Show manual data entry form
  - [ ] Show Salesforce sync working

**Success metric:** Founder can upload contracts + manually enter data + sync to Salesforce

---

## 🗓️ WEEK 4: Dashboard + Automated Alerts (Factory.ai)

**Goal:** Build customer dashboard and automated renewal alerts

### Day 1 (Monday):
- [ ] **Build customer dashboard (Feature #5):**
  - [ ] Create `/dashboard` page
  - [ ] Summary cards (Total Contracts, ARR, Renewals This Quarter, High-Risk Renewals)
  - [ ] Table view (Customer, Renewal Date, ACV, Risk Score, Days Until Renewal)
  - [ ] Sortable columns (Renewal Date, ACV, Risk Score)

### Day 2 (Tuesday):
- [ ] **Add filtering + export:**
  - [ ] Filter by: Risk Score (High/Medium/Low), Contract Type (Enterprise/Mid-Market/SMB)
  - [ ] Export button: Download as CSV
  - [ ] Create API route: `GET /api/export-contracts` (returns CSV)

### Day 3 (Wednesday):
- [ ] **Build automated alerts system (Feature #4):**
  - [ ] Create API route: `GET /api/cron/send-renewal-alerts`
  - [ ] Database query: `SELECT * FROM contracts WHERE renewal_date - CURRENT_DATE IN (90, 60, 30)`
  - [ ] Email template: "🔔 Renewal Alert: [Customer] expires in [X] days"
  - [ ] Send email via Resend or SendGrid

- [ ] **Set up Vercel Cron job:**
  - [ ] Configure cron job in `vercel.json` (runs daily at 9 AM)
  - [ ] Test cron job manually (trigger via API call)

### Day 4 (Thursday):
- [ ] **Test automated alerts:**
  - [ ] Set renewal dates to trigger 90/60/30-day alerts
  - [ ] Manually trigger cron job
  - [ ] Verify emails sent to correct recipients (Account owner + beta customer email)

- [ ] **Fallback logic:**
  - [ ] If Salesforce API down, send email to fallback (founder@contractiq.com)
  - [ ] Test fallback by disconnecting Salesforce

### Day 5 (Friday):
- [ ] **End-of-week testing:**
  - [ ] Load dashboard with 20+ contracts
  - [ ] Test sorting, filtering, export
  - [ ] Test automated alerts (trigger all 3: 90/60/30 days)

- [ ] **Demo to founder:**
  - [ ] Show customer dashboard
  - [ ] Show automated alerts working
  - [ ] Walk through full end-to-end flow (upload → manual entry → dashboard → alerts)

**Success metric:** Dashboard + automated alerts working end-to-end

---

## 🗓️ WEEK 5: Testing + Beta Customer Onboarding (Founder + Factory.ai)

**Goal:** QA testing, bug fixes, and onboard first beta customer

### Day 1 (Monday):
- [ ] **Full QA testing (Founder + Factory.ai):**
  - [ ] Test Feature #1: Contract upload (20 files at once)
  - [ ] Test Feature #2: Manual data entry form (5 contracts)
  - [ ] Test Feature #3: Salesforce sync (verify all 5 contracts appear)
  - [ ] Test Feature #4: Automated alerts (trigger 90/60/30-day alerts)
  - [ ] Test Feature #5: Dashboard (sorting, filtering, export)

- [ ] **Create bug list:**
  - [ ] Document all issues found during QA
  - [ ] Prioritize: P0 (blockers), P1 (high priority), P2 (nice-to-have)

### Day 2 (Tuesday):
- [ ] **Fix P0 bugs (blockers):**
  - [ ] Fix any issues that prevent beta customers from using the product
  - [ ] Re-test all P0 fixes

### Day 3 (Wednesday):
- [ ] **Fix P1 bugs (high priority):**
  - [ ] Fix any issues that impact user experience but don't block usage
  - [ ] Re-test all P1 fixes

- [ ] **Prepare for beta customer onboarding:**
  - [ ] Create onboarding email template (see BETA-LAUNCH/08-BETA-AGREEMENT.md)
  - [ ] Set up first beta customer account in database
  - [ ] Generate login credentials for first beta customer

### Day 4 (Thursday):
- [ ] **Onboard first beta customer:**
  - [ ] 30-minute onboarding call (walk through upload flow + dashboard)
  - [ ] Beta customer uploads 10-20 contracts
  - [ ] Founder manually extracts data via admin form
  - [ ] Beta customer reviews dashboard + provides feedback

### Day 5 (Friday):
- [ ] **Iterate based on feedback:**
  - [ ] Fix any issues reported by first beta customer
  - [ ] Re-test changes

- [ ] **Prepare for Week 6 (onboard beta customers #2 and #3):**
  - [ ] Schedule onboarding calls for next week
  - [ ] Send welcome emails to remaining beta customers

**Success metric:** First beta customer onboarded and actively using Contract IQ

---

## 🎯 WEEKLY CHECK-INS (Founder + Factory.ai)

**Every Monday @ 10 AM:**
- [ ] Review last week's progress
- [ ] Demo completed features
- [ ] Discuss blockers or challenges
- [ ] Confirm this week's priorities

**Every Friday @ 4 PM:**
- [ ] Demo week's work to founder
- [ ] QA testing session
- [ ] Create next week's task list

---

## 📊 SUCCESS METRICS (Weekly)

| Week | Metric | Target |
|------|--------|--------|
| Week 1 | Beta customers signed | 3 |
| Week 2 | Salesforce integration working | Yes |
| Week 3 | Admin form + upload working | Yes |
| Week 4 | Dashboard + alerts working | Yes |
| Week 5 | Beta customer #1 onboarded | Yes |

**Final success criteria (end of Week 5):**
✅ 3 beta customers signed  
✅ First beta customer onboarded and using product  
✅ All 5 MVP features working end-to-end  
✅ Zero P0 bugs (blockers)  
✅ Founder can manually extract contracts in < 5 mins per contract  

---

## 🚨 CONTINGENCY PLAN (If Things Go Wrong)

### Scenario #1: Week 2 runs late (Salesforce integration harder than expected)
**Solution:** Push Week 3 features to Week 4. Focus Week 3 on finishing Salesforce sync.

### Scenario #2: Beta customer recruitment slow (only 1-2 customers signed by Week 1)
**Solution:** Extend recruitment into Week 2. Factory.ai continues building while founder recruits.

### Scenario #3: Major bug discovered in Week 5 during beta customer onboarding
**Solution:** Delay beta customer #2 and #3 onboarding. Fix bug in Week 6.

---

## ✅ DAILY STANDUP TEMPLATE (For Factory.ai Team)

**What did you do yesterday?**  
Example: "Built the manual data entry form. Added all form fields (Customer Name, Renewal Date, ACV, etc.)."

**What are you doing today?**  
Example: "Hooking up 'Save & Sync' button to Salesforce API. Testing error handling."

**Any blockers?**  
Example: "Salesforce OAuth is giving a 401 error. Need to debug."

---

**Next Steps:**
1. Share this schedule with Factory.ai
2. Confirm availability for Monday kickoff meeting
3. Set up recurring check-ins (Monday 10 AM, Friday 4 PM)
4. Create shared project board (Trello, Asana, or Linear) to track tasks 🎯
