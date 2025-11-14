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
  onUploadContract?: (file: File) => void;
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages = [],
  onSendMessage,
  onUploadContract,
  isLoading = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<CitationData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadContract) {
      onUploadContract(file);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: 'var(--color-background)'
    }}>
      {/* Chat Header - Using our design system */}
      <div style={{ 
        padding: 'var(--space-6)', 
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <h1 className="text-h1">💬 Contract Intelligence Chat</h1>
            <p className="text-base text-secondary">
              Ask questions about your contracts, upload documents, or get negotiation insights
            </p>
          </div>
          <button 
            className="btn-primary"
            onClick={handleUploadClick}
            disabled={isLoading}
          >
            📄 Upload Contract
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Messages Area - Using our design system */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: 'var(--space-6)', 
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)'
      }}>
        {messages.length === 0 ? (
          <WelcomeScreen onUploadClick={handleUploadClick} />
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
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div className="card" style={{ maxWidth: '400px' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--primary-600)',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out infinite both'
                    }} />
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--primary-600)',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                    }} />
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--primary-600)',
                      borderRadius: '50%',
                      animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                    }} />
                  </div>
                  <span className="text-base text-secondary">Contract IQ is analyzing...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Using our design system */}
      <div style={{ 
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-6)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <textarea
              ref={textareaRef}
              className="input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="💬 Ask about contract terms, risks, negotiation strategies..."
              disabled={isLoading}
              rows={1}
              style={{ 
                resize: 'none',
                maxHeight: '120px',
                minHeight: '44px'
              }}
            />
          </div>
          <button
            className="btn-primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? '...' : '📤'}
          </button>
        </div>
        
        <div style={{ 
          marginTop: 'var(--space-3)',
          display: 'flex',
          gap: 'var(--space-4)',
          flexWrap: 'wrap'
        }}>
          <span className="text-sm text-tertiary">
            💡 Try asking: "What are the key risks?" • "Suggest negotiation points" • "Compare to market standards"
          </span>
        </div>
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
          w-full max-w-full sm:max-w-2xl 
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-white border border-gray-200'
          }
        `}
        padding="md"
      >
        <div className="space-y-2">
          <div className={`text-sm sm:text-base ${isUser ? 'text-white' : 'text-gray-900'}`}>
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

interface WelcomeScreenProps {
  onUploadClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onUploadClick }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100%', 
    textAlign: 'center',
    padding: 'var(--space-8)'
  }}>
    {/* Hero Icon */}
    <div style={{
      width: '80px',
      height: '80px',
      backgroundColor: 'var(--primary-100)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 'var(--space-6)'
    }}>
      <span style={{ fontSize: '36px' }}>💬</span>
    </div>
    
    {/* Welcome Content */}
    <div style={{ marginBottom: 'var(--space-8)', maxWidth: '600px' }}>
      <h2 className="text-h2" style={{ marginBottom: 'var(--space-3)' }}>
        Contract Intelligence at Your Fingertips
      </h2>
      <p className="text-lg text-secondary">
        Upload contracts to analyze risks, negotiate better terms, and compare against industry standards. 
        Get instant insights powered by AI.
      </p>
    </div>
    
    {/* Quick Upload CTA */}
    <div className="card card-accent card-accent-primary" style={{ marginBottom: 'var(--space-6)', maxWidth: '500px' }}>
      <div className="card-body" style={{ textAlign: 'center' }}>
        <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>📄 Ready to Get Started?</h3>
        <p className="text-base text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
          Upload your contract document to begin instant analysis
        </p>
        <button className="btn-primary btn-lg" onClick={onUploadClick}>
          📤 Upload Your Contract Now
        </button>
      </div>
    </div>
    
    {/* Feature Cards Grid */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: 'var(--space-4)', 
      width: '100%', 
      maxWidth: '900px'
    }}>
      <SuggestionCard
        icon="⚖️"
        title="Contract Risk Assessment"
        description="AI-powered analysis identifies liability issues, compliance gaps, and financial exposure risks in seconds"
      />
      <SuggestionCard
        icon="💰"
        title="Cost & Terms Optimization"
        description="Discover hidden fees, unfavorable terms, and negotiation opportunities to save money"
      />
      <SuggestionCard
        icon="🎯"
        title="Strategic Negotiation Playbooks"
        description="Get customized talking points, counterproposals, and leverage strategies for your specific contract"
      />
      <SuggestionCard
        icon="📊"
        title="Industry Benchmarking"
        description="Compare pricing, terms, and conditions against market standards and similar agreements"
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
  <div className="card card-interactive" style={{ cursor: 'pointer', height: '100%' }}>
    <div className="card-body">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', height: '100%' }}>
        <div style={{ 
          fontSize: '28px',
          flexShrink: 0,
          width: '40px',
          textAlign: 'center'
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-2)' }}>
            {title}
          </h4>
          <p className="text-sm text-secondary" style={{ lineHeight: '1.4' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface CitationPreviewProps {
  citation: CitationData;
  onClose: () => void;
}

const CitationPreview: React.FC<CitationPreviewProps> = ({ citation, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{citation.source}</h3>
            <div className="text-xs sm:text-sm text-gray-500">
              {citation.page && `Page ${citation.page}`}
              {citation.section && ` • Section ${citation.section}`}
              {citation.confidence && ` • ${Math.round(citation.confidence * 100)}% confidence`}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0 ml-2">
            ✕
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{citation.content}</p>
      </div>
    </Card>
  </div>
);