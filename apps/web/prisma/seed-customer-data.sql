-- Contract IQ - Sample Customer Contract Data
-- 10 realistic B2B SaaS customer agreements for testing
-- Total Portfolio: $2,268,000 ACV | 147 customers

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE "RiskScore", "Contract" CASCADE;

-- Insert sample customer contracts
INSERT INTO "Contract" (
  id,
  "organizationId",
  "fileName",
  "customerName",
  "customerType",
  industry,
  "contractType",
  "initialTermEndDate",
  "renewalType",
  "renewalNoticeDays",
  "renewalNoticeDeadline",
  "whoCanTerminate",
  "pricingModel",
  "baseMonthlyFee",
  "baseAnnualFee",
  currency,
  "committedSeats",
  "totalContractValue",
  "annualContractValue",
  status,
  "manualEntryComplete",
  "createdAt",
  "updatedAt"
) VALUES

-- Customer 1: TechScale Inc. (LOW CHURN RISK)
(
  'cust-001-techscale',
  'demo-org',
  'TechScale_MSA_2023.pdf',
  'TechScale Inc.',
  'Enterprise',
  'FinTech',
  'Master Service Agreement',
  '2026-01-14',
  'AUTO_RENEWAL',
  90,
  '2025-10-16',
  'EITHER_PARTY',
  'PER_USER',
  15000.00,
  180000.00,
  'USD',
  50,
  540000.00,
  180000.00,
  'active',
  true,
  '2023-01-15 10:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 2: GrowthCo Labs (HIGH CHURN RISK) ⚠️
(
  'cust-002-growthco',
  'demo-org',
  'GrowthCo_Agreement_2024.pdf',
  'GrowthCo Labs',
  'Mid-Market',
  'SaaS - Marketing',
  'Enterprise MSA',
  '2025-05-31',
  'MANUAL_RENEWAL',
  60,
  '2025-04-01',
  'EITHER_PARTY',
  'PER_USER',
  4000.00,
  48000.00,
  'USD',
  15,
  48000.00,
  48000.00,
  'active',
  true,
  '2024-06-01 09:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 3: DataFlow Analytics (LOW CHURN RISK)
(
  'cust-003-dataflow',
  'demo-org',
  'DataFlow_MSA_Professional_2023.pdf',
  'DataFlow Analytics',
  'Enterprise',
  'Data & Analytics',
  'Professional Services MSA',
  '2025-09-09',
  'AUTO_RENEWAL',
  120,
  '2025-05-11',
  'EITHER_PARTY',
  'PER_USER',
  30000.00,
  360000.00,
  'USD',
  100,
  720000.00,
  360000.00,
  'active',
  true,
  '2023-09-10 14:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 4: InnovateTech Solutions (MEDIUM CHURN RISK)
(
  'cust-004-innovatetech',
  'demo-org',
  'InnovateTech_MSA_2022.pdf',
  'InnovateTech Solutions',
  'Mid-Market',
  'Software Development',
  'Master Service Agreement',
  '2025-12-31',
  'MANUAL_RENEWAL',
  90,
  '2025-10-02',
  'EITHER_PARTY',
  'FLAT_FEE',
  6000.00,
  72000.00,
  'USD',
  20,
  216000.00,
  72000.00,
  'active',
  true,
  '2022-03-20 11:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 5: CloudFirst Corp (LOW CHURN RISK)
(
  'cust-005-cloudfirst',
  'demo-org',
  'CloudFirst_Enterprise_Agreement_2024.pdf',
  'CloudFirst Corp',
  'Enterprise',
  'Cloud Infrastructure',
  'Enterprise Agreement',
  '2026-12-31',
  'AUTO_RENEWAL',
  180,
  '2026-07-04',
  'EITHER_PARTY',
  'PER_USER',
  45000.00,
  540000.00,
  'USD',
  150,
  1620000.00,
  540000.00,
  'active',
  true,
  '2024-01-01 10:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 6: AgileWorks Consulting (HIGH CHURN RISK) ⚠️
(
  'cust-006-agileworks',
  'demo-org',
  'AgileWorks_Professional_Services_2023.pdf',
  'AgileWorks Consulting',
  'Mid-Market',
  'Business Consulting',
  'Professional Services Agreement',
  '2025-07-14',
  'MANUAL_RENEWAL',
  60,
  '2025-05-15',
  'EITHER_PARTY',
  'PER_USER',
  8000.00,
  96000.00,
  'USD',
  30,
  96000.00,
  96000.00,
  'active',
  true,
  '2023-07-15 13:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 7: NextGen Robotics (LOW CHURN RISK)
(
  'cust-007-nextgen',
  'demo-org',
  'NextGen_MSA_2024.pdf',
  'NextGen Robotics',
  'Enterprise',
  'Manufacturing - Robotics',
  'Master Service Agreement',
  '2026-02-28',
  'AUTO_RENEWAL',
  90,
  '2025-11-30',
  'EITHER_PARTY',
  'PER_USER',
  20000.00,
  240000.00,
  'USD',
  60,
  480000.00,
  240000.00,
  'active',
  true,
  '2024-03-01 12:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 8: HealthTech Partners (MEDIUM CHURN RISK)
(
  'cust-008-healthtech',
  'demo-org',
  'HealthTech_HIPAA_MSA_2022.pdf',
  'HealthTech Partners',
  'Regulated Industry',
  'Healthcare IT',
  'HIPAA-Compliant MSA',
  '2025-10-31',
  'MANUAL_RENEWAL',
  120,
  '2025-07-03',
  'EITHER_PARTY',
  'FLAT_FEE',
  12000.00,
  144000.00,
  'USD',
  40,
  432000.00,
  144000.00,
  'active',
  true,
  '2022-11-01 15:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 9: FinServe Global (LOW CHURN RISK)
(
  'cust-009-finserve',
  'demo-org',
  'FinServe_Enterprise_MSA_BAA_2024.pdf',
  'FinServe Global',
  'Strategic',
  'Financial Services',
  'Enterprise MSA + BAA',
  '2026-08-14',
  'AUTO_RENEWAL',
  180,
  '2026-02-15',
  'EITHER_PARTY',
  'PER_USER',
  40000.00,
  480000.00,
  'USD',
  120,
  960000.00,
  480000.00,
  'active',
  true,
  '2024-08-15 10:00:00',
  '2025-11-18 10:00:00'
),

-- Customer 10: RetailOps Inc. (MEDIUM CHURN RISK)
(
  'cust-010-retailops',
  'demo-org',
  'RetailOps_MSA_2023.pdf',
  'RetailOps Inc.',
  'Mid-Market',
  'Retail Technology',
  'Master Service Agreement',
  '2026-02-09',
  'AUTO_RENEWAL',
  60,
  '2025-12-11',
  'EITHER_PARTY',
  'PER_USER',
  9000.00,
  108000.00,
  'USD',
  30,
  324000.00,
  108000.00,
  'active',
  true,
  '2023-02-10 11:00:00',
  '2025-11-18 10:00:00'
);

-- Insert Risk Scores for each contract
INSERT INTO "RiskScore" (
  id,
  "contractId",
  "overallRiskScore",
  "riskClassification",
  "renewalRiskScore",
  "pricingRiskScore",
  "terminationRiskScore",
  "complianceRiskScore",
  "relationshipRiskScore",
  "calculatedAt",
  "calculationVersion",
  "createdAt",
  "updatedAt"
) VALUES

-- TechScale Inc. - LOW RISK (25/100)
('risk-001-techscale', 'cust-001-techscale', 25, 'LOW', 15, 20, 25, 30, 35, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- GrowthCo Labs - HIGH RISK (72/100) ⚠️
('risk-002-growthco', 'cust-002-growthco', 72, 'HIGH', 80, 70, 65, 75, 70, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- DataFlow Analytics - LOW RISK (15/100)
('risk-003-dataflow', 'cust-003-dataflow', 15, 'LOW', 10, 15, 20, 10, 20, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- InnovateTech Solutions - MEDIUM RISK (55/100)
('risk-004-innovatetech', 'cust-004-innovatetech', 55, 'MEDIUM', 60, 55, 50, 55, 50, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- CloudFirst Corp - LOW RISK (10/100)
('risk-005-cloudfirst', 'cust-005-cloudfirst', 10, 'LOW', 5, 10, 15, 10, 10, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- AgileWorks Consulting - HIGH RISK (68/100) ⚠️
('risk-006-agileworks', 'cust-006-agileworks', 68, 'HIGH', 75, 65, 70, 60, 70, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- NextGen Robotics - LOW RISK (32/100)
('risk-007-nextgen', 'cust-007-nextgen', 32, 'LOW', 30, 35, 30, 35, 30, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- HealthTech Partners - MEDIUM RISK (48/100)
('risk-008-healthtech', 'cust-008-healthtech', 48, 'MEDIUM', 50, 45, 50, 45, 50, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- FinServe Global - LOW RISK (18/100)
('risk-009-finserve', 'cust-009-finserve', 18, 'LOW', 20, 15, 20, 15, 20, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00'),

-- RetailOps Inc. - MEDIUM RISK (40/100)
('risk-010-retailops', 'cust-010-retailops', 40, 'MEDIUM', 45, 40, 35, 40, 40, '2025-11-18 10:00:00', 'v1.0.0', '2025-11-18 10:00:00', '2025-11-18 10:00:00');

-- Portfolio Summary:
-- Total Customers: 10
-- Total ACV: $2,268,000
-- Average ACV: $226,800
-- High Churn Risk: 2 (GrowthCo Labs, AgileWorks Consulting)
-- Medium Churn Risk: 3 (InnovateTech, HealthTech, RetailOps)
-- Low Churn Risk: 5 (TechScale, DataFlow, CloudFirst, NextGen, FinServe)
-- Auto-Renewal: 6 contracts
-- Manual Renewal: 4 contracts
