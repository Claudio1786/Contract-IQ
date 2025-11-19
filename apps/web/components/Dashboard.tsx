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
 * Main dashboard with KPIs, charts, customer table, and AI insights
 */
export default function Dashboard() {
  const router = useRouter();
  const [chartPeriod, setChartPeriod] = React.useState('1Y');
  const [loading, setLoading] = React.useState(true);
  const [contracts, setContracts] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any>(null);

  // Fetch real contract data on mount
  React.useEffect(() => {
    async function fetchContracts() {
      try {
        const response = await fetch('/api/contracts');
        const data = await response.json();
        
        if (data.success) {
          setContracts(data.contracts);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContracts();
  }, []);

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <h1>Dashboard</h1>
              <p className="dashboard-header-subtitle">
                Real-time insights into your customer relationships and contract performance
              </p>
            </div>
            <button
              onClick={() => router.push('/app/admin/contracts/new')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Contract
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {/* Total Contract Value */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #3B82F6, #2563EB)', '--kpi-bg': 'rgba(59,130,246,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="kpi-trend" style={{ '--trend-bg': 'rgba(16,185,129,0.1)', '--trend-color': '#10B981' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              </svg>
              +12.5%
            </div>
          </div>
          <div className="kpi-value">
            {loading ? '...' : `$${((summary?.total_acv || 0) / 1000).toFixed(1)}K`}
          </div>
          <div className="kpi-label">Total Contract Value</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">{loading ? 'Loading...' : `${summary?.total || 0} contracts`}</span>
          </div>
        </div>

        {/* Active Customers */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #10B981, #059669)', '--kpi-bg': 'rgba(16,185,129,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div className="kpi-trend" style={{ '--trend-bg': 'rgba(16,185,129,0.1)', '--trend-color': '#10B981' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              </svg>
              +8
            </div>
          </div>
          <div className="kpi-value">247</div>
          <div className="kpi-label">Active Customers</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">New this month</span>
            <span className="kpi-meta-value">12 customers</span>
          </div>
        </div>

        {/* Contracts Expiring */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #F59E0B, #D97706)', '--kpi-bg': 'rgba(245,158,11,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="kpi-trend" style={{ '--trend-bg': 'rgba(245,158,11,0.1)', '--trend-color': '#F59E0B' } as React.CSSProperties}>
              ⚠️ Attention
            </div>
          </div>
          <div className="kpi-value">18</div>
          <div className="kpi-label">Contracts Expiring (90 days)</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">Requiring action</span>
            <span className="kpi-meta-value">8 contracts</span>
          </div>
        </div>

        {/* High Risk Contracts */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #EF4444, #DC2626)', '--kpi-bg': 'rgba(239,68,68,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="kpi-trend" style={{ '--trend-bg': 'rgba(239,68,68,0.1)', '--trend-color': '#EF4444' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              </svg>
              -3
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : summary?.high_risk || 0}</div>
          <div className="kpi-label">High Risk Contracts</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">{loading ? 'Loading...' : 'Needs immediate action'}</span>
            <span className="kpi-meta-value">5 contracts</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Contract Value by Month</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`chart-tab ${chartPeriod === '6M' ? 'active' : ''}`}
              onClick={() => setChartPeriod('6M')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                background: chartPeriod === '6M' ? 'var(--surface-4)' : 'transparent',
                color: chartPeriod === '6M' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                border: chartPeriod === '6M' ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              6M
            </button>
            <button 
              className={`chart-tab ${chartPeriod === '1Y' ? 'active' : ''}`}
              onClick={() => setChartPeriod('1Y')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                background: chartPeriod === '1Y' ? 'var(--surface-4)' : 'transparent',
                color: chartPeriod === '1Y' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                border: chartPeriod === '1Y' ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              1Y
            </button>
            <button 
              className={`chart-tab ${chartPeriod === 'All' ? 'active' : ''}`}
              onClick={() => setChartPeriod('All')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                background: chartPeriod === 'All' ? 'var(--surface-4)' : 'transparent',
                color: chartPeriod === 'All' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                border: chartPeriod === 'All' ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              All Time
            </button>
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-bars">
            {monthData.map((data, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${data.height}%`,
                    '--bar-color': data.color,
                    '--bar-color-dark': data.colorDark,
                    '--bar-glow': `${data.color}33`
                  } as React.CSSProperties}
                ></div>
                <div className="bar-label">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="two-column">
        {/* Top Contracts Table - CUSTOMER REVENUE INTELLIGENCE */}
        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Recent Customer Contracts</h2>
            <button 
              className="table-action"
              onClick={() => router.push('/contracts')}
              style={{
                padding: '10px 18px',
                background: 'var(--surface-4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              View All →
            </button>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>ACV</th>
                <th>Status</th>
                <th>Churn Risk</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>
                    Loading customer contracts...
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)' }}>
                    No customer contracts yet. Add your first customer contract to get started.
                  </td>
                </tr>
              ) : (
                contracts.slice(0, 5).map((contract: any) => {
                  const riskLevel = contract.riskScore?.riskClassification || 'MEDIUM';
                  const riskBadge = riskLevel === 'HIGH' ? 'badge-high' : riskLevel === 'LOW' ? 'badge-low' : 'badge-medium';
                  const acv = contract.annualContractValue || contract.annualValue || 0;
                  
                  return (
                    <tr key={contract.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {contract.customerName || contract.contractName}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                          {contract.industry || contract.customerType || 'B2B SaaS'}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        ${acv.toLocaleString()}
                      </td>
                      <td><span className="badge badge-active">Active</span></td>
                      <td>
                        <span className={`badge ${riskBadge}`}>
                          {riskLevel.charAt(0) + riskLevel.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* AI Insights */}
        <div className="insights-card">
          <div className="insights-header">
            <div className="insights-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 className="insights-title">AI Insights</h3>
          </div>
          <div className="insight-item" style={{ '--insight-color': '#EF4444' } as React.CSSProperties}>
            <div className="insight-type">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              URGENT
            </div>
            <div className="insight-text">3 contracts require renewal notice within 30 days to avoid auto-renewal. Total value: $475,000.</div>
          </div>
          <div className="insight-item" style={{ '--insight-color': '#F59E0B' } as React.CSSProperties}>
            <div className="insight-type">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              OPTIMIZATION
            </div>
            <div className="insight-text">AWS usage shows 32% underutilization. Potential savings: $134,000/year with plan optimization.</div>
          </div>
          <div className="insight-item" style={{ '--insight-color': '#3B82F6' } as React.CSSProperties}>
            <div className="insight-type">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              INSIGHT
            </div>
            <div className="insight-text">Expansion bundling opportunity: 4 customers are candidates for bundle alignment. Potential revenue impact: $89,000/year.</div>
          </div>
          <div className="insight-item" style={{ '--insight-color': '#10B981' } as React.CSSProperties}>
            <div className="insight-type">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              OPPORTUNITY
            </div>
            <div className="insight-text">Salesforce renewal coming up. Historical data suggests 15-20% discount available with early negotiation.</div>
          </div>
          <div className="insight-item" style={{ '--insight-color': '#8B5CF6' } as React.CSSProperties}>
            <div className="insight-type">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              TREND
            </div>
            <div className="insight-text">Revenue increased 12.5% QoQ, driven primarily by customer expansions.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
