import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContractDetail } from '../../../components/contract-detail';
import { fetchContract } from '../../../lib/contracts';

interface ContractPageProps {
  params: {
    templateId: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ContractPageProps): Promise<Metadata> {
  return {
    title: `Contract Intelligence • ${params.templateId}`,
    description: 'AI-generated contract brief with clause intelligence, risk posture, and negotiation playbooks.'
  };
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { templateId } = params;

  try {
    const contract = await fetchContract(templateId);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <header className="border-b border-slate-800 bg-slate-950/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-slate-100">
              ← Back to workspace
            </Link>
            <div className="text-xs text-slate-500">
              Contract intelligence • Template {templateId}
            </div>
          </div>
        </header>
        <ContractDetail contract={contract} />
      </div>
    );
  } catch (error) {
    console.error(`Failed to render contract ${templateId}`, error);
    notFound();
  }
}