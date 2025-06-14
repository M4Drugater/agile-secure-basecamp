
import React from 'react';
import { ConsolidatedAppLayout } from '@/components/layout/ConsolidatedAppLayout';
import { DashboardCards } from '@/components/layout/DashboardCards';

export default function Index() {
  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <DashboardCards />
      </div>
    </ConsolidatedAppLayout>
  );
}
