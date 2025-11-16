'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import '../../styles/alerts.css';

interface Alert {
  id: string;
  type: 'renewal' | 'risk' | 'system' | 'success';
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  contractId?: string;
  actionRequired: boolean;
}

interface AlertCardProps extends Alert {
  onViewContract?: (contractId: string) => void;
  onMarkResolved?: (id: string) => void;
}

function AlertCard({ 
  id, 
  type, 
  title, 
  message, 
  timestamp, 
  priority, 
  contractId, 
  actionRequired,
  onViewContract,
  onMarkResolved 
}: AlertCardProps) {
  const getAlertIcon = () => {
    const color = priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#06B6D4';
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        {type === 'renewal' && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
        {type === 'risk' && <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
        {type === 'system' && <><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></>}
        {type === 'success' && <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>}
      </svg>
    );
  };

  const getPriorityClass = () => {
    return priority === 'high' ? 'alert-card-high' : priority === 'medium' ? 'alert-card-medium' : 'alert-card-low';
  };

  const getIconClass = () => {
    return priority === 'high' ? 'alert-icon-high' : priority === 'medium' ? 'alert-icon-medium' : 'alert-icon-low';
  };

  const getBadgeClass = () => {
    return priority === 'high' ? 'badge-glow-error' : priority === 'medium' ? 'badge-glow-warning' : 'badge-glow-info';
  };

  return (
    <div className={`alert-card-flow ${getPriorityClass()}`}>
      <div className="alert-header-flow">
        <div className={`alert-icon-flow ${getIconClass()}`}>
          {getAlertIcon()}
        </div>
        <div className="alert-title-group">
          <div className="alert-meta-flow">
            <div className="alert-title-flow">{title}</div>
            {actionRequired && <span className={`badge-glow ${getBadgeClass()}`}>{priority.toUpperCase()}</span>}
          </div>
          <div className="alert-subtitle-flow">{type === 'renewal' ? 'Renewal deadline approaching' : type === 'risk' ? 'Risk assessment' : type === 'system' ? 'System notification' : 'Success'}</div>
        </div>
      </div>

      <div className="alert-body-flow">
        {message}
      </div>

      {actionRequired && contractId && (
        <div className="alert-actions-flow">
          <button className="btn-flow btn-flow-primary" onClick={() => onViewContract?.(contractId)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            View Contract
          </button>
          {onMarkResolved && (
            <button className="btn-flow btn-flow-secondary" onClick={() => onMarkResolved(id)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
              Mark Resolved
            </button>
          )}
        </div>
      )}

      <div className="alert-timestamp-flow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Created {timestamp}
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [filterType, setFilterType] = useState<string>('all');

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'renewal',
      title: 'Salesforce Enterprise Agreement - Renewal Alert',
      message: 'Contract expires in 30 days. Auto-renewal clause requires 60-day notice to cancel. You\'re now past the cancellation window and will be automatically renewed unless action is taken immediately.',
      timestamp: '2 hours ago',
      priority: 'high',
      contractId: 'cont-001',
      actionRequired: true
    },
    {
      id: '2',
      type: 'risk',
      title: 'Microsoft 365 License - Payment Failure',
      message: 'Payment method on file was declined for the Microsoft 365 Enterprise E5 license renewal. Service will be suspended in 5 days if payment is not updated.',
      timestamp: '5 hours ago',
      priority: 'high',
      contractId: 'cont-002',
      actionRequired: true
    },
    {
      id: '3',
      type: 'renewal',
      title: 'AWS Enterprise Support - Renewal Notice',
      message: 'Your AWS Enterprise Support contract renews in 90 days. Notice period for non-renewal is 60 days. Consider reviewing usage patterns and negotiating terms.',
      timestamp: '1 day ago',
      priority: 'medium',
      contractId: 'cont-003',
      actionRequired: true
    },
    {
      id: '4',
      type: 'system',
      title: 'Slack Price Update Notification',
      message: 'Slack has announced a 12% price increase for Business+ plans, effective on your next renewal date (Aug 12, 2026). Your annual cost will increase from $48,000 to $53,760.',
      timestamp: '2 days ago',
      priority: 'low',
      contractId: 'cont-004',
      actionRequired: true
    },
    {
      id: '5',
      type: 'success',
      title: 'Adobe Creative Cloud - Successfully Renewed',
      message: 'Your Adobe Creative Cloud Enterprise subscription has been successfully renewed for another year. All 250 licenses are now active through November 2026.',
      timestamp: '3 days ago',
      priority: 'low',
      contractId: 'cont-005',
      actionRequired: false
    }
  ];

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);

  const urgentCount = alerts.filter(a => a.priority === 'high').length;

  const handleViewContract = (contractId: string) => {
    console.log('Viewing contract:', contractId);
    // Navigate to contract page - functionality preserved
    window.location.href = `/contracts/${contractId}`;
  };

  const handleMarkResolved = (id: string) => {
    console.log('Marking resolved:', id);
    // Mark alert as resolved - functionality preserved
    alert(`Alert ${id} marked as resolved`);
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px', position: 'relative', zIndex: 1 }}>
        {/* Decorative Waves Background */}
        <div className="decorative-waves">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgba(59,130,246,0.25)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(139,92,246,0.15)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgba(139,92,246,0.2)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(59,130,246,0.1)', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path d="M0,400 Q250,200 500,400 T1000,400 L1000,1000 L0,1000 Z" fill="url(#wave1)"/>
            <path d="M0,500 Q250,350 500,500 T1000,500 L1000,1000 L0,1000 Z" fill="url(#wave2)"/>
          </svg>
        </div>

        {/* Page Header */}
        <div className="alerts-page-header">
          <div className="alerts-header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="alerts-header-content">
            <h1>Alerts & Notifications</h1>
            <p className="alerts-header-subtitle">
              <span className="badge-glow badge-glow-error">{urgentCount} urgent</span> 
              alerts require immediate attention
            </p>
          </div>
        </div>

        {/* Filter Tabs with Sliding Indicator */}
        <div className="filter-tabs" data-active={filterType}>
          <button 
            className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Alerts
            <span className="tab-count">{alerts.length}</span>
          </button>
          <button 
            className={`filter-tab ${filterType === 'renewal' ? 'active' : ''}`}
            onClick={() => setFilterType('renewal')}
          >
            Renewals
            <span className="tab-count">{alerts.filter(a => a.type === 'renewal').length}</span>
          </button>
          <button 
            className={`filter-tab ${filterType === 'risk' ? 'active' : ''}`}
            onClick={() => setFilterType('risk')}
          >
            Risk
            <span className="tab-count">{alerts.filter(a => a.type === 'risk').length}</span>
          </button>
          <button 
            className={`filter-tab ${filterType === 'system' ? 'active' : ''}`}
            onClick={() => setFilterType('system')}
          >
            System
            <span className="tab-count">{alerts.filter(a => a.type === 'system').length}</span>
          </button>
          <button 
            className={`filter-tab ${filterType === 'success' ? 'active' : ''}`}
            onClick={() => setFilterType('success')}
          >
            Success
            <span className="tab-count">{alerts.filter(a => a.type === 'success').length}</span>
          </button>
        </div>

        {/* Alerts Grid */}
        <div className="alerts-grid">
          {filteredAlerts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '64px 32px',
              background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                No alerts to show
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-tertiary)' }}>
                {filterType === 'all' 
                  ? "You're all caught up! No alerts at this time."
                  : `No ${filterType} alerts to display.`
                }
              </p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                {...alert}
                onViewContract={handleViewContract}
                onMarkResolved={handleMarkResolved}
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
