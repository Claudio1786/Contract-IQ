'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import '../../styles/contracts.css';

interface ContractCardProps {
  id: string;
  name: string;
  vendor: string;
  renewalDate: string;
  annualValue: string;
  keyTerm: string;
  risk: 'high' | 'medium' | 'low';
  riskLabel: string;
}

function ContractCard({ 
  id, 
  name, 
  vendor, 
  renewalDate, 
  annualValue, 
  keyTerm, 
  risk, 
  riskLabel,
  onView,
  onAnalyze,
  onGeneratePlaybook
}: ContractCardProps & {
  onView: () => void;
  onAnalyze: () => void;
  onGeneratePlaybook: () => void;
}) {
  const accentClass = risk === 'high' ? 'card-accent-danger' : 
                     risk === 'medium' ? 'card-accent-warning' : 
                     'card-accent-success';
  
  const riskIcon = risk === 'high' ? '⚠️' : 
                   risk === 'medium' ? '🟡' : 
                   '✅';

  return (
    <div className={`card card-accent ${accentClass}`} style={{ marginBottom: 'var(--space-4)' }}>
      <div className="card-body">
        {/* Header Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 'var(--space-3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '20px' }}>📄</span>
            <div>
              <h3 className="text-lg font-medium">{name}</h3>
              <p className="text-sm text-secondary">{vendor}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ textAlign: 'right' }}>
              <p className="text-base">{renewalDate}</p>
              <p className="text-sm text-tertiary">Renewal</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>{riskIcon}</span>
              <span className="text-sm font-medium">{riskLabel}</span>
            </div>
          </div>
        </div>

        {/* Details Row */}
        <div style={{ 
          display: 'flex', 
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-4)'
        }}>
          <span className="text-base">Annual: {annualValue}</span>
          <span className="text-separator">|</span>
          <span className="text-base text-tertiary">{keyTerm}</span>
        </div>

        {/* Actions Row */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn-ghost btn-sm" onClick={onView}>View</button>
          <button className="btn-ghost btn-sm" onClick={onAnalyze}>Analyze</button>
          <button className="btn-primary btn-sm" onClick={onGeneratePlaybook}>Generate Playbook</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Contracts Library - Flow AI Design System
 * Contract cards grid with filters, stats, and risk indicators
 */
export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Demo contract data - 5 visible + 1 hidden slot for uploaded docs
  const contracts: ContractCardProps[] = [
    {
      id: 'salesforce-ea',
      name: 'Salesforce Enterprise Agreement',
      vendor: 'Salesforce',
      renewalDate: 'Jan 15, 2026',
      annualValue: '$180,000',
      keyTerm: 'Auto-renewal',
      risk: 'high',
      riskLabel: 'H'
    },
    {
      id: 'hubspot-mh',
      name: 'HubSpot Marketing Hub Order Form',
      vendor: 'HubSpot',
      renewalDate: 'Jan 22, 2026',
      annualValue: '$72,000',
      keyTerm: 'Price increase clause',
      risk: 'medium',
      riskLabel: 'M'
    },
    {
      id: 'notion-team',
      name: 'Notion Team Plan Subscription Agreement',
      vendor: 'Notion',
      renewalDate: 'Jan 28, 2026',
      annualValue: '$8,000',
      keyTerm: 'Standard terms',
      risk: 'low',
      riskLabel: 'L'
    },
    {
      id: 'acme-saas',
      name: 'Acme Corp Software License Agreement',
      vendor: 'Acme Corp',
      renewalDate: 'Feb 15, 2026',
      annualValue: '$95,000',
      keyTerm: 'Liability cap limitation',
      risk: 'high',
      riskLabel: 'H'
    },
    {
      id: 'techstart-msa',
      name: 'TechStart Inc Master Service Agreement',
      vendor: 'TechStart Inc',
      renewalDate: 'Mar 1, 2026',
      annualValue: '$45,000',
      keyTerm: 'Payment terms extended',
      risk: 'medium',
      riskLabel: 'M'
    }
  ];

  // Hidden 6th slot for uploaded documents (dynamically populated from sessionStorage)
  const [uploadedContract, setUploadedContract] = useState<ContractCardProps | null>(null);

  useEffect(() => {
    // Check for uploaded contracts in sessionStorage
    if (typeof window !== 'undefined') {
      const keys = Object.keys(sessionStorage);
      const contractKeys = keys.filter(key => key.startsWith('contract-uploaded-'));
      
      if (contractKeys.length > 0) {
        // Get the most recent uploaded contract
        const latestKey = contractKeys.sort().reverse()[0];
        const storedData = sessionStorage.getItem(latestKey);
        
        if (storedData) {
          try {
            const contractData = JSON.parse(storedData);
            setUploadedContract({
              id: contractData.id,
              name: contractData.fileName || 'Uploaded Document',
              vendor: 'Uploaded Contract',
              renewalDate: 'Analysis Complete',
              annualValue: 'TBD',
              keyTerm: 'Recently uploaded',
              risk: 'medium',
              riskLabel: 'M'
            });
          } catch (error) {
            console.error('Error parsing uploaded contract data:', error);
          }
        }
      }
    }
  }, []);

  const router = useRouter();

  const handleUploadContracts = () => {
    router.push('/upload');
  };

  const handleViewContract = (contractId: string) => {
    router.push(`/contracts/${contractId}`);
  };

  const handleAnalyzeContract = (contractId: string) => {
    router.push(`/chat?contract=${contractId}&q=Analyze this contract for risks and opportunities`);
  };

  const handleGeneratePlaybook = (contractId: string) => {
    router.push(`/playbooks?contract=${contractId}`);
  };

  // Sample contract data
  const contractsData = [
    {
      id: 'sf-001',
      title: 'Salesforce Enterprise Agreement',
      vendor: 'Salesforce Inc.',
      annualValue: '$180,000',
      expiryDate: 'Dec 15, 2025',
      term: '3 Years',
      autoRenewal: 'Yes (60d notice)',
      riskLevel: 'high' as const,
      tags: ['SaaS', 'Auto-Renewal', 'Enterprise'],
      iconColor: '#EF4444',
      iconBg: 'rgba(239,68,68,0.12)'
    },
    {
      id: 'aws-001',
      title: 'AWS Cloud Infrastructure Services',
      vendor: 'Amazon Web Services',
      annualValue: '$420,000',
      expiryDate: 'Mar 30, 2026',
      term: '1 Year',
      autoRenewal: 'No',
      riskLevel: 'medium' as const,
      tags: ['Infrastructure', 'Cloud', 'Usage-Based'],
      iconColor: '#F59E0B',
      iconBg: 'rgba(245,158,11,0.12)'
    },
    {
      id: 'slack-001',
      title: 'Slack Business+ Workspace',
      vendor: 'Slack Technologies',
      annualValue: '$48,000',
      expiryDate: 'Aug 12, 2026',
      term: '1 Year',
      autoRenewal: 'No',
      riskLevel: 'low' as const,
      tags: ['SaaS', 'Communication', 'Per-User'],
      iconColor: '#10B981',
      iconBg: 'rgba(16,185,129,0.12)'
    },
    {
      id: 'ms-001',
      title: 'Microsoft 365 Enterprise E5 License',
      vendor: 'Microsoft Corporation',
      annualValue: '$295,000',
      expiryDate: 'Jan 5, 2026',
      term: '3 Years',
      autoRenewal: 'Yes (90d notice)',
      riskLevel: 'high' as const,
      tags: ['SaaS', 'Productivity', 'Enterprise'],
      iconColor: '#EF4444',
      iconBg: 'rgba(239,68,68,0.12)'
    },
    {
      id: 'zoom-001',
      title: 'Zoom Business License',
      vendor: 'Zoom Video Communications',
      annualValue: '$21,600',
      expiryDate: 'Oct 20, 2026',
      term: '1 Year',
      autoRenewal: 'No',
      riskLevel: 'low' as const,
      tags: ['SaaS', 'Video', 'Collaboration'],
      iconColor: '#10B981',
      iconBg: 'rgba(16,185,129,0.12)'
    },
    {
      id: 'hubspot-001',
      title: 'HubSpot Marketing Hub Professional',
      vendor: 'HubSpot Inc.',
      annualValue: '$78,000',
      expiryDate: 'May 15, 2026',
      term: '1 Year',
      autoRenewal: 'Yes (30d notice)',
      riskLevel: 'medium' as const,
      tags: ['SaaS', 'Marketing', 'CRM'],
      iconColor: '#F59E0B',
      iconBg: 'rgba(245,158,11,0.12)'
    }
  ];

  return (
    <AppLayout>
      <div className="contracts-container">
        {/* Page Header */}
        <div className="contracts-page-header">
          <div className="contracts-header-content">
            <h1>Contracts Library</h1>
            <div className="contracts-header-meta">
              <div className="contracts-stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>247 Total Contracts</span>
              </div>
              <div className="contracts-stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Last synced 2 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="contracts-stats-summary">
          <div className="contracts-stat-card" style={{ '--stat-bg': 'rgba(239,68,68,0.1)', '--stat-color': '#EF4444' } as React.CSSProperties}>
            <div className="contracts-stat-card-header">
              <div className="contracts-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
            </div>
            <div className="contracts-stat-number">12</div>
            <div className="contracts-stat-label">High Risk Contracts</div>
          </div>

          <div className="contracts-stat-card" style={{ '--stat-bg': 'rgba(245,158,11,0.1)', '--stat-color': '#F59E0B' } as React.CSSProperties}>
            <div className="contracts-stat-card-header">
              <div className="contracts-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
            </div>
            <div className="contracts-stat-number">37</div>
            <div className="contracts-stat-label">Medium Risk Contracts</div>
          </div>

          <div className="contracts-stat-card" style={{ '--stat-bg': 'rgba(16,185,129,0.1)', '--stat-color': '#10B981' } as React.CSSProperties}>
            <div className="contracts-stat-card-header">
              <div className="contracts-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div className="contracts-stat-number">198</div>
            <div className="contracts-stat-label">Low Risk Contracts</div>
          </div>

          <div className="contracts-stat-card" style={{ '--stat-bg': 'rgba(59,130,246,0.1)', '--stat-color': '#3B82F6' } as React.CSSProperties}>
            <div className="contracts-stat-card-header">
              <div className="contracts-stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div className="contracts-stat-number">$24.8M</div>
            <div className="contracts-stat-label">Total Contract Value</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="contracts-filter-bar">
          <div className="contracts-search-box">
            <svg className="contracts-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search contracts by name, vendor, or terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="contracts-filter-group">
            <span className="contracts-filter-label">Risk Level:</span>
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          <div className="contracts-filter-group">
            <span className="contracts-filter-label">Type:</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="saas">SaaS</option>
              <option value="service">Service</option>
              <option value="vendor">Vendor</option>
              <option value="license">License</option>
            </select>
          </div>

          <div className="contracts-filter-group">
            <span className="contracts-filter-label">Status:</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Contracts Grid */}
        <div className="contracts-grid">
          {contractsData.map((contract) => (
            <div 
              key={contract.id} 
              className={`contract-card ${contract.riskLevel}-risk`}
              style={{ '--icon-bg': contract.iconBg } as React.CSSProperties}
            >
              <div className="contract-card-header">
                <div className="contract-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={contract.iconColor} strokeWidth="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div className="contract-card-title-group">
                  <div className="contract-card-title">{contract.title}</div>
                  <div className="contract-card-subtitle">{contract.vendor}</div>
                </div>
                <span className={`contracts-badge contracts-badge-${contract.riskLevel}`}>
                  {contract.riskLevel.toUpperCase()}
                </span>
              </div>

              <div className="contract-card-meta">
                <div className="contract-meta-item">
                  <div className="contract-meta-label">Annual Value</div>
                  <div className="contract-meta-value">{contract.annualValue}</div>
                </div>
                <div className="contract-meta-item">
                  <div className="contract-meta-label">Expiry Date</div>
                  <div className="contract-meta-value">{contract.expiryDate}</div>
                </div>
                <div className="contract-meta-item">
                  <div className="contract-meta-label">Contract Term</div>
                  <div className="contract-meta-value">{contract.term}</div>
                </div>
                <div className="contract-meta-item">
                  <div className="contract-meta-label">Auto-Renewal</div>
                  <div 
                    className="contract-meta-value" 
                    style={{ color: contract.autoRenewal.startsWith('Yes') ? '#EF4444' : contract.autoRenewal === 'No' ? '#10B981' : '#F59E0B' }}
                  >
                    {contract.autoRenewal}
                  </div>
                </div>
              </div>

              <div className="contract-card-tags">
                {contract.tags.map((tag) => (
                  <span key={tag} className="contracts-badge-tag">{tag}</span>
                ))}
              </div>

              <div className="contract-card-actions">
                <button className="contract-btn contract-btn-primary" onClick={() => handleViewContract(contract.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  View Details
                </button>
                <button className="contract-btn contract-btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}