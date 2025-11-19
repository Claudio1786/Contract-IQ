/**
 * Contract Comparison Engine
 * Core markup analysis and change detection system
 */

import { ContractChange, ContractDocument } from './gmail-integration';

export interface ComparisonResult {
  changes: ContractChange[];
  summary: ComparisonSummary;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'accept' | 'pushback' | 'escalate';
  confidence: number;
}

export interface ComparisonSummary {
  totalChanges: number;
  additions: number;
  deletions: number;
  modifications: number;
  criticalChanges: number;
  majorChanges: number;
  minorChanges: number;
  categoryCounts: Record<ContractChange['category'], number>;
}

export interface ContractSection {
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
  keywords: string[];
}

export interface DiffResult {
  type: 'addition' | 'deletion' | 'modification';
  original: string;
  modified: string;
  context: string;
  confidence: number;
}

class ContractComparisonEngine {
  private readonly sectionPatterns = [
    { title: 'Payment Terms', keywords: ['payment', 'invoice', 'billing', 'due', 'net'] },
    { title: 'Liability Limitation', keywords: ['liability', 'limitation', 'damages', 'indemnification'] },
    { title: 'Termination', keywords: ['termination', 'terminate', 'end', 'expire', 'cancel'] },
    { title: 'Intellectual Property', keywords: ['intellectual property', 'ip', 'copyright', 'patent', 'trademark'] },
    { title: 'Data Protection', keywords: ['data', 'privacy', 'gdpr', 'personal information', 'confidential'] },
    { title: 'Service Levels', keywords: ['sla', 'service level', 'uptime', 'performance', 'availability'] },
    { title: 'Pricing', keywords: ['price', 'fee', 'cost', 'rate', 'subscription'] },
    { title: 'Scope of Work', keywords: ['scope', 'services', 'deliverables', 'work', 'responsibilities'] }
  ];

  private readonly criticalKeywords = [
    'liability', 'limitation', 'damages', 'indemnification', 'terminate', 'termination',
    'confidential', 'ip', 'intellectual property', 'warranty', 'breach'
  ];

  private readonly majorKeywords = [
    'payment', 'billing', 'price', 'fee', 'sla', 'service level', 'deadline',
    'penalty', 'data', 'privacy', 'security'
  ];

  /**
   * Main comparison method
   */
  async compareContracts(
    original: ContractDocument, 
    modified: ContractDocument
  ): Promise<ComparisonResult> {
    try {
      // Extract sections from both documents
      const originalSections = this.extractSections(original.content);
      const modifiedSections = this.extractSections(modified.content);

      // Perform detailed diff analysis
      const changes = await this.analyzeChanges(originalSections, modifiedSections);

      // Generate summary statistics
      const summary = this.generateSummary(changes);

      // Calculate overall risk and recommendation
      const riskLevel = this.calculateRiskLevel(changes);
      const recommendation = this.generateRecommendation(changes, riskLevel);
      const confidence = this.calculateConfidence(changes);

      return {
        changes,
        summary,
        riskLevel,
        recommendation,
        confidence
      };
    } catch (error) {
      console.error('Contract comparison failed:', error);
      throw new Error('Failed to analyze contract changes');
    }
  }

  /**
   * Extract logical sections from contract text
   */
  private extractSections(content: string): ContractSection[] {
    const sections: ContractSection[] = [];
    const lines = content.split('\n');
    
    // Simple section detection based on headers and keywords
    for (const pattern of this.sectionPatterns) {
      const sectionContent = this.findSectionContent(content, pattern.keywords);
      if (sectionContent) {
        sections.push({
          title: pattern.title,
          content: sectionContent,
          startIndex: content.indexOf(sectionContent),
          endIndex: content.indexOf(sectionContent) + sectionContent.length,
          keywords: pattern.keywords
        });
      }
    }

    return sections;
  }

  /**
   * Find content related to specific keywords
   */
  private findSectionContent(content: string, keywords: string[]): string | null {
    const sentences = content.split(/[.!?]+/);
    const relevantSentences: string[] = [];

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (keywords.some(keyword => lowerSentence.includes(keyword))) {
        relevantSentences.push(sentence.trim());
      }
    }

    return relevantSentences.length > 0 ? relevantSentences.join('. ') : null;
  }

  /**
   * Analyze changes between original and modified sections
   */
  private async analyzeChanges(
    originalSections: ContractSection[],
    modifiedSections: ContractSection[]
  ): Promise<ContractChange[]> {
    const changes: ContractChange[] = [];

    // Compare sections by title/keywords
    for (const originalSection of originalSections) {
      const matchingModified = modifiedSections.find(section => 
        section.title === originalSection.title ||
        this.sectionsMatch(originalSection, section)
      );

      if (!matchingModified) {
        // Section was deleted
        changes.push({
          type: 'deletion',
          section: originalSection.title,
          original: originalSection.content,
          modified: '',
          severity: this.calculateSeverity(originalSection.content),
          category: this.categorizeChange(originalSection.content),
          recommendation: this.getChangeRecommendation('deletion', originalSection.content),
          rationale: `${originalSection.title} section was removed from the contract`
        });
      } else {
        // Compare content for modifications
        const sectionChanges = this.compareText(
          originalSection.content,
          matchingModified.content,
          originalSection.title
        );
        changes.push(...sectionChanges);
      }
    }

    // Check for new sections (additions)
    for (const modifiedSection of modifiedSections) {
      const matchingOriginal = originalSections.find(section =>
        section.title === modifiedSection.title ||
        this.sectionsMatch(section, modifiedSection)
      );

      if (!matchingOriginal) {
        changes.push({
          type: 'addition',
          section: modifiedSection.title,
          original: '',
          modified: modifiedSection.content,
          severity: this.calculateSeverity(modifiedSection.content),
          category: this.categorizeChange(modifiedSection.content),
          recommendation: this.getChangeRecommendation('addition', modifiedSection.content),
          rationale: `New ${modifiedSection.title} section added to the contract`
        });
      }
    }

    return changes;
  }

  /**
   * Compare two text blocks for specific changes
   */
  private compareText(original: string, modified: string, sectionTitle: string): ContractChange[] {
    const changes: ContractChange[] = [];

    // Simple word-level diff (in production, use more sophisticated diff algorithm)
    const originalWords = original.split(/\s+/);
    const modifiedWords = modified.split(/\s+/);

    // Detect significant changes (>10% word difference)
    const wordDifference = Math.abs(originalWords.length - modifiedWords.length) / originalWords.length;
    
    if (wordDifference > 0.1 || !this.areTextsSignificantlySimilar(original, modified)) {
      changes.push({
        type: 'modification',
        section: sectionTitle,
        original: original,
        modified: modified,
        severity: this.calculateSeverity(modified),
        category: this.categorizeChange(modified),
        recommendation: this.getChangeRecommendation('modification', modified),
        rationale: this.generateChangeRationale(original, modified, sectionTitle)
      });
    }

    return changes;
  }

  /**
   * Calculate severity of a change
   */
  private calculateSeverity(text: string): ContractChange['severity'] {
    const lowerText = text.toLowerCase();
    
    if (this.criticalKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'critical';
    }
    
    if (this.majorKeywords.some(keyword => lowerText.includes(keyword))) {
      return 'major';
    }
    
    return 'minor';
  }

  /**
   * Categorize change by business area
   */
  private categorizeChange(text: string): ContractChange['category'] {
    const lowerText = text.toLowerCase();
    
    if (['payment', 'billing', 'price', 'fee', 'cost'].some(k => lowerText.includes(k))) {
      return 'pricing';
    }
    
    if (['liability', 'damages', 'indemnification', 'limitation'].some(k => lowerText.includes(k))) {
      return 'liability';
    }
    
    if (['scope', 'services', 'deliverables', 'work'].some(k => lowerText.includes(k))) {
      return 'scope';
    }
    
    if (['termination', 'term', 'expire', 'deadline'].some(k => lowerText.includes(k))) {
      return 'terms';
    }
    
    return 'other';
  }

  /**
   * Generate recommendation for a change
   */
  private getChangeRecommendation(
    changeType: ContractChange['type'],
    text: string
  ): ContractChange['recommendation'] {
    const severity = this.calculateSeverity(text);
    const category = this.categorizeChange(text);
    
    // Critical liability changes always escalate
    if (severity === 'critical' && category === 'liability') {
      return 'escalate';
    }
    
    // Major pricing changes typically require pushback
    if (severity === 'major' && category === 'pricing') {
      return 'pushback';
    }
    
    // Deletions of critical sections escalate
    if (changeType === 'deletion' && severity === 'critical') {
      return 'escalate';
    }
    
    // Minor changes can often be accepted
    if (severity === 'minor') {
      return 'accept';
    }
    
    // Default to pushback for major changes
    return 'pushback';
  }

  /**
   * Generate human-readable rationale for a change
   */
  private generateChangeRationale(
    original: string,
    modified: string,
    sectionTitle: string
  ): string {
    const category = this.categorizeChange(modified);
    const severity = this.calculateSeverity(modified);
    
    const templates = {
      pricing: {
        critical: 'Significant pricing changes may impact deal profitability',
        major: 'Payment term modifications affect cash flow and revenue recognition',
        minor: 'Minor pricing adjustments are within acceptable ranges'
      },
      liability: {
        critical: 'Liability limitation changes pose significant business risk exposure',
        major: 'Indemnification terms require legal review for risk assessment',
        minor: 'Standard liability clause modifications'
      },
      terms: {
        critical: 'Termination clause changes affect contract enforceability',
        major: 'Term modifications impact service delivery timelines',
        minor: 'Minor adjustments to contract terms'
      },
      scope: {
        critical: 'Scope changes may affect deliverable commitments',
        major: 'Service scope modifications require capacity assessment',
        minor: 'Minor clarifications to service scope'
      },
      other: {
        critical: 'Critical contract modifications require escalation',
        major: 'Significant changes require management review',
        minor: 'Minor contract adjustments'
      }
    };
    
    return templates[category]?.[severity] || `${sectionTitle} modifications require review`;
  }

  // Utility methods
  private sectionsMatch(section1: ContractSection, section2: ContractSection): boolean {
    return section1.keywords.some(keyword => 
      section2.keywords.includes(keyword)
    );
  }

  private areTextsSignificantlySimilar(text1: string, text2: string): boolean {
    // Simple similarity check (in production, use more sophisticated algorithm)
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size > 0.7; // 70% similarity threshold
  }

  private generateSummary(changes: ContractChange[]): ComparisonSummary {
    const summary: ComparisonSummary = {
      totalChanges: changes.length,
      additions: changes.filter(c => c.type === 'addition').length,
      deletions: changes.filter(c => c.type === 'deletion').length,
      modifications: changes.filter(c => c.type === 'modification').length,
      criticalChanges: changes.filter(c => c.severity === 'critical').length,
      majorChanges: changes.filter(c => c.severity === 'major').length,
      minorChanges: changes.filter(c => c.severity === 'minor').length,
      categoryCounts: {
        pricing: changes.filter(c => c.category === 'pricing').length,
        liability: changes.filter(c => c.category === 'liability').length,
        terms: changes.filter(c => c.category === 'terms').length,
        scope: changes.filter(c => c.category === 'scope').length,
        other: changes.filter(c => c.category === 'other').length
      }
    };
    
    return summary;
  }

  private calculateRiskLevel(changes: ContractChange[]): 'low' | 'medium' | 'high' {
    const criticalCount = changes.filter(c => c.severity === 'critical').length;
    const majorCount = changes.filter(c => c.severity === 'major').length;
    
    if (criticalCount > 0 || majorCount > 3) return 'high';
    if (majorCount > 1 || changes.length > 5) return 'medium';
    return 'low';
  }

  private generateRecommendation(
    changes: ContractChange[],
    riskLevel: 'low' | 'medium' | 'high'
  ): 'accept' | 'pushback' | 'escalate' {
    const escalateCount = changes.filter(c => c.recommendation === 'escalate').length;
    const pushbackCount = changes.filter(c => c.recommendation === 'pushback').length;
    
    if (escalateCount > 0 || riskLevel === 'high') return 'escalate';
    if (pushbackCount > 2 || riskLevel === 'medium') return 'pushback';
    return 'accept';
  }

  private calculateConfidence(changes: ContractChange[]): number {
    // Confidence based on change clarity and analysis completeness
    if (changes.length === 0) return 0.95; // High confidence in no changes
    if (changes.length > 10) return 0.75; // Lower confidence with many changes
    return 0.85; // Standard confidence level
  }
}

export default ContractComparisonEngine;