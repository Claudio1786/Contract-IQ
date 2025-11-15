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

export interface PlaybookGeneratorProps {
  onPlaybookGenerated?: (playbook: NegotiationPlaybook) => void;
  className?: string;
}

export const PlaybookGenerator: React.FC<PlaybookGeneratorProps> = ({
  onPlaybookGenerated,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contractType: '',
    scenario: '',
    objectives: [] as string[],
    currentTerms: '',
    desiredOutcome: ''
  });

  const contractTypes = [
    'SaaS Agreement',
    'Service Contract',
    'Equipment Lease',
    'Professional Services',
    'Data Processing Agreement',
    'Master Service Agreement',
    'Statement of Work',
    'Licensing Agreement'
  ];

  // Get available objectives for selected scenario
  const getAvailableObjectives = (): ObjectiveIntelligence[] => {
    if (!formData.scenario) return [];
    
    const intelligence = negotiationIntelligenceDB[formData.scenario as keyof typeof negotiationIntelligenceDB];
    
    if (!intelligence || !intelligence.objectives) {
      console.warn(`No objectives found for scenario: ${formData.scenario}`);
      return [];
    }
    
    return intelligence.objectives || [];
  };

  // Get scenario context for display
  const getScenarioContext = () => {
    const intelligence = negotiationIntelligenceDB[formData.scenario as keyof typeof negotiationIntelligenceDB];
    if (!intelligence) return null;
    
    return {
      trends: intelligence.marketContext.trends,
      successRate: intelligence.marketContext.successRate,
      timing: intelligence.marketContext.timing
    };
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleObjective = (objectiveId: string) => {
    // Clear any errors when user changes objectives
    setError(null);
    
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objectiveId)
        ? prev.objectives.filter(id => id !== objectiveId)
        : [...prev.objectives, objectiveId]
    }));
  };
  
  // Helper to safely set form data with validation
  const safeSetFormData = (newData: Partial<typeof formData>) => {
    setError(null); // Clear any existing errors
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const generatePlaybook = async () => {
    setIsGenerating(true);
    setError(null);
    setRetryCount(0);
    
    const maxRetries = 3;
    const baseDelay = 1000;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        
        // Call the API to generate playbook with Gemini
        const response = await fetch('/api/generate-playbook', {
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
          }),
        });

        if (!response.ok) {
          const isRetryable = [502, 503, 504, 429].includes(response.status);
          
          if (isRetryable && attempt < maxRetries) {
            const delay = baseDelay * Math.pow(2, attempt);
            console.warn(`Retrying playbook generation (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to generate playbook');
        }

        console.log('✅ Playbook generated successfully!');
        console.log('Metadata:', data.metadata);
        
        setIsGenerating(false);
        setError(null);
        setRetryCount(0);
        onPlaybookGenerated?.(data.playbook);
        return;
        
      } catch (error: any) {
        console.error(`❌ Error generating playbook (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
        
        // If we've exhausted retries, show error with support info
        if (attempt >= maxRetries) {
          setIsGenerating(false);
          setError(error.message || 'Failed to generate playbook');
          return;
        }
        
        // Otherwise, retry with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const isFormValid = formData.contractType && formData.scenario && formData.objectives.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Generate Negotiation Playbook
        </h2>
        
        <div className="space-y-4">
          {/* Contract Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Type *
            </label>
            <select
              value={formData.contractType}
              onChange={(e) => handleInputChange('contractType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              <option value="">Select contract type...</option>
              {contractTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Scenario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Negotiation Scenario *
            </label>
            <select
              value={formData.scenario}
              onChange={(e) => handleInputChange('scenario', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              <option value="">Select scenario...</option>
              {enhancedScenarios.map(scenario => (
                <option key={scenario.id} value={scenario.id}>{scenario.label}</option>
              ))}
            </select>
            {getScenarioContext() && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-800 leading-relaxed mb-2">
                  <strong>📊 Market Context:</strong> {getScenarioContext()?.successRate}
                </div>
                <div className="text-sm text-blue-600 leading-relaxed">
                  {getScenarioContext()?.timing}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Objectives */}
          {formData.scenario && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Objectives * <span className="text-xs text-gray-500">(Select multiple)</span>
              </label>
              <div className="space-y-4 max-h-80 overflow-y-auto border border-gray-200 rounded-md p-4">
                {getAvailableObjectives().length > 0 ? (
                  getAvailableObjectives().map((objective) => (
                    <div key={objective.id} className="flex items-start space-x-3 py-2">
                      <input
                        type="checkbox"
                        id={objective.id}
                        checked={formData.objectives.includes(objective.id)}
                        onChange={() => toggleObjective(objective.id)}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <label 
                          htmlFor={objective.id}
                          className="text-sm font-medium text-gray-900 cursor-pointer block mb-2"
                        >
                          {objective.title}
                        </label>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                          {objective.description}
                        </p>
                        <div className="text-xs text-blue-600 leading-relaxed">
                          💪 Success Rate: {objective.successRate}
                        </div>
                        <div className="text-xs text-blue-600 mt-1 leading-relaxed">
                          📊 {objective.benchmark}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No objectives available for this scenario.</p>
                    <p className="text-xs mt-2">Please select a different scenario or use the custom objective option below.</p>
                  </div>
                )}
                
                {/* Custom objective option */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start space-x-3 py-2">
                    <input
                      type="checkbox"
                      id="custom_objective"
                      checked={formData.objectives.includes('custom')}
                      onChange={() => toggleObjective('custom')}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor="custom_objective" className="text-sm font-medium text-gray-900 cursor-pointer block mb-2">
                        ✏️ Custom Objective (specify below)
                      </label>
                      {formData.objectives.includes('custom') && (
                        <textarea
                          placeholder="Describe your custom negotiation objective..."
                          className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          rows={3}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {formData.objectives.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {formData.objectives.length} objective{formData.objectives.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}

          {/* Current Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Terms (Optional)
            </label>
            <Input
              value={formData.currentTerms}
              onChange={(e) => handleInputChange('currentTerms', e.target.value)}
              placeholder="Brief description of existing contract terms"
            />
          </div>

          {/* Desired Outcome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Outcome (Optional)
            </label>
            <Input
              value={formData.desiredOutcome}
              onChange={(e) => handleInputChange('desiredOutcome', e.target.value)}
              placeholder="What does success look like?"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={generatePlaybook}
            disabled={!isFormValid || isGenerating}
            loading={isGenerating}
            className="w-full focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            size="lg"
            aria-busy={isGenerating}
            aria-live="polite"
          >
            {isGenerating ? 'Generating Playbook...' : 'Generate Negotiation Strategy'}
          </Button>
          
          {/* Retry Status Indicator */}
          {isGenerating && retryCount > 0 && (
            <div 
              className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center space-x-2 text-sm text-amber-800">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Retrying... (Attempt {retryCount + 1} of 3)</span>
              </div>
            </div>
          )}
          
          {/* Error with Support Contact */}
          {error && (
            <div 
              className="mt-3 p-4 bg-rose-50 border border-rose-200 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-rose-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-rose-800 mb-1">
                    Failed to generate playbook
                  </h4>
                  <p className="text-sm text-rose-700 mb-3">
                    {error}
                  </p>
                  <div className="bg-white border border-rose-200 rounded-md p-3">
                    <p className="text-sm font-medium text-gray-900 mb-2">Need help?</p>
                    <p className="text-xs text-gray-600 mb-2">
                      Our support team is here to assist you with API connectivity issues.
                    </p>
                    <a 
                      href="mailto:support@contractiq.ai?subject=Playbook Generation Error"
                      className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Contact Support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isFormValid && !error && (
          <p className="mt-2 text-sm text-gray-500">
            * Contract type, scenario, and objectives are required
          </p>
        )}
      </Card>

      {/* Quick Templates */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">📚 Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setFormData({
                contractType: 'SaaS Agreement',
                scenario: 'saas_renewal_price_increase',
                objectives: ['cap_increase', 'right_size', 'multi_year_protection'],
                currentTerms: '$50K annual, 10% increase proposed, 99.5% uptime SLA',
                desiredOutcome: 'Cap increase at 5%, multi-year price protection'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">🔄 SaaS Renewal</div>
            <div className="text-xs text-gray-600">Price increase mitigation</div>
          </button>
          
          <button
            onClick={() => {
              setFormData({
                contractType: 'Service Contract',
                scenario: 'sla_enhancement',
                objectives: ['uptime_guarantee', 'response_times', 'financial_penalties'],
                currentTerms: '99% uptime, 4hr P1 response, no service credits',
                desiredOutcome: '99.9% uptime with financial accountability'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">⚡ SLA Enhancement</div>
            <div className="text-xs text-gray-600">Service level improvements</div>
          </button>
          
          <button
            onClick={() => {
              setFormData({
                contractType: 'Data Processing Agreement',
                scenario: 'gdpr_dpa_compliance',
                objectives: ['article_28_compliance', 'breach_notification', 'data_residency'],
                currentTerms: 'Basic DPA, unclear breach procedures',
                desiredOutcome: 'Full GDPR Article 28 compliance, 24hr notification'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">🔒 GDPR DPA</div>
            <div className="text-xs text-gray-600">Data protection compliance</div>
          </button>

          <button
            onClick={() => {
              setFormData({
                contractType: 'Service Agreement',
                scenario: 'liability_cap_negotiation',
                objectives: ['reasonable_liability_cap', 'carve_out_exceptions'],
                currentTerms: 'Unlimited liability, one-sided indemnification',
                desiredOutcome: '12 months fee cap, mutual liability protection'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">🛡️ Liability Caps</div>
            <div className="text-xs text-gray-600">Risk limitation & protection</div>
          </button>

          <button
            onClick={() => {
              setFormData({
                contractType: 'Service Agreement',
                scenario: 'termination_exit_rights',
                objectives: ['termination_for_convenience', 'data_portability_rights'],
                currentTerms: 'Locked 3-year term, no convenience termination',
                desiredOutcome: '90-day convenience termination, full data portability'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">🚪 Exit Rights</div>
            <div className="text-xs text-gray-600">Termination flexibility</div>
          </button>

          <button
            onClick={() => {
              setFormData({
                contractType: 'Service Agreement',
                scenario: 'payment_terms_optimization',
                objectives: ['extend_payment_terms', 'early_payment_discounts'],
                currentTerms: '30-day payment terms, no early discounts',
                desiredOutcome: '60-day payment terms, 2% early payment discount'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">🏦 Payment Terms</div>
            <div className="text-xs text-gray-600">Cash flow optimization</div>
          </button>

          <button
            onClick={() => {
              setFormData({
                contractType: 'Service Agreement',
                scenario: 'ip_rights_protection',
                objectives: ['retain_ip_ownership', 'work_product_ownership'],
                currentTerms: 'Unclear IP ownership, vendor-friendly terms',
                desiredOutcome: 'Full IP retention, clear work-for-hire terms'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">🏛️ IP Rights</div>
            <div className="text-xs text-gray-600">Intellectual property protection</div>
          </button>

          <button
            onClick={() => {
              setFormData({
                contractType: 'Purchase Agreement',
                scenario: 'volume_discount_optimization',
                objectives: ['tiered_volume_discounts', 'multi_year_volume_protection'],
                currentTerms: 'Flat pricing, no volume incentives',
                desiredOutcome: '15% discount at 3x volume, 3-year price protection'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">📈 Volume Discounts</div>
            <div className="text-xs text-gray-600">Scale-based pricing</div>
          </button>


        </div>
      </Card>
    </div>
  );
};