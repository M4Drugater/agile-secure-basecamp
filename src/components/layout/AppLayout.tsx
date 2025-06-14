
import React from 'react';
import { DashboardCards } from './DashboardCards';
import { UnifiedAppLayout } from './UnifiedAppLayout';

export function AppLayout() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto px-4 py-6 lg:px-8 animate-fade-in bg-gradient-to-br from-background via-muted/30 to-background">
        <DashboardCards />
      </div>
    </UnifiedAppLayout>
  );
}
