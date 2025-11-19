import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Pill } from './index';

describe('Pill', () => {
  it('renders label text', () => {
    render(<Pill label="Verified" variant="success" />);

    expect(screen.getByText('Verified')).toBeInTheDocument();
  });
});