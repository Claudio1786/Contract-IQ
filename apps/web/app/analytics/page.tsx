'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import '../../styles/analytics.css';

/**
 * Revenue Intelligence Dashboard - Flow AI Design System
 * Customer contract analytics with KPIs, Charts, Tables, and AI Insights
 */
export default function AnalyticsPage() {
  const [chartPeriod, setChartPeriod] = useState('1Y');

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
    <AppLayout>
      <div className="analytics-container">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-[#0F1319] to-[#14171F] border border-white/10 rounded-2xl p-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_0_20px_rgba(59,130,246,0.15)] bg-[linear-gradient(135deg,rgba(59,130,246,0.15)_0%,rgba(59,130,246,0.08)_100%)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h1 style={{
                fontSize: '40px',
                fontWeight: 700,
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Revenue Intelligence Dashboard
              </h1>
              <p className="text-[16px] text-slate-400">
                Real-time insights into your customer contracts and revenue performance
              </p>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="analytics-kpi-grid">
          {/* Total Contract Value */}
          <div
            className="analytics-kpi-card"
            style={{
              '--kpi-gradient': 'linear-gradient(90deg, #3B82F6, #2563EB)',
              '--kpi-bg': 'rgba(59,130,246,0.12)'
            } as React.CSSProperties}
          >
            <div className="analytics-kpi-header">
              <div className="analytics-kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div className="analytics-kpi-trend" style={{ '--trend-bg': 'rgba(16,185,129,0.1)', '--trend-color': '#10B981' } as React.CSSProperties}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                </svg>
                +12.5%
              </div>
            </div>
            <div className="analytics-kpi-value">$24.8M</div>
            <div className="analytics-kpi-label">Total Contract Value</div>
            <div className="analytics-kpi-meta">
              <span className="analytics-kpi-meta-item">vs last quarter</span>
              <span className="analytics-kpi-meta-value">+$2.8M</span>
            </div>
          </div>

          {/* Active Customer Contracts */}
          <div
            className="analytics-kpi-card"
            style={{
              '--kpi-gradient': 'linear-gradient(90deg, #10B981, #059669)',
              '--kpi-bg': 'rgba(16,185,129,0.12)'
            } as React.CSSProperties}
          >
            <div className="analytics-kpi-header">
              <div className="analytics-kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div className="analytics-kpi-trend" style={{ '--trend-bg': 'rgba(16,185,129,0.1)', '--trend-color': '#10B981' } as React.CSSProperties}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                </svg>
                +8
              </div>
            </div>
            <div className="analytics-kpi-value">147</div>
            <div className="analytics-kpi-label">Active Customer Contracts</div>
            <div className="analytics-kpi-meta">
              <span className="analytics-kpi-meta-item">New this month</span>
              <span className="analytics-kpi-meta-value">12 customers</span>
            </div>
          </div>

          {/* Contracts Expiring */}
          <div
            className="analytics-kpi-card"
            style={{
              '--kpi-gradient': 'linear-gradient(90deg, #F59E0B, #D97706)',
              '--kpi-bg': 'rgba(245,158,11,0.12)'
            } as React.CSSProperties}
          >
            <div className="analytics-kpi-header">
              <div className="analytics-kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="analytics-kpi-trend" style={{ '--trend-bg': 'rgba(245,158,11,0.1)', '--trend-color': '#F59E0B' } as React.CSSProperties}>
                ⚠️ Attention
              </div>
            </div>
            <div className="analytics-kpi-value">18</div>
            <div className="analytics-kpi-label">Contracts Expiring (90 days)</div>
            <div className="analytics-kpi-meta">
              <span className="analytics-kpi-meta-item">Requiring action</span>
              <span className="analytics-kpi-meta-value">8 contracts</span>
            </div>
          </div>

          {/* High Risk Contracts */}
          <div
            className="analytics-kpi-card"
            style={{
              '--kpi-gradient': 'linear-gradient(90deg, #EF4444, #DC2626)',
              '--kpi-bg': 'rgba(239,68,68,0.12)'
            } as React.CSSProperties}
          >
            <div className="analytics-kpi-header">
              <div className="analytics-kpi-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="analytics-kpi-trend" style={{ '--trend-bg': 'rgba(239,68,68,0.1)', '--trend-color': '#EF4444' } as React.CSSProperties}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                </svg>
                -3
              </div>
            </div>
            <div className="analytics-kpi-value">12</div>
            <div className="analytics-kpi-label">High Risk Contracts</div>
            <div className="analytics-kpi-meta">
              <span className="analytics-kpi-meta-item">Resolved this month</span>
              <span className="analytics-kpi-meta-value">5 contracts</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h2 className="analytics-chart-title">Contract Value by Month</h2>
            <div className="analytics-chart-controls">
              <button 
                className={`analytics-chart-tab ${chartPeriod === '6M' ? 'active' : ''}`}
                onClick={() => setChartPeriod('6M')}
              >
                6M
              </button>
              <button 
                className={`analytics-chart-tab ${chartPeriod === '1Y' ? 'active' : ''}`}
                onClick={() => setChartPeriod('1Y')}
              >
                1Y
              </button>
              <button 
                className={`analytics-chart-tab ${chartPeriod === 'All' ? 'active' : ''}`}
                onClick={() => setChartPeriod('All')}
              >
                All Time
              </button>
            </div>
          </div>
          <div className="analytics-chart-container">
            <div className="analytics-chart-bars">
              {monthData.map((month) => (
                <div key={month.month} className="analytics-chart-bar">
                  <div 
                    className="analytics-bar" 
                    style={{
                      height: `${month.height}%`,
                      '--bar-color': month.color,
                      '--bar-color-dark': month.colorDark,
                      '--bar-glow': `${month.color}4D`
                    } as React.CSSProperties}
                  />
                  <div className="analytics-bar-label">{month.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="analytics-two-column">
          {/* Top Customers Table */}
          <div className="analytics-table-card">
            <div className="analytics-table-header">
              <h2 className="analytics-table-title">Top Customers by ACV</h2>
              <button className="analytics-table-action">View All →</button>
            </div>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Annual Contract Value</th>
                  <th>Status</th>
                  <th>Churn Risk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>CloudFirst Corp</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Cloud Infrastructure</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>$540,000</td>
                  <td><span className="analytics-badge analytics-badge-active">Active</span></td>
                  <td><span className="analytics-badge analytics-badge-low">Low</span></td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>FinServe Global</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Financial Services</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>$480,000</td>
                  <td><span className="analytics-badge analytics-badge-active">Active</span></td>
                  <td><span className="analytics-badge analytics-badge-low">Low</span></td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>DataFlow Analytics</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Data & Analytics</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>$360,000</td>
                  <td><span className="analytics-badge analytics-badge-active">Active</span></td>
                  <td><span className="analytics-badge analytics-badge-low">Low</span></td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>NextGen Robotics</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Manufacturing - Robotics</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>$240,000</td>
                  <td><span className="analytics-badge analytics-badge-active">Active</span></td>
                  <td><span className="analytics-badge analytics-badge-low">Low</span></td>
                </tr>
                <tr>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>TechScale Inc.</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>FinTech</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>$180,000</td>
                  <td><span className="analytics-badge analytics-badge-active">Active</span></td>
                  <td><span className="analytics-badge analytics-badge-low">Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Insights */}
          <div className="analytics-insights-card">
            <div className="analytics-insights-header">
              <div className="analytics-insights-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 className="analytics-insights-title">AI Insights</h3>
            </div>

            <div className="analytics-insight-item" style={{ '--insight-color': '#EF4444' } as React.CSSProperties}>
              <div className="analytics-insight-type">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                URGENT
              </div>
              <div className="analytics-insight-text">
                3 contracts require renewal notice within 30 days to avoid auto-renewal. Total value: $475,000.
              </div>
            </div>

            <div className="analytics-insight-item" style={{ '--insight-color': '#F59E0B' } as React.CSSProperties}>
              <div className="analytics-insight-type">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                CHURN RISK
              </div>
              <div className="analytics-insight-text">
                GrowthCo Labs shows low engagement (43 days since last login). Churn probability: 45%. Recommend immediate outreach.
              </div>
            </div>

            <div className="analytics-insight-item" style={{ '--insight-color': '#3B82F6' } as React.CSSProperties}>
              <div className="analytics-insight-type">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                INSIGHT
              </div>
              <div className="analytics-insight-text">
                4 customers paying below market rate. Pricing correction at renewal could recover $148K in ARR.
              </div>
            </div>

            <div className="analytics-insight-item" style={{ '--insight-color': '#10B981' } as React.CSSProperties}>
              <div className="analytics-insight-type">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                OPPORTUNITY
              </div>
              <div className="analytics-insight-text">
                CloudFirst Corp is over seat limit (152/150). Immediate expansion opportunity: +$180K ARR.
              </div>
            </div>

            <div className="analytics-insight-item" style={{ '--insight-color': '#8B5CF6' } as React.CSSProperties}>
              <div className="analytics-insight-type">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                TREND
              </div>
              <div className="analytics-insight-text">
                Customer ACV increased 12.5% QoQ. 23 renewals secured this quarter with 94% retention rate.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}