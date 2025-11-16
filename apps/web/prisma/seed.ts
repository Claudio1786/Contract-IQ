/**
 * Database Seed Script
 * Epic 2: Task 2.1 - Database Setup
 * 
 * Populates database with test data for development
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const adminPassword = await hash('admin123', 12);
  const managerPassword = await hash('manager123', 12);
  const viewerPassword = await hash('viewer123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@contractiq.com' },
    update: {},
    create: {
      email: 'admin@contractiq.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@contractiq.com' },
    update: {},
    create: {
      email: 'manager@contractiq.com',
      password: managerPassword,
      name: 'Manager User',
      role: 'MANAGER',
      emailVerified: new Date(),
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@contractiq.com' },
    update: {},
    create: {
      email: 'viewer@contractiq.com',
      password: viewerPassword,
      name: 'Viewer User',
      role: 'VIEWER',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created test users:');
  console.log(`   - Admin: admin@contractiq.com / admin123`);
  console.log(`   - Manager: manager@contractiq.com / manager123`);
  console.log(`   - Viewer: viewer@contractiq.com / viewer123`);

  // Create sample contracts for testing (when Epic 3 is implemented)
  console.log('\\n📄 Creating sample contracts...');

  const contract1 = await prisma.contract.create({
    data: {
      userId: admin.id,
      title: 'Acme Corp SaaS Agreement',
      fileName: 'acme-saas-agreement.pdf',
      fileUrl: '/uploads/sample-contract-1.pdf',
      fileSize: 524288, // 512 KB
      mimeType: 'application/pdf',
      status: 'ANALYZED',
      vendor: 'Acme Corporation',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      value: 120000,
    },
  });

  const contract2 = await prisma.contract.create({
    data: {
      userId: manager.id,
      title: 'TechVendor Professional Services',
      fileName: 'techvendor-services.pdf',
      fileUrl: '/uploads/sample-contract-2.pdf',
      fileSize: 389120, // 380 KB
      mimeType: 'application/pdf',
      status: 'ANALYZED',
      vendor: 'TechVendor Inc',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-05-31'),
      value: 85000,
    },
  });

  const contract3 = await prisma.contract.create({
    data: {
      userId: admin.id,
      title: 'CloudServices Master Agreement',
      fileName: 'cloudservices-msa.pdf',
      fileUrl: '/uploads/sample-contract-3.pdf',
      fileSize: 671744, // 656 KB
      mimeType: 'application/pdf',
      status: 'PENDING',
      vendor: 'CloudServices Ltd',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2027-10-31'),
      value: 350000,
    },
  });

  console.log(`✅ Created ${3} sample contracts`);

  // Create sample analysis data
  console.log('\\n🤖 Creating sample analysis data...');

  await prisma.analysis.create({
    data: {
      contractId: contract1.id,
      riskScore: 35,
      riskLevel: 'MEDIUM',
      liabilityRisks: ['Limited liability clause caps at $100k', 'Force majeure clause is vendor-favorable'],
      complianceRisks: ['Missing GDPR data processing addendum', 'Audit rights limited to once per year'],
      financialRisks: ['Auto-renewal with 90-day notice period', 'Annual price increase of 5% allowed'],
      costAnalysis: JSON.stringify({
        totalValue: 120000,
        paymentTerms: 'Annual prepayment',
        hiddenFees: ['Implementation fee: $5,000', 'Support beyond business hours: $150/hour'],
      }),
      complianceCheck: JSON.stringify({
        gdpr: 'Partial compliance - requires DPA',
        soc2: 'Compliant',
        hipaa: 'Not applicable',
      }),
      recommendations: JSON.stringify([
        'Negotiate GDPR Data Processing Addendum',
        'Request liability cap increase to $500k',
        'Reduce auto-renewal notice period to 60 days',
      ]),
      playbook: JSON.stringify({
        objectives: ['Increase liability protection', 'Improve data privacy terms'],
        strategies: ['Leverage competitive alternatives', 'Cite industry standards'],
        talking Points: ['Reference competing vendor terms', 'Emphasize data volume'],
      }),
    },
  });

  await prisma.analysis.create({
    data: {
      contractId: contract2.id,
      riskScore: 58,
      riskLevel: 'MEDIUM',
      liabilityRisks: ['Unlimited liability for IP infringement', 'No limitation on consequential damages'],
      complianceRisks: ['Missing insurance requirements', 'Weak confidentiality terms'],
      financialRisks: ['Payment within 15 days (industry standard is 30)', 'No volume discounts'],
      costAnalysis: JSON.stringify({
        totalValue: 85000,
        paymentTerms: 'Net 15',
        hiddenFees: ['Travel expenses billed at cost plus 20%'],
      }),
      complianceCheck: JSON.stringify({
        gdpr: 'Not addressed',
        soc2: 'Unknown',
        hipaa: 'Not applicable',
      }),
      recommendations: JSON.stringify([
        'Add cap on consequential damages',
        'Extend payment terms to Net 30',
        'Request insurance certificate',
        'Strengthen confidentiality obligations',
      ]),
      playbook: JSON.stringify({
        objectives: ['Limit liability exposure', 'Improve payment terms'],
        strategies: ['Request mutual liability caps', 'Cite payment industry norms'],
        talkingPoints: ['Reference standard PSA terms', 'Highlight partnership value'],
      }),
    },
  });

  console.log(`✅ Created ${2} sample analyses`);

  // Create sample tags
  console.log('\\n🏷️  Creating sample tags...');

  await prisma.contractTag.createMany({
    data: [
      { contractId: contract1.id, tag: 'saas' },
      { contractId: contract1.id, tag: 'high-value' },
      { contractId: contract1.id, tag: 'recurring' },
      { contractId: contract2.id, tag: 'services' },
      { contractId: contract2.id, tag: 'consulting' },
      { contractId: contract3.id, tag: 'saas' },
      { contractId: contract3.id, tag: 'infrastructure' },
      { contractId: contract3.id, tag: 'multi-year' },
    ],
  });

  console.log(`✅ Created ${8} sample tags`);

  // Create sample notifications
  console.log('\\n🔔 Creating sample notifications...');

  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        type: 'CONTRACT_EXPIRING',
        title: 'Contract Expiring Soon',
        message: 'Acme Corp SaaS Agreement expires in 90 days',
        read: false,
      },
      {
        userId: admin.id,
        type: 'HIGH_RISK_ALERT',
        title: 'High Risk Contract Detected',
        message: 'TechVendor Professional Services has a risk score of 58',
        read: false,
      },
      {
        userId: manager.id,
        type: 'ANALYSIS_COMPLETE',
        title: 'Analysis Complete',
        message: 'Your contract analysis for TechVendor is ready',
        read: true,
      },
    ],
  });

  console.log(`✅ Created ${3} sample notifications`);

  console.log('\\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
