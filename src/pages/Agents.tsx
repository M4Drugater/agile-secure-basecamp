
import React from 'react';
import { UnifiedAgentWorkspace } from '@/components/agents/UnifiedAgentWorkspace';
import { ConsolidatedAppLayout } from '@/components/layout/ConsolidatedAppLayout';

export default function Agents() {
  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <UnifiedAgentWorkspace />
      </div>
    </ConsolidatedAppLayout>
  );
}
