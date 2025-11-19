'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../../components/layout/AppLayout';
import { EscalationRule, ContractChange } from '../../../lib/gmail-integration';

interface EscalationRuleForm extends Omit<EscalationRule, 'id'> {
  id?: string;
}

export default function NegotiationSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rules' | 'gmail' | 'team' | 'notifications'>('rules');
  const [rules, setRules] = useState<EscalationRule[]>([
    {
      id: 'rule-001',
      name: 'Critical Liability Changes',
      condition: {
        severity: ['critical'],
        category: ['liability']
      },
      action: 'immediate-escalate',
      assignTo: 'legal@company.com',
      notifyChannels: ['email', 'slack'],
      priority: 'urgent'
    },
    {
      id: 'rule-002', 
      name: 'Large Deal Value Changes',
      condition: {
        dealValue: { min: 100000 },
        severity: ['major', 'critical']
      },
      action: 'flag-review',
      assignTo: 'sales-director@company.com',
      notifyChannels: ['email'],
      priority: 'high'
    },
    {
      id: 'rule-003',
      name: 'Payment Terms Extensions',
      condition: {
        category: ['pricing'],
        changeType: ['modification']
      },
      action: 'auto-accept',
      priority: 'medium'
    }
  ]);

  const [editingRule, setEditingRule] = useState<EscalationRuleForm | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);

  const handleSaveRule = (rule: EscalationRuleForm) => {
    if (rule.id) {
      // Update existing rule
      setRules(prev => prev.map(r => r.id === rule.id ? { ...rule, id: rule.id! } : r));
    } else {
      // Add new rule
      const newRule: EscalationRule = {
        ...rule,
        id: `rule-${Date.now()}`
      };
      setRules(prev => [...prev, newRule]);
    }
    
    setEditingRule(null);
    setShowRuleForm(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleEditRule = (rule: EscalationRule) => {
    setEditingRule(rule);
    setShowRuleForm(true);
  };

  const renderRulesTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 className="text-h2">Escalation Rules</h2>
          <p className="text-base text-secondary">Configure automatic routing for contract markups</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingRule({
              name: '',
              condition: {},
              action: 'flag-review',
              priority: 'medium'
            });
            setShowRuleForm(true);
          }}
        >
          + Add New Rule
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 className="text-h3">{rule.name}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                    <div>
                      <span className="text-sm text-secondary">Action:</span>
                      <span className={`badge ${getActionBadgeClass(rule.action)}`} style={{ marginLeft: 'var(--space-2)' }}>
                        {rule.action.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-secondary">Priority:</span>
                      <span className={`badge ${getPriorityBadgeClass(rule.priority)}`} style={{ marginLeft: 'var(--space-2)' }}>
                        {rule.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'var(--space-3)' }}>
                    <div className="text-sm text-secondary">Conditions:</div>
                    <div style={{ marginTop: 'var(--space-1)' }}>
                      {rule.condition.severity && (
                        <span className="badge badge-neutral" style={{ marginRight: 'var(--space-2)' }}>
                          Severity: {rule.condition.severity.join(', ')}
                        </span>
                      )}
                      {rule.condition.category && (
                        <span className="badge badge-neutral" style={{ marginRight: 'var(--space-2)' }}>
                          Category: {rule.condition.category.join(', ')}
                        </span>
                      )}
                      {rule.condition.changeType && (
                        <span className="badge badge-neutral" style={{ marginRight: 'var(--space-2)' }}>
                          Type: {rule.condition.changeType.join(', ')}
                        </span>
                      )}
                      {rule.condition.dealValue && (
                        <span className="badge badge-neutral">
                          Deal Value: ${rule.condition.dealValue.min?.toLocaleString()}+
                        </span>
                      )}
                    </div>
                  </div>

                  {rule.assignTo && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <span className="text-sm text-secondary">Assigned to: </span>
                      <span className="text-sm">{rule.assignTo}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn-ghost btn-sm" onClick={() => handleEditRule(rule)}>
                    Edit
                  </button>
                  <button className="btn-ghost btn-sm text-danger" onClick={() => handleDeleteRule(rule.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGmailTab = () => (
    <div>
      <h2 className="text-h2">Gmail Integration</h2>
      <p className="text-base text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
        Connect your Gmail account to automatically monitor contract emails
      </p>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="text-h3">Gmail Connection</h3>
              <p className="text-base text-secondary">Status: Not Connected</p>
            </div>
            <button className="btn-primary">
              📧 Connect Gmail Account
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-body">
          <h3 className="text-h3">Email Monitoring Settings</h3>
          <div className="space-y-4" style={{ marginTop: 'var(--space-4)' }}>
            <div>
              <label className="form-label">Monitor Labels/Folders</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="contracts, agreements, legal"
                defaultValue="contracts, agreements, legal"
              />
            </div>
            <div>
              <label className="form-label">Contract Keywords</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="contract, agreement, MSA, SOW"
                defaultValue="contract, agreement, MSA, SOW, terms, markup"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input type="checkbox" id="auto-processing" defaultChecked />
              <label htmlFor="auto-processing" className="text-base">
                Enable automatic contract processing
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamTab = () => (
    <div>
      <h2 className="text-h2">Team Management</h2>
      <p className="text-base text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
        Configure team members and assignment rules
      </p>

      <div className="card">
        <div className="card-body">
          <h3 className="text-h3">Team Members</h3>
          <div className="space-y-3" style={{ marginTop: 'var(--space-4)' }}>
            {[
              { name: 'Sarah Chen', role: 'Legal Counsel', email: 'sarah.chen@company.com' },
              { name: 'Mike Rodriguez', role: 'Sales Director', email: 'mike.rodriguez@company.com' },
              { name: 'Jennifer Park', role: 'Contract Manager', email: 'jennifer.park@company.com' }
            ].map((member, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div className="text-base font-medium">{member.name}</div>
                  <div className="text-sm text-secondary">{member.role} • {member.email}</div>
                </div>
                <button className="btn-ghost btn-sm">Edit</button>
              </div>
            ))}
          </div>
          <button className="btn-secondary" style={{ marginTop: 'var(--space-4)' }}>
            + Add Team Member
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div>
      <h2 className="text-h2">Notifications</h2>
      <p className="text-base text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
        Configure how and when you receive notifications
      </p>

      <div className="space-y-4">
        <div className="card">
          <div className="card-body">
            <h3 className="text-h3">Email Notifications</h3>
            <div className="space-y-3" style={{ marginTop: 'var(--space-4)' }}>
              {[
                { label: 'New contract received', checked: true },
                { label: 'Escalation triggered', checked: true },
                { label: 'Assignment changes', checked: true },
                { label: 'Daily summary report', checked: false }
              ].map((setting, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input type="checkbox" id={`email-${index}`} defaultChecked={setting.checked} />
                  <label htmlFor={`email-${index}`} className="text-base">{setting.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="text-h3">Slack Integration</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="text-base">Send notifications to Slack channels</p>
                <p className="text-sm text-secondary">Status: Not Connected</p>
              </div>
              <button className="btn-secondary">Connect Slack</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getActionBadgeClass = (action: EscalationRule['action']) => {
    switch (action) {
      case 'immediate-escalate': return 'badge-danger';
      case 'flag-review': return 'badge-warning';
      case 'auto-accept': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  const getPriorityBadgeClass = (priority: EscalationRule['priority']) => {
    switch (priority) {
      case 'urgent': return 'badge-danger';
      case 'high': return 'badge-warning';
      case 'medium': return 'badge-neutral';
      case 'low': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  return (
    <AppLayout>
      <div>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="text-h1">Negotiation Settings</h1>
          <p className="text-base text-secondary" style={{ marginTop: 'var(--space-2)' }}>
            Configure escalation rules, integrations, and team settings
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          marginBottom: 'var(--space-6)',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 'var(--space-2)'
        }}>
          {[
            { id: 'rules', label: '⚙️ Escalation Rules' },
            { id: 'gmail', label: '📧 Gmail Integration' },
            { id: 'team', label: '👥 Team Management' },
            { id: 'notifications', label: '🔔 Notifications' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'rules' && renderRulesTab()}
        {activeTab === 'gmail' && renderGmailTab()}
        {activeTab === 'team' && renderTeamTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}

        {/* Rule Form Modal */}
        {showRuleForm && editingRule && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '600px', maxHeight: '80vh', overflow: 'auto' }}>
              <div className="card-body">
                <h3 className="text-h3">{editingRule.id ? 'Edit Rule' : 'Create New Rule'}</h3>
                
                <div className="space-y-4" style={{ marginTop: 'var(--space-4)' }}>
                  <div>
                    <label className="form-label">Rule Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={editingRule.name}
                      onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                      placeholder="e.g., Critical Liability Changes"
                    />
                  </div>

                  <div>
                    <label className="form-label">Action</label>
                    <select 
                      className="form-input"
                      value={editingRule.action}
                      onChange={(e) => setEditingRule({...editingRule, action: e.target.value as EscalationRule['action']})}
                    >
                      <option value="auto-accept">Auto Accept</option>
                      <option value="flag-review">Flag for Review</option>
                      <option value="immediate-escalate">Immediate Escalate</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-input"
                      value={editingRule.priority}
                      onChange={(e) => setEditingRule({...editingRule, priority: e.target.value as EscalationRule['priority']})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Assign To (Email)</label>
                    <input 
                      type="email" 
                      className="form-input"
                      value={editingRule.assignTo || ''}
                      onChange={(e) => setEditingRule({...editingRule, assignTo: e.target.value})}
                      placeholder="user@company.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
                  <button 
                    className="btn-ghost"
                    onClick={() => {
                      setShowRuleForm(false);
                      setEditingRule(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleSaveRule(editingRule)}
                  >
                    {editingRule.id ? 'Update Rule' : 'Create Rule'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}