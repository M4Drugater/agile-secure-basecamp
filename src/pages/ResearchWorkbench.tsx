
import React from 'react';
import { ResearchWorkbench } from '@/components/research/ResearchWorkbench';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function ResearchWorkbenchPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ResearchWorkbench />
      </div>
    </UnifiedAppLayout>
  );
}
