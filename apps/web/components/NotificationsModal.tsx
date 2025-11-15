'use client';

import React, { useState } from 'react';

interface Notification {
  id: string;
  type: 'renewal' | 'risk' | 'system' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'renewal',
      title: 'Contract Renewal Alert',
      message: 'SaaS Master Agreement expires in 30 days. Review and prepare for negotiation.',
      timestamp: '2 hours ago',
      read: false,
      actionText: 'Review Contract',
      actionUrl: '/contracts/saas-msa'
    },
    {
      id: '2',
      type: 'risk',
      title: 'High Risk Contract Detected',
      message: 'Healthcare BAA contains uncapped liability clauses that require attention.',
      timestamp: '1 day ago',
      read: false,
      actionText: 'View Analysis',
      actionUrl: '/contracts/healthcare-baa'
    },
    {
      id: '3',
      type: 'success',
      title: 'Contract Analysis Complete',
      message: 'Enterprise Cloud Services Agreement has been successfully analyzed with 3 key insights.',
      timestamp: '2 days ago',
      read: true,
      actionText: 'View Results',
      actionUrl: '/contracts/enterprise-cloud-services'
    },
    {
      id: '4',
      type: 'system',
      title: 'Weekly Portfolio Summary',
      message: 'Your portfolio has 3 upcoming renewals and $180K optimization opportunities.',
      timestamp: '3 days ago',
      read: true,
      actionText: 'View Dashboard',
      actionUrl: '/'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'renewal': return '📅';
      case 'risk': return '⚠️';
      case 'success': return '✅';
      case 'system': return '📊';
      default: return '🔔';
    }
  };

  const getNotificationAccentColor = (type: Notification['type']) => {
    switch (type) {
      case 'renewal': return 'var(--warning-600)';
      case 'risk': return 'var(--danger-600)';
      case 'success': return 'var(--success-600)';
      case 'system': return 'var(--primary-600)';
      default: return 'var(--gray-600)';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 'var(--z-modal)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 'var(--z-modal-content)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-6)',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h2 className="text-h2">🔔 Notifications</h2>
            {unreadCount > 0 && (
              <span className="badge badge-primary">
                {unreadCount} new
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {unreadCount > 0 && (
              <button
                className="btn-ghost btn-sm"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
            <button
              className="btn-icon btn-sm"
              onClick={onClose}
              style={{ fontSize: '18px' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{
          maxHeight: '500px',
          overflowY: 'auto',
          padding: 'var(--space-4)'
        }}>
          {notifications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-8)',
              color: 'var(--color-text-tertiary)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🔕</div>
              <h3 className="text-lg">No notifications</h3>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  display: 'flex',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: notification.read ? 'transparent' : 'var(--gray-50)',
                  border: '1px solid',
                  borderColor: notification.read ? 'transparent' : 'var(--color-border)',
                  marginBottom: 'var(--space-3)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  opacity: notification.read ? 0.8 : 1
                }}
                onClick={() => {
                  if (!notification.read) markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--gray-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <h4 className="text-base font-medium">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-tertiary">
                      {notification.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-2)' }}>
                    {notification.message}
                  </p>

                  {notification.actionText && (
                    <button
                      className="btn-ghost btn-sm"
                      style={{
                        color: getNotificationAccentColor(notification.type),
                        padding: '4px 8px'
                      }}
                    >
                      {notification.actionText} →
                    </button>
                  )}
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-600)',
                    marginTop: 'var(--space-2)',
                    flexShrink: 0
                  }} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center'
        }}>
          <button
            className="btn-secondary btn-sm"
            onClick={() => window.location.href = '/settings'}
          >
            ⚙️ Notification Settings
          </button>
        </div>
      </div>
    </>
  );
}