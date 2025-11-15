'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';

interface NegotiationContract {
  id: string;
  clientName: string;
  clientEmail: string;
  contractType: string;
  subject: string;
  status: 'new' | 'reviewing' | 'escalated' | 'pushback' | 'accepted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dealValue: string;
  deadline?: string;
  changesCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
  escalationReason?: string;
  assignedTo?: string;
}

interface StatusFilter {
  value: NegotiationContract['status'] | 'all';
  label: string;
  color: string;
  count: number;
}

export default function NegotiationsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);

  // Mock negotiation data
  const negotiations: NegotiationContract[] = [
    {
      id: 'neg-001',
      clientName: 'Acme Corp',
      clientEmail: 'legal@acme.com',
      contractType: 'Enterprise SaaS Agreement',
      subject: 'Re: Acme Corp - Software License Agreement',
      status: 'escalated',
      priority: 'urgent',
      dealValue: '$180K',
      deadline: '2024-11-20',
      changesCount: 12,
      riskLevel: 'high',
      lastActivity: '2 hours ago',
      escalationReason: 'Liability cap reduced to $10K',
      assignedTo: 'Sarah Chen (Legal)'
    },
    {
      id: 'neg-002',
      clientName: 'TechStart Inc',
      clientEmail: 'contracts@techstart.io',
      contractType: 'SaaS MSA',
      subject: 'TechStart SaaS Agreement - Markup Review',
      status: 'reviewing',
      priority: 'high',
      dealValue: '$72K',
      deadline: '2024-11-22',
      changesCount: 5,
      riskLevel: 'medium',
      lastActivity: '4 hours ago'
    },
    {
      id: 'neg-003',
      clientName: 'Global Solutions LLC',
      clientEmail: 'procurement@globalsol.com',
      contractType: 'Professional Services Agreement',
      subject: 'Global Solutions - Service Agreement Updates',
      status: 'pushback',
      priority: 'medium',
      dealValue: '$45K',
      changesCount: 8,
      riskLevel: 'medium',
      lastActivity: '1 day ago',
      assignedTo: 'Mike Rodriguez (Sales)'
    },
    {
      id: 'neg-004',
      clientName: 'Startup Co',
      clientEmail: 'founder@startup.co',
      contractType: 'SaaS Agreement',
      subject: 'Startup Co Contract Terms',
      status: 'new',
      priority: 'low',
      dealValue: '$12K',
      changesCount: 3,
      riskLevel: 'low',
      lastActivity: '3 hours ago'
    },
    {
      id: 'neg-005',
      clientName: 'Enterprise Group',
      clientEmail: 'legal@enterprise.com',
      contractType: 'Master Service Agreement',
      subject: 'Enterprise Group - MSA Negotiations',
      status: 'accepted',
      priority: 'medium',
      dealValue: '$250K',
      changesCount: 2,
      riskLevel: 'low',
      lastActivity: '2 days ago'
    }
  ];

  const statusFilters: StatusFilter[] = [
    { value: 'all', label: 'All Contracts', color: 'var(--gray-600)', count: negotiations.length },
    { value: 'new', label: 'New', color: 'var(--primary-600)', count: negotiations.filter(n => n.status === 'new').length },
    { value: 'reviewing', label: 'Reviewing', color: 'var(--warning-600)', count: negotiations.filter(n => n.status === 'reviewing').length },
    { value: 'escalated', label: 'Escalated', color: 'var(--danger-600)', count: negotiations.filter(n => n.status === 'escalated').length },
    { value: 'pushback', label: 'Pushback', color: 'var(--warning-700)', count: negotiations.filter(n => n.status === 'pushback').length },
    { value: 'accepted', label: 'Accepted', color: 'var(--success-600)', count: negotiations.filter(n => n.status === 'accepted').length }
  ];

  const filteredNegotiations = selectedFilter === 'all' 
    ? negotiations 
    : negotiations.filter(n => n.status === selectedFilter);

  const getStatusBadgeClass = (status: NegotiationContract['status']) => {
    switch (status) {
      case 'new': return 'badge badge-primary';
      case 'reviewing': return 'badge badge-warning';
      case 'escalated': return 'badge badge-danger';
      case 'pushback': return 'badge badge-warning';
      case 'accepted': return 'badge badge-success';
      default: return 'badge badge-neutral';
    }
  };

  const getPriorityIcon = (priority: NegotiationContract['priority']) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟡';
      case 'medium': return '🟢';
      case 'low': return '⚪';
      default: return '⚪';
    }
  };

  const getRiskIcon = (risk: NegotiationContract['riskLevel']) => {
    switch (risk) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '✅';
      default: return '❓';
    }
  };

  const handleContractClick = (negotiation: NegotiationContract) => {
    router.push(`/negotiations/${negotiation.id}`);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for contracts:`, selectedContracts);
    // TODO: Implement bulk actions
  };

  const toggleContractSelection = (id: string) => {
    setSelectedContracts(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  const selectAllContracts = () => {
    setSelectedContracts(
      selectedContracts.length === filteredNegotiations.length 
        ? [] 
        : filteredNegotiations.map(n => n.id)
    );
  };

  return (
    <AppLayout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="text-h1">Contract Negotiations</h1>
          <p className="text-base text-secondary" style={{ marginTop: 'var(--space-2)' }}>
            Monitor and manage high-volume contract markups from clients
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          marginBottom: 'var(--space-6)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)'
        }}>
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              className={`btn ${selectedFilter === filter.value ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedFilter(filter.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                whiteSpace: 'nowrap',
                borderColor: selectedFilter === filter.value ? filter.color : 'transparent'
              }}
            >
              <span>{filter.label}</span>
              <span className="badge badge-neutral" style={{ 
                backgroundColor: selectedFilter === filter.value ? 'rgba(255,255,255,0.2)' : 'var(--gray-100)'
              }}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedContracts.length > 0 && (
          <div className="card card-accent card-accent-primary" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span className="text-base font-medium">
                    {selectedContracts.length} contract{selectedContracts.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn-secondary btn-sm" onClick={() => handleBulkAction('assign')}>
                    Assign
                  </button>
                  <button className="btn-secondary btn-sm" onClick={() => handleBulkAction('escalate')}>
                    Escalate
                  </button>
                  <button className="btn-secondary btn-sm" onClick={() => handleBulkAction('export')}>
                    Export
                  </button>
                  <button className="btn-ghost btn-sm" onClick={() => setSelectedContracts([])}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Negotiations Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedContracts.length === filteredNegotiations.length && filteredNegotiations.length > 0}
                        onChange={selectAllContracts}
                      />
                    </th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Client & Contract</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Priority</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Deal Value</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Changes</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Risk</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Deadline</th>
                    <th style={{ padding: 'var(--space-3)', textAlign: 'left' }}>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNegotiations.map((negotiation) => (
                    <tr 
                      key={negotiation.id}
                      style={{ 
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => handleContractClick(negotiation)}
                    >
                      <td style={{ padding: 'var(--space-3)' }} onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={selectedContracts.includes(negotiation.id)}
                          onChange={() => toggleContractSelection(negotiation.id)}
                        />
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div>
                          <div className="text-base font-medium">{negotiation.clientName}</div>
                          <div className="text-sm text-secondary">{negotiation.contractType}</div>
                          <div className="text-xs text-tertiary">{negotiation.clientEmail}</div>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className={getStatusBadgeClass(negotiation.status)}>
                          {negotiation.status}
                        </span>
                        {negotiation.assignedTo && (
                          <div className="text-xs text-tertiary" style={{ marginTop: 'var(--space-1)' }}>
                            → {negotiation.assignedTo}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          <span>{getPriorityIcon(negotiation.priority)}</span>
                          <span className="text-sm">{negotiation.priority}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className="text-base font-medium">{negotiation.dealValue}</span>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className="badge badge-neutral">
                          {negotiation.changesCount} changes
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          <span>{getRiskIcon(negotiation.riskLevel)}</span>
                          <span className="text-sm">{negotiation.riskLevel}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        {negotiation.deadline ? (
                          <div className="text-sm">
                            {new Date(negotiation.deadline).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-tertiary">-</span>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <span className="text-sm text-tertiary">{negotiation.lastActivity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          marginTop: 'var(--space-6)',
          display: 'flex',
          gap: 'var(--space-4)',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <button className="btn-secondary" onClick={() => router.push('/negotiations/settings')}>
              ⚙️ Configure Escalation Rules
            </button>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn-secondary">
              📧 Setup Gmail Integration
            </button>
            <button className="btn-primary">
              📤 Export Report
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}