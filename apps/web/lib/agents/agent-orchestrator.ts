// Contract IQ Agent Orchestration System
// Multi-agent architecture for contract intelligence processing

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Agent Types and Configurations
export type AgentType = 
  | 'clause_extraction'
  | 'risk_scoring'
  | 'benchmarking'
  | 'negotiation_strategy'
  | 'simulation'
  | 'reporting';

export type AgentPriority = 'critical' | 'high' | 'medium' | 'low';
export type AgentStatus = 'idle' | 'processing' | 'completed' | 'failed';

// Core Agent Interface
export interface IAgent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  model: string; // Gemini model variant
  priority: AgentPriority;
  dependencies: AgentType[]; // Which agents must complete first
  maxRetries: number;
  timeoutMs: number;
  
  // Processing methods
  process(input: AgentInput): Promise<AgentOutput>;
  validate(output: AgentOutput): Promise<boolean>;
  getConfidenceScore(output: AgentOutput): number;
}

// Input/Output Types
export interface AgentInput {
  contractId: string;
  contractText?: string;
  extractedClauses?: ExtractedClause[];
  riskAssessment?: RiskAssessment;
  benchmarkData?: BenchmarkData;
  context: ProcessingContext;
  metadata: AgentMetadata;
}

export interface AgentOutput {
  agentId: string;
  contractId: string;
  result: any; // Specialized per agent type
  confidence: number; // 0-1
  sources: Source[]; // Citations and provenance
  processingTime: number;
  timestamp: Date;
  errors?: string[];
  warnings?: string[];
}

export interface ProcessingContext {
  companyProfile?: CompanyProfile;
  contractType: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  sessionId: string;
  objectives: string[];
}

export interface AgentMetadata {
  version: string;
  modelVersion: string;
  processingNode: string; // Railway service instance
  retryCount: number;
  dependencies: AgentType[];
}

// Specialized Result Types
export interface ExtractedClause {
  id: string;
  type: ClauseType;
  text: string;
  normalizedTerms: Record<string, any>;
  confidence: number;
  sources: TextSpan[];
}

export interface RiskAssessment {
  overall: RiskScore;
  byClause: Record<string, RiskScore>;
  riskFactors: RiskFactor[];
  mitigationSuggestions: string[];
}

export interface BenchmarkData {
  industry: string;
  contractSize: string;
  comparisons: BenchmarkComparison[];
  percentile: number;
  recommendations: string[];
}

export type ClauseType = 
  | 'liability_cap'
  | 'indemnity'
  | 'data_processing'
  | 'sla'
  | 'termination'
  | 'payment_terms'
  | 'ip_rights'
  | 'governing_law'
  | 'audit_rights'
  | 'volume_discounts';

export interface RiskScore {
  score: number; // 0-10
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  impact: 'financial' | 'operational' | 'legal' | 'compliance';
}

export interface Source {
  type: 'clause' | 'benchmark' | 'knowledge_base' | 'model';
  reference: string;
  confidence: number;
  relevance: number;
}

// Google AI Model Configuration for Specialized Agents
export const AGENT_MODEL_CONFIG = {
  // Clause Extraction: Fast, structured output
  clause_extraction: {
    model: 'gemini-1.5-flash',
    temperature: 0.1,
    topP: 0.8,
    maxOutputTokens: 4096,
    systemInstruction: `You are a specialized contract clause extraction agent. 
    Extract and classify contract clauses with high accuracy. Return structured JSON only.`,
  },
  
  // Risk Scoring: Analytical, conservative
  risk_scoring: {
    model: 'gemini-1.5-pro',
    temperature: 0.2,
    topP: 0.9,
    maxOutputTokens: 2048,
    systemInstruction: `You are a contract risk assessment specialist. 
    Evaluate legal and financial risks conservatively. Provide confidence scores.`,
  },
  
  // Benchmarking: Data-driven analysis
  benchmarking: {
    model: 'gemini-1.5-pro',
    temperature: 0.1,
    topP: 0.8,
    maxOutputTokens: 3072,
    systemInstruction: `You are a contract benchmarking analyst. 
    Compare terms against industry standards and historical data.`,
  },
  
  // Strategy: Creative, strategic thinking
  negotiation_strategy: {
    model: 'gemini-1.5-pro',
    temperature: 0.4,
    topP: 0.9,
    maxOutputTokens: 4096,
    systemInstruction: `You are a contract negotiation strategist. 
    Provide tactical recommendations based on risk assessment and benchmarks.`,
  },
  
  // Simulation: Complex scenario modeling
  simulation: {
    model: 'gemini-1.5-pro',
    temperature: 0.3,
    topP: 0.9,
    maxOutputTokens: 3072,
    systemInstruction: `You are a contract simulation specialist. 
    Model different negotiation scenarios and their likely outcomes.`,
  },
  
  // Reporting: Clear, executive communication
  reporting: {
    model: 'gemini-1.5-pro',
    temperature: 0.2,
    topP: 0.8,
    maxOutputTokens: 6144,
    systemInstruction: `You are a contract analysis reporter. 
    Create clear, actionable reports for executives and legal teams.`,
  },
};

// Agent Orchestrator - Main coordination system
export class AgentOrchestrator {
  private agents: Map<AgentType, IAgent> = new Map();
  private processingQueue: ProcessingJob[] = [];
  private completedJobs: Map<string, ProcessingResult> = new Map();
  private genAI: GoogleGenerativeAI;
  
  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.initializeAgents();
  }
  
  private initializeAgents(): void {
    // Register all specialized agents
    this.agents.set('clause_extraction', new ClauseExtractionAgent(this.genAI));
    this.agents.set('risk_scoring', new RiskScoringAgent(this.genAI));
    this.agents.set('benchmarking', new BenchmarkingAgent(this.genAI));
    this.agents.set('negotiation_strategy', new NegotiationStrategyAgent(this.genAI));
    this.agents.set('simulation', new SimulationAgent(this.genAI));
    this.agents.set('reporting', new ReportingAgent(this.genAI));
  }
  
  // Main processing method - orchestrates all agents
  async processContract(input: ContractProcessingInput): Promise<ProcessingResult> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: ProcessingJob = {
      id: jobId,
      contractId: input.contractId,
      requiredAgents: input.requiredAgents || ['clause_extraction', 'risk_scoring', 'benchmarking', 'negotiation_strategy'],
      status: 'queued',
      priority: input.priority || 'medium',
      context: input.context,
      createdAt: new Date(),
      results: new Map(),
    };
    
    this.processingQueue.push(job);
    
    try {
      // Execute agents in dependency order
      const executionPlan = this.createExecutionPlan(job.requiredAgents);
      
      for (const stage of executionPlan) {
        await this.executeStage(job, stage, input.contractText);
      }
      
      job.status = 'completed';
      job.completedAt = new Date();
      
      // Generate final result
      const result: ProcessingResult = {
        jobId,
        contractId: input.contractId,
        status: 'completed',
        agentResults: Object.fromEntries(job.results),
        processingTime: job.completedAt.getTime() - job.createdAt.getTime(),
        confidence: this.calculateOverallConfidence(job.results),
        summary: await this.generateExecutiveSummary(job),
      };
      
      this.completedJobs.set(jobId, result);
      return result;
      
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      
      throw new Error(`Contract processing failed: ${job.error}`);
    }
  }
  
  private createExecutionPlan(requiredAgents: AgentType[]): AgentType[][] {
    // Define dependency graph
    const dependencies: Record<AgentType, AgentType[]> = {
      clause_extraction: [],
      risk_scoring: ['clause_extraction'],
      benchmarking: ['clause_extraction'],
      negotiation_strategy: ['clause_extraction', 'risk_scoring', 'benchmarking'],
      simulation: ['risk_scoring', 'benchmarking'],
      reporting: ['risk_scoring', 'benchmarking', 'negotiation_strategy'],
    };
    
    // Topological sort to create execution stages
    const stages: AgentType[][] = [];
    const remaining = new Set(requiredAgents);
    
    while (remaining.size > 0) {
      const currentStage: AgentType[] = [];
      
      for (const agent of remaining) {
        const deps = dependencies[agent] || [];
        const depsSatisfied = deps.every(dep => !remaining.has(dep));
        
        if (depsSatisfied) {
          currentStage.push(agent);
        }
      }
      
      if (currentStage.length === 0) {
        throw new Error('Circular dependency detected in agent execution plan');
      }
      
      currentStage.forEach(agent => remaining.delete(agent));
      stages.push(currentStage);
    }
    
    return stages;
  }
  
  private async executeStage(job: ProcessingJob, stage: AgentType[], contractText: string): Promise<void> {
    const stagePromises = stage.map(async (agentType) => {
      const agent = this.agents.get(agentType);
      if (!agent) {
        throw new Error(`Agent not found: ${agentType}`);
      }
      
      // Build input from previous agent results
      const agentInput: AgentInput = {
        contractId: job.contractId,
        contractText,
        extractedClauses: job.results.get('clause_extraction')?.result,
        riskAssessment: job.results.get('risk_scoring')?.result,
        benchmarkData: job.results.get('benchmarking')?.result,
        context: job.context,
        metadata: {
          version: '1.0',
          modelVersion: AGENT_MODEL_CONFIG[agentType].model,
          processingNode: process.env.RAILWAY_SERVICE_NAME || 'local',
          retryCount: 0,
          dependencies: agent.dependencies,
        },
      };
      
      const result = await agent.process(agentInput);
      job.results.set(agentType, result);
      
      return result;
    });
    
    await Promise.all(stagePromises);
  }
  
  private calculateOverallConfidence(results: Map<AgentType, AgentOutput>): number {
    const confidences = Array.from(results.values()).map(r => r.confidence);
    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  }
  
  private async generateExecutiveSummary(job: ProcessingJob): Promise<ExecutiveSummary> {
    const reportingAgent = this.agents.get('reporting');
    if (!reportingAgent) {
      throw new Error('Reporting agent not available');
    }
    
    // Use reporting agent to create executive summary
    const summaryInput: AgentInput = {
      contractId: job.contractId,
      context: job.context,
      extractedClauses: job.results.get('clause_extraction')?.result,
      riskAssessment: job.results.get('risk_scoring')?.result,
      benchmarkData: job.results.get('benchmarking')?.result,
      metadata: {
        version: '1.0',
        modelVersion: 'gemini-1.5-pro',
        processingNode: process.env.RAILWAY_SERVICE_NAME || 'local',
        retryCount: 0,
        dependencies: [],
      },
    };
    
    const summaryResult = await reportingAgent.process(summaryInput);
    return summaryResult.result as ExecutiveSummary;
  }
  
  // Job management methods
  getJobStatus(jobId: string): ProcessingJob | ProcessingResult | null {
    // Check completed jobs first
    const completed = this.completedJobs.get(jobId);
    if (completed) return completed;
    
    // Check processing queue
    return this.processingQueue.find(job => job.id === jobId) || null;
  }
  
  cancelJob(jobId: string): boolean {
    const jobIndex = this.processingQueue.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      this.processingQueue.splice(jobIndex, 1);
      return true;
    }
    return false;
  }
  
  getQueueStatus(): QueueStatus {
    return {
      queued: this.processingQueue.filter(job => job.status === 'queued').length,
      processing: this.processingQueue.filter(job => job.status === 'processing').length,
      completed: this.completedJobs.size,
      failed: this.processingQueue.filter(job => job.status === 'failed').length,
    };
  }
}

// Supporting Types
export interface ContractProcessingInput {
  contractId: string;
  contractText: string;
  context: ProcessingContext;
  requiredAgents?: AgentType[];
  priority?: AgentPriority;
}

export interface ProcessingJob {
  id: string;
  contractId: string;
  requiredAgents: AgentType[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  priority: AgentPriority;
  context: ProcessingContext;
  createdAt: Date;
  completedAt?: Date;
  results: Map<AgentType, AgentOutput>;
  error?: string;
}

export interface ProcessingResult {
  jobId: string;
  contractId: string;
  status: 'completed' | 'failed';
  agentResults: Record<string, AgentOutput>;
  processingTime: number;
  confidence: number;
  summary: ExecutiveSummary;
  error?: string;
}

export interface ExecutiveSummary {
  overview: string;
  keyRisks: string[];
  opportunities: string[];
  recommendations: string[];
  nextSteps: string[];
  confidence: number;
}

export interface QueueStatus {
  queued: number;
  processing: number;
  completed: number;
  failed: number;
}

// Additional supporting interfaces
export interface CompanyProfile {
  name: string;
  industry: string;
  size: 'startup' | 'mid-market' | 'enterprise' | 'fortune-500';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  preferences: ContractPreferences;
}

export interface ContractPreferences {
  preferredGoverningLaw: string[];
  maxLiabilityCap: number;
  preferredPaymentTerms: string;
  requiredSLAs: Record<string, number>;
}

export interface BenchmarkComparison {
  metric: string;
  yourValue: any;
  marketMedian: any;
  marketRange: [any, any];
  percentile: number;
  recommendation: 'acceptable' | 'negotiate' | 'red_flag';
}

export interface RiskFactor {
  category: 'financial' | 'operational' | 'legal' | 'compliance';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number; // 0-1
  impact: string;
  mitigation: string[];
}

export interface TextSpan {
  start: number;
  end: number;
  text: string;
  page?: number;
}

// Export the main orchestrator
export default AgentOrchestrator;