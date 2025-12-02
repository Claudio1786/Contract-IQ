'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../../components/layout/AppLayout';

interface Template {
  id: string;
  name: string;
  description: string | null;
  templateType: string;
}

type Step = 'template' | 'details' | 'review';

export default function CreateContractPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('template');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Contract details
  const [customerName, setCustomerName] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [termMonths, setTermMonths] = useState('12');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  }

  function selectTemplate(template: Template) {
    setSelectedTemplate(template);
    setStep('details');
  }

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep('review');
  }

  async function handleCreateContract() {
    if (!selectedTemplate) return;
    
    setIsCreating(true);
    
    try {
      const res = await fetch('/api/contracts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          customerName,
          contractValue: parseFloat(contractValue),
          termMonths: parseInt(termMonths),
          paymentTerms,
          notes
        })
      });
      
      const data = await res.json();
      
      if (data.contract) {
        // Redirect to contract detail page
        router.push(`/contracts/${data.contract.id}`);
      }
    } catch (error) {
      console.error('Create failed:', error);
    }
    
    setIsCreating(false);
  }

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  return (
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: step === 'template' ? '#3B82F6' : '#6B7280'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: step === 'template' ? '#3B82F6' : step !== 'template' ? 'rgba(59, 130, 246, 0.2)' : '#374151',
              color: step === 'template' ? 'white' : step !== 'template' ? '#3B82F6' : '#6B7280',
              fontWeight: 600
            }}>
              {step !== 'template' ? <CheckIcon /> : '1'}
            </div>
            <span style={{ marginLeft: '12px', fontWeight: 500 }}>Select Template</span>
          </div>
          
          <div style={{ width: '80px', height: '2px', background: '#374151', margin: '0 16px' }} />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: step === 'details' ? '#3B82F6' : '#6B7280'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: step === 'details' ? '#3B82F6' : step === 'review' ? 'rgba(59, 130, 246, 0.2)' : '#374151',
              color: step === 'details' ? 'white' : step === 'review' ? '#3B82F6' : '#6B7280',
              fontWeight: 600
            }}>
              {step === 'review' ? <CheckIcon /> : '2'}
            </div>
            <span style={{ marginLeft: '12px', fontWeight: 500 }}>Add Details</span>
          </div>
          
          <div style={{ width: '80px', height: '2px', background: '#374151', margin: '0 16px' }} />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            color: step === 'review' ? '#3B82F6' : '#6B7280'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: step === 'review' ? '#3B82F6' : '#374151',
              color: step === 'review' ? 'white' : '#6B7280',
              fontWeight: 600
            }}>
              3
            </div>
            <span style={{ marginLeft: '12px', fontWeight: 500 }}>Review & Create</span>
          </div>
        </div>

        {/* Step 1: Template Selection */}
        {step === 'template' && (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Create New Customer Contract
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Select a template to start your new contract
            </p>
            
            {templates.length === 0 ? (
              <div style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" style={{ margin: '0 auto 24px' }}>
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  No templates yet
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Upload your standard contracts first to create new agreements
                </p>
                <button 
                  onClick={() => router.push('/settings/templates')}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Add Template
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#3B82F6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {template.name}
                        </h3>
                        {template.description && (
                          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Contract Details */}
        {step === 'details' && (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Contract Details
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Using template: <strong>{selectedTemplate?.name}</strong>
            </p>
            
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-secondary)' 
                    }}>
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corporation"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--surface-3)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-secondary)' 
                    }}>
                      Contract Value ($) *
                    </label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={contractValue}
                      onChange={(e) => setContractValue(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--surface-3)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-secondary)' 
                    }}>
                      Contract Term (Months)
                    </label>
                    <select
                      value={termMonths}
                      onChange={(e) => setTermMonths(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--surface-3)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months (1 year)</option>
                      <option value="24">24 months (2 years)</option>
                      <option value="36">36 months (3 years)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-secondary)' 
                    }}>
                      Payment Terms
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'var(--surface-3)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    >
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)' 
                  }}>
                    Notes (Internal)
                  </label>
                  <textarea
                    placeholder="Any internal notes about this contract..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => setStep('template')}
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5"/>
                      <path d="M12 19l-7-7 7-7"/>
                    </svg>
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={!customerName || !contractValue}
                    style={{
                      padding: '12px 24px',
                      background: !customerName || !contractValue ? 'var(--surface-3)' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                      border: 'none',
                      borderRadius: '8px',
                      color: !customerName || !contractValue ? 'var(--text-tertiary)' : 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: !customerName || !contractValue ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"/>
                      <path d="M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Review & Create */}
        {step === 'review' && (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Review & Create
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Confirm the details before creating your contract
            </p>
            
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
                Contract Summary
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <dt style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Template</dt>
                  <dd style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{selectedTemplate?.name}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Customer</dt>
                  <dd style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{customerName}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Contract Value</dt>
                  <dd style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    ${parseFloat(contractValue || '0').toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Term</dt>
                  <dd style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{termMonths} months</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Payment Terms</dt>
                  <dd style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{paymentTerms}</dd>
                </div>
              </div>
              
              {notes && (
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
                  <dt style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Notes</dt>
                  <dd style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{notes}</dd>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                onClick={() => setStep('details')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5"/>
                  <path d="M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
              <button 
                onClick={handleCreateContract} 
                disabled={isCreating}
                style={{
                  padding: '12px 24px',
                  background: isCreating ? 'var(--surface-3)' : 'linear-gradient(135deg, #10B981, #059669)',
                  border: 'none',
                  borderRadius: '8px',
                  color: isCreating ? 'var(--text-tertiary)' : 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isCreating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isCreating ? 'Creating...' : 'Create Contract'}
                <CheckIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}