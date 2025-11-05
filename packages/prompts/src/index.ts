export interface ExtractionPromptInput {
  contractType: 'msa' | 'sponsorship' | 'nil';
  sections: string[];
  language?: string;
}

export function buildExtractionPrompt(input: ExtractionPromptInput): string {
  const locale = input.language ?? 'English';
  const sectionList = input.sections.map((section, index) => `${index + 1}. ${section}`).join('\n');

  return `You are an expert contract analyst operating in ${locale}.\n` +
    `Extract structured data for a ${input.contractType.toUpperCase()} agreement.\n` +
    `Focus on the following sections:\n${sectionList}\n` +
    `Respond in JSON with keys: clause, value, confidence.`;
}

export interface PlaybookPromptInput {
  contractName: string;
  contractType?: string;
  topic: string;
  currentPosition?: string;
  targetPosition: string;
  fallbackPosition?: string;
  impactLevel?: 'low' | 'medium' | 'high';
  stakeholders?: string[];
  counterpartyPersona?: string;
  riskSignal?: string;
  clauseSynopsis?: string;
  confidence?: number;
}

export function buildPlaybookPrompt(input: PlaybookPromptInput): string {
  const stakeholders = (input.stakeholders ?? []).map((stakeholder) => `- ${stakeholder}`).join('\n') || '- None provided';
  const persona = input.counterpartyPersona ?? 'counterparty negotiator';
  const fallback = input.fallbackPosition ? `If the target is declined, offer fallback: ${input.fallbackPosition}.\n` : '';
  const risk = input.riskSignal ? `Risk signal: ${input.riskSignal}.\n` : '';
  const synopsis = input.clauseSynopsis ? `Clause synopsis: ${input.clauseSynopsis}\n` : '';
  const confidence = typeof input.confidence === 'number'
    ? `Confidence in recommendation: ${(input.confidence * 100).toFixed(0)}%.\n`
    : '';
  const tone = input.impactLevel === 'high' ? 'assertive' : 'collaborative';

  const header = `You are supporting an enterprise negotiation for the ${input.contractName} ${
    input.contractType ? `${input.contractType.toUpperCase()} ` : ''
  }agreement.\n`;

  return (
    header +
    `Topic: ${input.topic}.\n` +
    `Current position: ${input.currentPosition ?? 'Not specified'}.\n` +
    `Desired target position: ${input.targetPosition}.\n` +
    fallback +
    synopsis +
    risk +
    `Impact level: ${(input.impactLevel ?? 'medium').toUpperCase()}.\n` +
    confidence +
    `Stakeholders impacted:\n${stakeholders}\n` +
    `Provide a ${tone} negotiation talk track tailored for the ${persona}.\n` +
    `Structure the response with the following JSON keys: "talk_track", "objection_handling", "next_step".\n` +
    `Ensure the talk track weaves in the target position rationale and references quantifiable value or risk.`
  );
}