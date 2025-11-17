'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Dashboard from '../../components/Dashboard';

/**
 * App Home Page - Dashboard with navigation bar
 * Accessed from landing page via /app route
 * All authenticated screens remain under /app/*
 */
export default function AppHomePage() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
