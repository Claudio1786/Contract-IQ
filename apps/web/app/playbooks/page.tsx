'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlaybookGenerator } from '../../components/playbooks/PlaybookGenerator';
import { PlaybookView } from '../../components/playbooks/PlaybookView';
import { Button } from '../../components/ui';

// Simple playbook interface for basic functionality
interface BasicPlaybook {
  id: string;
  title: string;
  content: string;
  contractType?: string;
  scenario?: string;
  objectives?: string[];
  createdAt: Date;
}

export default function PlaybooksPage() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contract');
  
  const [generatedPlaybook, setGeneratedPlaybook] = useState<BasicPlaybook | null>(null);
  const [playbookMetadata, setPlaybookMetadata] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(true);
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [showContractGuide, setShowContractGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load contract information if contractId is provided
  useEffect(() => {
    if (contractId) {
      setShowContractGuide(true);
      // In a real implementation, we'd fetch contract data from an API
      // For now, simulate contract info
      setContractInfo({
        id: contractId,
        type: 'Unknown Contract Type',
        uploadedAt: new Date().toLocaleDateString(),
        status: 'Processed',
        extractedTerms: [
          'Payment terms not clearly defined',
          'Service level agreements missing',
          'Liability caps need review'
        ]
      });
    }
  }, [contractId]);

  const handlePlaybookGenerated = (playbook: BasicPlaybook, metadata?: any) => {
    setGeneratedPlaybook(playbook);
    setPlaybookMetadata(metadata);
    setShowGenerator(false);
    setError(null);
  };

  const resetView = () => {
    setGeneratedPlaybook(null);
    setPlaybookMetadata(null);
    setShowGenerator(true);
    setError(null);
  };

  const handleContractGuideDismiss = () => {
    setShowContractGuide(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Contract Negotiation Playbooks
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Generate strategic playbooks for B2B vendor contract negotiations
                </p>
              </div>
              
              {!showGenerator && (
                <Button
                  onClick={resetView}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Generate New Playbook
                </Button>
              )}
            </div>

            {/* Contract Upload Guide */}
            {showContractGuide && contractInfo && (
              <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        🎯 Contract Uploaded Successfully!
                      </h3>
                      <p className="text-sm text-gray-600">
                        Generate a strategic negotiation playbook based on your contract
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleContractGuideDismiss}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📋 Contract Information</h4>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Contract ID:</span>
                        <span className="text-sm font-medium text-gray-900">{contractInfo.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="text-sm font-medium text-gray-900">{contractInfo.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Uploaded:</span>
                        <span className="text-sm font-medium text-gray-900">{contractInfo.uploadedAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {contractInfo.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">⚠️ Next Steps & Guidance</h4>
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 text-sm font-bold">1.</span>
                        <div>
                          <p className="text-sm text-gray-900 font-medium">Choose the right contract type</p>
                          <p className="text-xs text-gray-600">Select the template that matches your uploaded contract</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 text-sm font-bold">2.</span>
                        <div>
                          <p className="text-sm text-gray-900 font-medium">Select relevant objectives</p>
                          <p className="text-xs text-gray-600">Pick 2-4 key negotiation goals for best results</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 text-sm font-bold">3.</span>
                        <div>
                          <p className="text-sm text-gray-900 font-medium">Review extracted terms</p>
                          <p className="text-xs text-gray-600">Check if AI correctly identified key contract elements</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Terms Preview */}
                {contractInfo.extractedTerms && contractInfo.extractedTerms.length > 0 && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-yellow-900 mb-2">
                      🔍 AI-Extracted Key Issues (Review for Accuracy)
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {contractInfo.extractedTerms.map((term: string, index: number) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-yellow-700 mt-2">
                      💡 <strong>Not seeing the right issues?</strong> Choose a different contract type template below or adjust your negotiation objectives.
                    </p>
                  </div>
                )}

                {/* Template Suggestion */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">
                    🎯 Recommended Templates Based on Your Contract
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-25 transition-colors">
                      <div className="text-sm font-medium text-blue-900">SaaS Agreement</div>
                      <div className="text-xs text-blue-600">If this is software/cloud services</div>
                    </button>
                    <button className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-25 transition-colors">
                      <div className="text-sm font-medium text-blue-900">Professional Services</div>
                      <div className="text-xs text-blue-600">If this is consulting/services work</div>
                    </button>
                    <button className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-25 transition-colors">
                      <div className="text-sm font-medium text-blue-900">Supply/Manufacturing</div>
                      <div className="text-xs text-blue-600">If this is for goods/materials</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {showGenerator ? (
                <div className="space-y-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 mb-4">
                      AI-Powered Contract Negotiation Playbooks
                    </h2>
                    <p className="text-blue-700 mb-4">
                      Generate strategic negotiation playbooks using advanced AI analysis and market intelligence
                    </p>
                    <PlaybookGenerator onPlaybookGenerated={(playbook) => handlePlaybookGenerated(playbook)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <PlaybookView playbook={generatedPlaybook!} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Templates Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Playbook Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  SaaS Software Agreement
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  Focus: Pricing, SLAs, data security, liability caps
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Volume pricing negotiations</li>
                  <li>• Service level agreements</li>
                  <li>• Data processing terms</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Professional Services
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  Focus: SOW definition, payment terms, IP ownership
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Scope and deliverables</li>
                  <li>• Payment milestones</li>
                  <li>• Intellectual property rights</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  Manufacturing Supply
                </h3>
                <p className="text-purple-700 text-sm mb-4">
                  Focus: Quality standards, delivery terms, price adjustments
                </p>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• Quality specifications</li>
                  <li>• Delivery schedules</li>
                  <li>• Price escalation clauses</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-lg p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                  Data Processing Agreement
                </h3>
                <p className="text-orange-700 text-sm mb-4">
                  Focus: GDPR compliance, data security, breach notification
                </p>
                <ul className="text-xs text-orange-600 space-y-1">
                  <li>• Data protection measures</li>
                  <li>• Processing limitations</li>
                  <li>• Breach notification procedures</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-lg p-6 border border-teal-200">
                <h3 className="text-lg font-semibold text-teal-900 mb-3">
                  Cloud Infrastructure
                </h3>
                <p className="text-teal-700 text-sm mb-4">
                  Focus: Uptime SLAs, scalability, disaster recovery
                </p>
                <ul className="text-xs text-teal-600 space-y-1">
                  <li>• Service availability guarantees</li>
                  <li>• Scalability provisions</li>
                  <li>• Backup and recovery terms</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-6 border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">
                  Consulting Agreement
                </h3>
                <p className="text-pink-700 text-sm mb-4">
                  Focus: Engagement scope, success metrics, confidentiality
                </p>
                <ul className="text-xs text-pink-600 space-y-1">
                  <li>• Project deliverables</li>
                  <li>• Success criteria</li>
                  <li>• Confidentiality protections</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-lg p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                  Liability Cap Negotiation
                </h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Focus: Risk allocation, liability limitations, insurance requirements
                </p>
                <ul className="text-xs text-yellow-600 space-y-1">
                  <li>• Liability cap structuring</li>
                  <li>• Mutual vs one-sided caps</li>
                  <li>• Insurance coverage requirements</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Exit Rights & Termination
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  Focus: Termination clauses, data portability, transition assistance
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Termination for convenience</li>
                  <li>• Data extraction rights</li>
                  <li>• Transition support terms</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                  Payment Terms Optimization
                </h3>
                <p className="text-indigo-700 text-sm mb-4">
                  Focus: Payment schedules, early payment discounts, late fees
                </p>
                <ul className="text-xs text-indigo-600 space-y-1">
                  <li>• Optimized payment cycles</li>
                  <li>• Cash flow advantages</li>
                  <li>• Discount negotiations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}