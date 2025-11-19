import { useState, useCallback, useRef } from 'react';
import { ChatMessage, CitationData } from '../components/chat/ChatInterface';
import { chatService, ChatStreamResponse } from '../services/chatService';

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  onError?: (error: Error) => void;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  uploadContract: (file: File) => Promise<void>;
  isStreaming: boolean;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const sendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    setError(null);
    setIsLoading(true);
    setIsStreaming(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Prepare assistant message
    const assistantMessageId = generateMessageId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      citations: [],
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const streamGenerator = await chatService.sendMessage({
        message: content,
        contractId: contractId || undefined,
      });

      let accumulatedContent = '';
      const citations: CitationData[] = [];

      for await (const chunk of streamGenerator) {
        if (chunk.type === 'message' && chunk.content) {
          accumulatedContent += chunk.content;
          
          // Update the assistant message with accumulated content
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          );
        } else if (chunk.type === 'citation' && chunk.citation) {
          citations.push(chunk.citation);
          
          // Update citations
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, citations }
                : msg
            )
          );
        } else if (chunk.type === 'error') {
          setError(chunk.error || 'An error occurred');
          break;
        } else if (chunk.type === 'done') {
          break;
        }
      }

      // Mark message as complete
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(err instanceof Error ? err : new Error(errorMessage));
      
      // Remove the failed assistant message
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [isLoading, contractId, options]);

  const uploadContract = useCallback(async (file: File) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Process upload using same logic as upload page
      const result = await chatService.uploadContract(file);
      setContractId(result.contractId);
      
      // Add system message about successful upload
      const systemMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'assistant',
        content: `✅ Successfully uploaded "${result.fileName}" and completed AI analysis! Redirecting to detailed contract view...`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      // Redirect to contract analysis after brief success display (same as upload page)
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = `/contracts/${result.contractId}?analysis=complete`;
        }
      }, 1500);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      options.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setContractId(null);
    
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    uploadContract,
  };
};