'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';

/**
 * Upload Contract Page
 * Allows users to upload existing contracts for AI analysis
 */
export default function UploadContractPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'existing-contract');
      
      // Simulate upload (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, generate a contract ID
      const contractId = `contract_${Date.now()}`;
      
      // Store uploaded contract info in sessionStorage for demo
      const contractData = {
        id: contractId,
        customerName: file.name.replace('.pdf', ''),
        contractType: 'Uploaded Contract',
        effectiveDate: new Date().toISOString().split('T')[0],
        annualContractValue: 100000,
        status: 'uploaded',
        uploadedAt: new Date().toISOString()
      };
      
      // Store in sessionStorage to show in contracts list
      const existingContracts = JSON.parse(sessionStorage.getItem('uploadedContracts') || '[]');
      existingContracts.push(contractData);
      sessionStorage.setItem('uploadedContracts', JSON.stringify(existingContracts));
      
      setUploadSuccess(true);
      
      // Redirect to contracts page after 2 seconds
      setTimeout(() => {
        router.push('/contracts');
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <AppLayout>
        <div style={{ 
          maxWidth: '600px', 
          margin: '4rem auto', 
          textAlign: 'center',
          padding: '2rem'
        }}>
          <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Contract Uploaded Successfully!
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#64748B', marginBottom: '2rem' }}>
            AI is extracting key terms and analyzing risk factors...
          </p>
          <p style={{ color: '#64748B' }}>
            Redirecting to your contracts page...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Upload Existing Contract
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#64748B' }}>
            Upload a signed contract and we'll extract the key terms automatically.
            Perfect for importing your existing contract portfolio.
          </p>
        </div>

        {/* Upload Area */}
        <div
          style={{
            border: isDragging ? '2px dashed #3B82F6' : '2px dashed #CBD5E1',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : '#FAFBFC',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('contract-upload')?.click()}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="contract-upload"
          />
          
          {file ? (
            <div>
              <FileText size={48} color="#3B82F6" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {file.name}
              </h3>
              <p style={{ color: '#64748B', marginBottom: '1rem' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                style={{
                  color: '#3B82F6',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Choose a different file
              </button>
            </div>
          ) : (
            <div>
              <Upload size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Drop your contract here
              </h3>
              <p style={{ color: '#64748B', marginBottom: '1rem' }}>
                or click to browse your files
              </p>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
                PDF files only • Max 10MB
              </p>
            </div>
          )}
        </div>

        {/* What happens next */}
        <div style={{
          backgroundColor: '#F0F9FF',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1E40AF' }}>
            What happens after upload?
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ color: '#3B82F6', marginRight: '0.75rem' }}>✓</span>
              <span style={{ color: '#475569' }}>
                AI extracts key terms: customer name, dates, pricing, renewal terms
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ color: '#3B82F6', marginRight: '0.75rem' }}>✓</span>
              <span style={{ color: '#475569' }}>
                Automatic risk scoring based on termination clauses and payment terms
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ color: '#3B82F6', marginRight: '0.75rem' }}>✓</span>
              <span style={{ color: '#475569' }}>
                Renewal alerts set up automatically based on contract dates
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#3B82F6', marginRight: '0.75rem' }}>✓</span>
              <span style={{ color: '#475569' }}>
                Contract added to your dashboard for easy access and analysis
              </span>
            </li>
          </ul>
        </div>

        {/* Upload Button */}
        {file && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setFile(null);
                router.back();
              }}
              style={{
                padding: '0.75rem 2rem',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                backgroundColor: isUploading ? '#94A3B8' : '#3B82F6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isUploading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Uploading & Analyzing...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload & Analyze Contract
                </>
              )}
            </button>
          </div>
        )}

        {/* Alternative Actions */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center'
        }}>
          <p style={{ color: '#64748B', marginBottom: '1rem' }}>
            Want to create a new contract instead?
          </p>
          <button
            onClick={() => router.push('/contracts/new')}
            style={{
              color: '#3B82F6',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Create New Contract from Template →
          </button>
        </div>
      </div>

      {/* Add spinning animation */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </AppLayout>
  );
}