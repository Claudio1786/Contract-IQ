import React from 'react';
import { render, screen } from '@testing-library/react';

import { ContractSkeleton } from '../components/contract-skeleton';

describe('ContractSkeleton', () => {
  it('exposes loading semantics for assistive tech', () => {
    render(<ContractSkeleton />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText(/Loading contract dossier/i)).toBeInTheDocument();
  });
});