'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Citation } from '../ui';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: CitationData[];
  isStreaming?: boolean;
}

export interface CitationData {
  source: string;
  content: string;
  page?: number;
  section?: string;
  confidence?: number;
}

export interface ChatInterfaceProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages = [],
  onSendMessage,
  isLoading = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<CitationData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    onSendMessage?.(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contract Analysis</h2>
            <p className="text-sm text-gray-500">Ask questions about your contracts</p>
          </div>
          <Button variant="secondary" size="sm">
            📤 Upload Contract
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCitationClick={setSelectedCitation}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-2xl bg-gray-50">
              <div className="flex items-center space-x-2 p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-gray-600">Analyzing...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about contract terms, risks, or negotiation strategies..."
              disabled={isLoading}
              size="lg"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            loading={isLoading}
            size="lg"
          >
            Send
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Try: "What are the key risks in this contract?" or "Suggest negotiation points for liability terms"
        </p>
      </div>

      {/* Citation Preview Modal */}
      {selectedCitation && (
        <CitationPreview
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}
    </div>
  );
};

interface MessageBubbleProps {
  message: ChatMessage;
  onCitationClick: (citation: CitationData) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCitationClick }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card 
        className={`
          max-w-2xl 
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200'
          }
        `}
        padding="md"
      >
        <div className="space-y-2">
          <div className={`text-sm ${isUser ? 'text-white' : 'text-gray-900'}`}>
            {message.content}
          </div>
          
          {message.citations && message.citations.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.citations.map((citation, index) => (
                <Citation
                  key={index}
                  source={citation.source}
                  content={citation.content}
                  page={citation.page}
                  section={citation.section}
                  confidence={citation.confidence}
                  onPreview={onCitationClick}
                  size="sm"
                />
              ))}
            </div>
          )}
          
          <div className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </div>
  );
};

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">🤝</span>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-gray-900">
        Welcome to Contract IQ Chat
      </h3>
      <p className="text-gray-600 max-w-md">
        Upload a contract or ask me questions about contract terms, risks, and negotiation strategies.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
      <SuggestionCard
        icon="⚖️"
        title="Risk Analysis"
        description="Identify potential risks and liability issues"
      />
      <SuggestionCard
        icon="💰"
        title="Cost Optimization"
        description="Find opportunities to reduce costs"
      />
      <SuggestionCard
        icon="🎯"
        title="Negotiation Points"
        description="Get strategic talking points"
      />
      <SuggestionCard
        icon="📊"
        title="Benchmarking"
        description="Compare against industry standards"
      />
    </div>
  </div>
);

interface SuggestionCardProps {
  icon: string;
  title: string;
  description: string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ icon, title, description }) => (
  <Card variant="interactive" className="p-4 cursor-pointer">
    <div className="flex items-start space-x-3">
      <span className="text-xl">{icon}</span>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </Card>
);

interface CitationPreviewProps {
  citation: CitationData;
  onClose: () => void;
}

const CitationPreview: React.FC<CitationPreviewProps> = ({ citation, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{citation.source}</h3>
            <div className="text-sm text-gray-500">
              {citation.page && `Page ${citation.page}`}
              {citation.section && ` • Section ${citation.section}`}
              {citation.confidence && ` • ${Math.round(citation.confidence * 100)}% confidence`}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-700 whitespace-pre-wrap">{citation.content}</p>
      </div>
    </Card>
  </div>
);