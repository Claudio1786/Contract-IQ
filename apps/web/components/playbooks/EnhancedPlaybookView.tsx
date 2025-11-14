'use client';

import React, { useState } from 'react';
import { Button } from '../ui';

export interface EnhancedPlaybook {
  id: string;
  title: string;
  contractType: string;
  scenario: string;
  objectives: string[];
  content: string; // Full AI-generated content
  sections: Record<string, string>; // Parsed sections
  createdAt: Date;
}

export interface EnhancedPlaybookViewProps {
  playbook: EnhancedPlaybook;
  onEdit?: () => void;
  onExport?: () => void;
  className?: string;
}

export const EnhancedPlaybookView: React.FC<EnhancedPlaybookViewProps> = ({
  playbook,
  onEdit,
  onExport,
  className = ''
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('full');

  const availableSections = [
    { id: 'full', title: '📄 Full Playbook', icon: '📄' },
    { id: 'executiveSummary', title: '📋 Executive Summary', icon: '📋' },
    { id: 'talkingPoints', title: '💬 Talking Points', icon: '💬' },
    { id: 'riskMitigation', title: '⚠️ Risk Mitigation', icon: '⚠️' },
    { id: 'tactics', title: '🎯 Negotiation Tactics', icon: '🎯' },
    { id: 'timeline', title: '📅 Timeline', icon: '📅' },
    { id: 'successMetrics', title: '📊 Success Metrics', icon: '📊' }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const formatContent = (content: string) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```(.*?)```/gs, '<pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card">
        <div className="card-body">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start' 
          }}>
            <div style={{ flex: 1 }}>
              <h1 className="text-h1" style={{ marginBottom: 'var(--space-3)' }}>
                {playbook.title}
              </h1>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-4)'
              }}>
                <span className="badge badge-primary">{playbook.contractType}</span>
                <span className="text-separator">•</span>
                <span className="text-base text-tertiary">
                  Generated {playbook.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-3)'
              }}>
                {playbook.objectives.map((objective, index) => (
                  <span key={index} className="badge badge-success" style={{ fontSize: 'var(--text-xs)' }}>
                    ✓ {objective}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {onEdit && (
                <button className="btn-secondary" onClick={onEdit}>
                  ✏️ Edit
                </button>
              )}
              {onExport && (
                <button className="btn-primary" onClick={onExport}>
                  📤 Export PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 'var(--space-3)' 
      }}>
        {availableSections.map((section) => {
          const hasContent = section.id === 'full' || playbook.sections[section.id];
          if (!hasContent && section.id !== 'full') return null;
          
          return (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={expandedSection === section.id ? 'btn-primary' : 'btn-secondary'}
              style={{ opacity: hasContent ? 1 : 0.5 }}
            >
              {section.icon} {section.title}
            </button>
          );
        })}
      </div>

      {/* Content Display */}
      {expandedSection && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-h2">
              {availableSections.find(s => s.id === expandedSection)?.title || 'Content'}
            </h2>
          </div>
          <div className="card-body">
            {expandedSection === 'full' ? (
              <div 
                className="prose prose-sm max-w-none"
                style={{ 
                  lineHeight: '1.6',
                  color: 'var(--color-text-secondary)'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-4">${formatContent(playbook.content)}</p>` 
                }}
              />
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                style={{ 
                  lineHeight: '1.6',
                  color: 'var(--color-text-secondary)'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-4">${formatContent(playbook.sections[expandedSection] || 'Content not available')}</p>` 
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* AI Disclaimer */}
      <div className="card card-warning">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.25rem' }}>🤖</span>
            <div>
              <h3 className="text-base font-medium text-warning" style={{ marginBottom: 'var(--space-1)' }}>
                AI-Generated Content
              </h3>
              <p className="text-sm text-secondary">
                This playbook was generated using AI and market intelligence. Always consult with legal counsel 
                and validate all strategies against your specific situation. Market data and benchmarks are 
                based on industry sources but may not reflect your exact circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};