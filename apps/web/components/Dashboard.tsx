'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
}

function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-h3 text-secondary">{title}</h3>
        <p className="text-display">{value}</p>
        {subtitle && <p className="text-sm text-tertiary">{subtitle}</p>}
        {trend && <p className="text-sm text-success">{trend}</p>}
      </div>
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
 * Dashboard Component - For users with contracts
 * Shows overview stats, urgent alerts, spending analysis, and quick actions
 */
export default function Dashboard() {
  const router = useRouter();

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

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-h1">Dashboard Overview</h1>
      </div>

      {/* Stats Row (3 cards) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 'var(--space-6)', 
        marginBottom: 'var(--space-8)' 
      }}>
        <StatCard
          title="Total Contracts"
          value="5"
          trend="Demo Portfolio"
        />
        <StatCard
          title="Annual Spend"
          value="$400K"
          trend="5 Active Contracts"
        />
        <StatCard
          title="Renewals This Q"
          value="5"
          trend="2 High Risk"
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
          <h2 className="text-h2">📊 Spending by Category</h2>
        </div>
        <div className="card-body">
          {/* CRM Category */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">CRM</span>
              <span className="text-base">35% · $840K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '35%' }}></div>
            </div>
          </div>

          {/* Infrastructure Category */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Infrastructure</span>
              <span className="text-base">28% · $672K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '28%' }}></div>
            </div>
          </div>

          {/* Productivity Category */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Productivity</span>
              <span className="text-base">22% · $528K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '22%' }}></div>
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