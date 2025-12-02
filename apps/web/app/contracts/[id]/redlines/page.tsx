'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '../../../../components/layout/AppLayout';

interface Change {
  id: string;
  changeType: 'addition' | 'deletion' | 'modification';
  section: string;
  originalText: string | null;
  changedText: string | null;
  riskScore: 'high' | 'medium' | 'low';
  riskExplanation: string;
  suggestedCounter: string;
  talkingPoints: string[];
  userDecision: string;
}

interface AnalysisResult {
  sessionId: string;
  totalChanges: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  changes: Change[];
}

export default function RedlineAnalysisPage() {
  const params = useParams();
  const contractId = params.id as string;
  
  const [contract, setContract] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  async function fetchContract() {
    // Mock contract data for now
    setContract({
      id: contractId,
      customerName: 'Acme Corporation',
      contractValue: 75000,
      stage: 'negotiating'
    });
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    
    setIsUploading(true);
    setIsAnalyzing(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractId', contractId);
    
    try {
      const res = await fetch('/api/contracts/analyze-redlines', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    
    setIsUploading(false);
    setIsAnalyzing(false);
  }

  async function handleDecision(changeId: string, decision: 'accepted' | 'rejected' | 'countered') {
    await fetch(`/api/contracts/changes/${changeId}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision })
    });
    
    // Update local state
    setAnalysis(prev => prev ? {
      ...prev,
      changes: prev.changes.map(c => 
        c.id === changeId ? { ...c, userDecision: decision } : c
      )
    } : null);
  }

  const getRiskStyles = (level: 'high' | 'medium' | 'low') => {
    switch(level) {
      case 'high':
        return {
          bg: 'rgba(239, 68, 68, 0.05)',
          border: '#EF4444',
          badgeBg: 'rgba(239, 68, 68, 0.15)',
          badgeColor: '#EF4444'
        };
      case 'medium':
        return {
          bg: 'rgba(245, 158, 11, 0.05)',
          border: '#F59E0B',
          badgeBg: 'rgba(245, 158, 11, 0.15)',
          badgeColor: '#F59E0B'
        };
      case 'low':
        return {
          bg: 'rgba(16, 185, 129, 0.05)',
          border: '#10B981',
          badgeBg: 'rgba(16, 185, 129, 0.15)',
          badgeColor: '#10B981'
        };
    }
  };

  const RiskIcon = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
    if (level === 'high') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      );
    } else if (level === 'medium') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    );
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Redline Analysis
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {contract?.customerName} - Customer Contract
          </p>
        </div>

        {/* Upload Section (if no analysis yet) */}
        {!analysis && (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
              Upload Customer's Redlined Contract
            </h2>
            
            <form onSubmit={handleUpload}>
              <div style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: '12px',
                padding: '48px',
                textAlign: 'center',
                marginBottom: '24px',
                background: 'var(--surface-3)'
              }}>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="redline-upload"
                />
                <label htmlFor="redline-upload" style={{ cursor: 'pointer' }}>
                  {isAnalyzing ? (
                    <div>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid rgba(59, 130, 246, 0.2)',
                        borderTopColor: '#3B82F6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                      }} />
                      <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Analyzing customer changes...
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        This usually takes 15-30 seconds
                      </p>
                    </div>
                  ) : file ? (
                    <div>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" style={{ margin: '0 auto 16px' }}>
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {file.name}
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ margin: '0 auto 16px' }}>
                        <path d="M7 16l5-5 5 5"/>
                        <path d="M12 11V21"/>
                        <rect x="3" y="3" width="18" height="6" rx="2"/>
                      </svg>
                      <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        Drop customer's redlined contract here
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        PDF or DOCX with their changes
                      </p>
                    </div>
                  )}
                </label>
              </div>
              
              {file && !isAnalyzing && (
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Analyze Changes
                </button>
              )}
            </form>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {analysis.totalChanges}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Changes</p>
              </div>
              
              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid #EF4444',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#EF4444' }}>
                  {analysis.highRisk}
                </p>
                <p style={{ fontSize: '14px', color: '#EF4444' }}>High Risk</p>
              </div>
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid #F59E0B',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#F59E0B' }}>
                  {analysis.mediumRisk}
                </p>
                <p style={{ fontSize: '14px', color: '#F59E0B' }}>Medium Risk</p>
              </div>
              
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid #10B981',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '32px', fontWeight: 700, color: '#10B981' }}>
                  {analysis.lowRisk}
                </p>
                <p style={{ fontSize: '14px', color: '#10B981' }}>Low Risk</p>
              </div>
            </div>

            {/* Will's Key Feature Alert */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid #3B82F6',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Contract IQ Analysis Complete</strong>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Your customer made {analysis.totalChanges} changes. 
                  {analysis.highRisk > 0 && (
                    <span style={{ color: '#EF4444' }}>
                      {' '}{analysis.highRisk} are high-risk and require your attention.
                    </span>
                  )}
                  {' '}Review each change below and decide how to respond.
                </p>
              </div>
            </div>

            {/* Changes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysis.changes.map((change) => {
                const riskStyles = getRiskStyles(change.riskScore);
                
                return (
                  <div 
                    key={change.id}
                    style={{
                      background: riskStyles.bg,
                      border: `2px solid ${riskStyles.border}`,
                      borderLeft: `6px solid ${riskStyles.border}`,
                      borderRadius: '12px',
                      padding: '24px'
                    }}
                  >
                    {/* Header */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'start', 
                      marginBottom: '20px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <RiskIcon level={change.riskScore} />
                        <span style={{
                          padding: '4px 12px',
                          background: riskStyles.badgeBg,
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: riskStyles.badgeColor,
                          textTransform: 'uppercase'
                        }}>
                          {change.riskScore} RISK
                        </span>
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {change.section}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        background: 'var(--surface-3)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase'
                      }}>
                        {change.changeType}
                      </span>
                    </div>

                    {/* The Change */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: change.originalText && change.changedText ? '1fr 1fr' : '1fr',
                      gap: '16px', 
                      marginBottom: '20px' 
                    }}>
                      {change.originalText && (
                        <div>
                          <p style={{ 
                            fontSize: '12px', 
                            fontWeight: 600, 
                            color: 'var(--text-secondary)', 
                            marginBottom: '8px',
                            textTransform: 'uppercase'
                          }}>
                            YOUR VERSION:
                          </p>
                          <div style={{
                            padding: '12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            textDecoration: 'line-through',
                            opacity: 0.7
                          }}>
                            {change.originalText}
                          </div>
                        </div>
                      )}
                      {change.changedText && (
                        <div>
                          <p style={{ 
                            fontSize: '12px', 
                            fontWeight: 600, 
                            color: 'var(--text-secondary)', 
                            marginBottom: '8px',
                            textTransform: 'uppercase'
                          }}>
                            CUSTOMER CHANGED TO:
                          </p>
                          <div style={{
                            padding: '12px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            fontWeight: 500
                          }}>
                            {change.changedText}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Explanation - Will's Core Feature */}
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        color: '#3B82F6', 
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>⚡</span> WHAT THIS MEANS FOR YOU:
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                        {change.riskExplanation}
                      </p>
                    </div>

                    {/* AI Suggestion */}
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ 
                        fontSize: '12px', 
                        fontWeight: 600, 
                        color: '#8B5CF6', 
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>💡</span> SUGGESTED RESPONSE:
                      </p>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                        {change.suggestedCounter}
                      </p>
                    </div>

                    {/* Talking Points */}
                    {change.talkingPoints && change.talkingPoints.length > 0 && (
                      <div style={{
                        background: 'var(--surface-3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px'
                      }}>
                        <p style={{ 
                          fontSize: '12px', 
                          fontWeight: 600, 
                          color: 'var(--text-secondary)', 
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span>📞</span> IF THEY PUSH BACK, SAY:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {change.talkingPoints.map((point, i) => (
                            <li key={i} style={{ 
                              fontSize: '14px', 
                              color: 'var(--text-primary)',
                              marginBottom: '4px'
                            }}>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Decision Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      paddingTop: '20px', 
                      borderTop: '1px solid var(--border-subtle)' 
                    }}>
                      <button
                        onClick={() => handleDecision(change.id, 'accepted')}
                        style={{
                          padding: '10px 20px',
                          background: change.userDecision === 'accepted' ? '#10B981' : 'transparent',
                          border: `1px solid ${change.userDecision === 'accepted' ? '#10B981' : 'var(--border-subtle)'}`,
                          borderRadius: '8px',
                          color: change.userDecision === 'accepted' ? 'white' : 'var(--text-primary)',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ✓ Accept Their Change
                      </button>
                      <button
                        onClick={() => handleDecision(change.id, 'rejected')}
                        style={{
                          padding: '10px 20px',
                          background: change.userDecision === 'rejected' ? '#EF4444' : 'transparent',
                          border: `1px solid ${change.userDecision === 'rejected' ? '#EF4444' : 'var(--border-subtle)'}`,
                          borderRadius: '8px',
                          color: change.userDecision === 'rejected' ? 'white' : 'var(--text-primary)',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ✗ Keep My Version
                      </button>
                      <button
                        onClick={() => handleDecision(change.id, 'countered')}
                        style={{
                          padding: '10px 20px',
                          background: change.userDecision === 'countered' ? '#8B5CF6' : 'transparent',
                          border: `1px solid ${change.userDecision === 'countered' ? '#8B5CF6' : 'var(--border-subtle)'}`,
                          borderRadius: '8px',
                          color: change.userDecision === 'countered' ? 'white' : 'var(--text-primary)',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ↔ Counter-Propose
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Generate Counter-Proposal Button */}
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                Generate Counter-Proposal Document
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AppLayout>
  );
}