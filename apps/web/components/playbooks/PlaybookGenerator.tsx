'use client';

import React, { useState } from 'react';
import { Button, Card, Input } from '../ui';

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
  const [formData, setFormData] = useState({
    contractType: '',
    scenario: '',
    objectives: '',
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

  const commonScenarios = [
    'Renewal negotiation with price increase',
    'Adding new services to existing contract',
    'Reducing liability exposure',
    'Improving service level agreements',
    'Negotiating better payment terms',
    'Adding termination flexibility',
    'Data protection compliance updates',
    'Multi-year commitment discussions'
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePlaybook = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate playbook
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPlaybook: NegotiationPlaybook = {
      id: `playbook_${Date.now()}`,
      title: `${formData.contractType} Negotiation Strategy`,
      contractType: formData.contractType,
      scenario: formData.scenario,
      objectives: formData.objectives.split('\n').filter(obj => obj.trim()),
      talkingPoints: [
        {
          topic: 'Pricing Structure',
          position: 'Request volume-based discounts for multi-year commitment',
          rationale: 'Long-term partnership reduces vendor acquisition costs',
          fallback: 'Accept current pricing with annual escalation cap at 3%'
        },
        {
          topic: 'Service Level Agreement',
          position: 'Demand 99.9% uptime with service credits',
          rationale: 'Business criticality requires high availability',
          fallback: '99.5% uptime with proportional credits'
        },
        {
          topic: 'Data Protection',
          position: 'Full GDPR compliance with breach notification within 24h',
          rationale: 'Regulatory requirements and reputational risk',
        },
        {
          topic: 'Termination Rights',
          position: '30-day termination for convenience with data return',
          rationale: 'Business flexibility and exit strategy protection',
          fallback: '60-day notice with structured wind-down'
        }
      ],
      riskMitigation: [
        {
          risk: 'Vendor lock-in through proprietary data formats',
          mitigation: 'Negotiate standard export formats and API access',
          priority: 'high'
        },
        {
          risk: 'Unlimited liability exposure',
          mitigation: 'Cap liability at 12 months of fees paid',
          priority: 'high'
        },
        {
          risk: 'Automatic renewal with price increases',
          mitigation: 'Require explicit approval for renewals over 5% increase',
          priority: 'medium'
        }
      ],
      tactics: [
        {
          tactic: 'Competitive Leverage',
          description: 'Reference alternative solutions and pricing',
          whenToUse: 'When discussing pricing or terms that seem non-negotiable'
        },
        {
          tactic: 'Value Demonstration',
          description: 'Quantify business impact and ROI of partnership',
          whenToUse: 'To justify requests for better terms or pricing'
        },
        {
          tactic: 'Phased Implementation',
          description: 'Propose trial periods or gradual rollouts',
          whenToUse: 'When vendor is hesitant about concessions'
        }
      ],
      timeline: [
        {
          phase: 'Preparation',
          duration: '1-2 weeks',
          activities: [
            'Gather usage data and performance metrics',
            'Research competitive alternatives',
            'Define negotiation objectives and priorities',
            'Assemble negotiation team'
          ]
        },
        {
          phase: 'Initial Discussions',
          duration: '2-3 weeks',
          activities: [
            'Present renewal requirements',
            'Exchange initial proposals',
            'Identify key negotiation points',
            'Schedule follow-up meetings'
          ]
        },
        {
          phase: 'Active Negotiation',
          duration: '3-4 weeks',
          activities: [
            'Negotiate pricing and terms',
            'Address legal and compliance requirements',
            'Finalize service level agreements',
            'Document agreed changes'
          ]
        },
        {
          phase: 'Finalization',
          duration: '1-2 weeks',
          activities: [
            'Legal review of final terms',
            'Executive approvals',
            'Contract execution',
            'Implementation planning'
          ]
        }
      ],
      successMetrics: [
        'Achieve target pricing within 5% of budget',
        'Secure improved SLAs with financial penalties',
        'Maintain or improve contract flexibility',
        'Complete negotiation within 8-week timeline',
        'Establish framework for future negotiations'
      ],
      createdAt: new Date()
    };
    
    setIsGenerating(false);
    onPlaybookGenerated?.(mockPlaybook);
  };

  const isFormValid = formData.contractType && formData.scenario && formData.objectives;

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
              {commonScenarios.map(scenario => (
                <option key={scenario} value={scenario}>{scenario}</option>
              ))}
            </select>
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Objectives *
            </label>
            <textarea
              value={formData.objectives}
              onChange={(e) => handleInputChange('objectives', e.target.value)}
              placeholder="Enter your negotiation objectives (one per line)&#10;Example:&#10;- Reduce costs by 15%&#10;- Improve service levels&#10;- Add termination flexibility"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 h-24 resize-none"
            />
          </div>

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
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generating Playbook...' : 'Generate Negotiation Strategy'}
          </Button>
        </div>

        {!isFormValid && (
          <p className="mt-2 text-sm text-gray-500">
            * Contract type, scenario, and objectives are required
          </p>
        )}
      </Card>

      {/* Quick Templates */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">📚 Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              setFormData({
                contractType: 'SaaS Agreement',
                scenario: 'Renewal negotiation with price increase',
                objectives: '- Minimize price increase to 5% or less\n- Extend contract term for better rates\n- Improve support SLAs',
                currentTerms: '$50K annual, 99.5% uptime SLA',
                desiredOutcome: 'Multi-year deal with capped increases'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">SaaS Renewal</div>
            <div className="text-xs text-gray-600">Price increase mitigation</div>
          </button>
          
          <button
            onClick={() => {
              setFormData({
                contractType: 'Service Contract',
                scenario: 'Improving service level agreements',
                objectives: '- Increase uptime guarantee to 99.9%\n- Add financial penalties for SLA breaches\n- Improve response times',
                currentTerms: 'Basic SLAs with no penalties',
                desiredOutcome: 'Guaranteed service levels with accountability'
              });
            }}
            className="text-left p-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">SLA Enhancement</div>
            <div className="text-xs text-gray-600">Service level improvements</div>
          </button>
        </div>
      </Card>
    </div>
  );
};