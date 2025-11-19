'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from './Button';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete?: (result: { contractId: string; fileName: string }) => void;
  onUploadProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  isUploading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  onUploadProgress,
  onError,
  accept = '.pdf,.docx,.doc,.txt',
  maxSizeMB = 10,
  disabled = false,
  isUploading = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError?.(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      onError?.(`File type not supported. Allowed types: ${accept}`);
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;
    
    onFileSelect(file);
    setUploadProgress(0);
  }, [onFileSelect, accept, maxSizeMB, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [disabled, isUploading, handleFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Main upload area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : disabled || isUploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled && !isUploading ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <div className="text-center">
          {isUploading ? (
            <UploadProgress progress={uploadProgress} />
          ) : (
            <>
              <div className="mb-4">
                <div className={`
                  w-12 h-12 mx-auto rounded-full flex items-center justify-center
                  ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  <span className="text-2xl">📄</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragOver ? 'Drop your contract here' : 'Upload a contract'}
                </h3>
                <p className="text-sm text-gray-600">
                  Drag and drop your file here, or click to browse
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={disabled}
                >
                  Choose File
                </Button>
                <span className="text-xs text-gray-500">
                  or drag and drop
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File requirements */}
      <div className="mt-3 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4">
          <span>📋 Supported: {accept.replace(/\./g, '').toUpperCase()}</span>
          <span>📏 Max size: {maxSizeMB}MB</span>
          <span>🔒 Files are processed securely</span>
        </div>
      </div>
    </div>
  );
};

interface UploadProgressProps {
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => (
  <div className="space-y-3">
    <div className="w-16 h-16 mx-auto">
      <div className="relative w-16 h-16">
        {/* Background circle */}
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
        
        {/* Progress text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
    
    <div className="text-center">
      <h3 className="text-sm font-medium text-gray-900 mb-1">
        Uploading contract...
      </h3>
      <p className="text-xs text-gray-600">
        Processing your document securely
      </p>
    </div>
    
    {/* Progress bar */}
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);