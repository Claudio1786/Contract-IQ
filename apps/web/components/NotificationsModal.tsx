'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const modalRef = useRef<HTMLDivElement>(null);
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
      case 'renewal':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        );
      case 'risk':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case 'success':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
      case 'system':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18"/>
            <rect x="7" y="12" width="3" height="6"/>
            <rect x="12" y="8" width="3" height="10"/>
            <rect x="17" y="5" width="3" height="13"/>
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        );
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus the close button by default
    const toFocus = modalRef.current?.querySelector<HTMLElement>('button');
    toFocus?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
          zIndex: 'var(--z-modal, 1000)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-modal-title"
        ref={modalRef}
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
          zIndex: 'var(--z-modal-content, 1001)',
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
            <h2 id="notifications-modal-title" className="text-h2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              Notifications
            </h2>
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
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
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
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </div>
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
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>{notification.actionText}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14"/>
                          <path d="M13 5l7 7-7 7"/>
                        </svg>
                      </span>
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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .7.28 1.37.78 1.86.5.5 1.17.78 1.86.78H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
              <span>Notification Settings</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}