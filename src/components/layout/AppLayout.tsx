
import React from 'react';
import { AppHeader } from './AppHeader';
import { AppNavigation } from './AppNavigation';
import { DashboardCards } from './DashboardCards';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <AppNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardCards />
      </main>
    </div>
  );
}
