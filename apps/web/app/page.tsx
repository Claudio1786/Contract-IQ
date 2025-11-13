'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
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
      // Navigate to chat with the query
      router.push(`/chat?q=${encodeURIComponent(inputValue)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg className="sidebar-logo-icon" width="32" height="32" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill="#2563eb"/>
              <path d="M8 12h16M8 16h16M8 20h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="sidebar-logo-text">Contract IQ</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-nav-item active">
            <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="sidebar-nav-text">Home</span>
          </div>
          
          <div className="sidebar-nav-item">
            <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="sidebar-nav-text">Contracts</span>
            <span className="sidebar-nav-badge badge badge-primary">47</span>
          </div>
          
          <div className="sidebar-nav-item">
            <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="sidebar-nav-text">Alerts</span>
            <span className="sidebar-nav-badge badge badge-danger">3</span>
          </div>
          
          <div className="sidebar-nav-item">
            <svg className="sidebar-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="sidebar-nav-text">Settings</span>
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        <header className="app-header">
          <div className="header-left">
            <button 
              className="btn-icon btn-ghost" 
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              aria-label="Toggle sidebar"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="header-right">
            <button className="btn-icon btn-ghost" aria-label="Search">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button className="btn-icon btn-ghost" aria-label="Help">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <button className="btn-icon btn-ghost" aria-label="User profile">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </header>
        
        {/* Empty State */}
        <div className="empty-state">
          <div className="empty-state-icon" style={{fontSize: '64px'}}>💬</div>
          
          <h1 className="empty-state-title">
            Contract Intelligence for Your SaaS & Vendor Stack
          </h1>
          
          <p className="empty-state-description">
            Never miss a renewal. Negotiate with data. Understand your entire portfolio.
          </p>
          
          <div className="empty-state-actions">
            <div className="suggested-prompts">
              {suggestedPrompts.map((prompt, index) => (
                <button 
                  key={index}
                  className="suggested-prompt"
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <span className="suggested-prompt-icon">{prompt.icon}</span>
                  <span className="suggested-prompt-text">{prompt.text}</span>
                </button>
              ))}
            </div>
            
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
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              <button className="btn-secondary">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Contracts
              </button>
              
              <button className="btn-ghost">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch 2-Min Demo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}