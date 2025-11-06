import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { createApiContractResponse } from '@contract-iq/fixtures';
import { ContractDetail } from '../components/contract-detail';
import { mapContractResponse, ApiContractProcessedResponse } from '../lib/contracts';

describe('ContractDetail', () => {
  const response: ApiContractProcessedResponse = createApiContractResponse('saas-msa', {
    contractId: 'contract_123',
    teamId: 'team_456',
    processedAt: '2025-11-05T12:00:00Z'
  });

  it('renders clause intelligence and playbook content', () => {
    const contract = mapContractResponse(response);

    render(<ContractDetail contract={contract} />);

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

  it('shows operational obligations with due dates', () => {
    const contract = mapContractResponse(response);

    render(<ContractDetail contract={contract} />);

    expect(screen.getByText(/Operational obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/Provide annual SOC 2 Type II report/i)).toBeInTheDocument();
  });

  it('renders empty state messaging when no intelligence is available', () => {
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

    render(<ContractDetail contract={emptyContract} />);

    expect(screen.getByText(/No clause intelligence yet/i)).toBeInTheDocument();
    expect(screen.getByText(/No risks flagged/i)).toBeInTheDocument();
    expect(screen.getByText(/No negotiation topics/i)).toBeInTheDocument();
    expect(screen.getByText(/No obligations surfaced/i)).toBeInTheDocument();
  });

  it('allows expanding clause fallback guidance', async () => {
    const contract = mapContractResponse(response);
    const user = userEvent.setup();

    render(<ContractDetail contract={contract} />);

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
      render(<ContractDetail contract={contract} />);

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
});