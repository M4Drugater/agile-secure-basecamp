
import React from 'react';
import { CompetitiveIntelligenceDashboard } from '@/components/competitive-intelligence/CompetitiveIntelligenceDashboard';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function CompetitiveIntelligencePage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <CompetitiveIntelligenceDashboard />
      </div>
    </UnifiedAppLayout>
  );
}
