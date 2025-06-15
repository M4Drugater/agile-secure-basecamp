
import React from 'react';
import { TrendsDiscovery } from '@/components/trends/TrendsDiscovery';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function RedditTrendsPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <TrendsDiscovery />
      </div>
    </UnifiedAppLayout>
  );
}
