import { NextRequest, NextResponse } from 'next/server'

interface RedlineAnalysisRequest {
  contractId: string
  redlineFile: string
  originalContent?: string
  contractType?: string
}

interface AnalyzedChange {
  id: string
  changeNumber: number
  section: string
  changeType: 'addition' | 'deletion' | 'modification'
  originalText: string
  proposedText: string
  businessImpact: string
  riskLevel: 'low' | 'medium' | 'high'
  suggestedResponse: string
  talkingPoints: string[]
  legalImplications?: string
  financialImpact?: string
}

interface RedlineAnalysisResponse {
  contractId: string
  analysisId: string
  timestamp: string
  summary: {
    totalChanges: number
    highRiskChanges: number
    mediumRiskChanges: number
    lowRiskChanges: number
    estimatedNegotiationTime: string
    overallRiskAssessment: string
  }
  changes: AnalyzedChange[]
  negotiationStrategy: {
    priorityIssues: string[]
    suggestedApproach: string
    leveragePoints: string[]
    potentialCompromises: string[]
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: RedlineAnalysisRequest = await req.json()
    const { contractId, redlineFile, originalContent, contractType } = body

    // In production, this would:
    // 1. Parse the uploaded redline document
    // 2. Compare with original contract (if available)
    // 3. Use AI (GPT-4, Claude, etc.) to analyze changes
    // 4. Generate risk assessments and negotiation suggestions
    // 5. Store analysis in database

    // Mock AI-powered analysis response
    const analysisResponse: RedlineAnalysisResponse = {
      contractId,
      analysisId: `analysis_${Date.now()}`,
      timestamp: new Date().toISOString(),
      summary: {
        totalChanges: 12,
        highRiskChanges: 3,
        mediumRiskChanges: 5,
        lowRiskChanges: 4,
        estimatedNegotiationTime: '2-3 business days',
        overallRiskAssessment: 'The customer has proposed several significant changes that shift liability and payment terms in their favor. While some changes are reasonable, three require immediate attention and negotiation.'
      },
      changes: [
        {
          id: 'change_1',
          changeNumber: 1,
          section: '3.2 Payment Terms',
          changeType: 'modification',
          originalText: 'Payment is due within 30 days of invoice date',
          proposedText: 'Payment is due within 90 days of invoice date',
          businessImpact: 'This change would delay cash flow by 60 days, potentially impacting working capital and requiring adjustment to financial projections.',
          riskLevel: 'high',
          suggestedResponse: 'Counter with 45 days as a compromise, or maintain 30 days but offer 2% early payment discount',
          talkingPoints: [
            'Industry standard for SaaS contracts is typically 30 days',
            'Extended payment terms impact our ability to deliver continuous service',
            'We can offer a 2% discount for payments within 10 days as an alternative',
            'Our cash flow requirements necessitate predictable payment schedules'
          ],
          legalImplications: 'Extended payment terms may require additional credit checks and could impact revenue recognition',
          financialImpact: 'Could delay ~$50,000 in monthly revenue by 60 days'
        },
        {
          id: 'change_2',
          changeNumber: 2,
          section: '5.1 Liability Cap',
          changeType: 'modification',
          originalText: 'Liability limited to 12 months of fees paid',
          proposedText: 'Liability limited to 3 months of fees paid',
          businessImpact: 'Significantly reduces our protection in case of disputes. This is 75% reduction in liability coverage.',
          riskLevel: 'high',
          suggestedResponse: 'Propose 6 months as middle ground, or maintain 12 months but exclude certain types of damages',
          talkingPoints: [
            'Our standard contracts maintain 12 months to align with annual contract value',
            '3 months is below industry standard and may not cover implementation costs',
            'Consider carve-outs for specific concerns rather than reducing overall cap',
            'Our insurance requirements mandate minimum liability thresholds'
          ],
          legalImplications: 'May not meet insurance policy requirements; could affect D&O coverage',
          financialImpact: 'Reduces maximum liability coverage by $150,000'
        },
        {
          id: 'change_3',
          changeNumber: 3,
          section: '2.1 Service Level Agreement',
          changeType: 'modification',
          originalText: '99.5% uptime guarantee',
          proposedText: '99.9% uptime guarantee with penalties for breach',
          businessImpact: 'Increases our SLA commitment and adds financial penalties. Would require infrastructure investment.',
          riskLevel: 'high',
          suggestedResponse: 'Accept 99.9% uptime but limit penalties to service credits rather than cash refunds',
          talkingPoints: [
            'Current infrastructure supports 99.5% reliably',
            'Achieving 99.9% would require additional investment in redundancy',
            'Service credits are industry standard rather than cash penalties',
            'Consider excluding planned maintenance windows from calculations'
          ],
          legalImplications: 'Creates potential for significant financial exposure if SLA is breached',
          financialImpact: 'Infrastructure upgrades would cost ~$25,000; potential penalties up to $5,000/month'
        },
        {
          id: 'change_4',
          changeNumber: 4,
          section: '7.3 Termination Rights',
          changeType: 'addition',
          originalText: '',
          proposedText: 'Customer may terminate for convenience with 30 days notice',
          businessImpact: 'Adds unilateral termination right that could impact revenue predictability and contract value.',
          riskLevel: 'medium',
          suggestedResponse: 'Accept but require payment of remaining contract term or minimum 3 months fees',
          talkingPoints: [
            'Termination for convenience undermines annual contract commitments',
            'Consider requiring payment of 50% of remaining contract value',
            'Alternative: Allow after first 6 months with 3 months notice',
            'This provision affects our ability to forecast revenue'
          ],
          legalImplications: 'May impact revenue recognition and requires adjustment to standard terms',
          financialImpact: 'Could result in loss of up to $200,000 in contracted revenue'
        },
        {
          id: 'change_5',
          changeNumber: 5,
          section: '4.1 Data Security',
          changeType: 'addition',
          originalText: 'Provider maintains commercially reasonable security measures',
          proposedText: 'Provider maintains SOC 2 Type II compliance and provides annual audit reports',
          businessImpact: 'Requires specific compliance certification. We currently have SOC 2 Type I.',
          riskLevel: 'medium',
          suggestedResponse: 'Commit to achieving SOC 2 Type II within 6 months, provide Type I report immediately',
          talkingPoints: [
            'Currently maintain SOC 2 Type I certification',
            'Type II certification in progress, expected completion Q2 2024',
            'Can provide current security documentation and roadmap',
            'Consider accepting equivalent security standards (ISO 27001)'
          ],
          legalImplications: 'Creates specific compliance obligation with potential breach implications',
          financialImpact: 'SOC 2 Type II audit costs ~$30,000 annually'
        },
        {
          id: 'change_6',
          changeNumber: 6,
          section: '6.2 Support Response Times',
          changeType: 'modification',
          originalText: 'Critical issues: 4 hour response time',
          proposedText: 'Critical issues: 1 hour response time with 24/7 availability',
          businessImpact: 'Requires significant support infrastructure changes including 24/7 staffing.',
          riskLevel: 'medium',
          suggestedResponse: '2 hour response for critical issues during business hours, 4 hours for after-hours',
          talkingPoints: [
            'Current support team provides coverage during business hours',
            '24/7 support would require additional staffing investment',
            'Consider defining "critical" more narrowly to limit exposure',
            'Offer dedicated account manager as alternative to 24/7 support'
          ],
          legalImplications: 'Creates specific performance obligations with potential breach consequences',
          financialImpact: '24/7 support would cost additional $100,000 annually in staffing'
        },
        {
          id: 'change_7',
          changeNumber: 7,
          section: '8.1 Intellectual Property',
          changeType: 'modification',
          originalText: 'Customer data remains property of customer',
          proposedText: 'All work product and derivatives become property of customer',
          businessImpact: 'Could impact our ability to improve platform based on customer usage patterns.',
          riskLevel: 'medium',
          suggestedResponse: 'Customer owns their data; we retain rights to aggregated, anonymized insights',
          talkingPoints: [
            'Platform improvements benefit all customers',
            'Aggregated insights drive product development',
            'Customer owns their specific data and configurations',
            'Industry standard allows vendor to use anonymized data'
          ],
          legalImplications: 'May restrict product development and improvement capabilities',
          financialImpact: 'Could limit product development efficiency, indirect cost impact'
        },
        {
          id: 'change_8',
          changeNumber: 8,
          section: '9.3 Governing Law',
          changeType: 'modification',
          originalText: 'Governed by laws of Delaware',
          proposedText: 'Governed by laws of Customer\'s state (California)',
          businessImpact: 'Changes legal jurisdiction which may have different statutory requirements.',
          riskLevel: 'low',
          suggestedResponse: 'Accept California law but maintain Delaware courts for disputes',
          talkingPoints: [
            'Delaware law is business-friendly and predictable',
            'Can accept California law if critical for deal',
            'Ensure arbitration clause remains intact',
            'Consider implications for other contract provisions'
          ],
          legalImplications: 'California has specific statutory requirements that may apply',
          financialImpact: 'Minimal direct impact; potential legal cost differences'
        },
        {
          id: 'change_9',
          changeNumber: 9,
          section: '3.5 Price Adjustments',
          changeType: 'deletion',
          originalText: 'Annual price increases not to exceed 5%',
          proposedText: '[Deleted]',
          businessImpact: 'Removes our ability to adjust pricing annually for inflation and cost increases.',
          riskLevel: 'medium',
          suggestedResponse: 'Restore clause but reduce to 3% annual cap or CPI, whichever is lower',
          talkingPoints: [
            'Annual adjustments necessary to account for inflation',
            'Industry standard includes some form of price adjustment',
            'Consider tying to CPI or fixed percentage, whichever is lower',
            'Lock pricing for first 2 years as compromise'
          ],
          legalImplications: 'Removes contractual right to price adjustments',
          financialImpact: 'Could result in margin erosion of 3-5% annually'
        },
        {
          id: 'change_10',
          changeNumber: 10,
          section: '2.3 Implementation Timeline',
          changeType: 'modification',
          originalText: 'Implementation within 60 days of contract execution',
          proposedText: 'Implementation within 30 days of contract execution',
          businessImpact: 'Reduces implementation timeline by 50%, may require resource reallocation.',
          riskLevel: 'low',
          suggestedResponse: 'Accept if customer provides dedicated resources; otherwise maintain 60 days',
          talkingPoints: [
            'Standard implementation requires customer data migration',
            'Accelerated timeline possible with dedicated customer resources',
            'Consider phased approach with core features in 30 days',
            'Fast-track option available for additional fee'
          ],
          legalImplications: 'Creates tighter performance obligation',
          financialImpact: 'May require consultant overtime, ~$10,000 additional cost'
        },
        {
          id: 'change_11',
          changeNumber: 11,
          section: '10.2 Renewal Terms',
          changeType: 'modification',
          originalText: 'Auto-renewal unless cancelled 30 days prior',
          proposedText: 'Requires mutual written agreement to renew',
          businessImpact: 'Removes auto-renewal, requiring active renewal negotiations each term.',
          riskLevel: 'low',
          suggestedResponse: 'Accept but add right of first refusal and 60-day negotiation window',
          talkingPoints: [
            'Auto-renewal ensures service continuity',
            'Can accept mutual agreement with 90-day advance negotiation',
            'Consider multi-year terms with better pricing',
            'Build in price protection for renewal commitment'
          ],
          legalImplications: 'Changes renewal dynamics and notice requirements',
          financialImpact: 'Increases sales costs for renewal negotiations'
        },
        {
          id: 'change_12',
          changeNumber: 12,
          section: '4.3 Audit Rights',
          changeType: 'addition',
          originalText: '',
          proposedText: 'Customer may audit Provider\'s compliance annually with 30 days notice',
          businessImpact: 'Adds operational burden of supporting customer audits.',
          riskLevel: 'low',
          suggestedResponse: 'Accept with limitations: once per year, business hours, at customer expense',
          talkingPoints: [
            'Standard audit rights are reasonable for enterprise contracts',
            'Limit to once annually during business hours',
            'Customer bears cost of audit unless material breach found',
            'Can provide standard audit reports in lieu of on-site audit'
          ],
          legalImplications: 'Creates audit obligations and potential confidentiality issues',
          financialImpact: 'Audit support costs ~$5,000 per audit'
        }
      ],
      negotiationStrategy: {
        priorityIssues: [
          'Payment terms (Change #1) - Critical for cash flow',
          'Liability cap reduction (Change #2) - Significant risk exposure',
          'SLA penalties (Change #3) - Infrastructure and financial impact',
          'Termination for convenience (Change #4) - Revenue predictability'
        ],
        suggestedApproach: 'Focus negotiation on high-risk items first. Bundle concessions on low-risk items to gain leverage on critical issues. Consider offering pricing incentives for accepting standard terms on liability and payment.',
        leveragePoints: [
          'Our platform\'s proven ROI and industry-leading features',
          'Flexibility on implementation timeline and support options',
          'Willingness to provide additional security compliance documentation',
          'Potential for multi-year discount in exchange for standard terms'
        ],
        potentialCompromises: [
          'Accept California law and audit rights as easy concessions',
          'Offer phased implementation with core features accelerated',
          'Provide service credits instead of cash penalties for SLA',
          'Lock pricing for 2 years in exchange for maintaining payment terms'
        ]
      }
    }

    return NextResponse.json(analysisResponse)
  } catch (error) {
    console.error('Error analyzing redlines:', error)
    return NextResponse.json(
      { error: 'Failed to analyze redlines' },
      { status: 500 }
    )
  }
}