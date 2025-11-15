import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { EmailContract, ContractChange } from '../../../lib/gmail-integration';

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      throw new Error('Gmail OAuth credentials not configured');
    }

    // TODO: Get user's stored OAuth tokens from database
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    // TODO: Set credentials from stored tokens
    // oauth2Client.setCredentials(userTokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Search for contract-related emails
    const contractQuery = buildContractQuery();
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: contractQuery,
      maxResults: 50
    });

    const messages = response.data.messages || [];
    const contracts: EmailContract[] = [];

    // Process each message
    for (const message of messages.slice(0, 10)) { // Limit for demo
      try {
        const emailContract = await processContractMessage(gmail, message.id!);
        if (emailContract) {
          contracts.push(emailContract);
        }
      } catch (error) {
        console.error('Error processing message:', message.id, error);
      }
    }

    return NextResponse.json({ contracts, total: contracts.length });
  } catch (error) {
    console.error('Gmail contracts API error:', error);
    
    // Return mock data for MVP demo
    const mockContracts: EmailContract[] = [
      {
        id: 'gmail-001',
        threadId: 'thread-001',
        subject: 'Re: Acme Corp - Software License Agreement Markup',
        clientEmail: 'legal@acme.com',
        clientName: 'Acme Corp',
        emailContext: [],
        negotiationStage: 'markup',
        priority: 'urgent',
        dealValue: '$180K',
        deadline: new Date('2024-11-20'),
        createdAt: new Date('2024-11-14T10:00:00Z'),
        updatedAt: new Date('2024-11-14T14:30:00Z'),
        markedUpContract: {
          id: 'doc-001',
          fileName: 'Acme_SaaS_Agreement_MARKUP.pdf',
          fileType: 'pdf',
          content: '[Contract content with markups]',
          attachmentId: 'att-001',
          version: 2,
          changes: [
            {
              type: 'modification',
              section: 'Liability Limitation',
              original: 'Liability shall not exceed the total amount paid by Customer in the preceding 12 months',
              modified: 'Liability shall not exceed $10,000',
              severity: 'critical',
              category: 'liability',
              recommendation: 'escalate',
              rationale: 'Significant reduction in liability protection poses unacceptable business risk'
            },
            {
              type: 'modification',
              section: 'Payment Terms',
              original: 'Payment due within 30 days',
              modified: 'Payment due within 60 days',
              severity: 'major',
              category: 'pricing',
              recommendation: 'pushback',
              rationale: 'Extended payment terms negatively impact cash flow'
            }
          ]
        }
      },
      {
        id: 'gmail-002',
        threadId: 'thread-002',
        subject: 'TechStart SaaS Agreement - Review and Comments',
        clientEmail: 'contracts@techstart.io',
        clientName: 'TechStart Inc',
        emailContext: [],
        negotiationStage: 'revision',
        priority: 'high',
        dealValue: '$72K',
        createdAt: new Date('2024-11-14T08:15:00Z'),
        updatedAt: new Date('2024-11-14T12:00:00Z'),
        markedUpContract: {
          id: 'doc-002',
          fileName: 'TechStart_MSA_v2.docx',
          fileType: 'docx',
          content: '[Contract content with minor changes]',
          attachmentId: 'att-002',
          version: 2,
          changes: [
            {
              type: 'addition',
              section: 'Data Security',
              original: '',
              modified: 'Annual SOC 2 Type II audit reports must be provided',
              severity: 'minor',
              category: 'terms',
              recommendation: 'accept',
              rationale: 'Standard security requirement, acceptable addition'
            }
          ]
        }
      }
    ];

    return NextResponse.json({ 
      contracts: mockContracts, 
      total: mockContracts.length,
      mock: true,
      error: 'Using mock data - Gmail OAuth not configured' 
    });
  }
}

async function processContractMessage(gmail: any, messageId: string): Promise<EmailContract | null> {
  try {
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    });

    const headers = message.data.payload.headers;
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
    const from = headers.find((h: any) => h.name === 'From')?.value || '';
    
    // Check if this looks like a contract email
    const contractKeywords = ['contract', 'agreement', 'msa', 'sow', 'terms', 'markup', 'revision'];
    const isContractEmail = contractKeywords.some(keyword => 
      subject.toLowerCase().includes(keyword)
    );

    if (!isContractEmail) return null;

    // Extract attachments
    const attachments = await extractAttachments(gmail, message.data);
    if (attachments.length === 0) return null;

    // Parse client info from email
    const clientInfo = parseClientInfo(from, subject);
    
    const emailContract: EmailContract = {
      id: `gmail-${messageId}`,
      threadId: message.data.threadId,
      subject,
      clientEmail: clientInfo.email,
      clientName: clientInfo.name,
      emailContext: [], // TODO: Get thread messages
      negotiationStage: determineStage(subject),
      priority: calculatePriority(subject, attachments),
      dealValue: extractDealValue(subject) || undefined,
      createdAt: new Date(parseInt(message.data.internalDate)),
      updatedAt: new Date()
    };

    if (attachments.length > 0) {
      emailContract.markedUpContract = attachments[0];
    }

    return emailContract;
  } catch (error) {
    console.error('Error processing contract message:', error);
    return null;
  }
}

async function extractAttachments(gmail: any, messageData: any): Promise<any[]> {
  const attachments: any[] = [];
  
  // TODO: Implement attachment extraction
  // This would involve parsing message parts and downloading attachments
  // For now, return empty array
  
  return attachments;
}

function buildContractQuery(): string {
  const keywords = ['contract', 'agreement', 'msa', 'sow', 'proposal', 'terms'];
  const fileTypes = ['pdf', 'docx', 'doc'];
  
  const keywordQuery = keywords.map(k => `subject:${k}`).join(' OR ');
  const attachmentQuery = fileTypes.map(f => `filename:${f}`).join(' OR ');
  
  return `(${keywordQuery}) AND has:attachment AND (${attachmentQuery})`;
}

function parseClientInfo(fromHeader: string, subject: string): { email: string; name: string } {
  const emailMatch = fromHeader.match(/<(.+?)>/);
  const email = emailMatch ? emailMatch[1] : fromHeader;
  
  const nameMatch = fromHeader.match(/^(.+?)\s*</);
  const name = nameMatch ? nameMatch[1].replace(/"/g, '') : email.split('@')[0];
  
  return { email, name };
}

function determineStage(subject: string): EmailContract['negotiationStage'] {
  const lower = subject.toLowerCase();
  if (lower.includes('markup') || lower.includes('revised')) return 'markup';
  if (lower.includes('final') || lower.includes('executed')) return 'final';
  if (lower.includes('revision') || lower.includes('updated')) return 'revision';
  return 'initial';
}

function calculatePriority(subject: string, attachments: any[]): EmailContract['priority'] {
  const lower = subject.toLowerCase();
  if (lower.includes('urgent') || lower.includes('asap')) return 'urgent';
  if (lower.includes('high') || lower.includes('priority')) return 'high';
  if (attachments.length > 2) return 'high';
  return 'medium';
}

function extractDealValue(subject: string): string | null {
  const patterns = [
    /\$[\d,]+[kK]/g,  // $100k, $1,000k
    /\$[\d,]+/g,      // $100000, $1,000,000
    /[\d,]+[kK]/g     // 100k, 1,000k
  ];
  
  for (const pattern of patterns) {
    const matches = subject.match(pattern);
    if (matches) return matches[0];
  }
  
  return null;
}