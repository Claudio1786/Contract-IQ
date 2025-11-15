'use client';

import React, { useState } from 'react';
import { Button, Card, Input } from '../ui';
import { 
  enhancedScenarios, 
  negotiationIntelligenceDB, 
  buildEnhancedPrompt,
  type ObjectiveIntelligence 
} from '../../lib/negotiation-intelligence';

export interface NegotiationPlaybook {
  id: string;
  title: string;
  contractType: string;
  scenario: string;
  objectives: string[];
  talkingPoints: Array<{
    topic: string;
    position: string;
    rationale: string;
    fallback?: string;
  }>;
  riskMitigation: Array<{
    risk: string;
    mitigation: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  tactics: Array<{
    tactic: string;
    description: string;
    whenToUse: string;
  }>;
  timeline: Array<{
    phase: string;
    duration: string;
    activities: string[];
  }>;
  successMetrics: string[];
  createdAt: Date;
}

export interface EnhancedPlaybookGeneratorProps {
  onPlaybookGenerated?: (playbook: NegotiationPlaybook, metadata?: any) => void;
  className?: string;
}

export const EnhancedPlaybookGenerator: React.FC<EnhancedPlaybookGeneratorProps> = ({
  onPlaybookGenerated,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [useMultiLLM, setUseMultiLLM] = useState(true);
  const [formData, setFormData] = useState({
    contractType: '',
    scenario: '',
    objectives: [] as string[],
    currentTerms: '',
    desiredOutcome: '',
    modelPreference: 'auto-select' as 'auto-select' | 'openai' | 'gemini' | 'cross-validate'
  });

  const contractTypes = [
    'SaaS Agreement',
    'Service Contract',
    'Equipment Lease',
    'Professional Services',
    'Data Processing Agreement',
    'Software License',
    'Consulting Agreement',
    'Master Service Agreement'
  ];

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleObjective = (objectiveId: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objectiveId)
        ? prev.objectives.filter(id => id !== objectiveId)
        : [...prev.objectives, objectiveId]
    }));
  };

  const generatePlaybook = async () => {
    setIsGenerating(true);
    
    try {
      // Choose API endpoint based on multi-LLM preference
      const apiEndpoint = useMultiLLM ? '/api/generate-playbook-multi-llm' : '/api/generate-playbook';
      
      console.log(`🤖 Using ${useMultiLLM ? 'Multi-LLM' : 'Gemini-only'} approach...`);
      console.log('Model Preference:', formData.modelPreference);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractType: formData.contractType,
          scenario: formData.scenario,
          objectives: formData.objectives,
          currentTerms: formData.currentTerms,
          desiredOutcome: formData.desiredOutcome,
          modelPreference: formData.modelPreference,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate playbook');
      }

      console.log('✅ Enhanced playbook generated successfully!');
      console.log('Metadata:', data.metadata);
      
      if (data.metadata?.crossValidation) {
        console.log('🔍 Cross-validation results:', data.metadata.crossValidation);
      }
      
      setIsGenerating(false);
      onPlaybookGenerated?.(data.playbook, data.metadata);
      
    } catch (error: any) {
      console.error('❌ Error generating enhanced playbook:', error);
      setIsGenerating(false);
      
      alert(`Failed to generate playbook: ${error.message}`);
    }
  };

  const isFormValid = formData.contractType && formData.scenario && formData.objectives.length > 0;

  // Get available objectives for the selected scenario
  const getAvailableObjectives = (): ObjectiveIntelligence[] => {
    if (!formData.scenario) return [];
    
    const scenarioData = negotiationIntelligenceDB[formData.scenario as keyof typeof negotiationIntelligenceDB];
    return scenarioData?.objectiveIntelligence || [];
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Enhanced Header with Multi-LLM Toggle */}
      <div className="text-center space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Playbook Generator</h1>
          
          {/* Multi-LLM Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Multi-LLM Mode</span>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                useMultiLLM ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={useMultiLLM}
              onClick={() => setUseMultiLLM(!useMultiLLM)}
            >
              <span className="sr-only">Use Multi-LLM approach</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  useMultiLLM ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          {useMultiLLM 
            ? 'Generate advanced negotiation playbooks using both Google Gemini and OpenAI models for optimal results' 
            : 'Generate negotiation playbooks using Google Gemini AI'
          }
        </p>
        
        {useMultiLLM && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Multi-LLM Benefits:</span> Cross-validation, model-specific optimization, and enhanced accuracy
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Form Column */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Contract Details</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-6">
              {/* Contract Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Type *
                </label>
                <select
                  value={formData.contractType}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select contract type...</option>
                  {contractTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Scenario Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Negotiation Scenario *
                </label>
                <select
                  value={formData.scenario}
                  onChange={(e) => handleInputChange('scenario', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select scenario...</option>
                  {Object.entries(enhancedScenarios).map(([key, scenario]) => (
                    <option key={key} value={key}>
                      {scenario.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Preference (Multi-LLM mode only) */}
              {useMultiLLM && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model Preference
                  </label>
                  <select
                    value={formData.modelPreference}
                    onChange={(e) => handleInputChange('modelPreference', e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="auto-select">Auto-Select (Recommended)</option>
                    <option value="openai">Prefer OpenAI (Creative reasoning)</option>
                    <option value="gemini">Prefer Gemini (Structured analysis)</option>
                    <option value="cross-validate">Cross-Validate (Highest accuracy)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-select chooses the optimal model based on scenario type
                  </p>
                </div>
              )}

              {/* Current Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Contract Terms
                </label>
                <textarea
                  value={formData.currentTerms}
                  onChange={(e) => handleInputChange('currentTerms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the current terms you're working with..."
                />
              </div>

              {/* Desired Outcome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Outcome
                </label>
                <textarea
                  value={formData.desiredOutcome}
                  onChange={(e) => handleInputChange('desiredOutcome', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="What specific outcomes are you trying to achieve?"
                />
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Objectives Column */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Negotiation Objectives *</Card.Title>
              <p className="text-sm text-gray-600">
                Select your primary negotiation objectives. Intelligence-driven recommendations will be included.
              </p>
            </Card.Header>
            <Card.Content>
              {formData.scenario ? (
                <div className="space-y-3">
                  {getAvailableObjectives().map((objective) => (
                    <label
                      key={objective.id}
                      className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.objectives.includes(objective.id)}
                        onChange={() => toggleObjective(objective.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{objective.title}</div>
                        <div className="text-sm text-gray-600">{objective.description}</div>
                        {objective.marketIntelligence && (
                          <div className="text-xs text-blue-600 mt-1">
                            💡 {objective.marketIntelligence.slice(0, 100)}...
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Please select a scenario to see available objectives
                </p>
              )}
            </Card.Content>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={generatePlaybook}
            disabled={!isFormValid || isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>
                  {useMultiLLM ? 'Generating with Multi-LLM...' : 'Generating with Gemini...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>
                  Generate {useMultiLLM ? 'Enhanced' : 'Standard'} Playbook
                </span>
              </div>
            )}
          </Button>

          {formData.objectives.length > 0 && (
            <div className="text-sm text-green-600 text-center">
              ✓ {formData.objectives.length} objective{formData.objectives.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </div>

      {/* Feature Comparison */}
      {useMultiLLM && (
        <Card>
          <Card.Header>
            <Card.Title>Multi-LLM Advantages</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-medium text-gray-900 mb-2">Optimal Model Selection</h3>
                <p className="text-sm text-gray-600">
                  Automatically chooses the best AI model for each scenario type
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-medium text-gray-900 mb-2">Cross-Validation</h3>
                <p className="text-sm text-gray-600">
                  Validates results across multiple models for higher accuracy
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-medium text-gray-900 mb-2">Cost Transparency</h3>
                <p className="text-sm text-gray-600">
                  Real-time cost tracking and optimization recommendations
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPlaybookGenerator;