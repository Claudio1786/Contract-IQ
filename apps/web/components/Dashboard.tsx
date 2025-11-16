'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import '../styles/dashboard.css';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
}

function StatCard({ title, value, subtitle, trend, icon, gradient, bgColor }: StatCardProps) {
  return (
    <div 
      className="kpi-card" 
      style={{ 
        '--kpi-gradient': gradient,
        '--kpi-bg': bgColor
      } as React.CSSProperties}
    >
      <div className="kpi-header">
        <div className="kpi-icon">
          {icon}
        </div>
        {trend && (
          <div 
            className="kpi-trend" 
            style={{
              '--trend-bg': 'rgba(16,185,129,0.1)',
              '--trend-color': '#10B981'
            } as React.CSSProperties}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            {trend}
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{title}</div>
      {subtitle && (
        <div className="kpi-meta">
          <span className="kpi-meta-item">{subtitle}</span>
        </div>
      )}
    </div>
  );
}

interface RiskItemProps {
  title: string;
  renewalDate: string;
  risk: string;
  onViewDetails: () => void;
}

function RiskItem({ title, renewalDate, risk, onViewDetails }: RiskItemProps) {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <h4 className="text-lg font-medium text-primary">{title}</h4>
      <p className="text-base text-secondary">Renews: {renewalDate}</p>
      <p className="text-base text-tertiary">Risk: {risk}</p>
      <button 
        className="btn-ghost btn-sm" 
        onClick={onViewDetails}
        style={{ marginTop: 'var(--space-2)' }}
      >
        View Details →
      </button>
    </div>
  );
}

/**
 * Dashboard Component - Flow AI Design System
 * Main dashboard with KPIs, charts, vendor table, and AI insights
 */
export default function Dashboard() {
  const router = useRouter();
  const [chartPeriod, setChartPeriod] = React.useState('1Y');

  const handleStartChat = () => {
    router.push('/chat');
  };

  const handleViewAllRisks = () => {
    router.push('/contracts?filter=high-risk');
  };

  const handleViewAnalytics = () => {
    router.push('/analytics');
  };

  const handleViewDetails = (contractId: string) => {
    router.push(`/contracts/${contractId}`);
  };

  const monthData = [
    { month: 'Jan', height: 45, color: '#3B82F6', colorDark: '#2563EB' },
    { month: 'Feb', height: 60, color: '#3B82F6', colorDark: '#2563EB' },
    { month: 'Mar', height: 55, color: '#3B82F6', colorDark: '#2563EB' },
    { month: 'Apr', height: 70, color: '#3B82F6', colorDark: '#2563EB' },
    { month: 'May', height: 80, color: '#3B82F6', colorDark: '#2563EB' },
    { month: 'Jun', height: 65, color: '#3B82F6', colorDark: '#2563EB' },
    { month: 'Jul', height: 75, color: '#10B981', colorDark: '#059669' },
    { month: 'Aug', height: 85, color: '#10B981', colorDark: '#059669' },
    { month: 'Sep', height: 90, color: '#10B981', colorDark: '#059669' },
    { month: 'Oct', height: 95, color: '#10B981', colorDark: '#059669' },
    { month: 'Nov', height: 100, color: '#8B5CF6', colorDark: '#7C3AED' },
    { month: 'Dec', height: 50, color: '#94A3B8', colorDark: '#64748B' }
  ];

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-page-header">
        <div className="dashboard-header-content">
          <h1>Dashboard</h1>
          <p className="dashboard-header-subtitle">
            Real-time insights into your vendor relationships and contract performance
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <StatCard
          title="Total Contract Value"
          value="$2.4M"
          subtitle="Active agreements"
          trend="+12.5%"
          gradient="linear-gradient(90deg, #3B82F6, #2563EB)"
          bgColor="rgba(59,130,246,0.12)"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          }
        />
        <StatCard
          title="Active Contracts"
          value="18"
          subtitle="Across 12 vendors"
          trend="+3 this month"
          gradient="linear-gradient(90deg, #8B5CF6, #7C3AED)"
          bgColor="rgba(139,92,246,0.12)"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          }
        />
        <StatCard
          title="Renewals This Quarter"
          value="5"
          subtitle="2 require action"
          trend="45 days avg"
          gradient="linear-gradient(90deg, #F59E0B, #D97706)"
          bgColor="rgba(245,158,11,0.12)"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          }
        />
      </div>

      {/* Urgent Alerts Card */}
      <div className="card card-accent card-accent-danger" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="text-h2">⚠️ URGENT: 2 High Risk Contracts Need Attention</h2>
        </div>
        <div className="card-body">
          <RiskItem
            title="Salesforce Enterprise Agreement"
            renewalDate="January 15, 2026 (30 days)"
            risk="Auto-renewal clause"
            onViewDetails={() => handleViewDetails('salesforce-ea')}
          />
          <RiskItem
            title="Acme Corp Software License Agreement"
            renewalDate="February 15, 2026 (60 days)"
            risk="Liability cap limitation"
            onViewDetails={() => handleViewDetails('acme-saas')}
          />
          <RiskItem
            title="HubSpot Marketing Hub Order Form"
            renewalDate="January 22, 2026 (37 days)"
            risk="Price increase clause"
            onViewDetails={() => handleViewDetails('hubspot-mh')}
          />
        </div>
        <div className="card-footer">
          <button className="btn-secondary" onClick={handleViewAllRisks}>
            View All Risks →
          </button>
        </div>
      </div>

      {/* Spending Analysis Card */}
      <div className="card card-accent card-accent-primary" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="text-h2">📊 Vendor Spending by Category</h2>
          <p className="text-sm text-secondary">
            Breakdown of your organization's $400K annual contract portfolio
          </p>
        </div>
        <div className="card-body">
          {/* CRM & Sales Category */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">CRM & Sales</span>
              <span className="text-base">45% · $180K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* Software Development Category */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Software Development</span>
              <span className="text-base">24% · $95K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '24%' }}></div>
            </div>
          </div>

          {/* Marketing Category */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Marketing</span>
              <span className="text-base">18% · $72K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '18%' }}></div>
            </div>
          </div>

          {/* Productivity Category */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Productivity</span>
              <span className="text-base">13% · $53K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '13%' }}></div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn-secondary" onClick={handleViewAnalytics}>
            View Full Analytics →
          </button>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-h2">💬 Quick Actions</h2>
        </div>
        <div className="card-body">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <span>• Ask about upcoming renewals</span>
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <span>• Analyze contract risks</span>
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <span>• Generate negotiation playbooks</span>
            </li>
            <li>
              <span>• Compare pricing to market</span>
            </li>
          </ul>
        </div>
        <div className="card-footer">
          <button className="btn-primary" onClick={handleStartChat}>
            Start New Chat →
          </button>
        </div>
      </div>
    </div>
  );
}