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
    <div className="mb-4">
      <h4 className="text-lg font-medium text-primary">{title}</h4>
      <p className="text-base text-secondary">Renews: {renewalDate}</p>
      <p className="text-base text-tertiary">Risk: {risk}</p>
      <button 
        className="btn-ghost btn-sm inline-flex items-center gap-[6px] mt-2" 
        onClick={onViewDetails}
      >
        <span>View Details</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14"/>
          <path d="M13 5l7 7-7 7"/>
        </svg>
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
          <div className="flex items-center justify-between w-full">
            <div>
              <h1>Your Negotiation Command Center</h1>
              <p className="dashboard-header-subtitle">
                Create contracts, review customer redlines, and close deals faster.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/contracts/new')}
                className="px-6 py-3 rounded-xl text-white text-[16px] font-semibold flex items-center gap-2 
                  bg-gradient-to-br from-green-500 to-green-600 shadow-md hover:shadow-lg transition-transform 
                  hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create New Contract
              </button>
              <button
                onClick={() => router.push('/upload')}
                className="px-6 py-3 rounded-xl text-[16px] font-semibold flex items-center gap-2 
                  bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-transform 
                  hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 16l5-5 5 5"/>
                  <path d="M12 11V21"/>
                </svg>
                Upload for Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid - Negotiation Metrics */}
      <div className="kpi-grid">
        {/* Active Negotiations */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #3B82F6, #2563EB)', '--kpi-bg': 'rgba(59,130,246,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
          <div className="kpi-trend" style={{ '--trend-bg': 'rgba(16,185,129,0.1)', '--trend-color': '#10B981' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              </svg>
              +5
            </div>
          </div>
          <div className="kpi-value">12</div>
          <div className="kpi-label">Active Negotiations</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">vs last month</span>
          </div>
        </div>

        {/* Avg Time to Close */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #10B981, #059669)', '--kpi-bg': 'rgba(16,185,129,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          <div className="kpi-trend" style={{ '--trend-bg': 'rgba(16,185,129,0.1)', '--trend-color': '#10B981' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              </svg>
              -3 days
            </div>
          </div>
          <div className="kpi-value">7 days</div>
          <div className="kpi-label">Avg. Time to Close</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">vs last month</span>
          </div>
        </div>

        {/* Close Rate */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #8B5CF6, #7C3AED)', '--kpi-bg': 'rgba(139,92,246,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <div className="kpi-trend inline-flex items-center gap-[6px]" style={{ '--trend-bg': 'rgba(139,92,246,0.1)', '--trend-color': '#8B5CF6' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              </svg>
              +8%
            </div>
          </div>
          <div className="kpi-value">84%</div>
          <div className="kpi-label">Close Rate</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">vs last month</span>
          </div>
        </div>

        {/* Total Contract Value This Month */}
        <div className="kpi-card" style={{ '--kpi-gradient': 'linear-gradient(90deg, #F59E0B, #D97706)', '--kpi-bg': 'rgba(245,158,11,0.12)' } as React.CSSProperties}>
          <div className="kpi-header">
            <div className="kpi-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="kpi-trend" style={{ '--trend-bg': 'rgba(245,158,11,0.1)', '--trend-color': '#F59E0B' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              </svg>
              +22%
            </div>
          </div>
          <div className="kpi-value">
            {loading ? '...' : `$${((summary?.total_acv || 0) / 1000).toFixed(1)}K`}
          </div>
          <div className="kpi-label">Total Contract Value (This Month)</div>
          <div className="kpi-meta">
            <span className="kpi-meta-item">vs last month</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Contract Value by Month</h2>
          <div className="flex gap-2">
            <button 
              className={`chart-tab ${chartPeriod === '6M' ? 'active' : ''}`}
              onClick={() => setChartPeriod('6M')}
              className={`px-4 py-2 rounded-[10px] text-[14px] font-medium border transition 
                ${chartPeriod === '6M' ? 'bg-[var(--surface-4)] text-[var(--text-primary)] border-white/10' : 'bg-transparent text-[var(--text-tertiary)] border-transparent'}`}
            >
              6M
            </button>
            <button 
              className={`chart-tab ${chartPeriod === '1Y' ? 'active' : ''}`}
              onClick={() => setChartPeriod('1Y')}
              className={`px-4 py-2 rounded-[10px] text-[14px] font-medium border transition 
                ${chartPeriod === '1Y' ? 'bg-[var(--surface-4)] text-[var(--text-primary)] border-white/10' : 'bg-transparent text-[var(--text-tertiary)] border-transparent'}`}
            >
              1Y
            </button>
            <button 
              className={`chart-tab ${chartPeriod === 'All' ? 'active' : ''}`}
              onClick={() => setChartPeriod('All')}
              className={`px-4 py-2 rounded-[10px] text-[14px] font-medium border transition 
                ${chartPeriod === 'All' ? 'bg-[var(--surface-4)] text-[var(--text-primary)] border-white/10' : 'bg-transparent text-[var(--text-tertiary)] border-transparent'}`}
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

      {/* SECTION 1: Requires Your Attention */}
      <div className="section-card" style={{ marginBottom: '32px' }}>
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Requires Your Attention
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Contracts with customer changes awaiting your review
            </p>
          </div>
          <button 
            className="table-action px-4 py-2 bg-[var(--surface-4)] border border-white/10 rounded-[10px] text-[var(--text-primary)] text-[14px] font-medium transition hover:brightness-110"
            onClick={() => router.push('/contracts?filter=needs-review')}
          >
            View All →
          </button>
        </div>
        
        <div className="contracts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Contract requiring attention */}
          <div className="contract-card" style={{ 
            background: 'var(--surface-3)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                TechCorp Solutions
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ color: '#EF4444', fontSize: '14px', fontWeight: 500 }}>
                  8 changes detected
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
                  • 3 high risk
                </span>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Waiting 3 days for review
              </span>
            </div>
            <button 
              onClick={() => router.push('/contracts/techcorp-123/redlines')}
              style={{
                width: '100%',
                padding: '10px',
                background: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Review Now
            </button>
          </div>
          
          {/* Another contract */}
          <div className="contract-card" style={{ 
            background: 'var(--surface-3)', 
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                DataFlow Inc
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ color: '#F59E0B', fontSize: '14px', fontWeight: 500 }}>
                  5 changes detected
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
                  • 1 high risk
                </span>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Waiting 1 day for review
              </span>
            </div>
            <button 
              onClick={() => router.push('/contracts/dataflow-456/redlines')}
              style={{
                width: '100%',
                padding: '10px',
                background: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Review Now
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Active Negotiations and Recently Signed */}
      <div className="two-column">
        {/* SECTION 2: Active Negotiations */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2 className="table-title">Active Negotiations</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                Contracts currently in negotiation
              </p>
            </div>
            <button 
              className="table-action px-4 py-2 bg-[var(--surface-4)] border border-white/10 rounded-[10px] text-[var(--text-primary)] text-[14px] font-medium transition hover:brightness-110"
              onClick={() => router.push('/contracts?status=negotiating')}
            >
              <span className="inline-flex items-center gap-[6px]">
                <span>View All</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"/>
                  <path d="M13 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Value</th>
                <th>Status</th>
                <th>Days in Stage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="font-semibold text-[var(--color-text-primary)] mb-1">
                    CloudFirst Corp
                  </div>
                  <div className="text-[13px] text-[var(--color-text-tertiary)]">
                    Enterprise Software
                  </div>
                </td>
                <td className="font-semibold text-[var(--color-text-primary)]">
                  $250,000
                </td>
                <td><span className="badge badge-active">Awaiting Response</span></td>
                <td>
                  <span className="text-[var(--color-text-secondary)]">5 days</span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="font-semibold text-[var(--color-text-primary)] mb-1">
                    StartupHub
                  </div>
                  <div className="text-[13px] text-[var(--color-text-tertiary)]">
                    Tech Accelerator
                  </div>
                </td>
                <td className="font-semibold text-[var(--color-text-primary)]">
                  $45,000
                </td>
                <td><span className="badge badge-draft">Draft</span></td>
                <td>
                  <span className="text-[var(--color-text-secondary)]">2 days</span>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="font-semibold text-[var(--color-text-primary)] mb-1">
                    FinTech Solutions
                  </div>
                  <div className="text-[13px] text-[var(--color-text-tertiary)]">
                    Financial Services
                  </div>
                </td>
                <td className="font-semibold text-[var(--color-text-primary)]">
                  $180,000
                </td>
                <td><span className="badge badge-review">Under Review</span></td>
                <td>
                  <span className="text-[var(--color-text-secondary)]">1 day</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 3: Recently Signed */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2 className="table-title">Recently Signed</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                Contracts closed in the last 30 days
              </p>
            </div>
            <button 
              className="table-action px-4 py-2 bg-[var(--surface-4)] border border-white/10 rounded-[10px] text-[var(--text-primary)] text-[14px] font-medium transition hover:brightness-110"
              onClick={() => router.push('/contracts?status=signed')}
            >
              <span className="inline-flex items-center gap-[6px]">
                <span>View All</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"/>
                  <path d="M13 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Value</th>
                <th>Signed Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="font-semibold text-[var(--color-text-primary)] mb-1">
                    MegaCorp Industries
                  </div>
                  <div className="text-[13px] text-[var(--color-text-tertiary)]">
                    Manufacturing
                  </div>
                </td>
                <td className="font-semibold text-[var(--color-text-primary)]">
                  $320,000
                </td>
                <td>
                  <span className="text-[var(--color-text-secondary)]">Dec 28, 2024</span>
                </td>
                <td>
                  <button 
                    onClick={() => router.push('/contracts/megacorp-signed')}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-[14px]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="font-semibold text-[var(--color-text-primary)] mb-1">
                    GrowthTech
                  </div>
                  <div className="text-[13px] text-[var(--color-text-tertiary)]">
                    SaaS Platform
                  </div>
                </td>
                <td className="font-semibold text-[var(--color-text-primary)]">
                  $95,000
                </td>
                <td>
                  <span className="text-[var(--color-text-secondary)]">Dec 22, 2024</span>
                </td>
                <td>
                  <button 
                    onClick={() => router.push('/contracts/growthtech-signed')}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-[14px]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="font-semibold text-[var(--color-text-primary)] mb-1">
                    RetailPro
                  </div>
                  <div className="text-[13px] text-[var(--color-text-tertiary)]">
                    E-commerce
                  </div>
                </td>
                <td className="font-semibold text-[var(--color-text-primary)]">
                  $150,000
                </td>
                <td>
                  <span className="text-[var(--color-text-secondary)]">Dec 15, 2024</span>
                </td>
                <td>
                  <button 
                    onClick={() => router.push('/contracts/retailpro-signed')}
                    className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-[14px]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
