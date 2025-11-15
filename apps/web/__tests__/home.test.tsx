import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Home from '../app/page';

describe('Home', () => {
  it('renders key value propositions', () => {
    render(<Home />);

    expect(screen.getByText(/Operational intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Signal clarity/i)).toBeInTheDocument();
    expect(screen.getByText(/Faster execution/i)).toBeInTheDocument();
  });
});