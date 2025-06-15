
import React from 'react';
import { DashboardMetricsOverview } from './DashboardMetricsOverview';
import { QuickActionsGrid } from './QuickActionsGrid';
import { RecentActivityFeed } from './RecentActivityFeed';
import { ProgressInsights } from './ProgressInsights';
import { WelcomeSection } from './WelcomeSection';

export function ConsolidatedDashboard() {
  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl space-y-8">
      <WelcomeSection />
      <DashboardMetricsOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QuickActionsGrid />
        </div>
        <div>
          <RecentActivityFeed />
        </div>
      </div>
      <ProgressInsights />
    </div>
  );
}
