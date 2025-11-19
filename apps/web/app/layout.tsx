import type { Metadata } from 'next';
import React from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'Contract IQ - AI-Powered Contract Intelligence',
  description: 'Smart contract analysis, risk detection, and portfolio insights powered by AI. Extract insights, negotiate better terms, and manage agreements with intelligent automation.',
  
  // Open Graph (Facebook, LinkedIn, iMessage, WhatsApp)
  openGraph: {
    title: 'Contract IQ - AI-Powered Contract Intelligence',
    description: 'Smart contract analysis, risk detection, and portfolio insights powered by AI',
    url: 'https://contractiq.com',
    siteName: 'Contract IQ',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contract IQ - AI-Powered Contract Intelligence'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Contract IQ - AI-Powered Contract Intelligence',
    description: 'Smart contract analysis, risk detection, and portfolio insights powered by AI',
    images: ['/og-image.png']
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3B82F6' }
    ]
  },
  
  // Additional meta
  manifest: '/site.webmanifest',
  themeColor: '#0A0E1A',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  keywords: 'contract management, AI contract analysis, contract intelligence, risk detection, legal tech, contract automation'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0A0E1A" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}