/**
 * Upload Modal Component
 * Epic 3: Task 3.3 - Upload UI Enhancement
 * 
 * Drag-and-drop file upload with progress tracking
 */

'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (contract: any) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);

    // Validate file type
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setError('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.');
      return;
    }

    // Validate file size (50 MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds maximum of 50MB.');
      return;
    }

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title || selectedFile.name);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/contracts/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();

      // Success!
      setTimeout(() => {
        onUploadSuccess(data.data.contract);
        handleClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload contract');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setTitle('');
    setError(null);
    setUploadProgress(0);
    onClose();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 'var(--z-modal)',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 'calc(var(--z-modal) + 1)',
          width: '90%',
          maxWidth: '600px',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Header */}
          <div
            style={{
              padding: 'var(--space-6)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 className="text-h2">Upload Contract</h2>
            <button
              onClick={handleClose}
              disabled={isUploading}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.5 : 1,
                color: 'var(--color-text-secondary)',
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 'var(--space-6)' }}>
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                backgroundColor: isDragging
                  ? 'rgba(99, 102, 241, 0.05)'
                  : 'var(--color-surface)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                marginBottom: 'var(--space-6)',
              }}
              onClick={handleBrowseClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                disabled={isUploading}
              />

              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>📄</div>
                  <p className="text-base font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-secondary">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {!isUploading && (
                    <button
                      className="btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setTitle('');
                      }}
                      style={{ marginTop: 'var(--space-3)' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>☁️</div>
                  <p className="text-base font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                    {isDragging ? 'Drop your contract here' : 'Drag and drop your contract'}
                  </p>
                  <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
                    or
                  </p>
                  <button className="btn-secondary btn-sm">Browse Files</button>
                  <p className="text-xs text-tertiary" style={{ marginTop: 'var(--space-3)' }}>
                    Supports PDF, DOCX, DOC, TXT (max 50MB)
                  </p>
                </>
              )}
            </div>

            {/* Title Input */}
            {selectedFile && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Contract Title (Optional)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter contract title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  <span className="text-sm text-secondary">Uploading...</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${uploadProgress}%`,
                      backgroundColor: 'var(--color-primary)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <p className="text-sm" style={{ color: '#EF4444' }}>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: 'var(--space-6)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: 'var(--space-3)',
              justifyContent: 'flex-end',
            }}
          >
            <button
              className="btn-secondary"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Contract'}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
