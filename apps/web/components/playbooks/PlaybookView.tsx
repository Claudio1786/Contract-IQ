'use client';

import React, { useState } from 'react';
import { Card, Button } from '../ui';
import { NegotiationPlaybook } from './PlaybookGenerator';

export interface PlaybookViewProps {
  playbook: NegotiationPlaybook;
  onEdit?: () => void;
  onExport?: () => void;
  className?: string;
}

export const PlaybookView: React.FC<PlaybookViewProps> = ({
  playbook,
  onEdit,
  onExport,
  className = ''
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const sections = [
    { id: 'overview', title: '📋 Overview', icon: '📋' },
    { id: 'talkingPoints', title: '💬 Talking Points', icon: '💬' },
    { id: 'riskMitigation', title: '⚠️ Risk Mitigation', icon: '⚠️' },
    { id: 'tactics', title: '🎯 Negotiation Tactics', icon: '🎯' },
    { id: 'timeline', title: '📅 Timeline', icon: '📅' },
    { id: 'metrics', title: '📊 Success Metrics', icon: '📊' }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge';
    }
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
                  Created {playbook.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div>
                <h3 className="text-base font-medium text-secondary" style={{ marginBottom: 'var(--space-2)' }}>
                  Scenario:
                </h3>
                <p className="text-base text-secondary">{playbook.scenario}</p>
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
                  📤 Export
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
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => toggleSection(section.id)}
            className={expandedSection === section.id ? 'btn-primary' : 'btn-secondary'}
          >
            {section.icon} {section.title}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      
      {/* Overview */}
      {expandedSection === 'overview' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-h2">📋 Overview</h2>
          </div>
          <div className="card-body">
            <div>
              <h3 className="text-lg font-medium text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
                Key Objectives
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {playbook.objectives.map((objective, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <span className="text-success" style={{ marginTop: '2px' }}>✓</span>
                    <span className="text-base text-secondary">{objective}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Talking Points */}
      {expandedSection === 'talkingPoints' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-h2">💬 Talking Points</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {playbook.talkingPoints.map((point, index) => (
                <div key={index} className="card card-interactive">
                  <div className="card-body">
                    <h3 className="text-lg font-medium" style={{ marginBottom: 'var(--space-3)' }}>
                      {point.topic}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div>
                        <h4 className="text-base font-medium text-success" style={{ marginBottom: 'var(--space-1)' }}>
                          Position:
                        </h4>
                        <p className="text-base text-secondary">{point.position}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-base font-medium text-primary" style={{ marginBottom: 'var(--space-1)' }}>
                          Rationale:
                        </h4>
                        <p className="text-base text-secondary">{point.rationale}</p>
                      </div>
                      
                      {point.fallback && (
                        <div>
                          <h4 className="text-base font-medium text-warning" style={{ marginBottom: 'var(--space-1)' }}>
                            Fallback:
                          </h4>
                          <p className="text-base text-secondary">{point.fallback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Mitigation */}
      {expandedSection === 'riskMitigation' && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-h2">⚠️ Risk Mitigation</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {playbook.riskMitigation.map((risk, index) => (
                <div key={index} className="card card-interactive">
                  <div className="card-body">
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-3)'
                    }}>
                      <h3 className="text-lg font-medium text-primary">{risk.risk}</h3>
                      <span className={`badge ${getPriorityBadge(risk.priority)}`}>
                        {risk.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-medium text-secondary">Mitigation: </span>
                      <span className="text-base text-secondary">{risk.mitigation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tactics */}
      {expandedSection === 'tactics' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 Negotiation Tactics</h2>
          <div className="space-y-4">
            {playbook.tactics.map((tactic, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">{tactic.tactic}</div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">{tactic.description}</div>
                  <div className="text-sm">
                    <span className="font-medium text-purple-700">When to use:</span>
                    <span className="text-gray-600 ml-1">{tactic.whenToUse}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      {expandedSection === 'timeline' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Timeline</h2>
          <div className="space-y-4">
            {playbook.timeline.map((phase, index) => (
              <div key={index} className="relative">
                {index < playbook.timeline.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-300"></div>
                )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{phase.phase}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {phase.duration}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {phase.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Success Metrics */}
      {expandedSection === 'metrics' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Success Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playbook.successMetrics.map((metric, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-600 text-sm">🎯</span>
                <span className="text-sm text-gray-700">{metric}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};