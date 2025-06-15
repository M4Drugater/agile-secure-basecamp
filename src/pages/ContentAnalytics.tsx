
import React from 'react';
import { ContentAnalyticsDashboard } from '@/components/analytics/ContentAnalyticsDashboard';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function ContentAnalyticsPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ContentAnalyticsDashboard />
      </div>
    </UnifiedAppLayout>
  );
}
