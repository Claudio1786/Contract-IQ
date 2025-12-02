import { NextRequest, NextResponse } from 'next/server'

interface ChangeDecisionRequest {
  changeId: string
  contractId: string
  decision: 'accept' | 'reject' | 'counter'
  counterProposal?: {
    text: string
    reasoning: string
    compromiseOffered?: string
  }
  notes?: string
  notifyCustomer?: boolean
}

interface ChangeDecisionResponse {
  success: boolean
  changeId: string
  contractId: string
  decision: 'accept' | 'reject' | 'counter'
  timestamp: string
  nextSteps: string[]
  emailDraft?: {
    subject: string
    body: string
    attachments?: string[]
  }
  contractStatus: {
    totalChanges: number
    acceptedChanges: number
    rejectedChanges: number
    pendingChanges: number
    negotiationProgress: number // percentage
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const changeId = params.id
    const body: ChangeDecisionRequest = await req.json()
    const { contractId, decision, counterProposal, notes, notifyCustomer } = body

    // In production, this would:
    // 1. Update the change decision in the database
    // 2. Track negotiation history
    // 3. Update contract status
    // 4. Generate email communications if requested
    // 5. Trigger notifications to relevant parties
    // 6. Update analytics and reporting

    // Mock response based on decision type
    let emailDraft = undefined
    let nextSteps: string[] = []

    if (decision === 'accept') {
      nextSteps = [
        'Update contract document with accepted change',
        'Mark change as resolved in tracking system',
        'Proceed to next change or finalize if all changes addressed'
      ]
      
      if (notifyCustomer) {
        emailDraft = {
          subject: 'Re: Contract Redlines - Change Accepted',
          body: `Dear [Customer Name],\n\nThank you for your proposed modification to Section [X]. After careful review, we are pleased to accept this change as proposed.\n\nAccepted Change:\n${counterProposal?.text || '[Accepted change text]'}\n\n${notes ? `Additional Notes: ${notes}\n\n` : ''}This brings us closer to finalizing our agreement. We have [X] remaining items to review.\n\nBest regards,\n[Your Name]\n[Your Title]\n[Company Name]`,
          attachments: ['Updated_Contract_Draft_v2.docx']
        }
      }
    } else if (decision === 'reject') {
      nextSteps = [
        'Document rejection rationale for internal records',
        'Prepare talking points for customer discussion',
        'Consider alternative solutions to address underlying concern',
        'Move to next change item'
      ]
      
      if (notifyCustomer) {
        emailDraft = {
          subject: 'Re: Contract Redlines - Response to Proposed Changes',
          body: `Dear [Customer Name],\n\nThank you for your proposed modification to Section [X]. After thorough review with our legal and business teams, we must respectfully maintain the original language for this section.\n\nRationale:\n${notes || '[Explain business/legal reasons for maintaining original terms]'}\n\nWe understand your concerns and are open to discussing alternative approaches that might address your needs while maintaining our necessary protections. Perhaps we could schedule a brief call to explore other options?\n\nBest regards,\n[Your Name]\n[Your Title]\n[Company Name]`,
          attachments: []
        }
      }
    } else if (decision === 'counter') {
      nextSteps = [
        'Update contract with counter-proposal language',
        'Prepare negotiation talking points',
        'Document compromise rationale',
        'Send counter-proposal to customer',
        'Schedule follow-up discussion if needed'
      ]
      
      if (notifyCustomer && counterProposal) {
        emailDraft = {
          subject: 'Re: Contract Redlines - Counter-Proposal',
          body: `Dear [Customer Name],\n\nThank you for your proposed modification to Section [X]. We appreciate your perspective and would like to offer the following counter-proposal that we believe addresses both parties' concerns:\n\nOriginal Proposed Language:\n[Customer's proposed text]\n\nOur Counter-Proposal:\n${counterProposal.text}\n\nReasoning:\n${counterProposal.reasoning}\n\n${counterProposal.compromiseOffered ? `Compromise Offered:\n${counterProposal.compromiseOffered}\n\n` : ''}We believe this alternative language protects both parties' interests while ${notes || 'maintaining the commercial intent of our agreement'}.\n\nWe're happy to discuss this further at your convenience.\n\nBest regards,\n[Your Name]\n[Your Title]\n[Company Name]`,
          attachments: ['Contract_Redline_Counter_Proposal_v2.docx']
        }
      }
    }

    // Mock contract status calculation
    const contractStatus = {
      totalChanges: 12,
      acceptedChanges: decision === 'accept' ? 4 : 3,
      rejectedChanges: decision === 'reject' ? 3 : 2,
      pendingChanges: decision === 'counter' ? 5 : 6,
      negotiationProgress: decision === 'accept' ? 58 : decision === 'reject' ? 50 : 45
    }

    const response: ChangeDecisionResponse = {
      success: true,
      changeId,
      contractId,
      decision,
      timestamp: new Date().toISOString(),
      nextSteps,
      emailDraft,
      contractStatus
    }

    // In production, you would also:
    // - Send webhooks to integrated systems
    // - Update audit logs
    // - Trigger workflow automations
    // - Update team dashboards

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing change decision:', error)
    return NextResponse.json(
      { error: 'Failed to process change decision' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const changeId = params.id
    
    // In production, fetch change history from database
    const changeHistory = {
      changeId,
      decisions: [
        {
          id: 'decision_1',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          decision: 'counter',
          madeBy: 'John Smith',
          notes: 'Initial counter-proposal sent',
          counterText: 'Payment terms of 45 days instead of 90'
        },
        {
          id: 'decision_2',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          decision: 'counter',
          madeBy: 'Customer Legal Team',
          notes: 'Customer responded with 60 days',
          counterText: 'Payment terms of 60 days'
        }
      ],
      currentStatus: 'pending_decision',
      lastActivity: new Date(Date.now() - 43200000).toISOString()
    }

    return NextResponse.json(changeHistory)
  } catch (error) {
    console.error('Error fetching change history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch change history' },
      { status: 500 }
    )
  }
}