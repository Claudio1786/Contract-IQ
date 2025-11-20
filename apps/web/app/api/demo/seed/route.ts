// POST /api/demo/seed
// Seeds the database with 6 realistic demo contracts for organization 'demo-org'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { demoContracts, toPrismaContractData } from '@/lib/seed/demo-contracts'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const reset = body?.reset !== false // default true

    // Optional reset: clear existing demo data for org
    if (reset) {
      await prisma.contract.deleteMany({ where: { organizationId: 'demo-org' } })
    }

    const created: any[] = []
    for (const d of demoContracts) {
      const data = toPrismaContractData(d) as any

      // Create contract
      const contract = await prisma.contract.create({ data })

      // Calculate and save risk score
      const risk = calculateRiskScore(contract as any)
      await prisma.riskScore.create({
        data: {
          contractId: contract.id,
          ...risk,
        },
      })

      created.push(contract)
    }

    // Summary
    const total_acv = created.reduce((sum, c: any) => sum + Number(c.annualContractValue || 0), 0)

    return NextResponse.json({
      success: true,
      count: created.length,
      total_acv,
      message: `Seeded ${created.length} demo contracts.`,
    })
  } catch (error) {
    console.error('Error seeding demo data:', error)
    return NextResponse.json({ success: false, error: 'Failed to seed demo data', details: String(error) }, { status: 500 })
  }
}

// --- Risk scoring (copied from /api/contracts/create) ---
function calculateRiskScore(contract: any) {
  const today = new Date()
  const daysUntilDeadline = contract.renewalNoticeDeadline
    ? Math.ceil((contract.renewalNoticeDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : 999

  // Renewal risk (40% weight)
  let renewalRiskScore = 0
  const renewalFactors: string[] = []

  if (daysUntilDeadline <= 0) {
    renewalRiskScore = 100
    renewalFactors.push('🚨 CRITICAL: Renewal notice deadline has PASSED')
  } else if (daysUntilDeadline <= 7) {
    renewalRiskScore = 95
    renewalFactors.push(`⚠️ URGENT: Only ${daysUntilDeadline} days until renewal deadline`)
  } else if (daysUntilDeadline <= 15) {
    renewalRiskScore = 90
    renewalFactors.push(`⚠️ ${daysUntilDeadline} days until renewal deadline (act now)`)
  } else if (daysUntilDeadline <= 30) {
    renewalRiskScore = 75
    renewalFactors.push(`${daysUntilDeadline} days until renewal deadline`)
  } else if (daysUntilDeadline <= 60) {
    renewalRiskScore = 50
    renewalFactors.push(`${daysUntilDeadline} days until renewal deadline`)
  } else if (daysUntilDeadline <= 90) {
    renewalRiskScore = 30
    renewalFactors.push(`${daysUntilDeadline} days until renewal deadline`)
  } else {
    renewalRiskScore = 10
    renewalFactors.push(`${daysUntilDeadline} days until renewal deadline (low urgency)`)
  }

  if (contract.renewalType === 'AUTO_RENEWAL') {
    renewalFactors.push('✓ Auto-renewal clause active')
    renewalRiskScore = Math.max(renewalRiskScore - 20, 10)
  } else if (contract.renewalType === 'MANUAL_RENEWAL') {
    renewalFactors.push('⚠️ Manual renewal required - proactive outreach needed')
    renewalRiskScore = Math.min(renewalRiskScore + 10, 100)
  }

  // Pricing risk (25% weight) - Placeholder for now
  const pricingRiskScore = 20
  const pricingFactors = ['No pricing analysis available yet']

  // Termination risk (20% weight)
  let terminationRiskScore = 30
  const terminationFactors: string[] = []

  if (contract.whoCanTerminate === 'EITHER_PARTY') {
    terminationRiskScore = 50
    terminationFactors.push('Either party can terminate')
  } else if (contract.whoCanTerminate === 'CUSTOMER_ONLY') {
    terminationRiskScore = 70
    terminationFactors.push('Customer has unilateral termination rights')
  } else if (contract.whoCanTerminate === 'PROVIDER_ONLY') {
    terminationRiskScore = 10
    terminationFactors.push('Only provider can terminate')
  }

  // Compliance risk (10% weight) - Placeholder
  const complianceRiskScore = 15

  // Relationship risk (5% weight) - Placeholder
  const relationshipRiskScore = 25

  // Calculate overall risk (weighted average)
  const overallRiskScore = Math.round(
    renewalRiskScore * 0.40 +
    pricingRiskScore * 0.25 +
    terminationRiskScore * 0.20 +
    complianceRiskScore * 0.10 +
    relationshipRiskScore * 0.05
  )

  // Risk classification
  let riskClassification = 'LOW'
  if (overallRiskScore >= 75) riskClassification = 'HIGH'
  else if (overallRiskScore >= 40) riskClassification = 'MEDIUM'

  return {
    overallRiskScore,
    riskClassification,
    renewalRiskScore,
    pricingRiskScore,
    terminationRiskScore,
    complianceRiskScore,
    relationshipRiskScore,
    renewalRiskFactors: renewalFactors,
    pricingRiskFactors: pricingFactors,
    terminationRiskFactors: terminationFactors,
    recommendedActions: [],
    calculationVersion: 'v1.0.0',
  }
}
