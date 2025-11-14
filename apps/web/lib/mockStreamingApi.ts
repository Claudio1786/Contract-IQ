// Mock API for testing streaming chat responses
import { ChatStreamResponse, ChatRequest } from '../services/chatService';
import { CitationData } from '../components/chat/ChatInterface';

const mockCitations: CitationData[] = [
  {
    source: 'Service Agreement',
    content: 'The Service Provider shall maintain confidentiality of all Customer Data and shall not disclose such information to any third party without prior written consent.',
    page: 3,
    section: '2.1',
    confidence: 0.92
  },
  {
    source: 'Data Processing Agreement',
    content: 'Personal data shall be processed only for the specific purposes outlined in Schedule A and shall not be retained longer than necessary.',
    page: 7,
    section: '4.3',
    confidence: 0.87
  },
  {
    source: 'Terms of Service',
    content: 'Limitation of liability shall not exceed the total amount paid by Customer in the twelve (12) months preceding the claim.',
    page: 12,
    section: '9.2',
    confidence: 0.94
  }
];

const mockResponses: Record<string, { content: string; citations: CitationData[] }> = {
  'risk': {
    content: `Based on my analysis of the uploaded contract, I've identified several key risk areas that require attention:

**🚨 High Priority Risks:**

1. **Liability Limitations**: The current liability cap may be insufficient for your organization's exposure level. Consider negotiating higher coverage limits.

2. **Data Protection Compliance**: While GDPR clauses are present, specific breach notification timelines need clarification.

3. **Termination Rights**: The contract lacks clear termination procedures for material breaches, potentially creating legal vulnerabilities.

**⚠️ Medium Priority Concerns:**

- Payment terms extend beyond standard 30-day cycles
- Intellectual property ownership provisions are ambiguous
- Service level agreements lack specific penalty mechanisms

**💡 Recommended Actions:**
- Request legal review for liability terms
- Clarify data processing responsibilities
- Add specific breach remediation procedures`,
    citations: mockCitations
  },
  'negotiation': {
    content: `Here are strategic negotiation points to strengthen your position:

**🎯 Primary Negotiation Targets:**

1. **Payment Terms**: Current NET-60 terms can be improved to NET-30 with early payment discounts
2. **Service Levels**: Push for 99.9% uptime guarantee with credits for non-compliance
3. **Data Rights**: Ensure you retain full ownership and portability of your data

**💪 Your Leverage Points:**
- Multi-year commitment value
- Reference potential for vendor
- Integration complexity creates switching costs for both parties

**🤝 Compromise Opportunities:**
- Accept slightly higher pricing for better terms
- Offer longer commitment for improved SLAs
- Bundle additional services for package discounts`,
    citations: mockCitations.slice(0, 2)
  },
  'default': {
    content: `I've analyzed your message and here's what I can help with:

**📋 Contract Analysis Services:**
- Risk assessment and mitigation strategies
- Clause-by-clause review and recommendations  
- Benchmarking against industry standards
- Negotiation strategy development

**🔍 What I can review:**
- SaaS agreements and enterprise contracts
- Data processing and privacy terms
- Service level agreements and warranties
- Liability, indemnification, and limitation clauses

**💡 Try asking:**
- "What are the key risks in this contract?"
- "How can I negotiate better terms?"
- "Are these payment terms standard?"
- "What's missing from this agreement?"

Upload a contract file to get started with detailed analysis!`,
    citations: []
  }
};

function getResponseForMessage(message: string): { content: string; citations: CitationData[] } {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('risk') || lowerMessage.includes('danger') || lowerMessage.includes('problem')) {
    return mockResponses.risk;
  } else if (lowerMessage.includes('negotiat') || lowerMessage.includes('improve') || lowerMessage.includes('better')) {
    return mockResponses.negotiation;
  } else {
    return mockResponses.default;
  }
}

export async function* mockStreamingResponse(request: ChatRequest): AsyncGenerator<ChatStreamResponse, void, unknown> {
  const response = getResponseForMessage(request.message);
  const messageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simulate typing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Stream content word by word
  const words = response.content.split(' ');
  let accumulatedContent = '';
  
  for (let i = 0; i < words.length; i++) {
    accumulatedContent += (i > 0 ? ' ' : '') + words[i];
    
    yield {
      type: 'message',
      content: words[i] + (i < words.length - 1 ? ' ' : ''),
      messageId
    };
    
    // Simulate realistic typing speed
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
  }
  
  // Send citations after content is complete
  if (response.citations.length > 0) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (const citation of response.citations) {
      yield {
        type: 'citation',
        citation,
        messageId
      };
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // Signal completion
  yield {
    type: 'done',
    messageId
  };
}

// Mock upload function that matches the upload page logic
export async function mockUploadContract(file: File): Promise<{ contractId: string; fileName: string }> {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate AI analysis processing
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Create a contract ID from the file name and timestamp (same format as upload page)
  const contractId = `uploaded-${file.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  
  // Store the contract data in sessionStorage (same as upload page)
  const contractData = {
    id: contractId,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
    analysisComplete: true,
    fileType: file.type,
    fileSize: file.size
  };
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`contract-${contractId}`, JSON.stringify(contractData));
  }
  
  return {
    contractId,
    fileName: file.name
  };
}