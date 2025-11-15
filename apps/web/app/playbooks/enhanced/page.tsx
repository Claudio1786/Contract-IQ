'use client';

import { useState } from 'react';
import { PlaybookGenerator } from '../../../components/playbooks/PlaybookGenerator';
import { PlaybookView } from '../../../components/playbooks/PlaybookView';
import { Button } from '../../../components/ui';

// Enhanced playbook interface (when needed)
interface EnhancedPlaybook {
  id: string;
  title: string;
  content: string;
  contractType?: string;
  scenario?: string;
  objectives?: string[];
  createdAt: Date;
  metadata?: {
    modelUsed?: string;
    confidence?: number;
    cost?: number;
    processingTime?: number;
  };
}

export default function EnhancedPlaybooksPage() {
  const [generatedPlaybook, setGeneratedPlaybook] = useState<EnhancedPlaybook | null>(null);
  const [playbookMetadata, setPlaybookMetadata] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(true);

  const handlePlaybookGenerated = (playbook: EnhancedPlaybook, metadata?: any) => {
    setGeneratedPlaybook(playbook);
    setPlaybookMetadata(metadata);
    setShowGenerator(false);
  };

  const resetView = () => {
    setGeneratedPlaybook(null);
    setPlaybookMetadata(null);
    setShowGenerator(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Enhanced AI Negotiation Playbooks
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Advanced multi-LLM architecture for superior contract negotiation intelligence
                </p>
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    🚧 <strong>Coming Soon:</strong> This enhanced version with multi-LLM features (OpenAI + Gemini) 
                    is currently being optimized for deployment. Use the <a href="/playbooks" className="text-yellow-900 underline">standard playbooks page</a> for full functionality.
                  </p>
                </div>
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

            <div className="space-y-8">
              {showGenerator ? (
                <div className="space-y-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-900 mb-4">
                      Multi-LLM Playbook Generation
                    </h2>
                    <p className="text-blue-700 mb-4">
                      This page will feature enhanced playbook generation using both OpenAI and Google Gemini
                      for cross-validation and optimal negotiation strategies.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <h3 className="font-medium text-blue-900 mb-2">Enhanced Features (Coming Soon):</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Cross-validation between OpenAI and Gemini models</li>
                        <li>• Real-time cost tracking and optimization</li>
                        <li>• Confidence scoring for AI recommendations</li>
                        <li>• Advanced market intelligence integration</li>
                        <li>• Strategic model routing for optimal results</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Standard Generation (Available Now)
                    </h2>
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

        {/* Preview: Enhanced Features */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg shadow-lg overflow-hidden border border-purple-200">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">
              🔬 Enhanced AI Architecture Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Multi-Model Intelligence
                </h3>
                <p className="text-purple-700 text-sm">
                  Leverage both OpenAI's creative reasoning and Gemini's structured analysis for comprehensive negotiation strategies.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Cross-Validation
                </h3>
                <p className="text-purple-700 text-sm">
                  Validate negotiation recommendations across multiple AI models to ensure accuracy and reliability.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Cost Optimization
                </h3>
                <p className="text-purple-700 text-sm">
                  Real-time cost tracking and intelligent model routing to balance quality with operational efficiency.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Confidence Scoring
                </h3>
                <p className="text-purple-700 text-sm">
                  Get confidence ratings for each recommendation to understand the reliability of AI-generated strategies.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Strategic Routing
                </h3>
                <p className="text-purple-700 text-sm">
                  Automatically select the optimal AI model based on contract type and negotiation scenario.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-purple-200 shadow-sm">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-purple-700 text-sm">
                  Detailed metadata on generation process, model performance, and optimization opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}