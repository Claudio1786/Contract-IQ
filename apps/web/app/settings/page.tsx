'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import '../../styles/settings.css';

export default function SettingsPage() {
  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    email: 'ray@contractiq.com',
    company: 'GroceryDeals.co',
    timezone: 'Pacific Time (PT)'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    renewalReminders: true,
    riskAlerts: true,
    weeklyDigest: false,
    reminderLeadTime: '90 days'
  });

  // AI Settings
  const [aiSettings, setAISettings] = useState({
    autoAnalysis: true,
    riskScoring: true,
    playbookGeneration: true,
    analysisDetail: 'Comprehensive'
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    googleDriveSync: true,
    calendarIntegration: true,
    slackNotifications: false,
    apiAccess: false
  });

  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleSave = () => {
    console.log('Saving settings:', {
      account: accountSettings,
      notifications: notificationSettings,
      ai: aiSettings,
      integrations: integrationSettings
    });
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const handleCancel = () => {
    // Reset to initial values or navigate away
    window.location.reload();
  };

  return (
    <AppLayout>
      <div className="settings-container">
        {/* Page Header */}
        <div className="settings-page-header">
          <h1>Settings</h1>
          <p className="settings-header-subtitle">
            Manage your Contract IQ preferences and configurations
          </p>
        </div>

        {/* Success Message */}
        {showSaveMessage && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Settings saved successfully!</span>
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

        {/* AI & Analysis Settings */}
        <div className="settings-section">
          <div className="settings-section-card">
            <div className="settings-section-header">
              <div className="settings-section-icon" style={{ '--icon-bg': 'rgba(139,92,246,0.12)' } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <div className="settings-section-title">AI & Analysis Settings</div>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Auto-Analysis</div>
                  <div className="setting-description">Automatically analyze new contracts with AI</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={aiSettings.autoAnalysis}
                    onChange={(e) => setAISettings({ ...aiSettings, autoAnalysis: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Risk Scoring</div>
                  <div className="setting-description">Calculate risk scores for all contracts</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={aiSettings.riskScoring}
                    onChange={(e) => setAISettings({ ...aiSettings, riskScoring: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Intelligence Brief Generation</div>
                  <div className="setting-description">Auto-generate account intelligence briefs for renewals</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={aiSettings.playbookGeneration}
                    onChange={(e) => setAISettings({ ...aiSettings, playbookGeneration: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Analysis Detail Level</div>
                  <div className="setting-description">Depth of AI contract analysis</div>
                </div>
                <select
                  className="settings-select"
                  value={aiSettings.analysisDetail}
                  onChange={(e) => setAISettings({ ...aiSettings, analysisDetail: e.target.value })}
                >
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Comprehensive</option>
                  <option>Deep Dive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="settings-section">
          <div className="settings-section-card">
            <div className="settings-section-header">
              <div className="settings-section-icon" style={{ '--icon-bg': 'rgba(16,185,129,0.12)' } as React.CSSProperties}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div className="settings-section-title">Integration Settings</div>
            </div>
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Google Drive Sync</div>
                  <div className="setting-description">Automatically import contracts from Google Drive</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={integrationSettings.googleDriveSync}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, googleDriveSync: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Calendar Integration</div>
                  <div className="setting-description">Sync renewal dates to Google Calendar</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={integrationSettings.calendarIntegration}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, calendarIntegration: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">Slack Notifications</div>
                  <div className="setting-description">Send contract alerts to Slack channels</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={integrationSettings.slackNotifications}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, slackNotifications: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-label">API Access</div>
                  <div className="setting-description">Enable API for custom integrations</div>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={integrationSettings.apiAccess}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, apiAccess: e.target.checked })}
                  />
                  <span className="settings-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-action-buttons">
          <button className="settings-btn settings-btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="settings-btn settings-btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
