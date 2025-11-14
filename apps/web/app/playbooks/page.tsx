'use client';

import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
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
    <AppLayout>
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
          <h1 className="text-h1" style={{ marginBottom: 'var(--space-3)' }}>
            🎯 AI-Powered Negotiation Playbooks
          </h1>
          <p className="text-lg text-secondary">
            Generate strategic negotiation plans tailored to your contract scenarios with AI insights
          </p>
        </div>

        {/* Mode Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 'var(--space-8)' 
        }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              className={showGenerator ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setShowGenerator(true)}
            >
              📝 Create Playbook
            </button>
            {generatedPlaybook && (
              <button
                className={!showGenerator ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setShowGenerator(false)}
              >
                📋 View Playbook
              </button>
            )}
            {generatedPlaybook && (
              <button
                className="btn-secondary"
                onClick={handleCreateNew}
              >
                ✨ New Playbook
              </button>
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
          <div className="card card-accent card-accent-primary" style={{ marginTop: 'var(--space-8)' }}>
            <div className="card-header">
              <h3 className="text-h3">💡 How Negotiation Playbooks Work</h3>
            </div>
            <div className="card-body">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 'var(--space-4)' 
              }}>
                <div>
                  <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                    🎯 Strategic Input
                  </h4>
                  <p className="text-sm text-secondary">
                    Define your contract type, scenario, and negotiation objectives
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                    🧠 AI Analysis
                  </h4>
                  <p className="text-sm text-secondary">
                    Get AI-powered insights on tactics, talking points, and risks
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                    📋 Action Plan
                  </h4>
                  <p className="text-sm text-secondary">
                    Receive a detailed playbook with timeline and success metrics
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-2)' }}>
                    📤 Export Ready
                  </h4>
                  <p className="text-sm text-secondary">
                    Download your playbook for easy reference during negotiations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Playbooks */}
        {showGenerator && !generatedPlaybook && (
          <div className="card" style={{ marginTop: 'var(--space-6)' }}>
            <div className="card-header">
              <h3 className="text-h3">🔥 Popular Negotiation Scenarios</h3>
            </div>
            <div className="card-body">
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: 'var(--space-4)' 
              }}>
                <div className="card card-interactive" style={{ cursor: 'pointer' }}>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>📊</div>
                    <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                      SaaS Contract Renewals
                    </h4>
                    <p className="text-sm text-secondary">
                      Price negotiations, usage optimization, and multi-year commitments
                    </p>
                  </div>
                </div>
                <div className="card card-interactive" style={{ cursor: 'pointer' }}>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🔒</div>
                    <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                      Risk & Liability Reduction
                    </h4>
                    <p className="text-sm text-secondary">
                      Liability caps, indemnification, and compliance requirements
                    </p>
                  </div>
                </div>
                <div className="card card-interactive" style={{ cursor: 'pointer' }}>
                  <div className="card-body" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>⚡</div>
                    <h4 className="text-base font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                      Service Level Agreements
                    </h4>
                    <p className="text-sm text-secondary">
                      Performance metrics, penalties, and service guarantees
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}