'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';

interface Alert {
  id: string;
  type: 'urgent' | 'important' | 'info';
  category: 'renewal' | 'risk' | 'pricing' | 'notice';
  customer: string;
  message: string;
  actionRequired: string;
  dueDate: string;
  isRead: boolean;
}

/**
 * Renewal Alerts Page - Customer Revenue Intelligence
 * Track upcoming renewals, churn risks, and expansion opportunities
 */
export default function AlertsPage() {
  const [filterType, setFilterType] = useState('all');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'urgent',
      category: 'renewal',
      customer: 'TechFlow Industries',
      message: 'Renewal deadline approaching in 15 days',
      actionRequired: 'Contact customer success team to schedule renewal discussion',
      dueDate: 'Jan 15, 2026',
      isRead: false
    },
    {
      id: '2',
      type: 'urgent',
      category: 'risk',
      customer: 'GlobalRetail Solutions',
      message: 'High churn risk detected - usage dropped 45% this quarter',
      actionRequired: 'Schedule executive business review',
      dueDate: 'Jan 20, 2026',
      isRead: false
    },
    {
      id: '3',
      type: 'important',
      category: 'pricing',
      message: 'Acme Corp paying 30% below current market rate',
      actionRequired: 'Prepare pricing adjustment proposal for renewal',
      dueDate: 'Feb 15, 2026',
      isRead: false
    },
    {
      id: '4',
      type: 'urgent',
      category: 'notice',
      customer: 'DataSync Solutions',
      message: '30-day notice period deadline in 5 days',
      actionRequired: 'Submit renewal notice or contract will auto-terminate',
      dueDate: 'Jan 10, 2026',
      isRead: false
    },
    {
      id: '5',
      type: 'info',
      category: 'pricing',
      customer: 'CloudScale Inc',
      message: 'Expansion opportunity: Customer using 95% of seat capacity',
      actionRequired: 'Reach out to discuss seat expansion',
      dueDate: 'Jan 31, 2026',
      isRead: true
    }
  ]);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);

  const urgentCount = alerts.filter(a => a.type === 'urgent' && !a.isRead).length;
  const importantCount = alerts.filter(a => a.type === 'important' && !a.isRead).length;

  return (
    <AppLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F1319 0%, #14171F 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.08) 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 1px rgba(239,68,68,0.2), 0 0 20px rgba(239,68,68,0.15)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#F8FAFC', marginBottom: '8px' }}>
                Renewal Alerts
              </h1>
              <p style={{ fontSize: '16px', color: '#94A3B8' }}>
                Track upcoming renewals, churn risks, and revenue optimization opportunities
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                padding: '12px 20px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444' }}>{urgentCount}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Urgent</div>
              </div>
              <div style={{
                padding: '12px 20px',
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B' }}>{importantCount}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Important</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          padding: '8px',
          background: '#0F1319',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          {[
            { value: 'all', label: 'All Alerts' },
            { value: 'urgent', label: 'Urgent' },
            { value: 'important', label: 'Important' },
            { value: 'info', label: 'Info' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              style={{
                padding: '10px 20px',
                background: filterType === tab.value ? 'rgba(59,130,246,0.15)' : 'transparent',
                border: filterType === tab.value ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                borderRadius: '8px',
                color: filterType === tab.value ? '#3B82F6' : '#94A3B8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              style={{
                background: 'linear-gradient(135deg, #0F1319 0%, #14171F 100%)',
                border: `1px solid ${alert.type === 'urgent' ? 'rgba(239,68,68,0.3)' : alert.type === 'important' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
                borderRadius: '16px',
                padding: '24px',
                opacity: alert.isRead ? 0.6 : 1,
                position: 'relative',
                transition: 'all 0.3s'
              }}
            >
              {/* Alert Type Badge */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: alert.type === 'urgent' ? '#EF4444' : alert.type === 'important' ? '#F59E0B' : '#3B82F6',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  {/* Category & Customer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: alert.type === 'urgent' ? 'rgba(239,68,68,0.15)' : alert.type === 'important' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                      border: `1px solid ${alert.type === 'urgent' ? 'rgba(239,68,68,0.3)' : alert.type === 'important' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: alert.type === 'urgent' ? '#EF4444' : alert.type === 'important' ? '#F59E0B' : '#3B82F6'
                    }}>
                      {alert.category}
                    </span>
                    {alert.customer && (
                      <span style={{ fontSize: '16px', fontWeight: '600', color: '#F8FAFC' }}>
                        {alert.customer}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#F8FAFC', marginBottom: '8px' }}>
                    {alert.message}
                  </h3>

                  {/* Action Required */}
                  <p style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '12px' }}>
                    <strong style={{ color: '#F8FAFC' }}>Action Required:</strong> {alert.actionRequired}
                  </p>

                  {/* Due Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style={{ fontSize: '14px', color: '#94A3B8' }}>
                      Due: {alert.dueDate}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!alert.isRead && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(59,130,246,0.15)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '8px',
                        color: '#3B82F6',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px',
                      color: '#EF4444',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 32px',
            background: 'linear-gradient(135deg, #0F1319 0%, #14171F 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" style={{ margin: '0 auto 24px' }}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#F8FAFC', marginBottom: '12px' }}>
              No {filterType !== 'all' ? filterType : ''} alerts
            </h3>
            <p style={{ fontSize: '16px', color: '#94A3B8' }}>
              All caught up! No active alerts at this time.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
