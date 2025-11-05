## Low-Fidelity Wireframe Specifications

### 1. Workspace Onboarding Flow
**Goal:** Get a new organization from landing CTA → connected data source in <10 minutes.

#### Screen 1: Welcome & Value Props
- Header: product logo, progress indicator (Step 1 of 4).
- Body: three bullet proof points tailored to detected persona (Procurement / NIL / Legal).
- CTA buttons: `Create workspace` (primary), `Back to marketing site` (secondary link).
- Footer: compliance badges (SOC 2, GDPR) + link to security docs.

#### Screen 2: Account & Workspace Setup
- Form layout (two-column desktop, stacked mobile):
  - Left: personal details (name, work email, password, invite teammates toggle).
  - Right: workspace name, industry/vertical dropdown, data residency preference.
- Inline validation + checkbox for terms/privacy.
- Primary CTA: `Continue →` (disabled until required fields valid).

#### Screen 3: Data Source Selection
- Card grid of connectors (Upload, Google Drive, Dropbox, SharePoint, API token).
- Each card shows required permissions + “What we access”.
- Selecting a connector reveals right-rail with step-by-step instructions.
- CTA: `Connect [Connector]` or `Skip for now` (records reason for analytics).

#### Screen 4: Success & Next Steps
- Confirmation state with progress animation for first ingestion job.
- Checklist:
  1. “Invite teammates” (deep link to modal)
  2. “Upload first contract” (opens file picker if not already done)
  3. “Book onboarding session” (Calendly link)
- Button: `Go to Processing Dashboard`.

### 2. Contract Detail Intelligence View
**Goal:** Deliver trustworthy, actionable insight for a single contract in <60 seconds.

#### Layout Structure
- **Header Bar:**
  - Contract title, vendor/athlete, status pill (Processing / Verified / Action Needed).
  - Key metadata chips: contract value, renewal date countdown, confidence score badge.
  - Action buttons: `Export`, `Assign`, overflow menu (`View original`, `Duplicate`, `Archive`).

- **Main Body:** Two-column grid.
  - **Left Column (Clause Navigator):**
    - Accordion list grouped by category (Pricing, Term, Liability, Compliance, Custom).
    - Each item shows status icon (green/yellow/red) and confidence percentage.
    - Clicking an item scrolls right column to corresponding card.
  - **Right Column (Detail Cards):**
    1. **Insight Card:** Summaries with bolded key data, benchmark percentile, and recommended action.
    2. **Source Citation Drawer:** Inline footnotes (e.g., `[1] Section 4.2`) with clickable highlights opening PDF snippet modal.
    3. **Benchmark Visualization:** Mini bar chart (company vs. peer median). Toggle for peer group filters.
    4. **Risk Flags:** List of issues with severity badges; each expands to mitigation guidance.
    5. **Negotiation Playbook:** Step-by-step talking points, fallback clauses, projected impact.

- **Right Rail:**
  - Activity feed (comments, status changes) with timestamps.
  - Task list (assigned to, due date, quick status toggle).
  - Outcome logging widget (Win/Loss dropdown, savings % field, notes).

#### Interaction Notes
- Hover on benchmark bars shows percentile + sample size.
- Clicking citation opens side-by-side PDF view (default to page range).
- Commenting auto-mentions selected clause context.
- Mobile breakpoint collapses left column into top dropdown navigator.

### 3. Portfolio Command Center
**Goal:** Give operators a single view of renewals, conflicts, and ROI.

#### Layout Structure
- **Top Bar:** Filters (Team, Persona view, Vendor/Athlete type, Risk level, Date range) and quick search.
- **Hero Metrics Row:** Four KPI tiles with trend indicators and tooltips:
  1. ARR at Risk (next 90 days)
  2. Contracts with Critical Issues
  3. Savings Captured YTD
  4. Benchmark Coverage %

- **Middle Section (Two-up Charts):**
  - **Renewal Waterfall:** Horizontal timeline grouped by month; bars segmented by risk severity; clicking segment opens modal list.
  - **Conflict Heatmap / Spend Distribution:** Toggle between matrix of categories vs. athletes/vendors and donut chart of spend by vendor cluster.

- **Bottom Section:**
  - **Actionable Table:** Columns for contract name, owner, renewal date, risk score, tasks outstanding, last activity. Inline buttons: `View`, `Assign`, `Resolve`.
  - Pagination + export dropdown (CSV, PDF, API link).

- **Right Panel (Collapsible):**
  - Alerts list sorted by urgency.
  - Integration status (Slack, email digests) with toggle switches.
  - Shortcut cards for “Schedule Review”, “Invite Stakeholder”.

#### Interaction Notes
- Filters persist per user; provide “Reset filters” chip.
- Table uses inline editing for owners/dates with autosave.
- Export action logs event for analytics.
- Mobile view stacks KPI cards, charts become swipeable.

### Accessibility & Visual Design Notes
- Maintain WCAG AA contrast; ensure color + icon dual encoding for risk states.
- Use consistent spacing scale (8px grid) across screens.
- Provide keyboard shortcuts: `S` to focus search, `A` to assign selected contract, `E` to export.
- Loading skeletons for each module to communicate processing state.