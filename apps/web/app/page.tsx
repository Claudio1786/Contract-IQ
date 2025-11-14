'use client';

import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import Dashboard from '../components/Dashboard';

/**
 * Home Page - Dashboard as primary view
 * For MVP demo, always show dashboard with contract intelligence
 */
export default function HomePage() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}