import React from 'react';

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-800/60 ${className}`} aria-hidden="true" />;
}

export function ContractSkeleton() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading contract dossier…</span>
      <header className="border-b border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <SkeletonBlock className="h-4 w-32 rounded-full" />
          <SkeletonBlock className="h-3 w-48 rounded-full" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-10" aria-busy="true">
        <section className="space-y-4">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-10 w-3/4" />
          <SkeletonBlock className="h-5 w-48" />
          <SkeletonBlock className="h-16 w-2/3" />
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]" aria-hidden="true">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <SkeletonBlock className="h-6 w-44" />
                <SkeletonBlock className="h-6 w-32" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonBlock key={`metric-${index}`} className="h-24" />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-4 w-80" />
              </div>

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <article
                    key={`clause-${index}`}
                    className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-5"
                    style={{ minHeight: 120 }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <SkeletonBlock className="h-6 w-24" />
                      <SkeletonBlock className="h-6 w-20" />
                    </div>
                    <SkeletonBlock className="mt-3 h-16 w-full" />
                    <SkeletonBlock className="mt-4 h-12 w-full" />
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {['risk', 'playbook', 'obligations'].map((panel) => (
              <section
                key={panel}
                className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-5"
                style={{ minHeight: 80 }}
              >
                <SkeletonBlock className="h-5 w-40" />
                <SkeletonBlock className="mt-3 h-16 w-full" />
              </section>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}