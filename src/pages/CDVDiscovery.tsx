
import React from 'react';
import { CompetitorDiscoveryValidator } from '@/components/cdv/CompetitorDiscoveryValidator';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function CDVDiscoveryPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <CompetitorDiscoveryValidator />
      </div>
    </UnifiedAppLayout>
  );
}
