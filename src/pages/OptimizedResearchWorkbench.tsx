
import React from 'react';
import { OptimizedResearchWorkbench } from '@/components/research/OptimizedResearchWorkbench';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function OptimizedResearchWorkbenchPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <OptimizedResearchWorkbench />
      </div>
    </UnifiedAppLayout>
  );
}
