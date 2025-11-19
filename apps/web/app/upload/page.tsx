'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  fileName?: string;
  redirectTimer?: NodeJS.Timeout;
  contractId?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' });
  const [dragActive, setDragActive] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [customObjective, setCustomObjective] = useState('');

  // Key objectives for uploaded contracts
  const contractObjectives = [
    { id: 'risk_assessment', label: 'Risk Assessment & Liability Review' },
    { id: 'pricing_analysis', label: 'Pricing & Terms Optimization' },
    { id: 'sla_review', label: 'Service Level Agreement Review' },
    { id: 'termination_rights', label: 'Termination Rights & Exit Clauses' },
    { id: 'data_protection', label: 'Data Protection & Privacy Compliance' },
    { id: 'renewal_terms', label: 'Renewal & Auto-Renewal Analysis' },
    { id: 'ip_rights', label: 'Intellectual Property Rights' },
    { id: 'limitation_liability', label: 'Limitation of Liability Assessment' }
  ];

  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objectiveId)
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  // Cleanup redirect timer on unmount
  useEffect(() => {
    return () => {
      if (uploadStatus.redirectTimer) {
        clearTimeout(uploadStatus.redirectTimer);
      }
    };
  }, [uploadStatus.redirectTimer]);

  const handleFileUpload = async (file: File) => {
    // Validate file
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus({ 
        status: 'error', 
        message: 'Please upload a PDF, Word document, or text file.' 
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadStatus({ 
        status: 'error', 
        message: 'File must be smaller than 25MB.' 
      });
      return;
    }

    try {
      setUploadStatus({ 
        status: 'uploading', 
        fileName: file.name,
        message: 'Uploading your contract...' 
      });

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setUploadStatus({ 
        status: 'processing', 
        fileName: file.name,
        message: 'Analyzing contract with AI...' 
      });

      // Simulate AI analysis processing
      await new Promise(resolve => setTimeout(resolve, 2500));

      setUploadStatus({ 
        status: 'success', 
        fileName: file.name,
        message: 'Contract analysis complete!' 
      });

      // Create a contract ID from the file name and timestamp
      const contractId = `uploaded-${file.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
      
      // Store the contract data in sessionStorage for the analysis page
      const contractData = {
        id: contractId,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        analysisComplete: true,
        fileType: file.type,
        fileSize: file.size,
        objectives: selectedObjectives,
        customObjective: selectedObjectives.includes('custom') ? customObjective : undefined
      };
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`contract-${contractId}`, JSON.stringify(contractData));
        sessionStorage.setItem('last-uploaded-contract', contractId);
      }

      // Attempt automatic redirect after brief success display
      const redirectTimer = setTimeout(() => {
        router.push(`/contracts/${contractId}?analysis=complete`);
      }, 2000);

      // Store the redirect timer and contract ID for cleanup and manual navigation
      setUploadStatus(prev => ({ 
        ...prev, 
        redirectTimer,
        contractId 
      }));

    } catch (error) {
      setUploadStatus({ 
        status: 'error', 
        message: 'Upload failed. Please try again.' 
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const isProcessing = ['uploading', 'processing'].includes(uploadStatus.status);

  return (
    <AppLayout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 className="text-h1">Upload Contract</h1>
          <p className="text-base text-secondary" style={{ marginTop: 'var(--space-2)' }}>
            Upload your contract to start analyzing terms, identifying risks, and getting AI-powered insights.
          </p>
        </div>

        {/* Upload Area */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-body">
            <div
              className={`upload-zone ${dragActive ? 'upload-zone-active' : ''} ${isProcessing ? 'upload-zone-processing' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={!isProcessing ? openFileSelector : undefined}
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: dragActive ? 'var(--primary-50)' : 'var(--gray-50)',
                borderColor: dragActive ? 'var(--primary-400)' : 
                            uploadStatus.status === 'error' ? 'var(--danger-400)' :
                            uploadStatus.status === 'success' ? 'var(--success-400)' :
                            'var(--color-border)'
              }}
            >
              {/* Upload Icon/Status */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                {uploadStatus.status === 'idle' && (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                )}
                {uploadStatus.status === 'uploading' && (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 19V6"/>
                    <path d="M5 12l7-7 7 7"/>
                  </svg>
                )}
                {uploadStatus.status === 'processing' && (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 12a9 9 0 11-9-9"/>
                  </svg>
                )}
                {uploadStatus.status === 'success' && (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
                {uploadStatus.status === 'error' && (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18"/>
                    <path d="M6 6l12 12"/>
                  </svg>
                )}
              </div>

              {/* Status Message */}
              <div>
                {uploadStatus.status === 'idle' && (
                  <>
                    <h3 className="text-lg font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                      Drop your contract here
                    </h3>
                    <p className="text-base text-secondary">
                      or click to browse files
                    </p>
                    <p className="text-sm text-tertiary" style={{ marginTop: 'var(--space-2)' }}>
                      Supports PDF, Word, and text files up to 25MB
                    </p>
                  </>
                )}
                
                {isProcessing && (
                  <>
                    <h3 className="text-lg font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                      {uploadStatus.message}
                    </h3>
                    {uploadStatus.fileName && (
                      <p className="text-base text-secondary">
                        {uploadStatus.fileName}
                      </p>
                    )}
                    <div className="progress" style={{ 
                      marginTop: 'var(--space-4)',
                      maxWidth: '300px',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}>
                      <div className="progress-bar progress-bar-animated" style={{ width: '70%' }}></div>
                    </div>
                  </>
                )}

                {uploadStatus.status === 'success' && (
                  <>
                    <h3 className="text-lg font-medium text-success" style={{ marginBottom: 'var(--space-2)' }}>
                      {uploadStatus.message}
                    </h3>
                    <p className="text-base text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
                      Redirecting to contract analysis...
                    </p>
                    
                    {/* Manual Navigation Fallback */}
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          if (uploadStatus.redirectTimer) {
                            clearTimeout(uploadStatus.redirectTimer);
                          }
                          if (uploadStatus.contractId) {
                            router.push(`/contracts/${uploadStatus.contractId}?analysis=complete`);
                          }
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3v18h18"/>
                            <rect x="7" y="12" width="3" height="6"/>
                            <rect x="12" y="8" width="3" height="10"/>
                            <rect x="17" y="5" width="3" height="13"/>
                          </svg>
                          <span>View Analysis Results</span>
                        </span>
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => {
                          if (uploadStatus.redirectTimer) {
                            clearTimeout(uploadStatus.redirectTimer);
                          }
                          router.push('/contracts');
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                            <path d="M20 22H6.5a2.5 2.5 0 010-5H20v5z"/>
                            <path d="M6.5 17V2"/>
                          </svg>
                          <span>Go to Contracts Library</span>
                        </span>
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => {
                          if (uploadStatus.redirectTimer) {
                            clearTimeout(uploadStatus.redirectTimer);
                          }
                          if (uploadStatus.contractId) {
                            router.push(`/playbooks?contract=${uploadStatus.contractId}`);
                          }
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                          </svg>
                          <span>Generate Account Intelligence Brief</span>
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {uploadStatus.status === 'error' && (
                  <>
                    <h3 className="text-lg font-medium text-danger" style={{ marginBottom: 'var(--space-2)' }}>
                      Upload Failed
                    </h3>
                    <p className="text-base text-secondary">
                      {uploadStatus.message}
                    </p>
                    <button 
                      className="btn-primary" 
                      style={{ marginTop: 'var(--space-4)' }}
                      onClick={() => setUploadStatus({ status: 'idle' })}
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Analysis Objectives Section */}
        {uploadStatus.status === 'idle' && (
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="card-header">
              <h2 className="text-h2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                Analysis Objectives
              </h2>
              <p className="text-sm text-secondary">
                Select what you want to focus on when analyzing your contract (optional)
              </p>
            </div>
            <div className="card-body">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: 'var(--space-3)' 
              }}>
                {contractObjectives.map((objective) => (
                  <div key={objective.id}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 'var(--space-3)',
                      cursor: 'pointer',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      transition: 'all var(--transition-fast)',
                      backgroundColor: selectedObjectives.includes(objective.id) ? 'var(--primary-50)' : 'transparent',
                      borderColor: selectedObjectives.includes(objective.id) ? 'var(--primary-300)' : 'var(--color-border)'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedObjectives.includes(objective.id)}
                        onChange={() => toggleObjective(objective.id)}
                        style={{ marginTop: '2px' }}
                      />
                      <span className="text-sm font-medium">{objective.label}</span>
                    </label>
                  </div>
                ))}
                
                {/* Custom objective option */}
                <div>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'var(--space-3)',
                    cursor: 'pointer',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    transition: 'all var(--transition-fast)',
                    backgroundColor: selectedObjectives.includes('custom') ? 'var(--primary-50)' : 'transparent',
                    borderColor: selectedObjectives.includes('custom') ? 'var(--primary-300)' : 'var(--color-border)'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedObjectives.includes('custom')}
                      onChange={() => toggleObjective('custom')}
                      style={{ marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span className="text-sm font-medium" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9"/>
                          <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z"/>
                        </svg>
                        <span>Other (specify below)</span>
                      </span>
                      {selectedObjectives.includes('custom') && (
                        <textarea
                          value={customObjective}
                          onChange={(e) => setCustomObjective(e.target.value)}
                          placeholder="Describe your custom analysis objective..."
                          className="input"
                          rows={2}
                          style={{ 
                            marginTop: 'var(--space-2)',
                            width: '100%',
                            fontSize: '0.875rem'
                          }}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
              
              {selectedObjectives.length > 0 && (
                <div style={{ 
                  marginTop: 'var(--space-4)', 
                  padding: 'var(--space-3)', 
                  backgroundColor: 'var(--success-50)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--success-200)'
                }}>
                  <p className="text-sm text-success-dark">
                    ✓ {selectedObjectives.length} objective{selectedObjectives.length !== 1 ? 's' : ''} selected. 
                    Analysis will focus on these areas.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>Risk Analysis</h3>
              <p className="text-sm text-secondary">
                Automatically identify potential risks, liabilities, and unfavorable terms in your contracts.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 15a4 4 0 01-4 4H8l-5 3V6a4 4 0 014-4h10a4 4 0 014 4z"/>
                </svg>
              </div>
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>AI Chat</h3>
              <p className="text-sm text-secondary">
                Ask questions and get instant answers about any clause or term in your contract.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>Negotiation Tips</h3>
              <p className="text-sm text-secondary">
                Get strategic recommendations and playbooks for improving your contract terms.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          marginTop: 'var(--space-8)',
          textAlign: 'center',
          padding: 'var(--space-6)',
          backgroundColor: 'var(--gray-50)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <h3 className="text-h3" style={{ marginBottom: 'var(--space-4)' }}>
            Or explore with our demo contracts
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-secondary"
              onClick={() => router.push('/contracts/saas-msa')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <path d="M14 2v6h6"/>
                </svg>
                <span>SaaS Agreement</span>
              </span>
            </button>
            <button 
              className="btn-secondary"
              onClick={() => router.push('/contracts/saas-dpa')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span>Data Processing</span>
              </span>
            </button>
            <button 
              className="btn-secondary"
              onClick={() => router.push('/contracts/healthcare-baa')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M12 7v10"/>
                  <path d="M7 12h10"/>
                </svg>
                <span>Healthcare BAA</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}