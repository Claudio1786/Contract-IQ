import React from 'react';
import { render, screen } from '@testing-library/react';

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
});