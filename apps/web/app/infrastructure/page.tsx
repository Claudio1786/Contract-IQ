'use client';

import { useState } from 'react';
import { Card } from '../../components/ui';

export default function InfrastructurePage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'agent-orchestrator',
      title: '🤖 Agent Orchestrator',
      category: 'AI Processing',
      description: 'Coordinates 6 specialized AI agents for comprehensive contract analysis',
      status: 'Built - Ready for Integration',
      capabilities: [
        'Clause extraction and categorization',
        'Risk scoring and assessment', 
        'Market benchmarking against industry standards',
        'Negotiation strategy development',
        'Contract simulation and scenario planning',
        'Executive reporting and insights'
      ],
      techDetails: 'Built on Railway-optimized architecture with dependency management and confidence scoring',
      codeLocation: 'apps/web/lib/agents/agent-orchestrator.ts'
    },
    {
      id: 'multi-llm',
      title: '🧠 Multi-LLM Intelligence',
      category: 'AI Processing',
      description: 'Advanced multi-model AI system using OpenAI + Gemini for optimal results',
      status: 'Built - Ready for Integration',
      capabilities: [
        'Strategic model routing based on task type',
        'Cross-validation between AI models',
        'Cost tracking and optimization',
        'Confidence scoring for recommendations',
        'Unified API interface for multiple providers'
      ],
      techDetails: 'Intelligent orchestration with fallback strategies and cost optimization',
      codeLocation: 'apps/web/lib/agents/multi-llm-orchestrator.ts'
    },
    {
      id: 'database-infrastructure',
      title: '🗄️ PostgreSQL Foundation',
      category: 'Data Infrastructure',
      description: 'Complete enterprise database schema with vector search and full-text indexing',
      status: 'Built - Ready for Deployment',
      capabilities: [
        'Organizations and user management',
        'Contract storage with full metadata',
        'Clause extraction and categorization',
        'Risk assessments and benchmarks',
        'Negotiation strategies and outcomes',
        'Agent processing job tracking',
        'Market intelligence database'
      ],
      techDetails: 'PostgreSQL with pgvector extension, full-text search, audit trails, and performance indexes',
      codeLocation: 'apps/web/lib/database/schema.sql'
    },
    {
      id: 'vector-search',
      title: '🔍 Vector Search Engine',
      category: 'Data Intelligence',
      description: 'Semantic search across contracts and clauses using Google embeddings',
      status: 'Built - Ready for Integration',
      capabilities: [
        'Semantic contract similarity search',
        'Intelligent clause matching',
        'Market benchmark analysis',
        'Contract clustering and categorization',
        'Risk pattern recognition'
      ],
      techDetails: 'Google text-embedding-004 with PostgreSQL vector storage and similarity algorithms',
      codeLocation: 'apps/web/lib/database/vector-search.ts'
    },
    {
      id: 'audit-trail',
      title: '📋 Audit Trail System',
      category: 'Enterprise Governance',
      description: 'Complete audit logging for SOX, GDPR, and SOC2 compliance',
      status: 'Built - Ready for Integration',
      capabilities: [
        '25+ audit event types tracked',
        'SOX/GDPR/SOC2 compliance features',
        '7-year retention policies',
        'Event integrity hashing',
        'Comprehensive query engine',
        'Real-time compliance monitoring'
      ],
      techDetails: 'Immutable event logging with cryptographic integrity and compliance reporting',
      codeLocation: 'apps/web/lib/governance/audit-trail.ts'
    },
    {
      id: 'board-reporting',
      title: '📊 Executive Reporting',
      category: 'Enterprise Governance',
      description: 'Automated board-level reporting with risk heat maps and compliance tracking',
      status: 'Built - Ready for Integration',
      capabilities: [
        '8 executive report types',
        'Risk heat map generation',
        'Compliance status tracking',
        'Contract portfolio analytics',
        'Negotiation outcome analysis',
        'PDF generation and distribution'
      ],
      techDetails: 'Automated report generation with executive dashboards and compliance tracking',
      codeLocation: 'apps/web/lib/governance/board-reporting.ts'
    },
    {
      id: 'clm-integration',
      title: '🔌 CLM Integration Hub',
      category: 'Enterprise Integration',
      description: 'Integration framework for 10+ major Contract Lifecycle Management systems',
      status: 'Built - Ready for Integration',
      capabilities: [
        'Salesforce Contract Management',
        'DocuSign CLM integration',
        'ContractWorks connector',
        'Icertis platform sync',
        'Ironclad automation',
        'Bidirectional data sync',
        'Webhook processing',
        'Encrypted credential management'
      ],
      techDetails: 'Universal adapter pattern with encrypted credentials and audit logging',
      codeLocation: 'apps/web/lib/governance/clm-integration.ts'
    },
    {
      id: 'ingestion-pipeline',
      title: '📥 Contract Ingestion Pipeline',
      category: 'Data Processing',
      description: 'Multi-source contract ingestion with validation and processing',
      status: 'Built - Ready for Integration',
      capabilities: [
        'File upload processing (PDF, Word, text)',
        'Email integration and parsing',
        'CLM system data import',
        'Bulk contract import tools',
        'Document validation framework',
        'Automated content extraction'
      ],
      techDetails: 'Scalable ingestion pipeline with validation, transformation, and PostgreSQL storage',
      codeLocation: 'apps/web/lib/ingestion/contract-ingestion-pipeline.ts'
    },
    {
      id: 'negotiation-intelligence',
      title: '🎯 Market Intelligence Database',
      category: 'Strategic Intelligence',
      description: 'Comprehensive negotiation intelligence with 8 scenarios and 45+ research sources',
      status: 'Active - Powering Current Playbooks',
      capabilities: [
        'SaaS renewal strategies with market benchmarks',
        'GDPR compliance frameworks',
        'Payment terms optimization',
        'IP rights protection guidance',
        'Exit rights and termination clauses',
        'Liability cap negotiations',
        'Volume discount strategies'
      ],
      techDetails: 'Research-backed negotiation database with market intelligence and tactical scripts',
      codeLocation: 'apps/web/lib/negotiation-intelligence.ts'
    },
    {
      id: 'specialized-agents',
      title: '🔬 Specialized AI Agents',
      category: 'AI Processing',
      description: '6 domain-specific AI agents with advanced processing capabilities',
      status: 'Built - Ready for Integration',
      capabilities: [
        'Contract clause extraction agent',
        'Risk scoring and assessment agent',
        'Market benchmarking agent',
        'Negotiation strategy agent',
        'Contract simulation agent',
        'Executive reporting agent'
      ],
      techDetails: 'Specialized agents with Google Gemini integration and structured JSON processing',
      codeLocation: 'apps/web/lib/agents/specialized-agents.ts'
    },
    {
      id: 'contract-schema',
      title: '📋 Contract Data Schema',
      category: 'Data Infrastructure', 
      description: 'Standardized contract data model with 20+ fields for comprehensive analysis',
      status: 'Built - Ready for Integration',
      capabilities: [
        'Financial terms standardization',
        'Service level agreements structure',
        'Legal terms classification',
        'Termination clause analysis',
        'Data processing requirements',
        'Technical specifications tracking'
      ],
      techDetails: 'TypeScript interfaces with validation and AI analysis capabilities',
      codeLocation: 'apps/web/lib/contract-data-schema.ts'
    },
    {
      id: 'pilot-framework',
      title: '🚀 Pilot Program Framework',
      category: 'Business Operations',
      description: 'Complete customer pilot program management with ROI tracking',
      status: 'Built - Ready for Deployment',
      capabilities: [
        'Customer qualification scoring',
        '30/60/90-day pilot templates', 
        'ROI calculation framework',
        'Communication templates',
        'Success metrics tracking',
        'Sales process integration'
      ],
      techDetails: 'Structured pilot program with automated tracking and ROI measurement',
      codeLocation: 'apps/web/lib/pilot-program-framework.ts'
    }
  ];

  const categories = ['All', 'AI Processing', 'Data Infrastructure', 'Enterprise Governance', 'Enterprise Integration', 'Data Processing', 'Strategic Intelligence', 'Data Intelligence', 'Business Operations'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFeatures = selectedCategory === 'All' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const getStatusColor = (status: string) => {
    if (status.includes('Active')) return 'bg-green-100 text-green-800 border-green-200';
    if (status.includes('Ready')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏗️ Contract IQ Infrastructure Tour
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Comprehensive enterprise-grade infrastructure powering intelligent contract negotiation
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 From AI Wrapper to Enterprise Platform
            </h2>
            <p className="text-blue-700 text-sm">
              Contract IQ has evolved from a simple AI wrapper into a comprehensive enterprise infrastructure platform. 
              Below you'll find <strong>12 major infrastructure components</strong> built for scale, compliance, and integration.
              While the UI currently shows basic functionality, the underlying architecture is designed for enterprise deployment.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category} {category === 'All' ? `(${features.length})` : `(${features.filter(f => f.category === category).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredFeatures.map(feature => (
            <Card key={feature.id} className="cursor-pointer transition-all hover:shadow-lg">
              <Card.Header>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}>
                    {feature.status.split(' - ')[0]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{feature.category}</p>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </Card.Header>
              
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Capabilities:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {feature.capabilities.slice(0, 3).map((cap, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="text-green-500">•</span>
                          <span>{cap}</span>
                        </li>
                      ))}
                      {feature.capabilities.length > 3 && (
                        <li className="text-blue-600 text-xs">
                          +{feature.capabilities.length - 3} more capabilities...
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => setSelectedFeature(feature.id)}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    View Technical Details →
                  </button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>

        {/* Technical Details Modal */}
        {selectedFeature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              {(() => {
                const feature = features.find(f => f.id === selectedFeature);
                if (!feature) return null;
                
                return (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
                        <p className="text-gray-600">{feature.category}</p>
                      </div>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-700 mb-4">{feature.description}</p>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(feature.status)}`}>
                          {feature.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Implementation</h3>
                        <p className="text-gray-700 mb-4">{feature.techDetails}</p>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Code Location</h3>
                        <code className="bg-gray-100 text-gray-800 text-sm p-2 rounded block">
                          {feature.codeLocation}
                        </code>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Complete Capabilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feature.capabilities.map((cap, idx) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-800">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Integration Status</h4>
                      <p className="text-sm text-blue-700">
                        This component is fully built and tested. To activate it in the UI, additional frontend integration work is required.
                        The backend infrastructure is production-ready and can be deployed immediately.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Architecture Overview */}
        <div className="mt-16">
          <Card>
            <Card.Header>
              <Card.Title className="text-2xl">🏗️ System Architecture Overview</Card.Title>
              <p className="text-gray-600">
                Contract IQ's enterprise architecture spans multiple layers from data ingestion to executive reporting
              </p>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-900">Data Layer</h3>
                    <div className="text-sm text-blue-700 mt-2 space-y-1">
                      <div>• PostgreSQL + pgvector</div>
                      <div>• Vector Search</div>
                      <div>• Contract Schema</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-green-900">Processing Layer</h3>
                    <div className="text-sm text-green-700 mt-2 space-y-1">
                      <div>• AI Agent Orchestrator</div>
                      <div>• Multi-LLM System</div>
                      <div>• Ingestion Pipeline</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-purple-900">Intelligence Layer</h3>
                    <div className="text-sm text-purple-700 mt-2 space-y-1">
                      <div>• Market Intelligence</div>
                      <div>• Specialized Agents</div>
                      <div>• Strategic Analysis</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-orange-900">Governance Layer</h3>
                    <div className="text-sm text-orange-700 mt-2 space-y-1">
                      <div>• Audit Trails</div>
                      <div>• Board Reporting</div>
                      <div>• CLM Integration</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">
            🚀 Ready for Enterprise Deployment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">Backend Infrastructure</h3>
              <p className="text-indigo-700 text-sm">
                All 12 infrastructure components are built, tested, and ready for production deployment.
                Database schemas, AI processing, and governance systems are enterprise-ready.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">Integration Work</h3>
              <p className="text-indigo-700 text-sm">
                Frontend integration to connect UI components to backend infrastructure.
                API endpoints exist but need UI binding for full feature activation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">Deployment Strategy</h3>
              <p className="text-indigo-700 text-sm">
                Phased rollout starting with core negotiation intelligence (active), 
                then agent orchestration, followed by full enterprise governance features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}