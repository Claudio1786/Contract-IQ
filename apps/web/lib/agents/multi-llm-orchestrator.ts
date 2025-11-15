// Contract IQ Multi-LLM Orchestration System
// Advanced agent architecture supporting Google Gemini + OpenAI models

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Multi-LLM Provider Types
export type LLMProvider = 'gemini' | 'openai';
export type GeminiModel = 'gemini-2.5-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'text-embedding-004';
export type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo' | 'text-embedding-3-large' | 'text-embedding-3-small';

export type ModelType = GeminiModel | OpenAIModel;

// Enhanced Agent Types with LLM Strategy
export type AgentType = 
  | 'clause_extraction'
  | 'risk_scoring'
  | 'benchmarking'
  | 'negotiation_strategy'
  | 'simulation'
  | 'reporting'
  | 'cross_validation'  // New: Multi-model validation
  | 'cost_optimization'; // New: OpenAI for financial analysis

export type AgentPriority = 'critical' | 'high' | 'medium' | 'low';
export type AgentStatus = 'idle' | 'processing' | 'completed' | 'failed';

// LLM Routing Strategy - Which model is best for each task
export interface LLMStrategy {
  primary: {
    provider: LLMProvider;
    model: ModelType;
    reason: string;
  };
  fallback: {
    provider: LLMProvider;
    model: ModelType;
    reason: string;
  };
  crossValidation?: {
    provider: LLMProvider;
    model: ModelType;
    threshold: number; // Confidence threshold to trigger cross-validation
  };
}

// Optimized model routing based on our competitive analysis
export const MULTI_LLM_STRATEGIES: Record<AgentType, LLMStrategy> = {
  // Clause Extraction: Gemini Flash for speed, OpenAI GPT-4o for accuracy
  clause_extraction: {
    primary: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Superior speed for structured extraction, optimized for JSON output'
    },
    fallback: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      reason: 'Reliable structured output when Gemini fails'
    },
    crossValidation: {
      provider: 'openai',
      model: 'gpt-4o',
      threshold: 0.8 // If Gemini confidence < 80%, validate with OpenAI
    }
  },
  
  // Risk Scoring: OpenAI GPT-4o for complex reasoning, Gemini Pro for legal context
  risk_scoring: {
    primary: {
      provider: 'openai',
      model: 'gpt-4o',
      reason: 'Superior reasoning for multi-dimensional risk assessment'
    },
    fallback: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Strong legal document understanding as backup'
    },
    crossValidation: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      threshold: 0.75 // Critical decisions require dual validation
    }
  },
  
  // Benchmarking: Gemini Pro for data analysis, OpenAI for market insights
  benchmarking: {
    primary: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Excellent at processing large datasets and patterns'
    },
    fallback: {
      provider: 'openai',
      model: 'gpt-4o',
      reason: 'Strong analytical reasoning for market comparisons'
    }
  },
  
  // Negotiation Strategy: OpenAI GPT-4o for creative strategy, Gemini for tactical analysis
  negotiation_strategy: {
    primary: {
      provider: 'openai',
      model: 'gpt-4o',
      reason: 'Superior creative reasoning and strategic thinking'
    },
    fallback: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Strong analytical backup for strategy validation'
    }
  },
  
  // Simulation: OpenAI for scenario modeling, Gemini for outcome prediction
  simulation: {
    primary: {
      provider: 'openai',
      model: 'gpt-4o',
      reason: 'Advanced scenario modeling and probabilistic reasoning'
    },
    fallback: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Reliable outcome prediction based on historical patterns'
    }
  },
  
  // Reporting: Gemini Pro for clear writing, OpenAI for executive communication
  reporting: {
    primary: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Excellent at clear, structured business writing'
    },
    fallback: {
      provider: 'openai',
      model: 'gpt-4o',
      reason: 'Strong executive-level communication when needed'
    }
  },
  
  // Cross Validation: Always use the alternative model for verification
  cross_validation: {
    primary: {
      provider: 'openai',
      model: 'gpt-4o',
      reason: 'Independent validation of Gemini primary results'
    },
    fallback: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Secondary validation when OpenAI unavailable'
    }
  },
  
  // Cost Optimization: OpenAI excels at financial analysis and optimization
  cost_optimization: {
    primary: {
      provider: 'openai',
      model: 'gpt-4o',
      reason: 'Superior financial reasoning and cost-benefit analysis'
    },
    fallback: {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      reason: 'Analytical backup for cost calculations'
    }
  }
};

// Model Configuration for Different Providers
export interface ModelConfig {
  temperature: number;
  topP?: number;
  maxTokens: number;
  systemMessage: string;
  responseFormat?: 'json' | 'text';
}

// Multi-LLM Client Manager
export class MultiLLMClient {
  private gemini: GoogleGenerativeAI;
  private openai: OpenAI;
  private costTracker = new Map<string, number>(); // Track costs per contract
  
  constructor(geminiApiKey: string, openaiApiKey: string) {
    this.gemini = new GoogleGenerativeAI(geminiApiKey);
    this.openai = new OpenAI({ apiKey: openaiApiKey });
  }
  
  async callModel(
    provider: LLMProvider,
    model: ModelType,
    config: ModelConfig,
    prompt: string,
    contractId: string
  ): Promise<{ content: string; cost: number }> {
    const startTime = Date.now();
    
    try {
      if (provider === 'gemini') {
        return await this.callGemini(model as GeminiModel, config, prompt, contractId);
      } else {
        return await this.callOpenAI(model as OpenAIModel, config, prompt, contractId);
      }
    } catch (error) {
      console.error(`Model call failed: ${provider}:${model}`, error);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      console.log(`${provider}:${model} call took ${duration}ms for contract ${contractId}`);
    }
  }
  
  private async callGemini(
    model: GeminiModel,
    config: ModelConfig,
    prompt: string,
    contractId: string
  ): Promise<{ content: string; cost: number }> {
    const genModel = this.gemini.getGenerativeModel({
      model,
      generationConfig: {
        temperature: config.temperature,
        topP: config.topP || 0.8,
        maxOutputTokens: config.maxTokens,
        responseMimeType: config.responseFormat === 'json' ? 'application/json' : 'text/plain'
      },
      systemInstruction: config.systemMessage
    });
    
    const result = await genModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Estimate cost (Google pricing: ~$0.35 per 1M tokens)
    const estimatedTokens = text.length / 4; // Rough token estimate
    const cost = (estimatedTokens / 1000000) * 0.35;
    
    this.updateCostTracking(contractId, cost);
    
    return { content: text, cost };
  }
  
  private async callOpenAI(
    model: OpenAIModel,
    config: ModelConfig,
    prompt: string,
    contractId: string
  ): Promise<{ content: string; cost: number }> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: config.systemMessage },
      { role: 'user', content: prompt }
    ];
    
    const completion = await this.openai.chat.completions.create({
      model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      response_format: config.responseFormat === 'json' ? { type: 'json_object' } : undefined
    });
    
    const content = completion.choices[0]?.message?.content || '';
    
    // Calculate actual cost based on OpenAI pricing
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    
    let cost = 0;
    if (model === 'gpt-4o') {
      cost = (inputTokens * 0.0025 + outputTokens * 0.01) / 1000; // GPT-4o pricing
    } else if (model === 'gpt-4o-mini') {
      cost = (inputTokens * 0.00015 + outputTokens * 0.0006) / 1000; // GPT-4o-mini pricing
    }
    
    this.updateCostTracking(contractId, cost);
    
    return { content, cost };
  }
  
  private updateCostTracking(contractId: string, cost: number): void {
    const currentCost = this.costTracker.get(contractId) || 0;
    this.costTracker.set(contractId, currentCost + cost);
  }
  
  getTotalCost(contractId: string): number {
    return this.costTracker.get(contractId) || 0;
  }
  
  getAllCosts(): Map<string, number> {
    return new Map(this.costTracker);
  }
}

// Enhanced Input/Output Types
export interface AgentInput {
  contractId: string;
  contractText?: string;
  extractedClauses?: any[];
  riskAssessment?: any;
  benchmarkData?: any;
  context: ProcessingContext;
  metadata: AgentMetadata;
  preferences?: ModelPreferences;
}

export interface ModelPreferences {
  preferredProvider?: LLMProvider;
  requireCrossValidation?: boolean;
  maxCostPerRequest?: number;
  prioritizeSpeed?: boolean;
  prioritizeAccuracy?: boolean;
}

export interface ProcessingContext {
  companyProfile?: any;
  contractType: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  sessionId: string;
  objectives: string[];
}

export interface AgentMetadata {
  version: string;
  modelVersion: string;
  processingNode: string;
  retryCount: number;
  dependencies: AgentType[];
}

export interface AgentOutput {
  agentId: string;
  contractId: string;
  result: any;
  confidence: number;
  sources: any[];
  processingTime: number;
  timestamp: Date;
  modelUsed: {
    provider: LLMProvider;
    model: ModelType;
    cost: number;
  };
  crossValidation?: ValidationResult;
  errors?: string[];
  warnings?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  differences: string[];
  recommendation: 'accept' | 'review' | 'reject';
  validator: {
    provider: LLMProvider;
    model: ModelType;
  };
}

export interface ContractProcessingInput {
  contractId: string;
  contractText: string;
  context: ProcessingContext;
  requiredAgents?: AgentType[];
  priority?: 'critical' | 'high' | 'medium' | 'low';
  preferences?: ModelPreferences;
}

export interface ProcessingJob {
  id: string;
  contractId: string;
  requiredAgents: AgentType[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  priority: 'critical' | 'high' | 'medium' | 'low';
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

// Enhanced result interfaces
export interface EnhancedProcessingResult extends ProcessingResult {
  modelMetrics: {
    totalCost: number;
    modelsUsed: Record<string, number>;
    crossValidationResults: CrossValidationSummary;
  };
}

export interface CrossValidationSummary {
  totalValidations: number;
  successfulValidations: number;
  validationRate: number;
  flaggedDifferences: string[];
}

export interface CostAnalysis {
  totalCost: number;
  breakdown: Record<string, number>;
  recommendations: string[];
}

export default MultiLLMClient;