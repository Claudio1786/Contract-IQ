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

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {playbook.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {playbook.contractType}
              </span>
              <span>•</span>
              <span>Created {playbook.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="mt-3">
              <div className="text-sm font-medium text-gray-700">Scenario:</div>
              <div className="text-sm text-gray-600">{playbook.scenario}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={onEdit}>
                ✏️ Edit
              </Button>
            )}
            {onExport && (
              <Button variant="secondary" size="sm" onClick={onExport}>
                📤 Export
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => toggleSection(section.id)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              expandedSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section.icon} {section.title}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      
      {/* Overview */}
      {expandedSection === 'overview' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Overview</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Key Objectives</h3>
              <ul className="space-y-1">
                {playbook.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="text-green-600 mr-2">✓</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Talking Points */}
      {expandedSection === 'talkingPoints' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💬 Talking Points</h2>
          <div className="space-y-4">
            {playbook.talkingPoints.map((point, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-2">{point.topic}</div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-green-700 mb-1">Position:</div>
                    <div className="text-sm text-gray-600">{point.position}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-blue-700 mb-1">Rationale:</div>
                    <div className="text-sm text-gray-600">{point.rationale}</div>
                  </div>
                  
                  {point.fallback && (
                    <div>
                      <div className="text-sm font-medium text-orange-700 mb-1">Fallback:</div>
                      <div className="text-sm text-gray-600">{point.fallback}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Risk Mitigation */}
      {expandedSection === 'riskMitigation' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Risk Mitigation</h2>
          <div className="space-y-3">
            {playbook.riskMitigation.map((risk, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900">{risk.risk}</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(risk.priority)}`}>
                    {risk.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Mitigation:</span> {risk.mitigation}
                </div>
              </div>
            ))}
          </div>
        </Card>
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