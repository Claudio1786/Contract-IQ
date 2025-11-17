'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Dashboard from '../../components/Dashboard';

/**
 * Dashboard Page - Main contract intelligence view
 */
export default function DashboardPage() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
