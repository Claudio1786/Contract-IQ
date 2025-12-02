'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect to the proper contract creation flow
 * The correct workflow is:
 * 1. Upload templates → /settings/templates
 * 2. Create from templates → /contracts/new  
 * 3. Upload existing contracts → /upload
 */
export default function NewContractRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct contract creation wizard
    router.replace('/contracts/new');
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to contract creation wizard...</p>
    </div>
  );
}