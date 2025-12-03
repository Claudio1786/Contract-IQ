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
        <h1 className="text-h1">Customer Contract Dashboard</h1>
        <p className="text-base text-secondary" style={{ marginTop: 'var(--space-1)' }}>
          🏢 Manage your customer agreements and negotiation pipeline
        </p>
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
          title="Total Contract Value"
          value="$2.4M"
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
            title="Acme Corp Master Agreement"
            renewalDate="January 15, 2026 (30 days)"
            risk="Auto-renewal clause"
            onViewDetails={() => handleViewDetails('acme-msa')}
          />
          <RiskItem
            title="TechStart Inc Service Contract"
            renewalDate="February 15, 2026 (60 days)"
            risk="Liability cap limitation"
            onViewDetails={() => handleViewDetails('techstart-service')}
          />
          <RiskItem
            title="GlobalTech Solutions MSA"
            renewalDate="January 22, 2026 (37 days)"
            risk="Price increase clause"
            onViewDetails={() => handleViewDetails('globaltech-msa')}
          />
        </div>
        <div className="card-footer">
          <button className="btn-secondary" onClick={handleViewAllRisks}>
            View All Risks →
          </button>
        </div>
      </div>

      {/* Revenue Analysis Card */}
      <div className="card card-accent card-accent-primary" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="text-h2">📊 Customer Revenue by Segment</h2>
          <p className="text-sm text-secondary">
            Breakdown of your $2.4M customer contract portfolio
          </p>
        </div>
        <div className="card-body">
          {/* Enterprise Segment */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Enterprise</span>
              <span className="text-base">45% · $1.08M</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* Mid-Market Segment */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Mid-Market</span>
              <span className="text-base">30% · $720K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '30%' }}></div>
            </div>
          </div>

          {/* SMB Segment */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Small Business</span>
              <span className="text-base">18% · $432K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '18%' }}></div>
            </div>
          </div>

          {/* Startup Segment */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-base font-medium">Startups</span>
              <span className="text-base">7% · $168K</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '7%' }}></div>
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
              <span>• Review upcoming customer renewals</span>
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <span>• Analyze customer contract risks</span>
            </li>
            <li style={{ marginBottom: 'var(--space-2)' }}>
              <span>• Generate negotiation counter-language</span>
            </li>
            <li>
              <span>• Review pricing across customer segments</span>
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