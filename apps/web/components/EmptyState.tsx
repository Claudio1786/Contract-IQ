'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PromptCardProps {
  icon: string;
  text: string;
  onClick: () => void;
}

function PromptCard({ icon, text, onClick }: PromptCardProps) {
  return (
    <button className="suggested-prompt" onClick={onClick}>
      <span className="suggested-prompt-icon">{icon}</span>
      <span className="suggested-prompt-text">{text}</span>
    </button>
  );
}

/**
 * Empty State Component - For first-time users with no contracts
 * Follows the exact wireframe specification
 */
export default function EmptyState() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const suggestedPrompts = [
    {
      icon: '📋',
      text: 'Show me all renewals in the next 90 days'
    },
    {
      icon: '💰',
      text: 'What\'s our total SaaS spend by category?'
    },
    {
      icon: '⚠️',
      text: 'Flag contracts with uncapped liability'
    },
    {
      icon: '🔍',
      text: 'Compare our Salesforce pricing to market'
    }
  ];

  const handlePromptClick = (text: string) => {
    setInputValue(text);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Route to chat with query (chat page exists)
      router.push(`/chat?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="empty-state">
      {/* Icon */}
      <div className="empty-state-icon" style={{fontSize: '64px'}}>💬</div>
      
      {/* Hero Text */}
      <h1 className="empty-state-title">
        Contract Intelligence for Your SaaS & Vendor Stack
      </h1>
      
      <p className="empty-state-description">
        Never miss a renewal. Negotiate with data. Understand your entire portfolio.
      </p>
      
      <div className="empty-state-actions">
        {/* Suggested Prompts Grid (2x2) */}
        <div className="suggested-prompts">
          {suggestedPrompts.map((prompt, index) => (
            <PromptCard
              key={index}
              icon={prompt.icon}
              text={prompt.text}
              onClick={() => handlePromptClick(prompt.text)}
            />
          ))}
        </div>
        
        {/* Input Section */}
        <div className="input-group">
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Type your question here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ paddingRight: '100px' }}
            />
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              style={{ 
                position: 'absolute', 
                right: '4px', 
                top: '50%', 
                transform: 'translateY(-50%)' 
              }}
            >
              Send →
            </button>
          </div>
          <p className="input-hint">Or drag & drop contracts to get started</p>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
          <button 
            className="btn-secondary"
            onClick={() => router.push('/upload')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Contracts
          </button>
          
          <button 
            className="btn-ghost"
            onClick={() => router.push('/contracts/saas-msa')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Demo Contract
          </button>
        </div>
      </div>
    </div>
  );
}