// Specialized Agent Implementations
// Individual agents for contract processing pipeline

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { 
  IAgent, 
  AgentType, 
  AgentPriority, 
  AgentInput, 
  AgentOutput, 
  AGENT_MODEL_CONFIG,
  ExtractedClause,
  RiskAssessment,
  BenchmarkData,
  ClauseType,
  RiskScore,
  Source
} from './agent-orchestrator';

// Base Agent Class
abstract class BaseAgent implements IAgent {
  abstract id: string;
  abstract type: AgentType;
  abstract name: string;
  abstract description: string;
  abstract dependencies: AgentType[];
  
  model: string;
  priority: AgentPriority = 'medium';
  maxRetries: number = 3;
  timeoutMs: number = 30000;
  
  protected genAI: GoogleGenerativeAI;
  protected generativeModel: GenerativeModel;
  
  constructor(genAI: GoogleGenerativeAI, type: AgentType) {
    this.genAI = genAI;
    this.model = AGENT_MODEL_CONFIG[type].model;
    this.generativeModel = genAI.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: AGENT_MODEL_CONFIG[type].temperature,
        topP: AGENT_MODEL_CONFIG[type].topP,
        maxOutputTokens: AGENT_MODEL_CONFIG[type].maxOutputTokens,
      },
      systemInstruction: AGENT_MODEL_CONFIG[type].systemInstruction,
    });
  }
  
  abstract process(input: AgentInput): Promise<AgentOutput>;
  
  async validate(output: AgentOutput): Promise<boolean> {
    // Base validation - can be overridden by specific agents
    return output.confidence > 0.3 && output.result !== null;
  }
  
  getConfidenceScore(output: AgentOutput): number {
    return output.confidence;
  }
  
  protected createSources(references: string[], type: 'clause' | 'benchmark' | 'knowledge_base' | 'model' = 'model'): Source[] {
    return references.map((ref, index) => ({
      type,
      reference: ref,
      confidence: 0.8 + (index * 0.05), // Decreasing confidence for later sources
      relevance: 0.9 - (index * 0.1),
    }));
  }
}

// 1. Clause Extraction Agent
export class ClauseExtractionAgent extends BaseAgent {
  id = 'clause_extraction_agent_v1';
  type: AgentType = 'clause_extraction';
  name = 'Contract Clause Extraction Agent';
  description = 'Extracts and classifies contract clauses with high precision';
  dependencies: AgentType[] = [];
  
  constructor(genAI: GoogleGenerativeAI) {
    super(genAI, 'clause_extraction');
  }
  
  async process(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    
    try {
      const extractionPrompt = this.buildExtractionPrompt(input);
      const result = await this.generativeModel.generateContent(extractionPrompt);
      const responseText = result.response.text();
      
      // Parse structured JSON response
      const extractedData = JSON.parse(responseText);
      const extractedClauses = this.normalizeExtractionResults(extractedData);
      
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: extractedClauses,
        confidence: this.calculateExtractionConfidence(extractedClauses),
        sources: this.createSources(['contract_text'], 'clause'),
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
      
    } catch (error) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: [],
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: [error instanceof Error ? error.message : 'Unknown extraction error'],
      };
    }
  }
  
  private buildExtractionPrompt(input: AgentInput): string {
    const clauseTypes: ClauseType[] = [
      'liability_cap',
      'indemnity', 
      'data_processing',
      'sla',
      'termination',
      'payment_terms',
      'ip_rights',
      'governing_law',
      'audit_rights',
      'volume_discounts'
    ];
    
    return `
Analyze this contract and extract all clauses. Return ONLY valid JSON in this exact format:

{
  "clauses": [
    {
      "id": "unique_id",
      "type": "clause_type",
      "text": "exact clause text from contract",
      "normalizedTerms": {
        "key": "value pairs of important terms"
      },
      "confidence": 0.95,
      "sources": [
        {
          "start": 1234,
          "end": 1567,
          "text": "relevant text span",
          "page": 1
        }
      ]
    }
  ]
}

Clause types to identify: ${clauseTypes.join(', ')}

Contract text:
${input.contractText}

For each clause:
1. Extract exact text from contract
2. Normalize key terms (amounts, dates, percentages, etc.)
3. Provide confidence score (0-1)
4. Mark text spans with start/end positions

Return structured JSON only. No explanatory text.`;
  }
  
  private normalizeExtractionResults(data: any): ExtractedClause[] {
    if (!data.clauses || !Array.isArray(data.clauses)) {
      return [];
    }
    
    return data.clauses.map((clause: any, index: number) => ({
      id: clause.id || `clause_${index}_${Date.now()}`,
      type: clause.type as ClauseType,
      text: clause.text || '',
      normalizedTerms: clause.normalizedTerms || {},
      confidence: clause.confidence || 0.7,
      sources: clause.sources || [],
    }));
  }
  
  private calculateExtractionConfidence(clauses: ExtractedClause[]): number {
    if (clauses.length === 0) return 0;
    
    const avgConfidence = clauses.reduce((sum, c) => sum + c.confidence, 0) / clauses.length;
    const completenessBonus = Math.min(clauses.length / 8, 1) * 0.1; // Bonus for finding more clauses
    
    return Math.min(avgConfidence + completenessBonus, 1);
  }
}

// 2. Risk Scoring Agent
export class RiskScoringAgent extends BaseAgent {
  id = 'risk_scoring_agent_v1';
  type: AgentType = 'risk_scoring';
  name = 'Contract Risk Assessment Agent';
  description = 'Evaluates legal and financial risks in extracted contract clauses';
  dependencies: AgentType[] = ['clause_extraction'];
  
  constructor(genAI: GoogleGenerativeAI) {
    super(genAI, 'risk_scoring');
  }
  
  async process(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    
    if (!input.extractedClauses || input.extractedClauses.length === 0) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: ['No extracted clauses available for risk assessment'],
      };
    }
    
    try {
      const riskPrompt = this.buildRiskAssessmentPrompt(input);
      const result = await this.generativeModel.generateContent(riskPrompt);
      const responseText = result.response.text();
      
      const riskData = JSON.parse(responseText);
      const riskAssessment = this.normalizeRiskResults(riskData);
      
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: riskAssessment,
        confidence: this.calculateRiskConfidence(riskAssessment),
        sources: this.createSources(['extracted_clauses', 'risk_knowledge_base'], 'knowledge_base'),
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
      
    } catch (error) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: [error instanceof Error ? error.message : 'Unknown risk assessment error'],
      };
    }
  }
  
  private buildRiskAssessmentPrompt(input: AgentInput): string {
    const clausesText = input.extractedClauses!
      .map(c => `${c.type}: ${c.text}`)
      .join('\n\n');
    
    const companyContext = input.context.companyProfile ? 
      `Company: ${input.context.companyProfile.name} (${input.context.companyProfile.industry}, ${input.context.companyProfile.size})` : 
      'Company profile not provided';
    
    return `
Assess the legal and financial risks in these contract clauses. Return ONLY valid JSON:

{
  "overall": {
    "score": 6.5,
    "level": "medium",
    "factors": ["list of risk factors"],
    "impact": "financial"
  },
  "byClause": {
    "clause_id": {
      "score": 7.0,
      "level": "high", 
      "factors": ["specific risks"],
      "impact": "operational"
    }
  },
  "riskFactors": [
    {
      "category": "financial",
      "description": "Description of risk",
      "severity": "high",
      "likelihood": 0.7,
      "impact": "Potential business impact",
      "mitigation": ["suggested mitigations"]
    }
  ],
  "mitigationSuggestions": ["list of overall suggestions"]
}

Context:
${companyContext}
Contract Type: ${input.context.contractType}
Urgency: ${input.context.urgency}

Extracted Clauses:
${clausesText}

Risk scoring guidelines:
- Score 0-3: Low risk (green)
- Score 4-6: Medium risk (yellow)  
- Score 7-8: High risk (orange)
- Score 9-10: Critical risk (red)

Consider: Financial exposure, operational disruption, legal compliance, enforcement difficulty.`;
  }
  
  private normalizeRiskResults(data: any): RiskAssessment {
    return {
      overall: {
        score: data.overall?.score || 5,
        level: data.overall?.level || 'medium',
        factors: data.overall?.factors || [],
        impact: data.overall?.impact || 'operational',
      },
      byClause: data.byClause || {},
      riskFactors: (data.riskFactors || []).map((rf: any) => ({
        category: rf.category || 'operational',
        description: rf.description || '',
        severity: rf.severity || 'medium',
        likelihood: rf.likelihood || 0.5,
        impact: rf.impact || '',
        mitigation: rf.mitigation || [],
      })),
      mitigationSuggestions: data.mitigationSuggestions || [],
    };
  }
  
  private calculateRiskConfidence(assessment: RiskAssessment): number {
    const hasOverall = assessment.overall.score > 0;
    const hasClauseRisks = Object.keys(assessment.byClause).length > 0;
    const hasFactors = assessment.riskFactors.length > 0;
    const hasSuggestions = assessment.mitigationSuggestions.length > 0;
    
    const completeness = [hasOverall, hasClauseRisks, hasFactors, hasSuggestions]
      .filter(Boolean).length / 4;
    
    return 0.7 + (completeness * 0.25); // Base confidence of 70% + completeness bonus
  }
}

// 3. Benchmarking Agent  
export class BenchmarkingAgent extends BaseAgent {
  id = 'benchmarking_agent_v1';
  type: AgentType = 'benchmarking';
  name = 'Contract Benchmarking Agent';
  description = 'Compares contract terms against industry standards and historical data';
  dependencies: AgentType[] = ['clause_extraction'];
  
  constructor(genAI: GoogleGenerativeAI) {
    super(genAI, 'benchmarking');
  }
  
  async process(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    
    if (!input.extractedClauses || input.extractedClauses.length === 0) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: ['No extracted clauses available for benchmarking'],
      };
    }
    
    try {
      const benchmarkPrompt = this.buildBenchmarkingPrompt(input);
      const result = await this.generativeModel.generateContent(benchmarkPrompt);
      const responseText = result.response.text();
      
      const benchmarkData = JSON.parse(responseText);
      const normalizedBenchmarks = this.normalizeBenchmarkResults(benchmarkData);
      
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: normalizedBenchmarks,
        confidence: this.calculateBenchmarkConfidence(normalizedBenchmarks),
        sources: this.createSources(['industry_benchmarks', 'market_data'], 'benchmark'),
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
      
    } catch (error) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: [error instanceof Error ? error.message : 'Unknown benchmarking error'],
      };
    }
  }
  
  private buildBenchmarkingPrompt(input: AgentInput): string {
    const clausesText = input.extractedClauses!
      .map(c => `${c.type}: ${JSON.stringify(c.normalizedTerms)}`)
      .join('\n');
    
    const industry = input.context.companyProfile?.industry || 'Technology';
    const companySize = input.context.companyProfile?.size || 'mid-market';
    
    return `
Compare these contract terms against industry benchmarks. Return ONLY valid JSON:

{
  "industry": "${industry}",
  "contractSize": "${companySize}",
  "percentile": 65,
  "comparisons": [
    {
      "metric": "Liability Cap",
      "yourValue": "$1M",
      "marketMedian": "$500K",
      "marketRange": ["$100K", "$2M"],
      "percentile": 85,
      "recommendation": "negotiate"
    }
  ],
  "recommendations": [
    "Consider reducing liability cap to market median",
    "Payment terms are favorable compared to industry standard"
  ]
}

Industry: ${industry}
Company Size: ${companySize}
Contract Type: ${input.context.contractType}

Contract Terms:
${clausesText}

For each significant term:
1. Compare to industry standards
2. Provide market range and median
3. Calculate percentile (0-100, where 50 = median)
4. Recommend: "acceptable", "negotiate", or "red_flag"

Focus on: liability caps, payment terms, SLAs, termination rights, volume discounts.`;
  }
  
  private normalizeBenchmarkResults(data: any): BenchmarkData {
    return {
      industry: data.industry || 'Unknown',
      contractSize: data.contractSize || 'unknown',
      percentile: data.percentile || 50,
      comparisons: (data.comparisons || []).map((comp: any) => ({
        metric: comp.metric || '',
        yourValue: comp.yourValue,
        marketMedian: comp.marketMedian,
        marketRange: comp.marketRange || [null, null],
        percentile: comp.percentile || 50,
        recommendation: comp.recommendation || 'acceptable',
      })),
      recommendations: data.recommendations || [],
    };
  }
  
  private calculateBenchmarkConfidence(benchmarks: BenchmarkData): number {
    const hasComparisons = benchmarks.comparisons.length > 0;
    const hasRecommendations = benchmarks.recommendations.length > 0;
    const hasIndustryData = benchmarks.industry !== 'Unknown';
    
    const dataQuality = benchmarks.comparisons
      .filter(c => c.marketMedian !== null && c.marketRange[0] !== null)
      .length / Math.max(benchmarks.comparisons.length, 1);
    
    const completeness = [hasComparisons, hasRecommendations, hasIndustryData]
      .filter(Boolean).length / 3;
    
    return 0.6 + (completeness * 0.2) + (dataQuality * 0.2);
  }
}

// 4. Negotiation Strategy Agent
export class NegotiationStrategyAgent extends BaseAgent {
  id = 'negotiation_strategy_agent_v1';
  type: AgentType = 'negotiation_strategy';
  name = 'Contract Negotiation Strategy Agent';
  description = 'Develops tactical negotiation recommendations based on risk and benchmark analysis';
  dependencies: AgentType[] = ['clause_extraction', 'risk_scoring', 'benchmarking'];
  
  constructor(genAI: GoogleGenerativeAI) {
    super(genAI, 'negotiation_strategy');
  }
  
  async process(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    
    if (!input.extractedClauses || !input.riskAssessment || !input.benchmarkData) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: ['Missing required inputs: clauses, risk assessment, or benchmark data'],
      };
    }
    
    try {
      const strategyPrompt = this.buildStrategyPrompt(input);
      const result = await this.generativeModel.generateContent(strategyPrompt);
      const responseText = result.response.text();
      
      const strategyData = JSON.parse(responseText);
      
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: strategyData,
        confidence: this.calculateStrategyConfidence(strategyData),
        sources: this.createSources(['risk_assessment', 'benchmarks', 'negotiation_playbooks'], 'knowledge_base'),
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
      
    } catch (error) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: [error instanceof Error ? error.message : 'Unknown strategy generation error'],
      };
    }
  }
  
  private buildStrategyPrompt(input: AgentInput): string {
    const highRisks = input.riskAssessment!.riskFactors
      .filter(rf => rf.severity === 'high' || rf.severity === 'critical')
      .map(rf => rf.description);
    
    const negotiableComparisons = input.benchmarkData!.comparisons
      .filter(c => c.recommendation === 'negotiate' || c.recommendation === 'red_flag');
    
    return `
Develop a negotiation strategy based on risk assessment and benchmarks. Return ONLY valid JSON:

{
  "prioritizedIssues": [
    {
      "issue": "Liability cap exceeds market by 70%", 
      "priority": "high",
      "impact": "Financial exposure risk",
      "strategy": "Push for market median cap with carve-outs"
    }
  ],
  "negotiationTactics": [
    {
      "tactic": "Anchor on industry standard",
      "applicableIssues": ["liability_cap"],
      "rationale": "Strong benchmark data supports position"
    }
  ],
  "concessions": [
    {
      "giveUp": "Extended payment terms",
      "getBack": "Reduced liability exposure", 
      "reasoning": "Trade non-critical term for risk reduction"
    }
  ],
  "redlines": [
    {
      "clause": "indemnity",
      "currentText": "...",
      "proposedText": "...",
      "justification": "Reduces unlimited liability exposure"
    }
  ],
  "walkawayPoints": ["No liability cap", "Unlimited indemnity"],
  "timeline": [
    {
      "phase": "Initial Response",
      "duration": "3-5 days",
      "actions": ["Send redlined contract", "Schedule discussion call"]
    }
  ]
}

High Risk Issues:
${highRisks.join('\n')}

Benchmark Concerns:
${negotiableComparisons.map(c => `${c.metric}: ${c.recommendation} (${c.percentile}th percentile)`).join('\n')}

Company Profile: ${input.context.companyProfile?.riskTolerance || 'moderate'} risk tolerance
Contract Urgency: ${input.context.urgency}
Contract Type: ${input.context.contractType}

Strategy should prioritize highest impact/likelihood risks and worst benchmark outliers.`;
  }
  
  private calculateStrategyConfidence(strategy: any): number {
    const hasIssues = strategy.prioritizedIssues?.length > 0;
    const hasTactics = strategy.negotiationTactics?.length > 0;
    const hasRedlines = strategy.redlines?.length > 0;
    const hasTimeline = strategy.timeline?.length > 0;
    
    const completeness = [hasIssues, hasTactics, hasRedlines, hasTimeline]
      .filter(Boolean).length / 4;
    
    return 0.75 + (completeness * 0.2); // Higher base confidence for strategy
  }
}

// 5. Simulation Agent
export class SimulationAgent extends BaseAgent {
  id = 'simulation_agent_v1';
  type: AgentType = 'simulation';
  name = 'Contract Scenario Simulation Agent';
  description = 'Models different negotiation scenarios and their likely outcomes';
  dependencies: AgentType[] = ['risk_scoring', 'benchmarking'];
  
  constructor(genAI: GoogleGenerativeAI) {
    super(genAI, 'simulation');
  }
  
  async process(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    
    if (!input.riskAssessment || !input.benchmarkData) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: ['Missing required inputs: risk assessment or benchmark data'],
      };
    }
    
    try {
      const simulationPrompt = this.buildSimulationPrompt(input);
      const result = await this.generativeModel.generateContent(simulationPrompt);
      const responseText = result.response.text();
      
      const simulationData = JSON.parse(responseText);
      
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: simulationData,
        confidence: 0.8,
        sources: this.createSources(['risk_models', 'outcome_probabilities'], 'model'),
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
      
    } catch (error) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: [error instanceof Error ? error.message : 'Unknown simulation error'],
      };
    }
  }
  
  private buildSimulationPrompt(input: AgentInput): string {
    return `
Model negotiation scenarios and outcomes. Return ONLY valid JSON:

{
  "scenarios": [
    {
      "name": "Conservative Approach",
      "description": "Focus on highest-risk items only",
      "probability": 0.7,
      "timeline": "2-3 weeks",
      "outcomes": {
        "riskReduction": 60,
        "costSavings": 15000,
        "relationshipImpact": "neutral"
      }
    }
  ],
  "monteCarlo": {
    "iterations": 1000,
    "successRate": 0.73,
    "averageSavings": 18500,
    "riskDistribution": {
      "low": 0.2,
      "medium": 0.6, 
      "high": 0.2
    }
  },
  "recommendations": [
    "Scenario 2 offers best risk/reward balance",
    "Timeline pressure reduces negotiation leverage"
  ]
}

Risk Context: Overall risk score ${input.riskAssessment!.overall.score}/10
Timeline Pressure: ${input.context.urgency}
Benchmark Position: ${input.benchmarkData!.percentile}th percentile

Model 3-4 scenarios from aggressive to conservative negotiation approaches.`;
  }
}

// 6. Reporting Agent
export class ReportingAgent extends BaseAgent {
  id = 'reporting_agent_v1';
  type: AgentType = 'reporting';
  name = 'Contract Analysis Reporting Agent';
  description = 'Creates executive summaries and actionable reports';
  dependencies: AgentType[] = ['risk_scoring', 'benchmarking', 'negotiation_strategy'];
  
  constructor(genAI: GoogleGenerativeAI) {
    super(genAI, 'reporting');
  }
  
  async process(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    
    try {
      const reportPrompt = this.buildReportPrompt(input);
      const result = await this.generativeModel.generateContent(reportPrompt);
      const responseText = result.response.text();
      
      const reportData = JSON.parse(responseText);
      
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: reportData,
        confidence: 0.85,
        sources: this.createSources(['analysis_results', 'executive_templates']),
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
      };
      
    } catch (error) {
      return {
        agentId: this.id,
        contractId: input.contractId,
        result: null,
        confidence: 0,
        sources: [],
        processingTime: Date.now() - startTime,
        timestamp: new Date(),
        errors: [error instanceof Error ? error.message : 'Unknown reporting error'],
      };
    }
  }
  
  private buildReportPrompt(input: AgentInput): string {
    return `
Create an executive summary report. Return ONLY valid JSON:

{
  "overview": "Executive overview of contract analysis",
  "keyRisks": ["Risk 1", "Risk 2"],
  "opportunities": ["Opportunity 1", "Opportunity 2"], 
  "recommendations": ["Action 1", "Action 2"],
  "nextSteps": ["Step 1", "Step 2"],
  "confidence": 0.85
}

Analysis Context:
- Risk Level: ${input.riskAssessment?.overall.level || 'unknown'}
- Benchmark Position: ${input.benchmarkData?.percentile || 'unknown'}th percentile
- Contract Type: ${input.context.contractType}
- Urgency: ${input.context.urgency}

Create clear, actionable insights for executives and legal teams.`;
  }
}

// Export all agents
export {
  BaseAgent,
  ClauseExtractionAgent,
  RiskScoringAgent,
  BenchmarkingAgent,
  NegotiationStrategyAgent,
  SimulationAgent,
  ReportingAgent,
};