'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';

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

        {/* Notifications Section */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h2 className="text-h2">🔔 Notifications</h2>
          </div>
          <div className="card-body">
            {settings.filter(s => ['email-alerts', 'slack-notifications', 'renewal-window', 'risk-threshold'].includes(s.id)).map(setting => (
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