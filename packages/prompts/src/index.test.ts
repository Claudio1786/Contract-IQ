import { describe, expect, it } from 'vitest';

import { buildExtractionPrompt, buildPlaybookPrompt } from './index';

describe('buildExtractionPrompt', () => {
  it('creates a structured prompt with numbered sections', () => {
    const prompt = buildExtractionPrompt({
      contractType: 'msa',
      sections: ['Term', 'Renewal', 'Termination'],
      language: 'English'
    });

    expect(prompt).toContain('Extract structured data for a MSA agreement');
    expect(prompt).toContain('1. Term');
    expect(prompt).toContain('3. Termination');
    expect(prompt).toContain('Respond in JSON with keys: clause, value, confidence.');
  });
});

describe('buildPlaybookPrompt', () => {
  it('creates a negotiation playbook prompt with contextual framing', () => {
    const prompt = buildPlaybookPrompt({
      contractName: 'Northstar Retail Holdings — LatticeWorks',
      contractType: 'msa',
      topic: 'Liability Cap',
      currentPosition: '1x ARR',
      targetPosition: '2x ARR',
      fallbackPosition: '1.5x ARR with breach carve-outs',
      impactLevel: 'high',
      stakeholders: ['legal', 'procurement'],
      riskSignal: 'Cap below peer benchmark (2.1x ARR)',
      clauseSynopsis: "Vendor liability limited to fees paid in prior 12 months.",
      confidence: 0.72
    });

    expect(prompt).toContain('Topic: Liability Cap');
    expect(prompt).toContain('Desired target position: 2x ARR');
    expect(prompt).toContain('If the target is declined, offer fallback: 1.5x ARR with breach carve-outs.');
    expect(prompt).toContain('Stakeholders impacted');
    expect(prompt).toContain('Structure the response with the following JSON keys');
  });
});