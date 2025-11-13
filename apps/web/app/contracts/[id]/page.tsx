'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../../components/layout/AppShell';
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
  } | null>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
  } = useChat();

  // Mock data - in real app this would come from API
  useEffect(() => {
    // Simulate loading contract data
    const loadContract = async () => {
      // Mock highlights for demonstration
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
        // Note: In production, you'd have actual PDF URLs or file data
      });
    };

    loadContract();
  }, [contractId]);

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
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contract...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex h-full">
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
              
              {/* Mock message for demo */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> PDF viewer loaded with mock highlights. 
                  In production, this would display your actual contract document.
                </div>
              </div>
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
    </AppShell>
  );
}