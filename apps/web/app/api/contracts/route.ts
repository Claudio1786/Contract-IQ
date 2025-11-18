// GET /api/contracts
// Lists all contracts for an organization with risk scores

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organizationId') || 'demo-org' // TODO: Get from session
    const riskLevel = searchParams.get('riskLevel') // 'HIGH', 'MEDIUM', 'LOW'
    const search = searchParams.get('search') // Search by customer name
    
    // Build where clause
    const where: any = {
      organizationId: organizationId,
      status: 'active',
    }
    
    if (search) {
      where.customerName = {
        contains: search,
        mode: 'insensitive',
      }
    }
    
    // Get contracts with risk scores
    let contracts = await prisma.contract.findMany({
      where,
      include: {
        riskScore: true,
      },
      orderBy: {
        renewalNoticeDeadline: 'asc', // Soonest deadlines first
      },
    })
    
    // Filter by risk level if provided
    if (riskLevel) {
      contracts = contracts.filter(c => 
        c.riskScore && c.riskScore.riskClassification === riskLevel
      )
    }
    
    // Calculate summary statistics
    const summary = {
      total: contracts.length,
      high_risk: contracts.filter(c => c.riskScore?.riskClassification === 'HIGH').length,
      medium_risk: contracts.filter(c => c.riskScore?.riskClassification === 'MEDIUM').length,
      low_risk: contracts.filter(c => c.riskScore?.riskClassification === 'LOW').length,
      total_acv: contracts.reduce((sum, c) => sum + Number(c.annualContractValue || 0), 0),
      expiring_30_days: contracts.filter(c => {
        if (!c.renewalNoticeDeadline) return false
        const daysUntil = Math.ceil((c.renewalNoticeDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return daysUntil <= 30
      }).length,
      expiring_60_days: contracts.filter(c => {
        if (!c.renewalNoticeDeadline) return false
        const daysUntil = Math.ceil((c.renewalNoticeDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return daysUntil <= 60
      }).length,
      expiring_90_days: contracts.filter(c => {
        if (!c.renewalNoticeDeadline) return false
        const daysUntil = Math.ceil((c.renewalNoticeDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return daysUntil <= 90
      }).length,
    }
    
    return NextResponse.json({ 
      success: true, 
      contracts,
      summary,
    })
    
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts', details: String(error) },
      { status: 500 }
    )
  }
}
