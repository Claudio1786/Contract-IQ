import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ContractError from '../app/contracts/[templateId]/error';

describe('Contract dossier error boundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  it('retries with exponential backoff and reveals support guidance after three attempts', async () => {
    const reset = vi.fn();

    render(<ContractError error={new Error('Test failure')} reset={reset} />);

    const button = screen.getByRole('button', { name: /Try again/i });
    expect(button).toBeEnabled();

    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Retrying/i);
    expect(screen.getByText(/Retrying in 250 ms/i)).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250);
    });
    expect(reset).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Try again/i }));
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(reset).toHaveBeenCalledTimes(2);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Try again/i }));
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(reset).toHaveBeenCalledTimes(3);
    expect(screen.getByText(/Retry attempts:\s*3/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /support@contractiq.ai/i })).toBeInTheDocument();
  });
});