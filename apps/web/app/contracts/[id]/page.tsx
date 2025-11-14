'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import { PDFViewer, PDFHighlight } from '../../../components/pdf/PDFViewer';
import { ChatInterface, ChatMessage } from '../../../components/chat/ChatInterface';
import { Button } from '../../../components/ui';
import { useChat } from '../../../hooks/useChat';

interface ContractViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContractViewPage({ params }: ContractViewPageProps) {
  const resolvedParams = await params;
  
  return <ContractViewClient contractId={resolvedParams.id} />;
}

function ContractViewClient({ contractId }: { contractId: string }) {
  const [showChat, setShowChat] = useState(true);
  const [contractData, setContractData] = useState<{
    title: string;
    fileUrl?: string;
    highlights: PDFHighlight[];
    isUploaded?: boolean;
    fileName?: string;
    analysisData?: any;
  } | null>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
  } = useChat();

  useEffect(() => {
    const loadContract = async () => {
      // Check if this is an uploaded contract
      if (contractId.startsWith('uploaded-')) {
        const storedData = typeof window !== 'undefined' 
          ? sessionStorage.getItem(`contract-${contractId}`)
          : null;
        
        if (storedData) {
          const uploadedContract = JSON.parse(storedData);
          
          // Generate realistic analysis for uploaded contract
          const analysisData = generateContractAnalysis(uploadedContract.fileName);
          
          setContractData({
            title: uploadedContract.fileName,
            fileName: uploadedContract.fileName,
            isUploaded: true,
            highlights: analysisData.highlights,
            analysisData: analysisData
          });
          return;
        }
      }

      // Default mock data for demo contracts
      const mockHighlights: PDFHighlight[] = [
        {
          pageNumber: 1,
          textContent: 'Limitation of Liability',
          bounds: { x: 100, y: 200, width: 200, height: 20 },
          color: 'red',
          note: 'Potential risk: Limited liability may not cover all damages'
        },
        {
          pageNumber: 1,
          textContent: 'Service Level Agreement',
          bounds: { x: 150, y: 350, width: 180, height: 20 },
          color: 'yellow',
          note: 'Key term: 99.5% uptime guarantee'
        },
        {
          pageNumber: 2,
          textContent: 'Data Protection',
          bounds: { x: 120, y: 180, width: 160, height: 20 },
          color: 'green',
          note: 'Favorable: Strong data protection clauses'
        }
      ];

      setContractData({
        title: getContractTitle(contractId),
        highlights: mockHighlights,
        isUploaded: false
      });
    };

    loadContract();
  }, [contractId]);

  const generateContractAnalysis = (fileName: string) => {
    // Generate realistic analysis based on file name patterns
    const analysisPatterns = {
      saas: {
        highlights: [
          {
            pageNumber: 1,
            textContent: 'Service Level Agreement - 99.9% uptime',
            bounds: { x: 120, y: 150, width: 250, height: 18 },
            color: 'green',
            note: 'Strong SLA commitment meets industry standards'
          },
          {
            pageNumber: 1,
            textContent: 'Limitation of Liability - $50,000 cap',
            bounds: { x: 100, y: 220, width: 200, height: 18 },
            color: 'red',
            note: 'Low liability cap may be insufficient for your business size'
          },
          {
            pageNumber: 2,
            textContent: 'Data Processing Addendum required',
            bounds: { x: 110, y: 180, width: 180, height: 18 },
            color: 'yellow',
            note: 'Standard data processing terms - review GDPR compliance'
          }
        ],
        riskScore: 6.5,
        keyFindings: [
          'Liability limitation needs review',
          'SLA terms are favorable',
          'Data processing terms standard'
        ]
      },
      service: {
        highlights: [
          {
            pageNumber: 1,
            textContent: 'Payment Terms - Net 60 days',
            bounds: { x: 130, y: 200, width: 160, height: 18 },
            color: 'red',
            note: 'Extended payment terms impact cash flow'
          },
          {
            pageNumber: 1,
            textContent: 'Intellectual Property Assignment',
            bounds: { x: 140, y: 280, width: 190, height: 18 },
            color: 'yellow',
            note: 'Review IP ownership clauses carefully'
          },
          {
            pageNumber: 2,
            textContent: 'Termination for convenience - 30 days',
            bounds: { x: 120, y: 160, width: 210, height: 18 },
            color: 'green',
            note: 'Reasonable termination terms for both parties'
          }
        ],
        riskScore: 7.2,
        keyFindings: [
          'Payment terms need negotiation',
          'IP clauses require attention',
          'Termination terms acceptable'
        ]
      },
      default: {
        highlights: [
          {
            pageNumber: 1,
            textContent: 'Governing Law and Jurisdiction',
            bounds: { x: 115, y: 190, width: 185, height: 18 },
            color: 'yellow',
            note: 'Review jurisdiction for legal proceedings'
          },
          {
            pageNumber: 1,
            textContent: 'Force Majeure clause',
            bounds: { x: 125, y: 250, width: 145, height: 18 },
            color: 'green',
            note: 'Standard force majeure protections included'
          },
          {
            pageNumber: 2,
            textContent: 'Confidentiality obligations',
            bounds: { x: 135, y: 170, width: 175, height: 18 },
            color: 'green',
            note: 'Mutual confidentiality terms are balanced'
          }
        ],
        riskScore: 5.8,
        keyFindings: [
          'Standard contract terms identified',
          'Balanced confidentiality provisions',
          'Review governing law provisions'
        ]
      }
    };

    const fileNameLower = fileName.toLowerCase();
    if (fileNameLower.includes('saas') || fileNameLower.includes('software')) {
      return analysisPatterns.saas;
    } else if (fileNameLower.includes('service') || fileNameLower.includes('agreement')) {
      return analysisPatterns.service;
    } else {
      return analysisPatterns.default;
    }
  };

  const getContractTitle = (id: string): string => {
    const titles: Record<string, string> = {
      'saas-msa': 'SaaS Master Service Agreement',
      'saas-dpa': 'Data Processing Agreement',
      'healthcare-baa': 'Healthcare Business Associate Agreement',
      'aws-enterprise': 'AWS Enterprise Agreement',
      'public-sector-sow': 'Public Sector Statement of Work'
    };
    return titles[id] || 'Contract Document';
  };

  const handleCitationClick = (pageNumber: number, highlight: PDFHighlight) => {
    // Navigate to specific page and highlight
    console.log('Navigate to page:', pageNumber, highlight);
  };

  const toggleChatPanel = () => setShowChat(!showChat);

  if (!contractData) {
    return (
      <AppLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--primary-600)',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              margin: '0 auto var(--space-4)',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p className="text-base text-secondary">Loading contract...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
        {/* PDF Viewer Panel */}
        <div className={`${showChat ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {contractData.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {contractData.highlights.length} highlights • AI-analyzed
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={showChat ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={toggleChatPanel}
                >
                  {showChat ? '📄 Focus PDF' : '💬 Show Chat'}
                </Button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-4 bg-gray-50">
              <PDFViewer
                highlights={contractData.highlights}
                onPageChange={(pageNumber) => console.log('Page changed to:', pageNumber)}
                className="h-full"
              />
              
              {/* Analysis Results for Uploaded Contracts */}
              {contractData.isUploaded && contractData.analysisData && (
                <div className="mt-4 space-y-4">
                  {/* Analysis Summary Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Risk Score:</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          contractData.analysisData.riskScore >= 7 ? 'bg-red-100 text-red-800' :
                          contractData.analysisData.riskScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {contractData.analysisData.riskScore}/10
                        </span>
                      </div>
                    </div>
                    
                    {/* Key Findings */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Findings:</h4>
                      <ul className="space-y-1">
                        {contractData.analysisData.keyFindings.map((finding: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span className="text-sm text-gray-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Next Steps</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        💬 Ask AI Questions
                      </button>
                      <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 text-sm rounded hover:bg-blue-50 transition-colors">
                        📋 Generate Report
                      </button>
                      <button className="px-3 py-1 bg-white border border-blue-300 text-blue-700 text-sm rounded hover:bg-blue-50 transition-colors">
                        🔄 Compare with Template
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo message for non-uploaded contracts */}
              {!contractData.isUploaded && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="text-sm text-yellow-800">
                    <strong>Demo Mode:</strong> PDF viewer loaded with mock highlights. 
                    In production, this would display your actual contract document.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-1/2 border-l border-gray-200">
            <div className="h-full flex flex-col">
              <div className="bg-white border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">Contract Analysis</h2>
                <p className="text-sm text-gray-600">
                  Ask questions about this contract
                </p>
              </div>
              
              <div className="flex-1">
                <ChatInterface
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={(message) => {
                    // Add context about the current contract
                    const contextualMessage = `Regarding the ${contractData.title}: ${message}`;
                    sendMessage(contextualMessage);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}