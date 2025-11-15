'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
}

function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div className="card">
      <div className="card-body" style={{ textAlign: 'center' }}>
        <h3 className="text-h3 text-secondary">{title}</h3>
        <p className="text-display" style={{ margin: 'var(--space-2) 0' }}>{value}</p>
        <p className="text-sm text-success">{trend}</p>
      </div>
    </div>
  );
}

interface CategoryBarProps {
  name: string;
  percentage: number;
  value: string;
  vendors: string[];
}

function CategoryBar({ name, percentage, value, vendors }: CategoryBarProps) {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      {/* Category Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: 'var(--space-2)' 
      }}>
        <span className="text-base font-medium">{name}</span>
        <span className="text-base">({percentage}% · {value})</span>
      </div>
      
      {/* Progress Bar */}
      <div className="progress" style={{ marginBottom: 'var(--space-2)' }}>
        <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
      </div>
      
      {/* Vendors */}
      <p className="text-sm text-tertiary">
        → {vendors.join(' • ')}
      </p>
    </div>
  );
}

/**
 * Analytics Page - Follows wireframe specification exactly
 */
export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('Q1 2026');

  const categoryData: CategoryBarProps[] = [
    {
      name: 'CRM & Sales',
      percentage: 45,
      value: '$180K',
      vendors: ['Salesforce Enterprise Agreement']
    },
    {
      name: 'Marketing',
      percentage: 18,
      value: '$72K',
      vendors: ['HubSpot Marketing Hub']
    },
    {
      name: 'Software Development',
      percentage: 24,
      value: '$95K',
      vendors: ['Acme Corp Software License']
    },
    {
      name: 'Productivity',
      percentage: 13,
      value: '$53K',
      vendors: ['Notion Team Plan', 'TechStart MSA']
    }
  ];

  const renewalMonths = [
    { month: 'JAN', amount: '$480K', height: 60 },
    { month: 'FEB', amount: '$240K', height: 30 },
    { month: 'MAR', amount: '$580K', height: 72 },
    { month: 'APR', amount: '$120K', height: 15 },
    { month: 'MAY', amount: '$220K', height: 28 },
    { month: 'JUN', amount: '$380K', height: 48 },
    { month: 'JUL', amount: '$160K', height: 20 },
    { month: 'AUG', amount: '$290K', height: 36 },
    { month: 'SEP', amount: '$350K', height: 44 },
    { month: 'OCT', amount: '$200K', height: 25 },
    { month: 'NOV', amount: '$140K', height: 18 },
    { month: 'DEC', amount: '$420K', height: 52 }
  ];

  return (
    <AppLayout>
      <div>
        {/* Page Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-8)' 
        }}>
          <div>
            <h1 className="text-h1">Client Agreement Portfolio</h1>
            <p className="text-base text-secondary" style={{ marginTop: 'var(--space-1)' }}>
              📊 Manage your organization's vendor agreements and contract performance
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <select 
              className="input"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="Q1 2026">Q1 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q4 2026">Q4 2026</option>
            </select>
            
            <button className="btn-secondary">Export PDF</button>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 'var(--space-6)', 
          marginBottom: 'var(--space-8)' 
        }}>
          <StatCard
            title="Total Spend"
            value="$400K"
            trend="Demo Portfolio"
          />
          <StatCard
            title="Contracts"
            value="5"
            trend="Active Agreements"
          />
          <StatCard
            title="Avg Contract"
            value="$80K"
            trend="2 High Risk"
          />
        </div>

        {/* SaaS Portfolio Breakdown */}
        <div className="card card-accent card-accent-primary" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h2 className="text-h2">📊 Vendor Agreement Portfolio: $400K Annual Spend</h2>
            <p className="text-sm text-secondary">
              Track spending across your organization's key supplier contracts
            </p>
          </div>
          <div className="card-body">
            {categoryData.map((category) => (
              <CategoryBar key={category.name} {...category} />
            ))}

            {/* Key Insights Section */}
            <div style={{ 
              marginTop: 'var(--space-6)', 
              paddingTop: 'var(--space-6)', 
              borderTop: '1px solid var(--color-border)' 
            }}>
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-4)' }}>💡 KEY INSIGHTS</h3>
              
              <div className="card card-accent card-accent-warning" style={{ marginBottom: 'var(--space-4)' }}>
                <div className="card-body">
                  <h4 className="text-lg font-medium" style={{ marginBottom: 'var(--space-3)' }}>
                    ⚠️ $180K Optimization Opportunity
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>
                      • Salesforce pricing 15% above market average [1]
                    </li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>
                      • Redundant tools: Slack + Teams (~$50K)
                    </li>
                    <li>
                      • AWS reserved instances could save 30% (~$200K)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn-secondary">Export as PDF</button>
            <button className="btn-secondary">Drill Down</button>
            <button className="btn-primary">Show Renewal Risk</button>
          </div>
        </div>

        {/* Renewal Waterfall */}
        <div className="card card-accent card-accent-warning">
          <div className="card-header">
            <h2 className="text-h2">📅 Renewal Waterfall - Next 12 Months</h2>
          </div>
          <div className="card-body">
            {/* Chart */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'end', 
              gap: 'var(--space-2)', 
              height: '200px',
              marginBottom: 'var(--space-4)' 
            }}>
              {renewalMonths.map((month) => (
                <div 
                  key={month.month}
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center' 
                  }}
                >
                  {/* Bar */}
                  <div style={{
                    width: '100%',
                    height: `${month.height}px`,
                    backgroundColor: 'var(--primary-600)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: 'var(--space-2)'
                  }}></div>
                  
                  {/* Amount */}
                  <span className="text-xs text-primary font-medium">
                    {month.amount}
                  </span>
                  
                  {/* Month */}
                  <span className="text-xs text-tertiary">
                    {month.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-footer">
            <button className="btn-secondary">View Details</button>
            <button className="btn-primary">Export Calendar</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}