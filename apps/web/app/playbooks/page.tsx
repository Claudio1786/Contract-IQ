'use client';

import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { PlaybookGenerator, NegotiationPlaybook } from '../../components/playbooks/PlaybookGenerator';
import { PlaybookView } from '../../components/playbooks/PlaybookView';
import { Button } from '../../components/ui';

export default function PlaybooksPage() {
  const [generatedPlaybook, setGeneratedPlaybook] = useState<NegotiationPlaybook | null>(null);
  const [showGenerator, setShowGenerator] = useState(true);

  const handlePlaybookGenerated = (playbook: NegotiationPlaybook) => {
    setGeneratedPlaybook(playbook);
    setShowGenerator(false);
  };

  const handleCreateNew = () => {
    setGeneratedPlaybook(null);
    setShowGenerator(true);
  };

  const handleEdit = () => {
    setShowGenerator(true);
  };

  const handleExport = () => {
    if (!generatedPlaybook) return;
    
    // Create a formatted text version of the playbook
    const content = `
NEGOTIATION PLAYBOOK: ${generatedPlaybook.title}
Generated on: ${generatedPlaybook.createdAt.toLocaleDateString()}

CONTRACT TYPE: ${generatedPlaybook.contractType}
SCENARIO: ${generatedPlaybook.scenario}

KEY OBJECTIVES:
${generatedPlaybook.objectives.map(obj => `• ${obj}`).join('\n')}

TALKING POINTS:
${generatedPlaybook.talkingPoints.map(point => `
Topic: ${point.topic}
Position: ${point.position}
Rationale: ${point.rationale}
${point.fallback ? `Fallback: ${point.fallback}` : ''}
`).join('\n')}

RISK MITIGATION:
${generatedPlaybook.riskMitigation.map(risk => `
Risk: ${risk.risk} (${risk.priority} priority)
Mitigation: ${risk.mitigation}
`).join('\n')}

NEGOTIATION TACTICS:
${generatedPlaybook.tactics.map(tactic => `
Tactic: ${tactic.tactic}
Description: ${tactic.description}
When to use: ${tactic.whenToUse}
`).join('\n')}

TIMELINE:
${generatedPlaybook.timeline.map((phase, index) => `
${index + 1}. ${phase.phase} (${phase.duration})
Activities:
${phase.activities.map(activity => `   • ${activity}`).join('\n')}
`).join('\n')}

SUCCESS METRICS:
${generatedPlaybook.successMetrics.map(metric => `• ${metric}`).join('\n')}
    `;

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPlaybook.title.replace(/[^a-z0-9]/gi, '_')}_playbook.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 Negotiation Playbook Generator
          </h1>
          <p className="text-gray-600">
            Generate AI-powered negotiation strategies for your contract discussions
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant={showGenerator ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowGenerator(true)}
            >
              📝 Generator
            </Button>
            {generatedPlaybook && (
              <Button
                variant={!showGenerator ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowGenerator(false)}
              >
                📋 View Playbook
              </Button>
            )}
            {generatedPlaybook && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCreateNew}
              >
                ✨ New Playbook
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {showGenerator ? (
          <PlaybookGenerator
            onPlaybookGenerated={handlePlaybookGenerated}
          />
        ) : generatedPlaybook ? (
          <PlaybookView
            playbook={generatedPlaybook}
            onEdit={handleEdit}
            onExport={handleExport}
          />
        ) : null}

        {/* Help Section */}
        {showGenerator && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Select your contract type and negotiation scenario</li>
              <li>• Define your key objectives and desired outcomes</li>
              <li>• Get a comprehensive strategy with talking points, tactics, and timeline</li>
              <li>• Export your playbook for easy reference during negotiations</li>
            </ul>
          </div>
        )}

        {/* Sample Playbooks */}
        {showGenerator && !generatedPlaybook && (
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">🔥 Popular Playbooks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-gray-200 rounded text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm font-medium text-gray-900">SaaS Renewals</div>
                <div className="text-xs text-gray-600">Price negotiation strategies</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded text-center">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-sm font-medium text-gray-900">Risk Reduction</div>
                <div className="text-xs text-gray-600">Liability and compliance</div>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded text-center">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-sm font-medium text-gray-900">SLA Enhancement</div>
                <div className="text-xs text-gray-600">Service level improvements</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}