'use client';

import { useState, useEffect } from 'react';
import AppLayout from '../../../components/layout/AppLayout';

interface Template {
  id: string;
  name: string;
  description: string | null;
  templateType: string;
  fileUrl: string;
  usageCount: number;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateType, setTemplateType] = useState('msa');
  const [file, setFile] = useState<File | null>(null);

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

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !name) return;
    
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('templateType', templateType);
    
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        setShowUploadForm(false);
        setName('');
        setDescription('');
        setFile(null);
        fetchTemplates();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    
    setIsUploading(false);
  }

  async function handleDelete(templateId: string) {
    if (!confirm('Delete this template? This cannot be undone.')) return;
    
    await fetch(`/api/templates/${templateId}`, { method: 'DELETE' });
    fetchTemplates();
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 700, 
              color: 'var(--text-primary)',
              marginBottom: '8px' 
            }}>
              Contract Templates
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Upload your standard agreements to create new contracts quickly
            </p>
          </div>
          <button 
            onClick={() => setShowUploadForm(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Template
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              marginBottom: '20px' 
            }}>
              Upload New Template
            </h2>
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)' 
                }}>
                  Template Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Standard MSA, Services Agreement"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Use for enterprise customers over $50K"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Template Type
                </label>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
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
                  <option value="msa">Master Service Agreement (MSA)</option>
                  <option value="services">Services Agreement</option>
                  <option value="sow">Statement of Work (SOW)</option>
                  <option value="nda">Non-Disclosure Agreement (NDA)</option>
                  <option value="custom">Custom</option>
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
                  Template File (PDF or DOCX) *
                </label>
                <div style={{
                  border: '2px dashed var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                  background: 'var(--surface-3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="file"
                    id="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file" style={{ cursor: 'pointer' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ margin: '0 auto 16px' }}>
                      <path d="M7 16l5-5 5 5"/>
                      <path d="M12 11V21"/>
                      <rect x="3" y="3" width="18" height="6" rx="2"/>
                    </svg>
                    {file ? (
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {file.name}
                      </p>
                    ) : (
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Click to upload or drag and drop
                      </p>
                    )}
                  </label>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  disabled={isUploading || !file || !name}
                  style={{
                    padding: '12px 24px',
                    background: isUploading || !file || !name 
                      ? 'var(--surface-3)' 
                      : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    border: 'none',
                    borderRadius: '8px',
                    color: isUploading || !file || !name ? 'var(--text-tertiary)' : 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isUploading || !file || !name ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload Template'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowUploadForm(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Templates List */}
        {templates.length === 0 ? (
          <div style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '64px',
            textAlign: 'center'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" style={{ margin: '0 auto 24px' }}>
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              marginBottom: '8px' 
            }}>
              No templates yet
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '24px' 
            }}>
              Upload your standard contracts to start creating new agreements
            </p>
            <button 
              onClick={() => setShowUploadForm(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Your First Template
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {templates.map((template) => (
              <div 
                key={template.id}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'var(--surface-3)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      marginBottom: '4px'
                    }}>
                      {template.name}
                    </h3>
                    {template.description && (
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--text-secondary)',
                        marginBottom: '8px' 
                      }}>
                        {template.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: 'var(--surface-3)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase'
                      }}>
                        {template.templateType}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-tertiary)' 
                      }}>
                        Used {template.usageCount} times
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => window.open(template.fileUrl, '_blank')}
                    style={{
                      padding: '8px 16px',
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    style={{
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                      <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}