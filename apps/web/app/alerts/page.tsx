'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import PageHeader from '@/components/ui/PageHeader';

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
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Page Header */}
        <PageHeader
          title="Renewal Alerts"
          subtitle="Track upcoming renewals, churn risks, and revenue optimization opportunities"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          }
          actions={
            <div className="flex gap-3">
              <div className="px-5 py-3 bg-red-500/15 border border-red-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-500">{urgentCount}</div>
                <div className="text-[12px] text-slate-400 uppercase tracking-wide">Urgent</div>
              </div>
              <div className="px-5 py-3 bg-amber-500/15 border border-amber-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-500">{importantCount}</div>
                <div className="text-[12px] text-slate-400 uppercase tracking-wide">Important</div>
              </div>
            </div>
          }
        />

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 p-2 bg-[#0F1319] border border-white/10 rounded-xl w-fit">
          {[
            { value: 'all', label: 'All Alerts' },
            { value: 'urgent', label: 'Urgent' },
            { value: 'important', label: 'Important' },
            { value: 'info', label: 'Info' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-all cursor-pointer border 
                ${filterType === tab.value 
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-500' 
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="flex flex-col gap-4">
          {filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-gradient-to-br from-[#0F1319] to-[#14171F] rounded-2xl p-6 relative transition-all border 
                ${alert.type === 'urgent' ? 'border-red-500/30' : alert.type === 'important' ? 'border-amber-500/30' : 'border-blue-500/30'}
                ${alert.isRead ? 'opacity-60' : 'opacity-100'}`}
            >
              {/* Alert Type Badge */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl 
                ${alert.type === 'urgent' ? 'bg-red-500' : alert.type === 'important' ? 'bg-amber-500' : 'bg-blue-500'}`} />

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Category & Customer */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide border 
                      ${alert.type === 'urgent' 
                        ? 'bg-red-500/15 border-red-500/30 text-red-500'
                        : alert.type === 'important'
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                        : 'bg-blue-500/15 border-blue-500/30 text-blue-500'}`}>
                      {alert.category}
                    </span>
                    {alert.customer && (
                      <span className="text-[16px] font-semibold text-slate-50">
                        {alert.customer}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <h3 className="text-[18px] font-semibold text-slate-50 mb-2">
                    {alert.message}
                  </h3>

                  {/* Action Required */}
                  <p className="text-[14px] text-slate-300 mb-3">
                    <strong className="text-slate-50">Action Required:</strong> {alert.actionRequired}
                  </p>

                  {/* Due Date */}
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="text-[14px] text-slate-400">
                      Due: {alert.dueDate}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!alert.isRead && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="px-4 py-2 bg-blue-500/15 border border-blue-500/30 rounded-lg text-blue-500 text-[14px] font-semibold whitespace-nowrap hover:bg-blue-500/20"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="px-4 py-2 bg-red-500/15 border border-red-500/30 rounded-lg text-red-500 text-[14px] font-semibold whitespace-nowrap hover:bg-red-500/20"
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
          <div className="text-center py-20 px-8 bg-gradient-to-br from-[#0F1319] to-[#14171F] border border-white/10 rounded-2xl">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" className="mx-auto mb-6">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 className="text-2xl font-semibold text-slate-50 mb-3">
              No {filterType !== 'all' ? filterType : ''} alerts
            </h3>
            <p className="text-[16px] text-slate-400">
              All caught up! No active alerts at this time.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
