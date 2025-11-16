import type { Metadata } from 'next';
import React from 'react';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import './globals.css';

export const metadata: Metadata = {
  title: 'Contract IQ - AI-Powered Contract Intelligence',
  description: 'Smart contract analysis, risk detection, and portfolio insights powered by AI. Manage, analyze, and optimize your vendor agreements with intelligent automation.',
  keywords: ['contract management', 'AI contract analysis', 'contract intelligence', 'vendor management', 'risk detection', 'portfolio insights'],
  authors: [{ name: 'Contract IQ' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo-icon.svg', type: 'image/svg+xml', sizes: '512x512' }
    ],
    apple: [
      { url: '/logo-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://contract-iq.org',
    siteName: 'Contract IQ',
    title: 'Contract IQ - AI-Powered Contract Intelligence',
    description: 'Smart contract analysis, risk detection, and portfolio insights powered by AI',
    images: [
      {
        url: 'https://contract-iq.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contract IQ - AI-Powered Contract Intelligence'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contract IQ - AI-Powered Contract Intelligence',
    description: 'Smart contract analysis, risk detection, and portfolio insights powered by AI',
    images: ['/og-image.png']
  }
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
