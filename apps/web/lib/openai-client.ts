/**
 * OpenAI Client for Contract IQ
 * Customer Revenue Intelligence Platform
 * 
 * This module provides OpenAI-powered AI features including:
 * - Contract Q&A
 * - Account Intelligence Brief Generation
 * - Risk Analysis
 * - Portfolio Insights
 * - Streaming Chat
 */

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import {
  CONTRACT_QA_PROMPT,
  ACCOUNT_BRIEF_PROMPT,
  RISK_ANALYSIS_PROMPT,
  PORTFOLIO_INSIGHTS_PROMPT,
  PRICING_INTELLIGENCE_PROMPT,
  RENEWAL_TIMELINE_PROMPT
} from './ai-prompts';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 0;
}

/**
 * Answer questions about a specific contract
 */
export async function answerContractQuestion(
  question: string,
  contractContext: {
    customerName: string;
    contractType: string;
    annualValue: number;
    renewalDate: string;
    terms: string;
    riskFactors?: string[];
  }
): Promise<string> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = CONTRACT_QA_PROMPT
    .replace('{customerName}', contractContext.customerName)
    .replace('{contractType}', contractContext.contractType)
    .replace('{annualValue}', contractContext.annualValue.toLocaleString())
    .replace('{renewalDate}', contractContext.renewalDate)
    .replace('{terms}', contractContext.terms)
    .replace('{riskFactors}', contractContext.riskFactors?.join(', ') || 'None identified');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: question }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0]?.message?.content || 'Unable to generate response';
}

/**
 * Generate comprehensive Account Intelligence Brief
 */
export async function generateAccountBrief(
  contractData: {
    customerName: string;
    customerType: string;
    industry: string;
    annualValue: number;
    contractStartDate: string;
    renewalDate: string;
    renewalType: string;
    renewalNoticeDays: number;
    pricingModel: string;
    committedSeats: number;
    riskScore: number;
    riskFactors: string[];
    keyTerms: string;
  }
): Promise<{
  executiveSummary: string;
  riskAssessment: string;
  renewalStrategy: string;
  pricingAnalysis: string;
  actionItems: string[];
  recommendedTiming: string;
}> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = ACCOUNT_BRIEF_PROMPT
    .replace('{customerName}', contractData.customerName)
    .replace('{customerType}', contractData.customerType)
    .replace('{industry}', contractData.industry)
    .replace('{annualValue}', contractData.annualValue.toLocaleString())
    .replace('{contractStartDate}', contractData.contractStartDate)
    .replace('{renewalDate}', contractData.renewalDate)
    .replace('{renewalType}', contractData.renewalType)
    .replace('{renewalNoticeDays}', contractData.renewalNoticeDays.toString())
    .replace('{pricingModel}', contractData.pricingModel)
    .replace('{committedSeats}', contractData.committedSeats.toString())
    .replace('{riskScore}', contractData.riskScore.toString())
    .replace('{riskFactors}', contractData.riskFactors.join(', '))
    .replace('{keyTerms}', contractData.keyTerms);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2500,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

/**
 * Analyze contract risks with AI
 */
export async function analyzeContractRisks(
  contractData: {
    customerName: string;
    annualValue: number;
    renewalDate: string;
    renewalType: string;
    autoRenewal: boolean;
    terminationClause: string;
    paymentTerms: string;
    usageMetrics?: {
      activeUsers: number;
      committedSeats: number;
      utilizationRate: number;
    };
  }
): Promise<{
  overallRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  churnProbability: number;
  riskFactors: Array<{
    category: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    mitigation: string;
  }>;
  renewalRecommendations: string[];
}> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = RISK_ANALYSIS_PROMPT
    .replace('{customerName}', contractData.customerName)
    .replace('{annualValue}', contractData.annualValue.toLocaleString())
    .replace('{renewalDate}', contractData.renewalDate)
    .replace('{renewalType}', contractData.renewalType)
    .replace('{autoRenewal}', contractData.autoRenewal ? 'Yes' : 'No')
    .replace('{terminationClause}', contractData.terminationClause)
    .replace('{paymentTerms}', contractData.paymentTerms)
    .replace('{usageMetrics}', contractData.usageMetrics 
      ? `Active: ${contractData.usageMetrics.activeUsers}, Committed: ${contractData.usageMetrics.committedSeats}, Utilization: ${contractData.usageMetrics.utilizationRate}%`
      : 'Not available');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: prompt }
    ],
    temperature: 0.6,
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

/**
 * Generate portfolio-level insights across all contracts
 */
export async function generatePortfolioInsights(
  portfolioData: {
    totalContracts: number;
    totalACV: number;
    avgContractValue: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    renewalsNext90Days: number;
    topCustomers: Array<{
      name: string;
      acv: number;
      risk: string;
    }>;
    industryBreakdown: Record<string, number>;
  }
): Promise<{
  executiveSummary: string;
  keyTrends: string[];
  riskAnalysis: string;
  opportunities: string[];
  priorityActions: string[];
}> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = PORTFOLIO_INSIGHTS_PROMPT
    .replace('{totalContracts}', portfolioData.totalContracts.toString())
    .replace('{totalACV}', portfolioData.totalACV.toLocaleString())
    .replace('{avgContractValue}', portfolioData.avgContractValue.toLocaleString())
    .replace('{highRiskCount}', portfolioData.highRiskCount.toString())
    .replace('{mediumRiskCount}', portfolioData.mediumRiskCount.toString())
    .replace('{lowRiskCount}', portfolioData.lowRiskCount.toString())
    .replace('{renewalsNext90Days}', portfolioData.renewalsNext90Days.toString())
    .replace('{topCustomers}', portfolioData.topCustomers.map(c => `${c.name} ($${c.acv.toLocaleString()}) - ${c.risk}`).join(', '))
    .replace('{industryBreakdown}', Object.entries(portfolioData.industryBreakdown).map(([k, v]) => `${k}: ${v}`).join(', '));

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

/**
 * Stream chat responses for interactive conversations
 */
export async function streamContractChat(
  messages: ChatCompletionMessageParam[],
  onChunk: (text: string) => void,
  contractContext?: {
    customerName?: string;
    contracts?: Array<{
      id: string;
      customerName: string;
      annualValue: number;
      renewalDate: string;
      riskLevel: string;
    }>;
  }
): Promise<void> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  // Build system message with contract context
  const systemMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: `You are an AI assistant for Contract IQ, a customer revenue intelligence platform for B2B SaaS companies.

Your role is to help Customer Success and Revenue teams:
- Analyze customer contracts and identify churn risks
- Provide renewal strategies and pricing insights
- Generate account intelligence briefs
- Answer questions about specific contracts or the overall portfolio

${contractContext?.customerName ? `Current focus: ${contractContext.customerName} contract` : ''}
${contractContext?.contracts ? `\nPortfolio context:\n${contractContext.contracts.map(c => `- ${c.customerName}: $${c.annualValue.toLocaleString()} ACV, Renews ${c.renewalDate}, Risk: ${c.riskLevel}`).join('\n')}` : ''}

Be concise, actionable, and focus on revenue retention and expansion opportunities.
Always provide specific recommendations with clear next steps.`
  };

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [systemMessage, ...messages],
    temperature: 0.7,
    max_tokens: 1500,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      onChunk(content);
    }
  }
}

/**
 * Generate pricing intelligence for renewal negotiations
 */
export async function generatePricingIntelligence(
  customerData: {
    customerName: string;
    currentACV: number;
    contractLength: number;
    industry: string;
    utilizationRate?: number;
    growthRate?: number;
  }
): Promise<{
  suggestedPricing: {
    renewalACV: number;
    priceIncrease: number;
    justification: string;
  };
  negotiationStrategy: string[];
  marketBenchmarks: string;
}> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = PRICING_INTELLIGENCE_PROMPT
    .replace('{customerName}', customerData.customerName)
    .replace('{currentACV}', customerData.currentACV.toLocaleString())
    .replace('{contractLength}', customerData.contractLength.toString())
    .replace('{industry}', customerData.industry)
    .replace('{utilizationRate}', customerData.utilizationRate?.toString() || 'N/A')
    .replace('{growthRate}', customerData.growthRate?.toString() || 'N/A');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: 'json_object' }
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}

export default {
  answerContractQuestion,
  generateAccountBrief,
  analyzeContractRisks,
  generatePortfolioInsights,
  streamContractChat,
  generatePricingIntelligence,
  isOpenAIConfigured
};
