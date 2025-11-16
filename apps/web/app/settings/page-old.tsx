'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import '../../styles/components-dark.css';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input';
  value: boolean | string;
  options?: string[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: 'email-alerts',
      label: 'Email Alerts',
      description: 'Receive email notifications for contract renewals and risk alerts',
      type: 'toggle',
      value: true
    },
    {
      id: 'slack-notifications',
      label: 'Slack Notifications',
      description: 'Send alerts to your Slack workspace',
      type: 'toggle',
      value: false
    },
    {
      id: 'renewal-window',
      label: 'Renewal Alert Window',
      description: 'How far in advance to alert about contract renewals',
      type: 'select',
      value: '90 days',
      options: ['30 days', '60 days', '90 days', '120 days', '180 days']
    },
    {
      id: 'risk-threshold',
      label: 'Risk Alert Threshold',
      description: 'Minimum risk level to trigger alerts',
      type: 'select',
      value: 'Medium',
      options: ['Low', 'Medium', 'High']
    },
    {
      id: 'auto-analysis',
      label: 'Auto-Analysis',
      description: 'Automatically analyze new contracts upon upload',
      type: 'toggle',
      value: true
    },
    {
      id: 'data-retention',
      label: 'Data Retention Period',
      description: 'How long to keep contract analysis data',
      type: 'select',
      value: '2 years',
      options: ['6 months', '1 year', '2 years', '5 years', 'Indefinite']
    }
  ]);

  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const updateSetting = (id: string, newValue: boolean | string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, value: newValue } : setting
    ));
  };

  const handleSave = () => {
    // Simulate API call
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const handleReset = () => {
    // Reset to defaults
    const confirmation = confirm('Are you sure you want to reset all settings to defaults?');
    if (confirmation) {
      // This would reset to default values
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    }
  };

  const renderSettingControl = (setting: SettingItem) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="checkbox"
              checked={setting.value as boolean}
              onChange={(e) => updateSetting(setting.id, e.target.checked)}
              style={{ display: 'none' }}
            />
            <div
              className={`toggle-slider ${setting.value ? 'toggle-slider-active' : ''}`}
              onClick={() => updateSetting(setting.id, !setting.value)}
              style={{
                width: '48px',
                height: '24px',
                backgroundColor: setting.value ? 'var(--primary-600)' : 'var(--gray-300)',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: setting.value ? '26px' : '2px',
                  transition: 'all var(--transition-fast)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>
            <span className="text-sm">{setting.value ? 'Enabled' : 'Disabled'}</span>
          </label>
        );

      case 'select':
        return (
          <select
            className="input"
            value={setting.value as string}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            className="input"
            value={setting.value as string}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            style={{ maxWidth: '300px' }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="text-h1">Settings</h1>
          <p className="text-base text-secondary" style={{ marginTop: 'var(--space-2)' }}>
            Customize your Contract IQ experience and notification preferences.
          </p>
        </div>

        {/* Success Message */}
        {showSaveMessage && (
          <div 
            className="card card-accent card-accent-success" 
            style={{ 
              marginBottom: 'var(--space-6)',
              animation: 'fadeIn 0.3s ease-in'
            }}
          >
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                <span className="text-base font-medium">Settings saved successfully!</span>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="settings-section">
          <div className="settings-section-card">
            <div className="settings-section-header">
              <div className="settings-section-icon" style={{ '--icon-bg': 'rgba(59,130,246,0.12)' } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="settings-section-title">Account Settings</div>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Email Address</div>
                  <div className="setting-description">Your primary email for notifications and account recovery</div>
                </div>
                <input
                  type="email"
                  className="settings-input"
                  value={accountSettings.email}
                  onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                />
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Company Name</div>
                  <div className="setting-description">Organization name displayed in reports and contracts</div>
                </div>
                <input
                  type="text"
                  className="settings-input"
                  value={accountSettings.company}
                  onChange={(e) => setAccountSettings({ ...accountSettings, company: e.target.value })}
                />
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Time Zone</div>
                  <div className="setting-description">Used for scheduling and deadline calculations</div>
                </div>
                <select
                  className="settings-select"
                  value={accountSettings.timezone}
                  onChange={(e) => setAccountSettings({ ...accountSettings, timezone: e.target.value })}
                >
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="settings-section">
          <div className="settings-section-card">
            <div className="settings-section-header">
              <div className="settings-section-icon" style={{ '--icon-bg': 'rgba(245,158,11,0.12)' } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <div className="settings-section-title">Notification Preferences</div>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Email Notifications</div>
                  <div className="setting-description">Receive email alerts for important contract events</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Renewal Reminders</div>
                  <div className="setting-description">Get notified before contracts expire</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.renewalReminders}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, renewalReminders: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Risk Alerts</div>
                  <div className="setting-description">Immediate notification for high-risk contract issues</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.riskAlerts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, riskAlerts: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Weekly Digest</div>
                  <div className="setting-description">Summary of contract activity every Monday</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyDigest}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyDigest: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Reminder Lead Time</div>
                  <div className="setting-description">How far in advance to send renewal reminders</div>
                </div>
                <select
                  className="settings-select"
                  value={notificationSettings.reminderLeadTime}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, reminderLeadTime: e.target.value })}
                >
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                  <option>120 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Settings */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h2 className="text-h2">🔍 Analysis</h2>
          </div>
          <div className="card-body">
            {settings.filter(s => ['auto-analysis', 'data-retention'].includes(s.id)).map(setting => (
              <div key={setting.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--space-4)',
                paddingBottom: 'var(--space-4)',
                borderBottom: '1px solid var(--color-border)'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 className="text-base font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                    {setting.label}
                  </h3>
                  <p className="text-sm text-secondary">
                    {setting.description}
                  </p>
                </div>
                <div style={{ marginLeft: 'var(--space-4)' }}>
                  {renderSettingControl(setting)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h2 className="text-h2">👤 Account</h2>
          </div>
          <div className="card-body">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <div style={{ flex: 1 }}>
                <h3 className="text-base font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                  Email Address
                </h3>
                <p className="text-sm text-secondary">
                  demo@contractiq.com
                </p>
              </div>
              <button className="btn-secondary">Change</button>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-4)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <div style={{ flex: 1 }}>
                <h3 className="text-base font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                  Plan
                </h3>
                <p className="text-sm text-secondary">
                  Professional Plan - 100 contracts/month
                </p>
              </div>
              <button className="btn-primary">Upgrade</button>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <h3 className="text-base font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                  Export Data
                </h3>
                <p className="text-sm text-secondary">
                  Download all your contract data and analysis results
                </p>
              </div>
              <button className="btn-secondary">Export</button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <button 
            className="btn-secondary"
            onClick={handleReset}
          >
            Reset to Defaults
          </button>
          <button 
            className="btn-primary"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AppLayout>
  );
}
