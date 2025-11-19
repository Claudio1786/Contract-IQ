/**
 * Seed script to load sample customer contract data
 * Run with: npx tsx scripts/seed-customers.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample customer contracts
const contracts = [
  {
    id: 'cust-001-techscale',
    organizationId: 'demo-org',
    fileName: 'TechScale_MSA_2023.pdf',
    customerName: 'TechScale Inc.',
    customerType: 'Enterprise',
    industry: 'FinTech',
    contractType: 'Master Service Agreement',
    initialTermEndDate: new Date('2026-01-14'),
    renewalType: 'AUTO_RENEWAL',
    renewalNoticeDays: 90,
    renewalNoticeDeadline: new Date('2025-10-16'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 15000.00,
    baseAnnualFee: 180000.00,
    currency: 'USD',
    committedSeats: 50,
    totalContractValue: 540000.00,
    annualContractValue: 180000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2023-01-15 10:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 25,
      riskClassification: 'LOW',
      renewalRiskScore: 15,
      pricingRiskScore: 20,
      terminationRiskScore: 25,
      complianceRiskScore: 30,
      relationshipRiskScore: 35,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-002-growthco',
    organizationId: 'demo-org',
    fileName: 'GrowthCo_Agreement_2024.pdf',
    customerName: 'GrowthCo Labs',
    customerType: 'Mid-Market',
    industry: 'SaaS - Marketing',
    contractType: 'Enterprise MSA',
    initialTermEndDate: new Date('2025-05-31'),
    renewalType: 'MANUAL_RENEWAL',
    renewalNoticeDays: 60,
    renewalNoticeDeadline: new Date('2025-04-01'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 4000.00,
    baseAnnualFee: 48000.00,
    currency: 'USD',
    committedSeats: 15,
    totalContractValue: 48000.00,
    annualContractValue: 48000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2024-06-01 09:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 72,
      riskClassification: 'HIGH',
      renewalRiskScore: 80,
      pricingRiskScore: 70,
      terminationRiskScore: 65,
      complianceRiskScore: 75,
      relationshipRiskScore: 70,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-003-dataflow',
    organizationId: 'demo-org',
    fileName: 'DataFlow_MSA_Professional_2023.pdf',
    customerName: 'DataFlow Analytics',
    customerType: 'Enterprise',
    industry: 'Data & Analytics',
    contractType: 'Professional Services MSA',
    initialTermEndDate: new Date('2025-09-09'),
    renewalType: 'AUTO_RENEWAL',
    renewalNoticeDays: 120,
    renewalNoticeDeadline: new Date('2025-05-11'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 30000.00,
    baseAnnualFee: 360000.00,
    currency: 'USD',
    committedSeats: 100,
    totalContractValue: 720000.00,
    annualContractValue: 360000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2023-09-10 14:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 15,
      riskClassification: 'LOW',
      renewalRiskScore: 10,
      pricingRiskScore: 15,
      terminationRiskScore: 20,
      complianceRiskScore: 10,
      relationshipRiskScore: 20,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-004-innovatetech',
    organizationId: 'demo-org',
    fileName: 'InnovateTech_MSA_2022.pdf',
    customerName: 'InnovateTech Solutions',
    customerType: 'Mid-Market',
    industry: 'Software Development',
    contractType: 'Master Service Agreement',
    initialTermEndDate: new Date('2025-12-31'),
    renewalType: 'MANUAL_RENEWAL',
    renewalNoticeDays: 90,
    renewalNoticeDeadline: new Date('2025-10-02'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'FLAT_FEE',
    baseMonthlyFee: 6000.00,
    baseAnnualFee: 72000.00,
    currency: 'USD',
    committedSeats: 20,
    totalContractValue: 216000.00,
    annualContractValue: 72000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2022-03-20 11:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 55,
      riskClassification: 'MEDIUM',
      renewalRiskScore: 60,
      pricingRiskScore: 55,
      terminationRiskScore: 50,
      complianceRiskScore: 55,
      relationshipRiskScore: 50,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-005-cloudfirst',
    organizationId: 'demo-org',
    fileName: 'CloudFirst_Enterprise_Agreement_2024.pdf',
    customerName: 'CloudFirst Corp',
    customerType: 'Enterprise',
    industry: 'Cloud Infrastructure',
    contractType: 'Enterprise Agreement',
    initialTermEndDate: new Date('2026-12-31'),
    renewalType: 'AUTO_RENEWAL',
    renewalNoticeDays: 180,
    renewalNoticeDeadline: new Date('2026-07-04'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 45000.00,
    baseAnnualFee: 540000.00,
    currency: 'USD',
    committedSeats: 150,
    totalContractValue: 1620000.00,
    annualContractValue: 540000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2024-01-01 10:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 10,
      riskClassification: 'LOW',
      renewalRiskScore: 5,
      pricingRiskScore: 10,
      terminationRiskScore: 15,
      complianceRiskScore: 10,
      relationshipRiskScore: 10,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-006-agileworks',
    organizationId: 'demo-org',
    fileName: 'AgileWorks_Professional_Services_2023.pdf',
    customerName: 'AgileWorks Consulting',
    customerType: 'Mid-Market',
    industry: 'Business Consulting',
    contractType: 'Professional Services Agreement',
    initialTermEndDate: new Date('2025-07-14'),
    renewalType: 'MANUAL_RENEWAL',
    renewalNoticeDays: 60,
    renewalNoticeDeadline: new Date('2025-05-15'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 8000.00,
    baseAnnualFee: 96000.00,
    currency: 'USD',
    committedSeats: 30,
    totalContractValue: 96000.00,
    annualContractValue: 96000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2023-07-15 13:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 68,
      riskClassification: 'HIGH',
      renewalRiskScore: 75,
      pricingRiskScore: 65,
      terminationRiskScore: 70,
      complianceRiskScore: 60,
      relationshipRiskScore: 70,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-007-nextgen',
    organizationId: 'demo-org',
    fileName: 'NextGen_MSA_2024.pdf',
    customerName: 'NextGen Robotics',
    customerType: 'Enterprise',
    industry: 'Manufacturing - Robotics',
    contractType: 'Master Service Agreement',
    initialTermEndDate: new Date('2026-02-28'),
    renewalType: 'AUTO_RENEWAL',
    renewalNoticeDays: 90,
    renewalNoticeDeadline: new Date('2025-11-30'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 20000.00,
    baseAnnualFee: 240000.00,
    currency: 'USD',
    committedSeats: 60,
    totalContractValue: 480000.00,
    annualContractValue: 240000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2024-03-01 12:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 32,
      riskClassification: 'LOW',
      renewalRiskScore: 30,
      pricingRiskScore: 35,
      terminationRiskScore: 30,
      complianceRiskScore: 35,
      relationshipRiskScore: 30,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-008-healthtech',
    organizationId: 'demo-org',
    fileName: 'HealthTech_HIPAA_MSA_2022.pdf',
    customerName: 'HealthTech Partners',
    customerType: 'Regulated Industry',
    industry: 'Healthcare IT',
    contractType: 'HIPAA-Compliant MSA',
    initialTermEndDate: new Date('2025-10-31'),
    renewalType: 'MANUAL_RENEWAL',
    renewalNoticeDays: 120,
    renewalNoticeDeadline: new Date('2025-07-03'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'FLAT_FEE',
    baseMonthlyFee: 12000.00,
    baseAnnualFee: 144000.00,
    currency: 'USD',
    committedSeats: 40,
    totalContractValue: 432000.00,
    annualContractValue: 144000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2022-11-01 15:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 48,
      riskClassification: 'MEDIUM',
      renewalRiskScore: 50,
      pricingRiskScore: 45,
      terminationRiskScore: 50,
      complianceRiskScore: 45,
      relationshipRiskScore: 50,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-009-finserve',
    organizationId: 'demo-org',
    fileName: 'FinServe_Enterprise_MSA_BAA_2024.pdf',
    customerName: 'FinServe Global',
    customerType: 'Strategic',
    industry: 'Financial Services',
    contractType: 'Enterprise MSA + BAA',
    initialTermEndDate: new Date('2026-08-14'),
    renewalType: 'AUTO_RENEWAL',
    renewalNoticeDays: 180,
    renewalNoticeDeadline: new Date('2026-02-15'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 40000.00,
    baseAnnualFee: 480000.00,
    currency: 'USD',
    committedSeats: 120,
    totalContractValue: 960000.00,
    annualContractValue: 480000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2024-08-15 10:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 18,
      riskClassification: 'LOW',
      renewalRiskScore: 20,
      pricingRiskScore: 15,
      terminationRiskScore: 20,
      complianceRiskScore: 15,
      relationshipRiskScore: 20,
      calculationVersion: 'v1.0.0',
    },
  },
  {
    id: 'cust-010-retailops',
    organizationId: 'demo-org',
    fileName: 'RetailOps_MSA_2023.pdf',
    customerName: 'RetailOps Inc.',
    customerType: 'Mid-Market',
    industry: 'Retail Technology',
    contractType: 'Master Service Agreement',
    initialTermEndDate: new Date('2026-02-09'),
    renewalType: 'AUTO_RENEWAL',
    renewalNoticeDays: 60,
    renewalNoticeDeadline: new Date('2025-12-11'),
    whoCanTerminate: 'EITHER_PARTY',
    pricingModel: 'PER_USER',
    baseMonthlyFee: 9000.00,
    baseAnnualFee: 108000.00,
    currency: 'USD',
    committedSeats: 30,
    totalContractValue: 324000.00,
    annualContractValue: 108000.00,
    status: 'active',
    manualEntryComplete: true,
    createdAt: new Date('2023-02-10 11:00:00'),
    updatedAt: new Date('2025-11-18 10:00:00'),
    riskScore: {
      overallRiskScore: 40,
      riskClassification: 'MEDIUM',
      renewalRiskScore: 45,
      pricingRiskScore: 40,
      terminationRiskScore: 35,
      complianceRiskScore: 40,
      relationshipRiskScore: 40,
      calculationVersion: 'v1.0.0',
    },
  },
];

async function main() {
  console.log('🌱 Starting customer data seed...\n');

  // Upsert organization first
  await prisma.organization.upsert({
    where: { id: 'demo-org' },
    update: {},
    create: {
      id: 'demo-org',
      name: 'Demo Organization',
      domain: 'demo.contractiq.ai',
    },
  });

  console.log('✅ Organization created/updated: demo-org\n');

  // Load each contract with its risk score
  for (const contractData of contracts) {
    const { riskScore, ...contract } = contractData;

    try {
      await prisma.contract.upsert({
        where: { id: contract.id },
        update: contract,
        create: {
          ...contract,
          riskScore: {
            create: {
              id: `risk-${contract.id.substring(5)}`,
              ...riskScore,
            },
          },
        },
      });

      const riskLabel =
        riskScore.riskClassification === 'HIGH'
          ? '⚠️  HIGH'
          : riskScore.riskClassification === 'MEDIUM'
          ? '⚡ MEDIUM'
          : '✅ LOW';

      console.log(
        `✅ ${contract.customerName.padEnd(30)} | ${riskLabel.padEnd(12)} | ACV: $${(contract.annualContractValue || 0).toLocaleString()}`
      );
    } catch (error) {
      console.error(`❌ Error loading ${contract.customerName}:`, error);
    }
  }

  // Calculate totals
  const totalACV = contracts.reduce(
    (sum, c) => sum + (c.annualContractValue || 0),
    0
  );

  console.log('\n' + '='.repeat(70));
  console.log('📊 PORTFOLIO SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Customers: ${contracts.length}`);
  console.log(`Total ACV: $${totalACV.toLocaleString()}`);
  console.log(`Average ACV: $${(totalACV / contracts.length).toLocaleString()}`);
  console.log(
    `\nHigh Churn Risk: ${contracts.filter((c) => c.riskScore.riskClassification === 'HIGH').length}`
  );
  console.log(
    `Medium Churn Risk: ${contracts.filter((c) => c.riskScore.riskClassification === 'MEDIUM').length}`
  );
  console.log(
    `Low Churn Risk: ${contracts.filter((c) => c.riskScore.riskClassification === 'LOW').length}`
  );
  console.log('\n🎉 Customer data seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
