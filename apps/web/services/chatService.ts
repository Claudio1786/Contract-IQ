import { ChatMessage, CitationData } from '../components/chat/ChatInterface';
import { mockStreamingResponse, mockUploadContract } from '../lib/mockStreamingApi';

export interface ChatStreamResponse {
  type: 'message' | 'citation' | 'error' | 'done';
  content?: string;
  citation?: CitationData;
  error?: string;
  messageId?: string;
}

export interface ChatRequest {
  message: string;
  contractId?: string;
  sessionId?: string;
}

class ChatService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  async sendMessage(request: ChatRequest): Promise<AsyncGenerator<ChatStreamResponse, void, unknown>> {
    // Always use mock API for MVP demo until backend is integrated
    const useMockAPI = true; // Force mock API for now
    
    if (useMockAPI) {
      return mockStreamingResponse({
        ...request,
        sessionId: this.sessionId || this.generateSessionId(),
      });
    }

    const response = await fetch(`${this.baseUrl}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        sessionId: this.sessionId || this.generateSessionId(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return this.parseStreamResponse(response.body);
  }

  private async *parseStreamResponse(body: ReadableStream<Uint8Array>): AsyncGenerator<ChatStreamResponse, void, unknown> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          
          const data = trimmed.slice(6); // Remove 'data: ' prefix
          
          if (data === '[DONE]') {
            yield { type: 'done' };
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            yield parsed as ChatStreamResponse;
          } catch (error) {
            console.warn('Failed to parse SSE data:', data, error);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async uploadContract(file: File): Promise<{ contractId: string; fileName: string }> {
    // Always use mock API for MVP demo until backend is integrated
    const useMockAPI = true; // Force mock API for now
    
    if (useMockAPI) {
      return mockUploadContract(file);
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/contracts/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getConversationHistory(sessionId: string): Promise<ChatMessage[]> {
    const response = await fetch(`${this.baseUrl}/api/chat/history/${sessionId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get history: ${response.statusText}`);
    }

    return response.json();
  }

  private generateSessionId(): string {
    this.sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return this.sessionId;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

export const chatService = new ChatService();