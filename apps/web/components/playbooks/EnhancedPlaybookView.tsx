'use client';

import React, { useState } from 'react';
import { Card, Button } from '../ui';
import { NegotiationPlaybook } from '../../lib/negotiation-intelligence';

export interface EnhancedPlaybookViewProps {
  playbook: NegotiationPlaybook;
  metadata?: any; // Multi-LLM metadata from API response
  onEdit?: () => void;
  onExport?: () => void;
  className?: string;
}

export const EnhancedPlaybookView: React.FC<EnhancedPlaybookViewProps> = ({
  playbook,
  metadata,
  onEdit,
  onExport,
  className = ''
}) => {
  const [showMetadata, setShowMetadata] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.85) return 'High Confidence';
    if (confidence >= 0.7) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with Enhanced Metadata */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {playbook.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>📅 Generated: {formatDate(playbook.createdAt)}</span>
              <span>📄 Contract: {playbook.contractType}</span>
              <span>🎯 Scenario: {playbook.scenario}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {onEdit && (
              <Button
                onClick={onEdit}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                ✏️ Edit
              </Button>
            )}
            {onExport && (
              <Button
                onClick={onExport}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                📤 Export
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Metadata Section */}
        {metadata && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                🤖 AI Generation Details
              </h3>
              <button
                onClick={() => setShowMetadata(!showMetadata)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showMetadata ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {/* Quick Summary */}
            <div className="flex items-center space-x-6 text-sm">
              {metadata.modelUsed && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {metadata.modelUsed}
                  </span>
                </div>
              )}
              
              {metadata.confidence !== undefined && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Quality:</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${getConfidenceColor(metadata.confidence)}`}>
                    {getConfidenceLabel(metadata.confidence)}
                  </span>
                </div>
              )}
              
              {metadata.cost !== undefined && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium text-green-700">
                    {formatCost(metadata.cost)}
                  </span>
                </div>
              )}
              
              {metadata.processingTime && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Generated in:</span>
                  <span className="font-medium text-gray-700">
                    {(metadata.processingTime / 1000).toFixed(1)}s
                  </span>
                </div>
              )}
            </div>
            
            {/* Detailed Metadata */}
            {showMetadata && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Generation Strategy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Model:</span>
                      <span className="font-medium">{metadata.primaryModel || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Final Model Used:</span>
                      <span className="font-medium">{metadata.modelUsed || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Length:</span>
                      <span className="font-medium">{metadata.responseLength?.toLocaleString() || 'N/A'} chars</span>
                    </div>
                  </div>
                </div>
                
                {metadata.crossValidation && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Cross-Validation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fallback Model:</span>
                        <span className="font-medium">{metadata.crossValidation.fallbackModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Agreement Score:</span>
                        <span className="font-medium">
                          {(metadata.crossValidation.agreement * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recommended:</span>
                        <span className={`font-medium capitalize ${
                          metadata.crossValidation.recommendedApproach === 'primary' 
                            ? 'text-green-600' 
                            : 'text-blue-600'
                        }`}>
                          {metadata.crossValidation.recommendedApproach} model
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Objectives Overview */}
      <Card>
        <Card.Header>
          <Card.Title>🎯 Negotiation Objectives</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playbook.objectives.map((objective, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-medium text-blue-900">{objective}</div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {playbook.content}
          </div>
        </div>
      </div>

      {/* Structured Sections (if available) */}
      {playbook.sections && Object.keys(playbook.sections).length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">📋 Structured Sections</h2>
          
          {playbook.sections.executiveSummary && (
            <Card>
              <Card.Header>
                <Card.Title>📊 Executive Summary</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {playbook.sections.executiveSummary}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {playbook.sections.talkingPoints && (
            <Card>
              <Card.Header>
                <Card.Title>💬 Key Talking Points</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {playbook.sections.talkingPoints}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {playbook.sections.riskMitigation && (
            <Card>
              <Card.Header>
                <Card.Title>🛡️ Risk Mitigation</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {playbook.sections.riskMitigation}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {playbook.sections.tactics && (
            <Card>
              <Card.Header>
                <Card.Title>🎮 Negotiation Tactics</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {playbook.sections.tactics}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {playbook.sections.timeline && (
            <Card>
              <Card.Header>
                <Card.Title>⏱️ Timeline & Phases</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {playbook.sections.timeline}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {playbook.sections.successMetrics && (
            <Card>
              <Card.Header>
                <Card.Title>📈 Success Metrics</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {playbook.sections.successMetrics}
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedPlaybookView;