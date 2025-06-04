
import React from 'react';
import { AppHeader } from './AppHeader';
import { AppNavigation } from './AppNavigation';
import { DashboardCards } from './DashboardCards';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <AppHeader />
      
      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border shadow-soft">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-sidebar-foreground mb-2">Navigation</h2>
              <div className="h-px bg-gradient-to-r from-sidebar-border to-transparent"></div>
            </div>
            <AppNavigation />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 container-padding section-padding animate-fade-in">
          <DashboardCards />
        </main>
      </div>
    </div>
  );
}
