'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import EmptyState from '../components/EmptyState';
import Dashboard from '../components/Dashboard';

/**
 * SMART ROUTER - Single Source of Truth Home Page
 * Shows Empty State OR Dashboard based on user state
 * ELIMINATES the duplicate home page problem
 */
export default function HomePage() {
  const [hasContracts, setHasContracts] = useState<boolean | null>(null);

  useEffect(() => {
    // TODO: Replace this with actual API call to check user contracts
    // For demo purposes, we'll simulate checking user state
    const checkUserContracts = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // TODO: Replace with actual API call
        // const contracts = await getUserContracts();
        // const hasUserContracts = contracts.length > 0;
        
        // For demo: Show dashboard for returning users, empty state for new users
        // Check if user has been here before via localStorage
        const hasVisited = localStorage.getItem('contract-iq-visited');
        const shouldShowDashboard = hasVisited === 'true';
        
        setHasContracts(shouldShowDashboard);
        
        // Mark as visited for next time
        if (!hasVisited) {
          localStorage.setItem('contract-iq-visited', 'true');
        }
      } catch (error) {
        console.error('Failed to check user contracts:', error);
        // Default to empty state on error
        setHasContracts(false);
      }
    };

    checkUserContracts();
  }, []);

  // Loading state while checking user contracts
  if (hasContracts === null) {
    return (
      <AppLayout>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh' 
        }}>
          <div className="spinner" style={{ marginRight: 'var(--space-3)' }}></div>
          <span className="text-secondary">Loading...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {hasContracts ? <Dashboard /> : <EmptyState />}
    </AppLayout>
  );
}