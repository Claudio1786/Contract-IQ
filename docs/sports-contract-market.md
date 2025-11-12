## Sports Contract Market Intelligence

**Research Date:** 2025-11-07  
**Vertical Scope:** USA amateur → collegiate → professional athletics  
**Source Baseline:** Claudio Aversa primary research packet (see conversation) augmented with Contract IQ synthesis

---

### 1. Market Overview & Segmentation

| Lifecycle Stage | Primary Stakeholders | Annual Contract Volume | Annual Contract Value | Notes for Contract IQ |
| --- | --- | --- | --- | --- |
| **High School / Pre-College** | Athletes, parents/guardians, local brands, NIL collectives, trainers, showcase operators | 51k – 105k (NIL + training + recruiting) | $50M – $250M | Fast-changing regulatory patchwork; majority of contracts < $25k but high exploitation risk. |
| **College (NIL + Athletics)** | Student athletes, universities, collectives, apparel brands, agencies, compliance offices | 260k – 560k | $1.67B today → $3–5B by 2030 | Highest volume / lowest maturity; House v. NCAA settlement could add $1–2B revenue sharing in 2025. |
| **Professional (Player / Staff)** | Athletes, teams, leagues, NBPA/NFLPA/MLBPA/NHLPA, agents, scouts | 9k – 12k (new/renewed player contracts) | $20B+ in salaries + $19–29B endorsements | Complex cap mechanics, guarantees, and incentive ladders; requires league-specific rule packs. |
| **Extended Ecosystem** | Coaches, trainers, scouts, media, endorsement partners, medical providers | 160k – 300k | $15B+ coaching + support services | Contracts tied to athlete lifecycle; many share clauses with player agreements (incentives, buyouts, exclusivity). |

**Strategic Insight:** Target NIL + entry-level pro deals for Stage 1 research deliverable—largest volume segment with immediate AI leverage. Stage 2 and beyond should layer coaching, agency, and endorsement analytics supporting “TolT IQ for Sports” parity.

---

### 2. Contract Catalog & Required Data Model

#### 2.1 Athlete-Facing Agreements

| Contract Type | Stage | Volume (Annual) | Key Clauses / Fields to Extract | Risk Flags |
| --- | --- | --- | --- | --- |
| NIL Endorsement Agreement | HS & College | 200k – 500k | Compensation schedule, deliverables (posts/appearances), exclusivity windows, carve-outs, usage rights, payment timing, tax withholding, termination for misconduct | Commission > 20%, morality clauses, unilateral termination, indefinite exclusivity, data usage beyond scope |
| Collective Stipend Agreement | College | 20k – 40k | Academic eligibility, participation requirements, payment triggers, clawback terms, donor disclosure, compliance attestations | Pay-for-play structures, confidentiality preventing oversight, non-payment risk |
| Professional Player Contract | Pro | 5k – 8k | Base salary, signing/roster/workout bonuses, guarantees (full vs. injury), option years, trade clauses, cap hits, deferrals | Void years, escalating penalties, offset language, franchise/transition tags |
| Two-way / Minor League Contract | Pro (NBA/NHL/G-League/AHL) | 1k – 2k | Salary tiers by league, conversion triggers, call-up procedures, housing/travel stipends | Guaranteed days thresholds, unilateral termination, transition windows |
| Athlete Appearance / Autograph Agreement | HS → Pro | 50k – 75k | Appearance schedule, deliverables, exclusivity by geography and category, media rights usage, cancellation policy | Non-competes beyond event, indemnification scope, lack of travel reimbursement |

#### 2.2 Stakeholder & Support Agreements

| Contract Type | Stakeholder | Volume (Annual) | Key Data Points | Risk & Compliance Considerations |
| --- | --- | --- | --- | --- |
| Coaching Contract | College & Pro | 109k – 174k | Compensation buckets (base, retention, incentives), buyout formula, termination for cause, staff salary pools, retention bonuses | Massive buyouts ($90M+), one-way termination, clawback on NCAA violations |
| Agent Representation Agreement | Athletes | 19.5k – 48k | Commission %, scope (contracts/endorsements), exclusivity, term length, termination rights, fiduciary duties | Commission caps per league, conflict of interest disclosures, sunset clauses |
| Training & Development Contract | Athletes (HS/College/Pro) | 60k – 120k | Session schedule, rate cards, liability waivers, injury responsibilities, refund policy | Hidden auto-renewal, broad liability waiver, ownership of recorded content |
| Medical & Rehab Agreement | Teams & Providers | 5k – 10k | Scope of services, PHI handling (HIPAA), malpractice coverage, availability SLAs | HIPAA/BAA requirements, liability caps below malpractice coverage |
| Scouting / Recruiting Services | Teams, Colleges | 5k – 8k | Territory, compensation, confidentiality, data ownership, NCAA compliance | Rogue scouting, improper inducements, breach of confidentiality |

#### 2.3 Commercial & Media Agreements

| Contract Type | Stage | Volume | Key Fields | Notes |
| --- | --- | --- | --- | --- |
| Athlete Endorsement / Sponsorship | College & Pro | 60.5k – 504k | Campaign deliverables, compensation formula (flat vs. CPM), usage rights duration, territory, exclusivity categories, performance bonuses | Most social-driven deals under 12 months; needs social analytics integration |
| Merchandising & Licensing | Pro | 5k – 10k | Royalty rate, distribution channels, audit rights, minimum guarantees, co-branding approvals | Group licensing (e.g., NFLPA) vs. individual exclusives |
| Media / Content Rights | HS → Pro | 2k – 5k | Content scope, platform exclusivity, revenue share, editorial approvals | Often includes perpetuity clauses with limited compensation |

---

### 3. Document Formats & Processing Considerations

| Format | Frequency | Extraction Notes |
| --- | --- | --- |
| PDF (scanned + e-signed) | ~70% | Requires OCR with table recognition (compensation schedules) and clause header heuristics (e.g., “COMPENSATION,” “BUYOUT”). |
| eSignature (DocuSign, Adobe Sign) JSON/XML | ~15% | Structured field data available; integrate via API for high-volume collectives and agencies. |
| Word / Google Docs | ~10% | Use DOCX parser for headings, track changes; maintain version audit. |
| Spreadsheets (bonus ladders, incentive trackers) | ~5% | Link to base agreements; ingest as supporting data with schema mapping. |

**Redaction Workflow:** Many HS/college contracts require PII masking (minors). Implement automated redaction templates before dataset enrichment.

---

### 4. Recommended AI & Schema Enhancements

1. **Contract Taxonomy Additions**  
   - `sports.contract_type`: enumeration across NIL, collective, player_standard, coaching, agency_rep, endorsement, training, medical, scouting, media.  
   - `sports.level`: hs | college | professional | semi_pro | youth_academy.  
   - `sports.league_code`: e.g., NFL, NBA, MLB, NCAA-D1, NIL-HS-TX.  
   - `sports.compensation` struct (cash, equity, royalty, deferred, in-kind).  
   - `sports.performance_incentives` array (metric, threshold, payout, cap hit impact).

2. **Clause Extraction Targets**  
   - Distribution of buyout formulas (percentage, flat fee, declining scale).  
   - Representation commissions with cap validation (flag > 3% NFL, > 4% NBA).  
   - NIL exclusivity categories and blackout periods vs. NCAA rules.  
   - Insurance coverage (loss-of-value policies, disability riders).  
   - Moral turpitude clauses and unilateral termination rights.  
   - Revenue sharing definitions post House v. NCAA (if adopted).

3. **Risk Scoring Dimensions**  
   - Payment reliability (collective vs. brand vs. institution).  
   - Compliance exposure (state law, NCAA interim policy, league CBA).  
   - Agent/agency certification verification.  
   - Commission & fee anomalies.  
   - Exclusivity conflicts (category overlap within 90-day window).

---

### 5. Research Backlog & Deliverables

| Milestone | Objective | Output | Owner | Target Sprint |
| --- | --- | --- | --- | --- |
| **S1-R1** | Collect 50 NIL contracts (HS + college) with focus on compensation + exclusivity patterns. | Annotated dataset, clause taxonomy updates, risk heuristics. | Research Ops | 2025-11 Sprint (current). |
| **S1-R2** | Interview 20 stakeholders (athletes/parents/agents/compliance) to validate pain points + pricing sensitivity. | Persona extensions, journey maps, pricing hypotheses. | Product | 2025-11 Sprint (current). |
| **S1-R3** | Map 15 professional rookie contracts per league (NFL/NBA/MLB/NHL) to identify clause variance. | Benchmark dashboards, ingestion spec updates. | Data Intelligence | 2025-12 Sprint. |
| **S1-R4** | Build clause library for coaching & buyout mechanics (Power Five + top pro leagues). | Playbook content + risk scoring templates. | Legal Ops | 2026-01 Sprint. |
| **S1-R5** | Define data model for agent representation + endorsement tracking. | Schema PR + analytics events. | Platform | 2026-01 Sprint. |

---

### 6. Integration with Product Roadmap

- **Stage 1 (Assisted Operations):** Incorporate NIL + rookie contract ingestion, red flag detection, and guidance prompts. Deliver compliance dashboards for athletic departments.  
- **Stage 2 (Operational Intelligence):** Expand to coaching/agent contracts, link to SaaS/Vendor segmentation, and introduce cross-vertical benchmarking (sports vs. SaaS).  
- **Stage 3 (Market Expansion):** Offer endorsement management, ROI analytics, and pro team contract scenario planning akin to cap-table tooling.

**Cross-Vertical Alignment:** Maintain separate data marts for **Sports Intelligence** and **Enterprise SaaS/Vendor Intelligence** while sharing reusable NLP primitives (clause classification, renewal detection). This ensures the platform scales across both target markets without schema collisions.

---

### 7. Open Questions

1. Confirm regulatory coverage per state for HS NIL (18+ states). Build compliance matrix referencing most restrictive requirements.  
2. Determine data acquisition strategy for collective contracts (likely via anonymity agreements with collectives).  
3. Assess need for league-specific licensing (e.g., NFLPA group rights) before distribution of analytics to clubs.  
4. Evaluate pricing tiers for athlete-side vs. institution-side users; incorporate revenue projections into GTM briefs.  
5. Identify overlap with existing fixtures (`nil-athlete-agreement.json`) and plan for multi-template coverage (agent agreements, endorsement templates, training waivers).

---

**Next Action:** Feed these requirements into roadmap + iteration artifacts (see updates in `docs/product-roadmap.md` and `docs/status/2025-11-05-iteration-plan.md`).