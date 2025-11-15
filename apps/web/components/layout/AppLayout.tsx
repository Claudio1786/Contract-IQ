'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NotificationsModal from '../NotificationsModal';

/**
 * Master Layout Component - Used on ALL pages
 * Provides consistent sidebar, header, and content structure
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigationItems = [
    { 
      href: '/', 
      icon: '🏠', 
      label: 'Home', 
      active: pathname === '/' 
    },
    { 
      href: '/chat', 
      icon: '💬', 
      label: 'Chat', 
      active: pathname.startsWith('/chat') 
    },
    { 
      href: '/contracts', 
      icon: '📋', 
      label: 'Contracts', 
      badge: '47', 
      active: pathname.startsWith('/contracts') 
    },
    { 
      href: '/analytics', 
      icon: '📊', 
      label: 'Analytics', 
      active: pathname.startsWith('/analytics') 
    },
    { 
      href: '/settings', 
      icon: '⚙️', 
      label: 'Settings', 
      active: pathname.startsWith('/settings') 
    },
  ];

  const alertsItem = {
    href: '/alerts',
    icon: '🔔',
    label: 'Alerts',
    badge: '3',
    badgeVariant: 'danger' as const,
    active: pathname.startsWith('/alerts')
  };

  return (
    <div className="app-container">
      {/* Global Sidebar - Same on ALL pages */}
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
          {navigationItems.map((item) => (
            <div 
              key={item.href}
              className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => router.push(item.href)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-text">{item.label}</span>
              {item.badge && (
                <span className="sidebar-nav-badge badge badge-primary">{item.badge}</span>
              )}
            </div>
          ))}

          {/* Alerts with danger badge */}
          <div 
            className={`sidebar-nav-item ${alertsItem.active ? 'active' : ''}`}
            onClick={() => router.push(alertsItem.href)}
          >
            <span className="sidebar-nav-icon">{alertsItem.icon}</span>
            <span className="sidebar-nav-text">{alertsItem.label}</span>
            <span className="sidebar-nav-badge badge badge-danger">{alertsItem.badge}</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-nav-item">
            <span className="sidebar-nav-icon">👤</span>
            <span className="sidebar-nav-text">Profile</span>
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