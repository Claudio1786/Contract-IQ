import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Home from '../app/page';

describe('Home', () => {
  it('renders key value propositions', () => {
    render(<Home />);

    // Updated copy: verify key hero/section texts
    expect(
      screen.getByText(/AI-Powered Revenue Intelligence for Revenue Teams/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Turn Customer Contracts Into Revenue Intelligence/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Built for Revenue Operations Teams/i)
    ).toBeInTheDocument();
  });
});