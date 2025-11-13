'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  // Force Vercel redeploy with latest commit

  useEffect(() => {
    // Redirect to chat interface for the new UX v3.0
    router.push('/chat');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Contract IQ...</p>
      </div>
    </div>
  );
}