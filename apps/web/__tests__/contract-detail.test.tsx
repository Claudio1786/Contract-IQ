import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, vi } from 'vitest';

import { createApiContractResponse } from '@contract-iq/fixtures';
import { ContractDetail } from '../components/contract-detail';
import { mapContractResponse, ApiContractProcessedResponse } from '../lib/contracts';
import * as ai from '../lib/ai';

describe('ContractDetail', () => {
  const response: ApiContractProcessedResponse = createApiContractResponse('saas-msa', {
    contractId: 'contract_123',
    teamId: 'team_456',
    processedAt: '2025-11-05T12:00:00Z'
  });
  const requestGuidanceSpy = vi.spyOn(ai, 'requestNegotiationGuidance');
  const listHistorySpy = vi.spyOn(ai, 'listNegotiationHistory');

  async function renderContractDetail(contract: ApiContractProcessedResponse) {
    render(<ContractDetail contract={contract} />);
    await screen.findByRole('heading', { level: 2, name: /Negotiation playbook/i });
  }

  beforeEach(() => {
    listHistorySpy.mockResolvedValue([]);
  });

  afterEach(() => {
    requestGuidanceSpy.mockReset();
    listHistorySpy.mockReset();
  });

  it('renders clause intelligence and playbook content', async () => {
    const contract = mapContractResponse(response);

    await renderContractDetail(contract);

    expect(screen.getByText(/Engagement overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Clause intelligence/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /Vendor's aggregate liability is limited to 1x the fees paid in the preceding 12 months./i
      ).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { level: 2, name: /Negotiation playbook/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Liability Cap/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Severity 4\/5/i)).toBeInTheDocument();
    expect(screen.getAllByText(/LLM negotiation prompt/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Structure the response with the following JSON keys/i).length).toBeGreaterThan(0);
  });

  it('shows operational obligations with due dates', async () => {
    const contract = mapContractResponse(response);

    await renderContractDetail(contract);

    expect(screen.getByText(/Operational obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Provide annual SOC 2 Type II report/i)).toBeInTheDocument();
  });

  it('renders empty state messaging when no intelligence is available', async () => {
    const contract = mapContractResponse(response);
    const emptyContract = {
      ...contract,
      payload: {
        ...contract.payload,
        clauses: [],
        risks: [],
        obligations: [],
        negotiation: contract.payload.negotiation
          ? {
              ...contract.payload.negotiation,
              playbook: []
            }
          : { summary: null, playbook: [] }
      }
    };

    await renderContractDetail(emptyContract);

    expect(screen.getByText(/No clause intelligence yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No risks flagged/i)).toBeInTheDocument();
    expect(screen.getByText(/No negotiation topics/i)).toBeInTheDocument();
    expect(screen.getByText(/No obligations surfaced/i)).toBeInTheDocument();
  });

  it('allows expanding clause fallback guidance', async () => {
    const contract = mapContractResponse(response);
    const user = userEvent.setup();

    await renderContractDetail(contract);

    const clauseCards = screen.getAllByRole('article');
    const firstClauseCard = clauseCards[0];
    const fallbackToggle = within(firstClauseCard).getByRole('button', { name: /View fallback guidance/i });
    expect(
      within(firstClauseCard).queryByText(/Set cap to 2x fees with carve-outs for data breach and IP claims/i)
    ).not.toBeInTheDocument();

    await user.click(fallbackToggle);

    expect(
      within(firstClauseCard).getByText(/Set cap to 2x fees with carve-outs for data breach and IP claims/i)
    ).toBeInTheDocument();
    expect(within(firstClauseCard).getByRole('button', { name: /Hide fallback guidance/i })).toBeInTheDocument();
  });

  it('tracks risk escalation and copies negotiation prompts', async () => {
    const contract = mapContractResponse(response);
    const user = userEvent.setup();
    const clipboardWrite = vi.fn().mockResolvedValue(undefined);
    const originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: clipboardWrite
      }
    });

    try {
      await renderContractDetail(contract);

      const riskHeading = screen.getByRole('heading', { level: 2, name: /Risk posture/i });
      const riskSection = riskHeading.closest('section');
      if (!riskSection) {
        throw new Error('Risk section not found');
      }
      const escalateButton = within(riskSection).getAllByRole('button', { name: /Escalate risk/i })[0];
      await user.click(escalateButton);

      expect(within(riskSection).getByText(/Escalation logged/i)).toBeInTheDocument();
      expect(within(riskSection).getByRole('button', { name: /Escalated/i })).toBeDisabled();

      const playbookHeading = screen.getByRole('heading', { level: 2, name: /Negotiation playbook/i });
      const playbookSection = playbookHeading.closest('section');
      if (!playbookSection) {
        throw new Error('Playbook section not found');
      }
      const copyButton = within(playbookSection).getAllByRole('button', { name: /Copy prompt/i })[0];
      await user.click(copyButton);

      expect(clipboardWrite).toHaveBeenCalledTimes(1);
      expect(within(playbookSection).getByRole('button', { name: /Copied!/i })).toBeInTheDocument();
    } finally {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: originalClipboard
      });
    }
  });

  it('generates Gemini guidance for the selected topic', async () => {
    const contract = mapContractResponse(response);
    const user = userEvent.setup();

    requestGuidanceSpy.mockResolvedValueOnce({
      guidanceId: 'guidance_001',
      contractId: 'contract_123',
      templateId: 'saas-msa',
      topic: 'Liability Cap',
      generatedAt: '2025-11-05T12:00:00Z',
      summary: 'Focus on net revenue retention safeguards.',
      fallbackRecommendation: 'Counter with a liability cap pegged to 2x trailing twelve month fees.',
      talkingPoints: ['Our standard is 2x trailing fees', 'Align with industry benchmarks for SaaS MSAs'],
      riskCallouts: ['Current cap exposes us to disproportionate indemnity exposure.'],
      confidence: 0.82,
      cached: false,
      model: 'gemini-1.5-flash-latest',
      latencyMs: 420,
      documentationUrl: 'https://docs.contractiq.ai/liability-cap',
      generatedPrompt: 'Explain the rationale for liability caps with 2x fees.'
    });

    await renderContractDetail(contract);

    const generateButton = await screen.findByRole('button', { name: /Generate with Gemini/i });
    expect(generateButton).toBeInTheDocument();
    await user.click(generateButton);

    expect(requestGuidanceSpy).toHaveBeenCalledTimes(1);
    const payload = requestGuidanceSpy.mock.calls[0]?.[0];
    expect(payload).toBeDefined();
    expect(payload.topic).toBe('Liability Cap');
    expect(payload.contract_id).toBe('contract_123');

    const summaryHeading = await screen.findByRole('heading', { name: /Summary/i });
    const summarySection = summaryHeading.closest('section');
    expect(summarySection).toBeTruthy();
    if (summarySection) {
      expect(
        within(summarySection).getByText(/Focus on net revenue retention safeguards/i)
      ).toBeInTheDocument();
    }
    expect(
      screen.getByText(/Counter with a liability cap pegged to 2x trailing twelve month fees/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Key talking points/i)).toBeInTheDocument();
    expect(screen.getByText(/Risk callouts/i)).toBeInTheDocument();
    expect(screen.getByText(/Model gemini-1\.5-flash-latest/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View reference documentation/i })).toHaveAttribute(
      'href',
      'https://docs.contractiq.ai/liability-cap'
    );

    const historyHeading = await screen.findByRole('heading', { name: /Recent Gemini guidance/i });
    const historySection = historyHeading.parentElement?.parentElement;
    expect(historySection).toBeInTheDocument();
    if (historySection) {
      expect(await within(historySection).findByText(/Fresh generation/i)).toBeInTheDocument();
    }
  });

  it('renders persisted Gemini guidance history and allows review', async () => {
    const contract = mapContractResponse(response);
    const user = userEvent.setup();

    listHistorySpy.mockResolvedValueOnce([
      {
        guidance: {
          guidanceId: 'persisted_001',
          contractId: 'contract_123',
          templateId: 'saas-msa',
          topic: 'Liability Cap',
          generatedAt: '2025-11-04T10:30:00Z',
          summary: 'Persisted Gemini summary for liability considerations.',
          fallbackRecommendation: 'Fallback to 2x fees with breach carve-out.',
          talkingPoints: ['Position around parity with customer contracts'],
          riskCallouts: ['Monitor indemnity exposure'],
          confidence: 0.76,
          cached: false,
          model: 'gemini-1.5-flash-latest',
          latencyMs: 380,
          documentationUrl: null,
          generatedPrompt: null
        },
        context: {
          topic: 'Liability Cap',
          contract_id: 'contract_123',
          template_id: 'saas-msa',
          current_position: 'Cap at 1x fees',
          target_position: 'Cap at 2x fees',
          fallback_position: 'Cap at 1.5x fees'
        }
      }
    ]);

    await renderContractDetail(contract);

    const summaryHeading = await screen.findByRole('heading', { name: /Summary/i });
    const summarySection = summaryHeading.closest('section');
    expect(summarySection).toBeTruthy();
    if (summarySection) {
      const guidanceResult = summarySection.parentElement;
      expect(guidanceResult).toBeTruthy();
      if (guidanceResult) {
        expect(
          within(summarySection).getByText(/Persisted Gemini summary for liability considerations/i)
        ).toBeInTheDocument();
        expect(
          within(guidanceResult).getByText(/Fresh generation/i)
        ).toBeInTheDocument();
      }
    }

    const reviewButton = screen.getByRole('button', { name: /Review/i });
    expect(reviewButton).toBeEnabled();
    await user.click(reviewButton);

    expect(screen.getByText(/Fallback to 2x fees with breach carve-out/i)).toBeInTheDocument();
  });
});
