
import React from 'react';
import { CompetitiveIntelligenceDashboard } from '@/components/competitive-intelligence/CompetitiveIntelligenceDashboard';
import { ConsolidatedAppLayout } from '@/components/layout/ConsolidatedAppLayout';

export default function CompetitiveIntelligencePage() {
  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <CompetitiveIntelligenceDashboard />
      </div>
    </ConsolidatedAppLayout>
  );
}
