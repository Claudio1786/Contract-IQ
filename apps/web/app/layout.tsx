import type { Metadata } from 'next';
import React from 'react';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import './globals.css';

export const metadata: Metadata = {
  title: 'Contract IQ',
  description: 'Intelligence and automation for critical contract workflows.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}