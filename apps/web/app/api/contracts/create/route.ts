// POST /api/contracts/create
// Creates a new contract with manual data entry + calculates risk score

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Calculate renewal notice deadline
    const renewalNoticeDeadline = body.renewalNoticeDays && body.initialTermEndDate
      ? new Date(new Date(body.initialTermEndDate).getTime() - (body.renewalNoticeDays * 24 * 60 * 60 * 1000))
      : null
    
    // Calculate contract values
    const baseMonthly = body.baseMonthlyFee ? parseFloat(body.baseMonthlyFee) : 0
    const baseAnnual = body.baseAnnualFee ? parseFloat(body.baseAnnualFee) : baseMonthly * 12
    
    // Create contract
    const contract = await prisma.contract.create({
      data: {
        organizationId: body.organizationId || 'demo-org', // TODO: Get from session
        fileName: body.fileName || 'Manual Entry',
        customerName: body.customerName,
        contractType: body.contractType,
        effectiveDate: body.effectiveDate ? new Date(body.effectiveDate) : null,
        
        // Term & Renewal
        initialTermEndDate: new Date(body.initialTermEndDate),
        renewalType: body.renewalType,
        renewalNoticeDays: body.renewalNoticeDays || null,
        renewalNoticeDeadline: renewalNoticeDeadline,
        whoCanTerminate: body.whoCanTerminate,
        
        // Pricing
        pricingModel: body.pricingModel,
        baseMonthlyFee: baseMonthly,
        baseAnnualFee: baseAnnual,
        currency: body.currency || 'USD',
        committedSeats: body.committedSeats || null,
        
        // Calculate contract values
        totalContractValue: baseAnnual * 3, // Assume 3-year deal
        annualContractValue: baseAnnual,
        
        manualEntryComplete: true,
        status: 'active',
      },
    })
    
    // Calculate risk score
    const riskScore = calculateRiskScore(contract)
    
    // Save risk score
    const savedRiskScore = await prisma.riskScore.create({
      data: {
        contractId: contract.id,
        ...riskScore,
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      contract,
      riskScore: savedRiskScore
    })
    
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { error: 'Failed to create contract', details: String(error) },
      { status: 500 }
    )
  }
}

// Risk Scoring Algorithm
// Based on BUSINESS-MODEL-PIVOT-SPECS/03-RISK-SCORING-ALGORITHM.md
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
    renewalRiskScore = Math.max(renewalRiskScore - 20, 10) // Reduce risk if auto-renewal
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
  
  // Generate recommended actions
  const recommendedActions = generateActions(overallRiskScore, daysUntilDeadline, contract.renewalType)
  
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
    recommendedActions,
    calculationVersion: 'v1.0.0',
  }
}

function generateActions(riskScore: number, daysUntilDeadline: number, renewalType: string) {
  const actions = []
  
  if (daysUntilDeadline <= 0) {
    actions.push({
      action: '🚨 IMMEDIATE: Contact customer TODAY - deadline has passed',
      priority: 'CRITICAL',
      deadline: new Date().toISOString(),
      reason: 'Renewal deadline exceeded - risk of automatic cancellation or unfavorable terms',
    })
  } else if (daysUntilDeadline <= 7) {
    actions.push({
      action: 'Contact customer within 24 hours to discuss renewal',
      priority: 'HIGH',
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      reason: `Only ${daysUntilDeadline} days until renewal deadline`,
    })
  } else if (daysUntilDeadline <= 30) {
    actions.push({
      action: 'Schedule renewal discussion this week',
      priority: 'HIGH',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Renewal deadline approaching - proactive outreach needed',
    })
  } else if (daysUntilDeadline <= 60) {
    actions.push({
      action: 'Begin renewal preparation and stakeholder mapping',
      priority: 'MEDIUM',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Start renewal discussions early to identify potential issues',
    })
  }
  
  if (renewalType === 'MANUAL_RENEWAL' && riskScore >= 60) {
    actions.push({
      action: 'Prepare renewal proposal with pricing analysis',
      priority: 'MEDIUM',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Manual renewal requires proactive customer engagement',
    })
  }
  
  return actions
}
