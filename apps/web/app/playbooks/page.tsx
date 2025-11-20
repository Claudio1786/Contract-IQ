'use client';

import { useState, useEffect } from 'react';
import { PlaybookGenerator } from '../../components/playbooks/PlaybookGenerator';
import { PlaybookView } from '../../components/playbooks/PlaybookView';
import { Button } from '../../components/ui';

// Simple renewal brief interface for basic functionality
interface BasicRenewalBrief {
  id: string;
  title: string;
  content: string;
  contractType?: string;
  scenario?: string;
  objectives?: string[];
  createdAt: Date;
}

export default function RenewalBriefsPage() {
  const [generatedBrief, setGeneratedBrief] = useState<BasicRenewalBrief | null>(null);
  const [briefMetadata, setBriefMetadata] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBriefGenerated = (brief: BasicRenewalBrief, metadata?: any) => {
    setGeneratedBrief(brief);
    setBriefMetadata(metadata);
    setShowGenerator(false);
    setError(null);
  };

  const resetView = () => {
    setGeneratedBrief(null);
    setBriefMetadata(null);
    setShowGenerator(true);
    setError(null);
  };



  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-[#0F1319] to-[#14171F] border border-white/10 rounded-2xl p-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-[0_0_0_1px_rgba(251,146,60,0.2),0_0_20px_rgba(251,146,60,0.15)] bg-[linear-gradient(135deg,rgba(251,146,60,0.15)_0%,rgba(251,146,60,0.08)_100%)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div className="flex-1">
                <h1 style={{
                  fontSize: '40px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Account Intelligence Briefs
                </h1>
                <p className="text-[16px] text-slate-400">
                  Generate strategic intelligence briefs for customer renewal negotiations
                </p>
              </div>
            </div>
            
            {!showGenerator && (
              <Button
                onClick={resetView}
                variant="outline"
                className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              >
                Generate New Intelligence Brief
              </Button>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0F1319] to-[#14171F] border border-white/10 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">



            <div className="space-y-8">
              {showGenerator ? (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-400 mb-4">
                      AI-Powered Account Intelligence Briefs
                    </h2>
                    <p className="text-slate-300 mb-4">
                      Generate strategic account intelligence briefs using advanced AI analysis and customer insights
                    </p>
                    <PlaybookGenerator onPlaybookGenerated={(brief) => handleBriefGenerated(brief)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <PlaybookView playbook={generatedBrief!} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Templates Section */}
        <div className="mt-8 bg-gradient-to-br from-[#0F1319] to-[#14171F] border border-white/10 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">
              Quick Intelligence Brief Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">
                  SaaS Software Agreement
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: Pricing, SLAs, data security, liability caps
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Volume pricing negotiations</li>
                  <li>• Service level agreements</li>
                  <li>• Data processing terms</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-lg font-semibold text-green-400 mb-3">
                  Professional Services
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: SOW definition, payment terms, IP ownership
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Scope and deliverables</li>
                  <li>• Payment milestones</li>
                  <li>• Intellectual property rights</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">
                  Manufacturing Supply
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: Quality standards, delivery terms, price adjustments
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Quality specifications</li>
                  <li>• Delivery schedules</li>
                  <li>• Price escalation clauses</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-6 border border-orange-500/20">
                <h3 className="text-lg font-semibold text-orange-400 mb-3">
                  Data Processing Agreement
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: GDPR compliance, data security, breach notification
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Data protection measures</li>
                  <li>• Processing limitations</li>
                  <li>• Breach notification procedures</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-lg p-6 border border-teal-500/20">
                <h3 className="text-lg font-semibold text-teal-400 mb-3">
                  Cloud Infrastructure
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: Uptime SLAs, scalability, disaster recovery
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Service availability guarantees</li>
                  <li>• Scalability provisions</li>
                  <li>• Backup and recovery terms</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-lg p-6 border border-pink-500/20">
                <h3 className="text-lg font-semibold text-pink-400 mb-3">
                  Consulting Agreement
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: Engagement scope, success metrics, confidentiality
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Project deliverables</li>
                  <li>• Success criteria</li>
                  <li>• Confidentiality protections</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-lg p-6 border border-yellow-500/20">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  Liability Cap Negotiation
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: Risk allocation, liability limitations, insurance requirements
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Liability cap structuring</li>
                  <li>• Mutual vs one-sided caps</li>
                  <li>• Insurance coverage requirements</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-lg p-6 border border-slate-500/20">
                <h3 className="text-lg font-semibold text-slate-300 mb-3">
                  Exit Rights & Termination
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: Termination clauses, data portability, transition assistance
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Termination for convenience</li>
                  <li>• Data extraction rights</li>
                  <li>• Transition support terms</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-lg p-6 border border-indigo-500/20">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">
                  Payment Terms Optimization
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Focus: Payment schedules, early payment discounts, late fees
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
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