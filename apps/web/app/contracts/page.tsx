'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import '../../styles/contracts.css';

interface Contract {
  id: number;
  contractName: string;
  customerName: string;
  customerType: string;
  annualValue: number;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  autoRenewal: boolean;
  riskScore?: {
    overallScore: number;
    renewalRisk: number;
    paymentRisk: number;
    relationshipRisk: number;
    competitiveRisk: number;
    utilizationRisk: number;
  };
}

interface PortfolioStats {
  totalContracts: number;
  totalACV: number;
  avgContractValue: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

interface ContractCardProps {
  id: string;
  name: string;
  customer: string;
  renewalDate: string;
  annualValue: string;
  keyTerm: string;
  risk: 'high' | 'medium' | 'low';
  riskLabel: string;
}

function ContractCard({ 
  id, 
  name, 
  customer, 
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
              <p className="text-sm text-secondary">{customer}</p>
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
          <button className="btn-primary btn-sm" onClick={onGeneratePlaybook}>Generate Intelligence Brief</button>
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
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local demo fallback data used when API is unavailable
  const demoContracts: Contract[] = [
    {
      id: 101,
      contractName: 'Acme Corp Master Service Agreement',
      customerName: 'Acme Corp',
      customerType: 'Enterprise',
      annualValue: 120000,
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      renewalTerms: 'Auto-renewal (12 months)',
      autoRenewal: true,
      riskScore: {
        overallScore: 65,
        renewalRisk: 70,
        paymentRisk: 40,
        relationshipRisk: 30,
        competitiveRisk: 50,
        utilizationRisk: 20,
      },
    },
    {
      id: 102,
      contractName: 'CloudFirst Annual Subscription',
      customerName: 'CloudFirst Corp',
      customerType: 'Mid-Market',
      annualValue: 540000,
      startDate: '2024-07-01',
      endDate: '2025-07-01',
      renewalTerms: 'Standard renewal (12 months)',
      autoRenewal: false,
      riskScore: {
        overallScore: 35,
        renewalRisk: 30,
        paymentRisk: 20,
        relationshipRisk: 25,
        competitiveRisk: 30,
        utilizationRisk: 40,
      },
    },
  ];

  const demoPortfolioStats: PortfolioStats = {
    totalContracts: demoContracts.length,
    totalACV: demoContracts.reduce((sum, c) => sum + c.annualValue, 0),
    avgContractValue: Math.round(
      demoContracts.reduce((sum, c) => sum + c.annualValue, 0) / demoContracts.length
    ),
    riskDistribution: {
      high: demoContracts.filter(c => (c.riskScore?.overallScore || 0) >= 70).length,
      medium: demoContracts.filter(c => {
        const s = c.riskScore?.overallScore || 0;
        return s >= 40 && s < 70;
      }).length,
      low: demoContracts.filter(c => (c.riskScore?.overallScore || 0) < 40).length,
    },
  };

  // Fetch contracts from API
  useEffect(() => {
    async function fetchContracts() {
      try {
        setLoading(true);
        const response = await fetch('/api/contracts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contracts');
        }
        
        const data = await response.json();
        setContracts(data.contracts || []);
        setPortfolioStats(data.portfolioStats || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching contracts:', err);
        // Fallback to local demo data so the page remains functional
        setContracts(demoContracts);
        setPortfolioStats(demoPortfolioStats);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContracts();
  }, []);

  // Demo contract data - 5 visible + 1 hidden slot for uploaded docs
  const oldContracts: ContractCardProps[] = [
    {
      id: 'salesforce-ea',
      name: 'Salesforce Enterprise Agreement',
      customer: 'Salesforce',
      renewalDate: 'Jan 15, 2026',
      annualValue: '$180,000',
      keyTerm: 'Auto-renewal',
      risk: 'high',
      riskLabel: 'H'
    },
    {
      id: 'hubspot-mh',
      name: 'HubSpot Marketing Hub Order Form',
      customer: 'HubSpot',
      renewalDate: 'Jan 22, 2026',
      annualValue: '$72,000',
      keyTerm: 'Price increase clause',
      risk: 'medium',
      riskLabel: 'M'
    },
    {
      id: 'notion-team',
      name: 'Notion Team Plan Subscription Agreement',
      customer: 'Notion',
      renewalDate: 'Jan 28, 2026',
      annualValue: '$8,000',
      keyTerm: 'Standard terms',
      risk: 'low',
      riskLabel: 'L'
    },
    {
      id: 'acme-saas',
      name: 'Acme Corp Software License Agreement',
      customer: 'Acme Corp',
      renewalDate: 'Feb 15, 2026',
      annualValue: '$95,000',
      keyTerm: 'Liability cap limitation',
      risk: 'high',
      riskLabel: 'H'
    },
    {
      id: 'techstart-msa',
      name: 'TechStart Inc Master Service Agreement',
      customer: 'TechStart Inc',
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
              customer: 'Uploaded Contract',
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

  // Convert API contracts to display format
  const getRiskLevel = (overallScore?: number): 'high' | 'medium' | 'low' => {
    if (!overallScore) return 'medium';
    if (overallScore >= 70) return 'high';
    if (overallScore >= 40) return 'medium';
    return 'low';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' };
      case 'medium': return { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
      case 'low': return { color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
      default: return { color: '#6B7280', bg: 'rgba(107,114,128,0.12)' };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateContractTerm = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (months >= 12) {
      const years = Math.round(months / 12);
      return `${years} Year${years > 1 ? 's' : ''}`;
    }
    return `${months} Month${months > 1 ? 's' : ''}`;
  };

  const contractsData = contracts.map(contract => {
    const riskLevel = getRiskLevel(contract.riskScore?.overallScore);
    const colors = getRiskColor(riskLevel);
    
    return {
      id: contract.id.toString(),
      title: contract.contractName,
      customer: contract.customerName,
      annualValue: formatCurrency(contract.annualValue),
      expiryDate: formatDate(contract.endDate),
      term: calculateContractTerm(contract.startDate, contract.endDate),
      autoRenewal: contract.autoRenewal ? 'Yes' : 'No',
      riskLevel: riskLevel,
      tags: [contract.customerType, contract.renewalTerms],
      iconColor: colors.color,
      iconBg: colors.bg
    };
  });

  return (
    <AppLayout>
      <div className="contracts-container">
        {/* Loading State */}
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid rgba(59, 130, 246, 0.2)',
              borderTopColor: '#3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#6B7280', fontSize: '16px' }}>Loading contracts...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ 
            padding: '24px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#EF4444',
            textAlign: 'center'
          }}>
            <p>{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && !error && (
          <>
            {/* Page Header */}
            <div className="bg-gradient-to-br from-[#0F1319] to-[#14171F] border border-white/10 rounded-2xl p-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_0_20px_rgba(16,185,129,0.15)] bg-[linear-gradient(135deg,rgba(16,185,129,0.15)_0%,rgba(16,185,129,0.08)_100%)]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h1 style={{
                    fontSize: '40px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Contracts Library
                  </h1>
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <span className="text-[14px] text-slate-400">{portfolioStats?.totalContracts || contractsData.length} Active Customers</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="text-[14px] text-slate-400">Last synced just now</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('intelligence-briefs');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 20l9-16-9 6-9-6 9 16z"/>
                </svg>
                Generate Brief
              </button>
              <button
                onClick={() => router.push('/app/admin/contracts/new')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Contract
              </button>
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
            <div className="contracts-stat-number">$2.3M</div>
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
              placeholder="Search contracts by name, customer, or terms..."
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
              <option value="customer">Customer</option>
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
                  <div className="contract-card-subtitle">{contract.customer}</div>
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
      </>
    )}
  </div>
    </AppLayout>
  );
}
