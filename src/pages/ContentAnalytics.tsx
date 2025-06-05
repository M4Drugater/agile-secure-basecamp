
import React from 'react';
import { ContentAnalyticsDashboard } from '@/components/analytics/ContentAnalyticsDashboard';
import { UniversalLayout } from '@/components/layout/UniversalLayout';

export default function ContentAnalyticsPage() {
  return (
    <UniversalLayout>
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <ContentAnalyticsDashboard />
        </div>
      </div>
    </UniversalLayout>
  );
}
