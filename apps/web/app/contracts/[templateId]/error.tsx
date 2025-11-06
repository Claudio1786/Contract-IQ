'use client';

import React from 'react';
import Link from 'next/link';

interface ContractErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ContractError({ error, reset }: ContractErrorProps) {
  const [attempts, setAttempts] = React.useState(0);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const retryTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    console.error('Failed to render contract dossier', error);

    return () => {
      if (retryTimer.current) {
        window.clearTimeout(retryTimer.current);
      }
    };
  }, [error]);

  const delayForAttempt = React.useCallback((attempt: number) => {
    const baseDelay = 250;
    const multiplier = Math.pow(2, attempt - 1);
    return Math.min(1000, baseDelay * multiplier);
  }, []);

  const [pendingDelay, setPendingDelay] = React.useState<number | null>(null);

  const handleRetry = React.useCallback(() => {
    if (retryTimer.current) {
      window.clearTimeout(retryTimer.current);
    }

    const nextAttempt = attempts + 1;
    const delay = delayForAttempt(nextAttempt);
    setAttempts(nextAttempt);
    setIsRetrying(true);
    setPendingDelay(delay);

    retryTimer.current = window.setTimeout(() => {
      retryTimer.current = null;
      setIsRetrying(false);
      setPendingDelay(null);
      reset();
    }, delay);
  }, [attempts, delayForAttempt, reset]);

  const supportMessageVisible = attempts >= 3;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-rose-300">Contract dossier unavailable</p>
          <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">We hit a snag loading this contract</h1>
          <p className="text-base text-slate-300">
            The dossier request failed to complete. You can retry in place, or head back to the workspace while we
            continue investigating. If the issue persists, reach out to support and include the reference code below.
          </p>
        </header>

        <section className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-100">What happened?</h2>
            <p className="text-sm text-slate-400">
              {error.message || 'The contract intelligence service returned an unexpected error.'}
            </p>
            {error.digest ? (
              <p className="text-xs text-slate-500">Reference code: {error.digest}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3" aria-live="polite">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:bg-amber-500/40 disabled:text-slate-400"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? 'Retrying…' : 'Try again'}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              Back to workspace
            </Link>
          </div>

          {pendingDelay ? (
            <p className="text-xs text-slate-500" aria-live="polite">
              Retrying in {pendingDelay} ms…
            </p>
          ) : null}

          <p className="text-xs text-slate-500">
            Retry attempts: {attempts}{' '}
            {supportMessageVisible ? (
              <>
                — We recommend contacting{' '}
                <a
                  href="mailto:support@contractiq.ai"
                  className="font-medium text-amber-300 underline-offset-2 hover:underline"
                >
                  support@contractiq.ai
                </a>{' '}
                with the reference code above.
              </>
            ) : null}
          </p>
        </section>
      </div>
    </div>
  );
}