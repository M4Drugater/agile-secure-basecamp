
import React from 'react';
import { DashboardCards } from './DashboardCards';
import { ConsolidatedAppLayout } from './ConsolidatedAppLayout';

export function AppLayout() {
  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto px-4 py-6 lg:px-8 animate-fade-in bg-gradient-to-br from-background via-muted/30 to-background">
        <DashboardCards />
      </div>
    </ConsolidatedAppLayout>
  );
}
