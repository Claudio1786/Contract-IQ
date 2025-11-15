import { NextRequest, NextResponse } from 'next/server';
import { MultiLLMClient } from '../../../lib/agents/multi-llm-orchestrator';
import { buildEnhancedPrompt } from '../../../lib/negotiation-intelligence';

// Initialize Multi-LLM Client
const multiLLMClient = new MultiLLMClient(
  process.env.GEMINI_API_KEY || '',
  process.env.OPENAI_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractType, scenario, objectives, currentTerms, desiredOutcome, modelPreference } = body;

    // Validate required fields
    if (!contractType || !scenario || !objectives || objectives.length === 0) {
      return NextResponse.json(
        { error: 'Contract type, scenario, and objectives are required' },
        { status: 400 }
      );
    }

    // Build enhanced prompt with market intelligence
    const enhancedPrompt = buildEnhancedPrompt(
      contractType,
      scenario,
      objectives,
      currentTerms,
      desiredOutcome
    );

    console.log('🤖 Generating playbook with Multi-LLM approach...');
    console.log('Enhanced Prompt Length:', enhancedPrompt.length);
    console.log('Model Preference:', modelPreference || 'auto-select');

    // Determine optimal model strategy for playbook generation
    const strategy = determineOptimalStrategy(scenario, objectives, modelPreference);
    
    console.log('🎯 Selected Strategy:', {
      primary: `${strategy.primary.provider}:${strategy.primary.model}`,
      reason: strategy.primary.reason
    });

    // Generate playbook with primary model
    const primaryResult = await generateWithModel(
      strategy.primary.provider,
      strategy.primary.model,
      enhancedPrompt,
      `contract_${Date.now()}`
    );

    let result = primaryResult;
    let crossValidation = null;

    // Cross-validate with secondary model for critical scenarios or low confidence
    if (shouldCrossValidate(scenario, primaryResult.confidence, modelPreference)) {
      console.log('🔍 Cross-validating with fallback model...');
      
      try {
        const fallbackResult = await generateWithModel(
          strategy.fallback.provider,
          strategy.fallback.model,
          enhancedPrompt,
          `contract_${Date.now()}_validation`
        );
        
        crossValidation = {
          fallbackModel: `${strategy.fallback.provider}:${strategy.fallback.model}`,
          agreement: calculateContentAgreement(primaryResult.content, fallbackResult.content),
          recommendedApproach: selectBetterResult(primaryResult, fallbackResult)
        };
        
        // Use better result if cross-validation suggests it
        if (crossValidation.recommendedApproach === 'fallback') {
          result = fallbackResult;
        }
        
      } catch (error) {
        console.warn('Cross-validation failed, using primary result:', error);
      }
    }

    console.log('✅ Playbook generated successfully');
    console.log('Final Model Used:', `${result.provider}:${result.model}`);
    console.log('Total Cost:', `$${(result.cost + (crossValidation ? 0.01 : 0)).toFixed(4)}`);

    // Parse the generated content into structured format
    const playbook = parsePlaybookResponse(result.content, {
      contractType,
      scenario,
      objectives,
      currentTerms,
      desiredOutcome
    });

    return NextResponse.json({ 
      success: true, 
      playbook,
      metadata: {
        promptLength: enhancedPrompt.length,
        responseLength: result.content.length,
        primaryModel: `${strategy.primary.provider}:${strategy.primary.model}`,
        modelUsed: `${result.provider}:${result.model}`,
        cost: result.cost,
        crossValidation,
        confidence: result.confidence,
        processingTime: result.processingTime
      }
    });

  } catch (error: any) {
    console.error('❌ Error generating multi-LLM playbook:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate playbook with multi-LLM approach',
        details: error.message,
        type: error.name
      },
      { status: 500 }
    );
  }
}

// Determine optimal model strategy based on scenario and objectives
function determineOptimalStrategy(scenario: string, objectives: string[], modelPreference?: string) {
  // High-level strategy mapping based on our competitive analysis
  const scenarioStrategies: Record<string, any> = {
    // Financial optimization scenarios: OpenAI excels at financial reasoning
    'saas_renewal_price_increase': {
      primary: {
        provider: 'openai',
        model: 'gpt-4o',
        reason: 'Superior financial analysis and cost optimization reasoning'
      },
      fallback: {
        provider: 'gemini',
        model: 'gemini-1.5-pro',
        reason: 'Strong analytical backup for negotiation tactics'
      }
    },
    
    // Legal compliance scenarios: Gemini Pro for document understanding
    'gdpr_dpa_compliance': {
      primary: {
        provider: 'gemini',
        model: 'gemini-1.5-pro',
        reason: 'Excellent legal document understanding and compliance analysis'
      },
      fallback: {
        provider: 'openai',
        model: 'gpt-4o',
        reason: 'Creative problem-solving for complex compliance challenges'
      }
    },
    
    // Service level scenarios: Balance of technical and negotiation analysis
    'sla_enhancement': {
      primary: {
        provider: 'openai',
        model: 'gpt-4o',
        reason: 'Strategic thinking for service level negotiations'
      },
      fallback: {
        provider: 'gemini',
        model: 'gemini-1.5-pro',
        reason: 'Technical accuracy for SLA metrics and benchmarking'
      }
    }
  };

  // Override with user preference if specified
  if (modelPreference) {
    const baseStrategy = scenarioStrategies[scenario] || scenarioStrategies['sla_enhancement'];
    
    if (modelPreference === 'openai') {
      return {
        primary: {
          provider: 'openai',
          model: 'gpt-4o',
          reason: 'User preference: OpenAI for creative reasoning'
        },
        fallback: baseStrategy.fallback
      };
    } else if (modelPreference === 'gemini') {
      return {
        primary: {
          provider: 'gemini',
          model: 'gemini-1.5-pro',
          reason: 'User preference: Gemini for structured analysis'
        },
        fallback: baseStrategy.fallback
      };
    }
  }

  return scenarioStrategies[scenario] || scenarioStrategies['sla_enhancement'];
}

// Generate content with specified model
async function generateWithModel(
  provider: 'gemini' | 'openai',
  model: string,
  prompt: string,
  contractId: string
) {
  const startTime = Date.now();
  
  const config = {
    temperature: 0.7,
    maxTokens: 4000,
    systemMessage: `You are a specialized contract negotiation strategist. Generate comprehensive, actionable negotiation playbooks based on market intelligence and proven tactics.`
  };

  try {
    const result = await multiLLMClient.callModel(
      provider,
      model as any,
      config,
      prompt,
      contractId
    );
    
    const processingTime = Date.now() - startTime;
    const confidence = calculateConfidence(result.content, provider);
    
    return {
      content: result.content,
      cost: result.cost,
      provider,
      model,
      processingTime,
      confidence
    };
  } catch (error) {
    console.error(`Failed to generate with ${provider}:${model}:`, error);
    throw error;
  }
}

// Calculate confidence score based on content quality and provider
function calculateConfidence(content: string, provider: string): number {
  let score = 0.5;
  
  // Length and structure indicators
  if (content.length > 2000) score += 0.1;
  if (content.length > 4000) score += 0.1;
  
  // Structure indicators
  if (content.includes('EXECUTIVE SUMMARY')) score += 0.1;
  if (content.includes('TALKING POINTS')) score += 0.1;
  if (content.includes('SUCCESS METRICS')) score += 0.1;
  
  // Model-specific confidence adjustments
  if (provider === 'openai' && content.includes('$') && content.includes('%')) {
    score += 0.05; // OpenAI tends to be better with financial analysis
  }
  
  if (provider === 'gemini' && content.includes('compliance') && content.includes('GDPR')) {
    score += 0.05; // Gemini tends to be better with legal/compliance content
  }
  
  return Math.min(score, 1.0);
}

// Determine if cross-validation is needed
function shouldCrossValidate(
  scenario: string, 
  confidence: number, 
  modelPreference?: string
): boolean {
  // Always cross-validate for financial scenarios (high stakes)
  if (scenario.includes('price') || scenario.includes('cost')) {
    return true;
  }
  
  // Cross-validate if confidence is low
  if (confidence < 0.8) {
    return true;
  }
  
  // Cross-validate if user explicitly requests it
  if (modelPreference === 'cross-validate') {
    return true;
  }
  
  return false;
}

// Calculate agreement between two content pieces
function calculateContentAgreement(content1: string, content2: string): number {
  // Simple similarity calculation based on key phrases
  const extractKeyPhrases = (text: string) => {
    return text.toLowerCase()
      .split(/[.!?\n]/)                    // Split by sentences
      .map(s => s.trim())                  // Trim whitespace
      .filter(s => s.length > 20)         // Filter short sentences
      .slice(0, 10);                      // Take first 10 key sentences
  };
  
  const phrases1 = extractKeyPhrases(content1);
  const phrases2 = extractKeyPhrases(content2);
  
  let matches = 0;
  for (const phrase1 of phrases1) {
    for (const phrase2 of phrases2) {
      // Calculate simple word overlap
      const words1 = new Set(phrase1.split(' ').filter(w => w.length > 3));
      const words2 = new Set(phrase2.split(' ').filter(w => w.length > 3));
      
      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);
      
      const similarity = intersection.size / union.size;
      if (similarity > 0.3) {
        matches++;
        break;
      }
    }
  }
  
  return matches / Math.max(phrases1.length, phrases2.length);
}

// Select better result between primary and fallback
function selectBetterResult(
  primary: { content: string; confidence: number; provider: string },
  fallback: { content: string; confidence: number; provider: string }
): 'primary' | 'fallback' {
  // If confidence difference is significant, choose higher confidence
  if (Math.abs(primary.confidence - fallback.confidence) > 0.15) {
    return primary.confidence > fallback.confidence ? 'primary' : 'fallback';
  }
  
  // If confidence is similar, prefer based on content length (more comprehensive)
  if (Math.abs(primary.content.length - fallback.content.length) > 500) {
    return primary.content.length > fallback.content.length ? 'primary' : 'fallback';
  }
  
  // Default to primary if no clear winner
  return 'primary';
}

// Parse response into structured playbook format (reuse from original route)
function parsePlaybookResponse(text: string, metadata: any) {
  const playbook = {
    id: `multi_llm_playbook_${Date.now()}`,
    title: `${metadata.contractType} - ${getScenarioDisplayName(metadata.scenario)}`,
    contractType: metadata.contractType,
    scenario: metadata.scenario,
    objectives: metadata.objectives,
    content: text,
    createdAt: new Date(),
    
    // Parse structured sections from the text
    sections: parseStructuredSections(text)
  };

  return playbook;
}

function getScenarioDisplayName(scenarioId: string): string {
  const scenarioNames: Record<string, string> = {
    'saas_renewal_price_increase': 'SaaS Renewal Price Increase Mitigation',
    'sla_enhancement': 'Service Level Agreement Enhancement',
    'gdpr_dpa_compliance': 'GDPR Data Processing Agreement Compliance',
    'liability_cap_negotiation': 'Liability Cap Negotiation',
    'ip_rights_protection': 'IP Rights Protection',
    'termination_exit_rights': 'Termination & Exit Rights',
    'payment_terms_optimization': 'Payment Terms Optimization',
    'volume_discount_optimization': 'Volume Discount Optimization'
  };
  
  return scenarioNames[scenarioId] || scenarioId;
}

function parseStructuredSections(text: string) {
  const sections: Record<string, string> = {};
  
  // Enhanced section parsing for multi-LLM generated content
  const sectionPatterns = [
    { key: 'executiveSummary', patterns: [
      /EXECUTIVE SUMMARY[:\n]+(.*?)(?=\n##|\n\*\*|\nTALKING|\nRISK|$)/is, 
      /Executive Summary[:\n]+(.*?)(?=\n##|\n\*\*|\nTalking|\nRisk|$)/is,
      /## Executive Summary\n+(.*?)(?=\n##|$)/is
    ]},
    { key: 'talkingPoints', patterns: [
      /BATTLE-TESTED TALKING POINTS[:\n]+(.*?)(?=\n##|\n\*\*|\nRISK|\nTACTICS|$)/is,
      /TALKING POINTS[:\n]+(.*?)(?=\n##|\n\*\*|\nRisk|\nTactics|$)/is,
      /## Talking Points\n+(.*?)(?=\n##|$)/is
    ]},
    { key: 'riskMitigation', patterns: [
      /RISK MITIGATION[:\n]+(.*?)(?=\n##|\n\*\*|\nTACTICS|\nTIMELINE|$)/is,
      /## Risk Mitigation\n+(.*?)(?=\n##|$)/is
    ]},
    { key: 'tactics', patterns: [
      /NEGOTIATION TACTICS[:\n]+(.*?)(?=\n##|\n\*\*|\nTIMELINE|\nSUCCESS|$)/is,
      /## Negotiation Tactics\n+(.*?)(?=\n##|$)/is
    ]},
    { key: 'timeline', patterns: [
      /TIMELINE & PHASES[:\n]+(.*?)(?=\n##|\n\*\*|\nSUCCESS|$)/is,
      /## Timeline\n+(.*?)(?=\n##|$)/is
    ]},
    { key: 'successMetrics', patterns: [
      /SUCCESS METRICS[:\n]+(.*?)(?=\n##|\n\*\*|$)/is,
      /## Success Metrics\n+(.*?)(?=\n##|$)/is
    ]}
  ];

  for (const section of sectionPatterns) {
    for (const pattern of section.patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        sections[section.key] = match[1].trim();
        break;
      }
    }
  }

  return sections;
}