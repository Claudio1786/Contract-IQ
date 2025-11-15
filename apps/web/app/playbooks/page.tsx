'use client';

import { useState } from 'react';
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
  const [generatedPlaybook, setGeneratedPlaybook] = useState<BasicPlaybook | null>(null);
  const [playbookMetadata, setPlaybookMetadata] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(true);

  const handlePlaybookGenerated = (playbook: BasicPlaybook, metadata?: any) => {
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