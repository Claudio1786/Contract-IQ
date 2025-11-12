'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '../ui';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div 
        className={`
          bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-16'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">CIQ</span>
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-gray-900">Contract IQ</h1>
                  <p className="text-xs text-gray-500">AI Contract Assistant</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              <svg
                className={`w-4 h-4 transition-transform ${!sidebarOpen && 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            href="/chat"
            icon="💬"
            label="New Chat"
            collapsed={!sidebarOpen}
            isActive={false}
          />
          <NavItem
            href="/contracts"
            icon="📋"
            label="Contracts"
            collapsed={!sidebarOpen}
            isActive={false}
          />
          <NavItem
            href="/dashboard"
            icon="📊"
            label="Dashboard"
            collapsed={!sidebarOpen}
            isActive={false}
          />
          <NavItem
            href="/analytics"
            icon="📈"
            label="Analytics"
            collapsed={!sidebarOpen}
            isActive={false}
          />
          <NavItem
            href="/playbooks"
            icon="🎯"
            label="Playbooks"
            collapsed={!sidebarOpen}
            isActive={false}
          />
        </nav>

        {/* Chat History */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Chats</h3>
            <div className="space-y-1">
              <ChatHistoryItem 
                title="SaaS MSA Review"
                timestamp="2 hours ago"
                href="/chat/saas-msa-123"
              />
              <ChatHistoryItem 
                title="GDPR DPA Analysis"
                timestamp="Yesterday"
                href="/chat/gdpr-dpa-456"
              />
              <ChatHistoryItem 
                title="Healthcare BAA"
                timestamp="3 days ago"
                href="/chat/healthcare-baa-789"
              />
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">U</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">User</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  collapsed: boolean;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, collapsed, isActive }) => (
  <Link
    href={href}
    className={`
      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
      ${isActive 
        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }
      ${collapsed && 'justify-center'}
    `}
  >
    <span className="text-base">{icon}</span>
    {!collapsed && <span className="ml-3">{label}</span>}
  </Link>
);

interface ChatHistoryItemProps {
  title: string;
  timestamp: string;
  href: string;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ title, timestamp, href }) => (
  <Link
    href={href}
    className="block px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded truncate"
  >
    <div className="font-medium truncate">{title}</div>
    <div className="text-gray-400">{timestamp}</div>
  </Link>
);