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
          <div>
            <h1>Your Negotiation Command Center</h1>
            <p className="dashboard-header-subtitle">
              Create new contracts. Review customer redlines. Close deals faster.
            </p>
            {/* Primary Action Buttons */}
            <div className="flex gap-4 mt-6">
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
                onClick={() => router.push(`/contracts/redlines/upload`)}
                className="px-6 py-3 rounded-xl text-[16px] font-semibold flex items-center gap-2 
                  bg-[var(--surface-4)] border border-white/10 text-[var(--text-primary)]
                  hover:brightness-110 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 16l5-5 5 5"/>
                  <path d="M12 11V21"/>
                  <rect x="3" y="3" width="18" height="6" rx="2"/>
                </svg>
                Upload Redlines
              </button>
            </div>
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
            <div className="kpi-trend inline-flex items-center gap-[6px]" style={{ '--trend-bg': 'rgba(245,158,11,0.1)', '--trend-color': '#F59E0B' } as React.CSSProperties}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <span>Attention</span>
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

      {/* Two Column Layout */}
      <div className="two-column">
        {/* Requires Your Attention */}
        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">⚠️ Requires Your Attention</h2>
            <button 
              className="table-action px-4 py-2 bg-[var(--surface-4)] border border-white/10 rounded-[10px] text-[var(--text-primary)] text-[14px] font-medium transition hover:brightness-110"
              onClick={() => router.push('/contracts')}
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
          <div className="space-y-3 p-4">
            <p className="text-[var(--text-secondary)]">3 contracts awaiting your review</p>
              {/* Negotiation Action Items */}
              <div className="p-3 bg-[var(--surface-3)] rounded-lg border border-red-500/20 hover:brightness-110 transition cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Acme Corp</div>
                    <div className="text-sm text-[var(--text-secondary)]">Customer sent redlines (2 days ago)</div>
                  </div>
                  <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-md text-sm font-medium hover:bg-red-500/30 transition">
                    Review Redlines
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[var(--surface-3)] rounded-lg border border-yellow-500/20 hover:brightness-110 transition cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">TechCo</div>
                    <div className="text-sm text-[var(--text-secondary)]">High-risk changes detected</div>
                  </div>
                  <button className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-md text-sm font-medium hover:bg-yellow-500/30 transition">
                    View Analysis
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[var(--surface-3)] rounded-lg border border-blue-500/20 hover:brightness-110 transition cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">DataCorp</div>
                    <div className="text-sm text-[var(--text-secondary)]">Approval requested by sales</div>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-md text-sm font-medium hover:bg-blue-500/30 transition">
                    Approve/Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Section */}
        <div className="insights-card">
          <div className="insights-header">
            <div className="insights-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 className="insights-title">📝 In Progress</h3>
          </div>
          <div className="p-4">
            <p className="text-[var(--text-secondary)] mb-4 font-semibold">8 contracts under negotiation</p>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 hover:bg-[var(--surface-3)] rounded transition">
                <span className="text-[var(--text-primary)]">3 awaiting customer response</span>
                <span className="text-sm text-[var(--text-secondary)]">→</span>
              </div>
              
              <div className="flex justify-between items-center p-2 hover:bg-[var(--surface-3)] rounded transition">
                <span className="text-[var(--text-primary)]">2 awaiting your review</span>
                <span className="text-sm text-[var(--text-secondary)]">→</span>
              </div>
              
              <div className="flex justify-between items-center p-2 hover:bg-[var(--surface-3)] rounded transition">
                <span className="text-[var(--text-primary)]">3 in draft stage</span>
                <span className="text-sm text-[var(--text-secondary)]">→</span>
              </div>
            </div>
            
            <button 
              className="mt-4 w-full px-4 py-2 bg-[var(--surface-4)] border border-white/10 rounded-[10px] text-[var(--text-primary)] text-[14px] font-medium transition hover:brightness-110"
              onClick={() => router.push('/contracts?status=negotiating')}
            >
              View All Negotiations →
            </button>
          </div>

          {/* Recently Closed Section */}
          <div className="mt-6 p-4 bg-[var(--surface-3)] rounded-lg">
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">✅ Recently Closed (This Week)</h4>
            <p className="text-sm text-[var(--text-secondary)]">5 contracts signed totaling $647K</p>
            <p className="text-sm text-[var(--text-secondary)]">Avg negotiation time: 12 days</p>
            <button 
              className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition"
              onClick={() => router.push('/analytics')}
            >
              View Revenue Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

