'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  fileName?: string;
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
    { id: 'pricing_analysis', label: 'Pricing & Cost Optimization' },
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

      // Redirect to contract analysis after brief success display
      setTimeout(() => {
        router.push(`/contracts/${contractId}?analysis=complete`);
      }, 1500);

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
                  <div style={{ fontSize: '48px' }}>📄</div>
                )}
                {uploadStatus.status === 'uploading' && (
                  <div style={{ fontSize: '48px' }}>⬆️</div>
                )}
                {uploadStatus.status === 'processing' && (
                  <div style={{ fontSize: '48px' }}>🔄</div>
                )}
                {uploadStatus.status === 'success' && (
                  <div style={{ fontSize: '48px' }}>✅</div>
                )}
                {uploadStatus.status === 'error' && (
                  <div style={{ fontSize: '48px' }}>❌</div>
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
                    <p className="text-base text-secondary">
                      Redirecting to contract analysis...
                    </p>
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
              <h2 className="text-h2">🎯 Analysis Objectives</h2>
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
                      <span className="text-sm font-medium">✏️ Other (specify below)</span>
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
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🔍</div>
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>Risk Analysis</h3>
              <p className="text-sm text-secondary">
                Automatically identify potential risks, liabilities, and unfavorable terms in your contracts.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>💬</div>
              <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>AI Chat</h3>
              <p className="text-sm text-secondary">
                Ask questions and get instant answers about any clause or term in your contract.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: 'var(--space-3)' }}>🎯</div>
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
              📄 SaaS Agreement
            </button>
            <button 
              className="btn-secondary"
              onClick={() => router.push('/contracts/saas-dpa')}
            >
              🔒 Data Processing
            </button>
            <button 
              className="btn-secondary"
              onClick={() => router.push('/contracts/healthcare-baa')}
            >
              🏥 Healthcare BAA
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}