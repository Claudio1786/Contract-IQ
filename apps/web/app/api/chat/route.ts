/**
 * Chat API
 * Epic 5: Chat Functionality
 * 
 * Handles chat messages with AI streaming responses
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  successResponse,
  unauthorizedError,
  validationError,
} from '@/lib/api-response';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Send chat message
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const body = await request.json();
    const { message, conversationId, contractId } = body;

    if (!message) {
      return validationError('Message is required');
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId: session.user.id,
        },
      });
    }

    if (!conversation) {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: message.substring(0, 100), // First 100 chars as title
        },
      });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    });

    // Get contract context if provided
    let contractContext = '';
    if (contractId) {
      const contract = await prisma.contract.findFirst({
        where: {
          id: contractId,
          userId: session.user.id,
        },
        include: {
          analysis: true,
        },
      });

      if (contract) {
        contractContext = `\n\nContract Context:\nTitle: ${contract.title}\nVendor: ${contract.vendor || 'Unknown'}\n`;
        
        if (contract.extractedText) {
          contractContext += `\nContract Text:\n${contract.extractedText.substring(0, 5000)}`;
        }

        if (contract.analysis) {
          contractContext += `\n\nAnalysis:\nRisk Level: ${contract.analysis.riskLevel}\nRisk Score: ${contract.analysis.riskScore}\n`;
          if (contract.analysis.keyTerms.length > 0) {
            contractContext += `Key Terms: ${contract.analysis.keyTerms.join(', ')}\n`;
          }
        }
      }
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, contractContext, conversation.id);

    // Save AI message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: aiResponse,
      },
    });

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return successResponse({
      conversation: {
        id: conversation.id,
        title: conversation.title,
      },
      message: assistantMessage,
      userMessage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return successResponse({
      message: {
        role: 'ASSISTANT',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
      },
    }, 200); // Return 200 with error message for better UX
  }
}

/**
 * Get conversation history
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      // Get specific conversation with messages
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId: session.user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return successResponse({ conversation });
    } else {
      // Get all conversations
      const conversations = await prisma.conversation.findMany({
        where: { userId: session.user.id },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Last message only for list view
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      });

      return successResponse({ conversations });
    }
  } catch (error) {
    console.error('Get chat error:', error);
    return successResponse({ conversations: [] });
  }
}

/**
 * Generate AI response using Gemini
 */
async function generateAIResponse(
  userMessage: string,
  contractContext: string,
  conversationId: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    return generateStubResponse(userMessage, contractContext);
  }

  try {
    const genai = new GoogleGenerativeAI(apiKey);
    const model = genai.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    // Build prompt with contract context
    const prompt = contractContext
      ? `You are Contract IQ, an AI assistant specializing in contract analysis and management. You help users understand contracts, identify risks, and provide negotiation guidance.

${contractContext}

User Question: ${userMessage}

Provide a helpful, accurate response. If discussing risks or legal matters, recommend consulting with legal counsel for important decisions.`
      : `You are Contract IQ, an AI assistant specializing in contract analysis and management. You help users understand contracts, identify risks, and provide negotiation guidance.

User Question: ${userMessage}

Provide a helpful, accurate response. If discussing risks or legal matters, recommend consulting with legal counsel for important decisions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini error:', error);
    return generateStubResponse(userMessage, contractContext);
  }
}

/**
 * Generate stub response when AI is unavailable
 */
function generateStubResponse(userMessage: string, contractContext: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('risk')) {
    return 'I can help you identify contract risks. Key areas to review include:\n\n• **Liability and Indemnification**: Limits on damages and who bears responsibility\n• **Termination Rights**: Conditions under which you can exit\n• **Auto-Renewal**: Automatic extensions that may lock you in\n• **Payment Terms**: When and how payments are due\n\nWould you like me to analyze a specific contract for detailed risk assessment?';
  }

  if (lowerMessage.includes('analyze') || lowerMessage.includes('review')) {
    return 'I can analyze contracts to identify:\n\n✓ Risk levels and specific risk areas\n✓ Key terms and conditions\n✓ Payment and pricing details\n✓ Compliance issues\n✓ Missing or problematic clauses\n\nUpload a contract to get started, and I\'ll provide a comprehensive analysis.';
  }

  if (lowerMessage.includes('negotiate') || lowerMessage.includes('playbook')) {
    return 'For contract negotiations, I can help you:\n\n• **Prepare Talking Points**: Key arguments for your position\n• **Identify Leverage**: Areas where you have negotiating power\n• **Suggest Fallback Positions**: Alternative terms if your primary goals aren\'t met\n• **Flag Risks**: Terms that need special attention\n\nWhat specific terms are you looking to negotiate?';
  }

  if (contractContext) {
    return 'Based on the contract provided, here are some key considerations:\n\n• Review the termination and renewal clauses carefully\n• Verify payment terms align with your budget and cash flow\n• Check for any auto-renewal provisions\n• Ensure liability limitations are acceptable\n• Confirm notice periods for any required actions\n\nWhat specific aspect would you like me to explain in more detail?';
  }

  return 'Hello! I\'m Contract IQ, your AI assistant for contract analysis and management.\n\nI can help you:\n• **Analyze Contracts**: Upload contracts for risk assessment and key term extraction\n• **Answer Questions**: Ask about contract terms, risks, or best practices\n• **Generate Playbooks**: Create negotiation strategies for specific contract terms\n\nHow can I assist you today?';
}
