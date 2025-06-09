
import React from 'react';
import { AppHeader } from './AppHeader';
import { DashboardCards } from './DashboardCards';
import { UniversalLayout } from './UniversalLayout';
import { EnhancedTopNav } from './EnhancedTopNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <EnhancedTopNav />
      
      <div className="pt-16">
        <AppHeader />
        
        {/* Main Content - Full Width */}
        <main className="container mx-auto px-4 py-6 lg:px-8 animate-fade-in">
          <DashboardCards />
        </main>
      </div>
    </div>
  );
}
