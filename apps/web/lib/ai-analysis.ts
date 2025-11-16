/**
 * AI Analysis Engine
 * Epic 4: Task 4.1, 4.2, 4.3, 4.4
 * 
 * Analyzes contracts for risks, costs, key terms, and compliance
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ContractAnalysis {
  // Risk Assessment (Task 4.1)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number; // 0-100
  liabilityRisks: string[];
  terminationRisks: string[];
  renewalRisks: string[];
  
  // Cost Analysis (Task 4.2)
  detectedValue?: number;
  paymentTerms?: string;
  priceEscalation?: string;
  hiddenCosts: string[];
  
  // Key Terms (Task 4.3)
  vendor?: string;
  startDate?: Date;
  endDate?: Date;
  autoRenewal: boolean;
  noticePerion?: string;
  keyTerms: string[];
  
  // Compliance (Task 4.4)
  complianceIssues: string[];
  missingClauses: string[];
  recommendations: string[];
  
  // Metadata
  confidence: number;
  analyzedAt: Date;
  model: string;
}

/**
 * AI Analysis Service
 */
export class AIAnalysisService {
  private genai: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (apiKey) {
      try {
        this.genai = new GoogleGenerativeAI(apiKey);
        this.model = this.genai.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
      } catch (error) {
        console.error('Failed to initialize Gemini:', error);
      }
    }
  }

  /**
   * Analyze contract text
   */
  async analyzeContract(contractText: string, contractTitle: string): Promise<ContractAnalysis> {
    // If no AI available, return stub analysis
    if (!this.model) {
      return this.createStubAnalysis(contractText, contractTitle);
    }

    try {
      const prompt = this.buildAnalysisPrompt(contractText, contractTitle);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const analysis = this.parseAnalysisResponse(text);
      return analysis;
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.createStubAnalysis(contractText, contractTitle);
    }
  }

  /**
   * Build comprehensive analysis prompt
   */
  private buildAnalysisPrompt(contractText: string, contractTitle: string): string {
    return `You are a contract analysis expert. Analyze the following contract and return a JSON response with this exact structure:

{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "riskScore": number (0-100),
  "liabilityRisks": ["risk1", "risk2"],
  "terminationRisks": ["risk1", "risk2"],
  "renewalRisks": ["risk1", "risk2"],
  "detectedValue": number | null,
  "paymentTerms": "string" | null,
  "priceEscalation": "string" | null,
  "hiddenCosts": ["cost1", "cost2"],
  "vendor": "string" | null,
  "startDate": "YYYY-MM-DD" | null,
  "endDate": "YYYY-MM-DD" | null,
  "autoRenewal": boolean,
  "noticePerion": "string" | null,
  "keyTerms": ["term1", "term2", "term3"],
  "complianceIssues": ["issue1", "issue2"],
  "missingClauses": ["clause1", "clause2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "confidence": number (0-1)
}

Contract Title: ${contractTitle}

Contract Text:
${contractText.substring(0, 20000)}

Analyze for:
1. RISK ASSESSMENT: Identify liability, termination, and renewal risks
2. COST ANALYSIS: Extract pricing, payment terms, escalation clauses, hidden costs
3. KEY TERMS: Extract vendor, dates, auto-renewal, notice period, important terms
4. COMPLIANCE: Identify issues, missing standard clauses, provide recommendations

Return ONLY valid JSON. Be thorough but concise. Confidence should reflect certainty.`;
  }

  /**
   * Parse AI response
   */
  private parseAnalysisResponse(responseText: string): ContractAnalysis {
    try {
      // Try to extract JSON from markdown code blocks
      let jsonText = responseText;
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else {
        const codeMatch = responseText.match(/```\n([\s\S]*?)\n```/);
        if (codeMatch) {
          jsonText = codeMatch[1];
        }
      }

      const parsed = JSON.parse(jsonText);

      return {
        riskLevel: parsed.riskLevel || 'MEDIUM',
        riskScore: parsed.riskScore || 50,
        liabilityRisks: Array.isArray(parsed.liabilityRisks) ? parsed.liabilityRisks : [],
        terminationRisks: Array.isArray(parsed.terminationRisks) ? parsed.terminationRisks : [],
        renewalRisks: Array.isArray(parsed.renewalRisks) ? parsed.renewalRisks : [],
        detectedValue: parsed.detectedValue || undefined,
        paymentTerms: parsed.paymentTerms || undefined,
        priceEscalation: parsed.priceEscalation || undefined,
        hiddenCosts: Array.isArray(parsed.hiddenCosts) ? parsed.hiddenCosts : [],
        vendor: parsed.vendor || undefined,
        startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
        endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
        autoRenewal: parsed.autoRenewal || false,
        noticePerion: parsed.noticePerion || undefined,
        keyTerms: Array.isArray(parsed.keyTerms) ? parsed.keyTerms : [],
        complianceIssues: Array.isArray(parsed.complianceIssues) ? parsed.complianceIssues : [],
        missingClauses: Array.isArray(parsed.missingClauses) ? parsed.missingClauses : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        confidence: parsed.confidence || 0.7,
        analyzedAt: new Date(),
        model: 'gemini-1.5-pro-latest',
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  /**
   * Create stub analysis when AI is unavailable
   */
  private createStubAnalysis(contractText: string, contractTitle: string): ContractAnalysis {
    // Simple heuristics for demo
    const wordCount = contractText.split(/\s+/).length;
    const hasAutoRenewal = /auto.*renew|automatic.*renew/i.test(contractText);
    const hasTermination = /terminat|cancel/i.test(contractText);
    const hasLiability = /liabilit|indemnif/i.test(contractText);

    let riskScore = 40;
    if (hasAutoRenewal) riskScore += 15;
    if (!hasTermination) riskScore += 10;
    if (hasLiability) riskScore += 15;
    if (wordCount < 1000) riskScore += 10; // Short contract = less detail

    const riskLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 50 ? 'MEDIUM' : 'LOW';

    return {
      riskLevel,
      riskScore,
      liabilityRisks: hasLiability 
        ? ['Liability clause detected - requires legal review']
        : ['No explicit liability limitations found'],
      terminationRisks: hasTermination
        ? ['Termination clause present - review notice requirements']
        : ['No clear termination clause identified'],
      renewalRisks: hasAutoRenewal
        ? ['Auto-renewal detected - calendar reminder recommended']
        : ['Manual renewal - track expiration date'],
      hiddenCosts: [],
      vendor: this.extractVendor(contractTitle),
      autoRenewal: hasAutoRenewal,
      keyTerms: [
        'Review payment terms',
        'Verify termination rights',
        'Check notice periods',
      ],
      complianceIssues: wordCount < 1000 
        ? ['Contract appears incomplete - missing standard clauses']
        : [],
      missingClauses: [
        'Recommended: Add data privacy clause',
        'Recommended: Add dispute resolution clause',
      ],
      recommendations: [
        'Have legal team review liability sections',
        'Set calendar reminder for renewal date',
        'Document key stakeholder contacts',
      ],
      confidence: 0.6,
      analyzedAt: new Date(),
      model: 'stub-fallback',
    };
  }

  /**
   * Extract vendor name from title
   */
  private extractVendor(title: string): string | undefined {
    // Simple extraction - first word before common contract terms
    const cleaned = title.replace(/\.(pdf|docx|doc|txt)$/i, '');
    const parts = cleaned.split(/\s+/);
    
    for (let i = 0; i < Math.min(3, parts.length); i++) {
      const word = parts[i];
      if (!/^(contract|agreement|msa|sla|order|form|master|service)$/i.test(word)) {
        return word;
      }
    }
    
    return undefined;
  }
}

/**
 * Singleton instance
 */
let aiAnalysisService: AIAnalysisService | null = null;

export function getAIAnalysisService(): AIAnalysisService {
  if (!aiAnalysisService) {
    aiAnalysisService = new AIAnalysisService();
  }
  return aiAnalysisService;
}
