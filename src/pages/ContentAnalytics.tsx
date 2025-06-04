
import React from 'react';
import { ContentAnalyticsDashboard } from '@/components/analytics/ContentAnalyticsDashboard';

export default function ContentAnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ContentAnalyticsDashboard />
      </div>
    </div>
  );
}
