'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { FileUpload } from '../../components/ui';
import { useChat } from '../../hooks/useChat';

export default function UploadPage() {
  const { uploadContract, isLoading, error } = useChat();

  const handleFileSelect = async (file: File) => {
    try {
      await uploadContract(file);
      // Redirect to chat after successful upload
      window.location.href = '/chat';
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Your Contract
            </h1>
            <p className="text-gray-600">
              Upload a contract document to start analyzing terms, identifying risks, and developing negotiation strategies.
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div className="flex-1 p-6 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <FileUpload
              onFileSelect={handleFileSelect}
              isUploading={isLoading}
              onError={(error) => console.error('Upload error:', error)}
              accept=".pdf,.docx,.doc,.txt"
              maxSizeMB={25}
            />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="text-red-800 text-sm font-medium">
                  Upload failed
                </div>
                <div className="text-red-600 text-sm mt-1">
                  {error}
                </div>
              </div>
            )}
            
            {/* Features Preview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-blue-600 text-lg mb-2">🔍</div>
                <h3 className="font-medium text-gray-900 mb-1">Risk Analysis</h3>
                <p className="text-sm text-gray-600">
                  Automatically identify potential risks, liabilities, and unfavorable terms
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-green-600 text-lg mb-2">💬</div>
                <h3 className="font-medium text-gray-900 mb-1">AI Chat</h3>
                <p className="text-sm text-gray-600">
                  Ask questions and get instant answers about any contract clause
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-purple-600 text-lg mb-2">🎯</div>
                <h3 className="font-medium text-gray-900 mb-1">Negotiation Tips</h3>
                <p className="text-sm text-gray-600">
                  Get strategic recommendations for improving contract terms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}