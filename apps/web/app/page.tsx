import React from 'react';
import Link from 'next/link';

import { Pill } from '@contract-iq/ui';

const heroPills = [
  { label: 'Renewal risk', variant: 'warning' as const },
  { label: 'Clause coverage', variant: 'success' as const },
  { label: 'Negotiation ready', variant: 'default' as const }
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-20">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Contract IQ</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
          Operational intelligence for every contract
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Monitor renewal risk, benchmark clauses, and launch negotiation playbooks with a
          workspace built for procurement, legal teams, and NIL operations.
        </p>
        <div className="flex flex-wrap gap-2">
          {heroPills.map((pill) => (
            <Pill key={pill.label} label={pill.label} variant={pill.variant} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          {
            title: 'Signal clarity',
            body: 'One-click insights across pricing, liability, and compliance benchmarks.'
          },
          {
            title: 'Faster execution',
            body: 'Workflow automations accelerate intake, review, and stakeholder handoffs.'
          },
          {
            title: 'Measurable impact',
            body: 'Portfolio dashboards track captured savings, risk flags, and playbook adoption.'
          }
        ].map((card) => (
          <article key={card.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-slate-100">{card.title}</h2>
            <p className="text-sm text-slate-400">{card.body}</p>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold text-slate-100">Preview contract intelligence</h2>
        <p className="mt-2 text-sm text-slate-400">
          Jump into a live dossier generated from our ingestion pipeline using production-grade fixture
          data.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contracts/saas-msa"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            View SaaS MSA brief →
          </Link>
          <Link
            href="/contracts/saas-dpa"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            GDPR DPA summary
          </Link>
          <Link
            href="/contracts/healthcare-baa"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Healthcare BAA briefing
          </Link>
          <Link
            href="/contracts/aws-enterprise"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            AWS Enterprise Agreement
          </Link>
          <Link
            href="/contracts/public-sector-sow"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Public sector SOW
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400"
          >
            Portfolio dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}