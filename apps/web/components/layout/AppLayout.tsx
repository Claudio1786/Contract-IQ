'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NotificationsModal from '../NotificationsModal';

/**
 * Master Layout Component - Used on ALL pages
 * Provides consistent sidebar, header, and content structure
 * OPTIMIZED SIDEBAR: Larger touch targets, glowing badges, section grouping, enhanced visual hierarchy
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Main Navigation Section - CONTRACT NEGOTIATION FOCUS
  const mainNavItems = [
    { 
      href: '/app', 
      label: 'Command Center',
      iconClass: 'icon-home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      ),
      active: pathname === '/app' 
    },
    { 
      href: '/contracts', 
      label: 'Contracts',
      iconClass: 'icon-contracts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      badge: '247',
      badgeClass: 'badge-primary',
      active: pathname.startsWith('/contracts') 
    },
    { 
      href: '/chat', 
      label: 'AI Assistant',
      iconClass: 'icon-chat',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ),
      active: pathname.startsWith('/chat') 
    },
    { 
      href: '/analytics', 
      label: 'Revenue Intel',
      iconClass: 'icon-analytics',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      active: pathname.startsWith('/analytics') 
    },
  ];

  // Management Navigation Section
  const managementNavItems = [
    {
      href: '/alerts',
      label: 'Activity Center',
      iconClass: 'icon-alerts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      ),
      badge: '12',
      badgeClass: 'badge-error',
      active: pathname.startsWith('/alerts')
    },
    { 
      href: '/settings', 
      label: 'Settings',
      iconClass: 'icon-settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      active: pathname.startsWith('/settings') 
    },
  ];

  return (
    <div className="app-container">
      {/* Global Sidebar - Optimized UX */}
      <aside className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        {/* Enhanced Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <span className="brand-name">Contract IQ</span>
          </div>
          <button 
            className="menu-toggle"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
        
        {/* Navigation with Section Grouping */}
        <nav className="nav-container">
          {/* Main Section */}
          <div className="nav-section">
            <div className="nav-section-label">Main</div>
            {mainNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item ${item.iconClass} ${item.active ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              >
                <div className="nav-icon-wrapper">
                  <div className="nav-icon">{item.icon}</div>
                </div>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge ${item.badgeClass}`}>{item.badge}</span>
                )}
              </a>
            ))}
          </div>

          {/* Management Section */}
          <div className="nav-section">
            <div className="nav-section-label">Management</div>
            {managementNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item ${item.iconClass} ${item.active ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                }}
              >
                <div className="nav-icon-wrapper">
                  <div className="nav-icon">{item.icon}</div>
                </div>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge ${item.badgeClass}`}>{item.badge}</span>
                )}
              </a>
            ))}
          </div>
        </nav>

        {/* Enhanced Profile Footer */}
        <div className="sidebar-footer">
          <div className="profile-item">
            <div className="profile-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="profile-info">
              <div className="profile-name">Ray</div>
              <div className="profile-status">View Profile</div>
            </div>
            <svg className="profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area - Same on ALL pages */}
      <main className="main-content">
        {/* Global Header - Same on ALL pages */}
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
            
            <button 
              className="btn-icon btn-ghost" 
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(true)}
              style={{ position: 'relative' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification dot for unread notifications */}
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--danger-600)',
                borderRadius: '50%'
              }} />
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
        
        {/* Page-Specific Content */}
        <div className="content-area">
          {children}
        </div>
      </main>

      {/* Global Notifications Modal */}
      <NotificationsModal 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}