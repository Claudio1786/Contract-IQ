'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';

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
 * Contracts List Page - Follows wireframe specification exactly
 */
export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortValue, setSortValue] = useState('recent');

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

  // Hidden 6th slot for uploaded documents (will be dynamically populated)
  const uploadedContract = null; // This would be populated from sessionStorage/API

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

  return (
    <AppLayout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="text-h1">Contracts Library</h1>
        </div>

        {/* Search and Filters */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-body">
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-4)', 
              alignItems: 'center' 
            }}>
              {/* Search */}
              <div style={{ flex: 1 }}>
                <input 
                  type="text"
                  className="input"
                  placeholder="🔍 Search contracts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Dropdown */}
              <select 
                className="input"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Contracts</option>
                <option value="high-risk">High Risk</option>
                <option value="medium-risk">Medium Risk</option>
                <option value="low-risk">Low Risk</option>
              </select>

              {/* Sort Dropdown */}
              <select 
                className="input"
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="recent">Sort: Recent</option>
                <option value="renewal">Sort: Renewal Date</option>
                <option value="value">Sort: Annual Value</option>
                <option value="risk">Sort: Risk Level</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contracts List */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          {contracts.map((contract) => (
            <ContractCard 
              key={contract.id} 
              {...contract}
              onView={() => handleViewContract(contract.id)}
              onAnalyze={() => handleAnalyzeContract(contract.id)}
              onGeneratePlaybook={() => handleGeneratePlaybook(contract.id)}
            />
          ))}

          {/* Load More */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
            <button className="btn-secondary">Load more contracts...</button>
          </div>
        </div>

        {/* Floating Action Button */}
        <div style={{ 
          position: 'fixed', 
          bottom: 'var(--space-6)', 
          right: 'var(--space-6)',
          zIndex: 'var(--z-fixed)'
        }}>
          <button 
            className="btn-primary btn-lg"
            onClick={handleUploadContracts}
            style={{ 
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            + Upload New Contracts
          </button>
        </div>
      </div>
    </AppLayout>
  );
}