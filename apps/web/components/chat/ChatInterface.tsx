'use client';

import React, { useState, useRef, useEffect } from 'react';
import '../../styles/chat-optimized.css';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: CitationData[];
  isStreaming?: boolean;
  resultCard?: ResultCardData;
}

export interface CitationData {
  source: string;
  content: string;
  page?: number;
  section?: string;
  confidence?: number;
}

export interface ResultCardData {
  title: string;
  badge: { text: string; level: 'high' | 'medium' | 'low' };
  details: { label: string; value: string }[];
  actions?: { text: string; icon: string; primary?: boolean }[];
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadContract) {
      onUploadContract(file);
    }
  };

  const handleSuggestionClick = (text: string) => {
    onSendMessage?.(text);
  };

  // 6 suggestion cards for empty state
  const suggestionCards = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      label: 'Show high-risk contracts',
      description: 'View contracts requiring immediate attention',
      bg: 'rgba(239,68,68,0.1)'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      label: 'Contracts expiring soon',
      description: 'Find contracts expiring in the next 90 days',
      bg: 'rgba(245,158,11,0.1)'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      label: 'Cost optimization opportunities',
      description: 'Identify potential savings across vendors',
      bg: 'rgba(59,130,246,0.1)'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      ),
      label: 'Portfolio performance',
      description: 'Review overall contract health metrics',
      bg: 'rgba(16,185,129,0.1)'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      ),
      label: 'Generate renewal brief',
      description: 'Create strategy for upcoming renewals',
      bg: 'rgba(139,92,246,0.1)'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      ),
      label: 'Search specific customer',
      description: 'Find all contracts with a particular customer',
      bg: 'rgba(6,182,212,0.1)'
    }
  ];

  // Follow-up suggestions after messages
  const followUpSuggestions = [
    '💡 Create calendar alerts for all notice deadlines',
    '📊 Export auto-renewal report',
    '🎯 Generate negotiation playbooks'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* OPTIMIZED HEADER */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div className="header-title-group">
              <h1 className="page-title">
                <span className="title-gradient">Contract Intelligence</span>
              </h1>
              <p className="page-subtitle">Ask questions about your contracts and get instant insights</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
            <button className="header-btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Chat
            </button>
          </div>
        </div>
      </header>

      {/* CHAT CONTAINER */}
      <div className="chat-container">
        {/* MESSAGES AREA */}
        <div className="chat-messages">
          {/* Empty State with Suggestions */}
          {messages.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h2 className="empty-title">What can I help you with?</h2>
              <p className="empty-subtitle">Ask me about customer contracts, renewals, churn risks, or revenue insights</p>
              
              {/* Suggestions Grid */}
              <div className="suggestions">
                {suggestionCards.map((card, index) => (
                  <div
                    key={index}
                    className="suggestion-card"
                    style={{ '--suggestion-bg': card.bg } as React.CSSProperties}
                    onClick={() => handleSuggestionClick(card.label)}
                  >
                    <div className="suggestion-icon">{card.icon}</div>
                    <div className="suggestion-content">
                      <div className="suggestion-label">{card.label}</div>
                      <div className="suggestion-desc">{card.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.type}`}>
              <div className={`chat-message-avatar ${message.type}`}>
                {message.type === 'user' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                )}
              </div>
              <div className="chat-message-content">
                <div className="chat-message-text">{message.content}</div>
                
                {message.resultCard && (
                  <div className="chat-result-card">
                    <div className="chat-result-header">
                      <div className="chat-result-title">{message.resultCard.title}</div>
                      <div className={`chat-result-badge ${message.resultCard.badge.level}`}>
                        {message.resultCard.badge.text}
                      </div>
                    </div>
                    {message.resultCard.details.map((detail, idx) => (
                      <div key={idx} className="chat-result-detail">
                        <div className="chat-result-label">{detail.label}</div>
                        <div className="chat-result-value">{detail.value}</div>
                      </div>
                    ))}
                    {message.resultCard.actions && (
                      <div className="chat-result-actions">
                        {message.resultCard.actions.map((action, idx) => (
                          <button key={idx} className={`chat-result-btn ${action.primary ? 'primary' : 'secondary'}`}>
                            <span>{action.icon}</span>
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="chat-message-meta">
                  {message.type === 'user' ? 'You' : 'Contract IQ'} • {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message assistant">
              <div className="chat-message-avatar assistant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div className="chat-message-content">
                <div className="chat-message-text">Analyzing...</div>
              </div>
            </div>
          )}
          
          {messages.length > 0 && (
            <div className="chat-suggestions">
              {followUpSuggestions.map((suggestion, index) => (
                <div key={index} className="chat-suggestion-chip" onClick={() => onSendMessage?.(suggestion)}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <div className="chat-input-toolbar">
              <button className="chat-toolbar-btn" title="Upload document" onClick={() => fileInputRef.current?.click()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <button className="chat-toolbar-btn" title="Insert template">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
              <button className="chat-toolbar-btn" title="Voice input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                  <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about contracts, renewals, risks, or any insights..."
              disabled={isLoading}
              rows={1}
            />
          </div>
          <button
            className="chat-send-btn"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
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
    
    {/* Feature Cards Grid - Perfect 2x2 Layout */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: 'var(--space-4)', 
      width: '100%', 
      maxWidth: '600px'
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