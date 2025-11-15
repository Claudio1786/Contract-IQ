'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';

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
    switch (type) {
      case 'renewal': return '📅';
      case 'risk': return '⚠️';
      case 'success': return '✅';
      case 'system': return '📊';
      default: return '🔔';
    }
  };

  const getAlertAccent = () => {
    switch (priority) {
      case 'high': return 'card-accent-danger';
      case 'medium': return 'card-accent-warning';
      case 'low': return 'card-accent-success';
      default: return '';
    }
  };

  return (
    <div className={`card ${getAlertAccent()}`} style={{ marginBottom: 'var(--space-4)' }}>
      <div className="card-body">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 'var(--space-3)' 
        }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <span style={{ fontSize: '24px' }}>{getAlertIcon()}</span>
            <div>
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-secondary">{message}</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <span className="text-xs text-tertiary">{timestamp}</span>
            <br />
            <span className={`badge ${priority === 'high' ? 'badge-danger' : priority === 'medium' ? 'badge-warning' : 'badge-success'}`}>
              {priority.toUpperCase()}
            </span>
          </div>
        </div>

        {actionRequired && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {contractId && onViewContract && (
              <button 
                className="btn-ghost btn-sm"
                onClick={() => onViewContract(contractId)}
              >
                View Contract
              </button>
            )}
            {onMarkResolved && (
              <button 
                className="btn-primary btn-sm"
                onClick={() => onMarkResolved(id)}
              >
                Mark Resolved
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'renewal',
      title: 'Salesforce Enterprise Agreement - Renewal Alert',
      message: 'Contract expires in 30 days. Auto-renewal clause requires 60-day notice to cancel.',
      timestamp: '2 hours ago',
      priority: 'high',
      contractId: 'salesforce-ea',
      actionRequired: true
    },
    {
      id: '2',
      type: 'risk',
      title: 'Acme Corp Software License - High Risk',
      message: 'Liability cap limitation clause creates significant financial exposure.',
      timestamp: '1 day ago',
      priority: 'high',
      contractId: 'acme-saas',
      actionRequired: true
    },
    {
      id: '3',
      type: 'renewal',
      title: 'HubSpot Marketing Hub - Price Increase',
      message: 'Price increase clause activated. New rates effective on renewal date.',
      timestamp: '1 day ago',
      priority: 'medium',
      contractId: 'hubspot-mh',
      actionRequired: true
    },
    {
      id: '4',
      type: 'system',
      title: 'Weekly Portfolio Summary Generated',
      message: '5 active contracts with $400K annual spend analyzed. 2 high-risk items identified.',
      timestamp: '3 days ago',
      priority: 'low',
      actionRequired: false
    },
    {
      id: '5',
      type: 'success',
      title: 'Notion Team Plan Analysis Complete',
      message: 'Contract analysis completed with low risk rating and standard terms identified.',
      timestamp: '1 week ago',
      priority: 'low',
      contractId: 'notion-team',
      actionRequired: false
    }
  ]);

  const handleViewContract = (contractId: string) => {
    window.location.href = `/contracts/${contractId}`;
  };

  const handleMarkResolved = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);

  const urgentCount = alerts.filter(a => a.priority === 'high' && a.actionRequired).length;

  return (
    <AppLayout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="text-h1">🔔 Alerts & Notifications</h1>
              <p className="text-lg text-secondary">
                {urgentCount} urgent alerts require immediate attention
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn-secondary">Mark All Read</button>
              <button className="btn-secondary">Export Alerts</button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <span className="text-base font-medium">Filter by type:</span>
              <select 
                className="input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Alerts ({alerts.length})</option>
                <option value="renewal">Renewal Alerts ({alerts.filter(a => a.type === 'renewal').length})</option>
                <option value="risk">Risk Alerts ({alerts.filter(a => a.type === 'risk').length})</option>
                <option value="system">System Alerts ({alerts.filter(a => a.type === 'system').length})</option>
                <option value="success">Success Alerts ({alerts.filter(a => a.type === 'success').length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div>
          {filteredAlerts.length === 0 ? (
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🎉</div>
                <h3 className="text-lg">No alerts to show</h3>
                <p className="text-sm text-secondary">
                  {filterType === 'all' 
                    ? "You're all caught up! No alerts at this time."
                    : `No ${filterType} alerts to display.`
                  }
                </p>
              </div>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                {...alert}
                onViewContract={handleViewContract}
                onMarkResolved={handleMarkResolved}
              />
            ))
          )}
        </div>

        {/* Summary Card */}
        {alerts.length > 0 && (
          <div className="card card-accent card-accent-primary" style={{ marginTop: 'var(--space-6)' }}>
            <div className="card-body">
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-3)' }}>📊 Alert Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-display text-danger">{alerts.filter(a => a.priority === 'high').length}</p>
                  <p className="text-sm text-secondary">High Priority</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-display text-warning">{alerts.filter(a => a.priority === 'medium').length}</p>
                  <p className="text-sm text-secondary">Medium Priority</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-display text-success">{alerts.filter(a => a.priority === 'low').length}</p>
                  <p className="text-sm text-secondary">Low Priority</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p className="text-display">{alerts.filter(a => a.actionRequired).length}</p>
                  <p className="text-sm text-secondary">Action Required</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}