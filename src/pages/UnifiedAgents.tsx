
import React from 'react';
import { ConsolidatedAppLayout } from '@/components/layout/ConsolidatedAppLayout';
import { UnifiedAgentWorkspace } from '@/components/agents/UnifiedAgentWorkspace';

export default function UnifiedAgents() {
  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <UnifiedAgentWorkspace />
      </div>
    </ConsolidatedAppLayout>
  );
}
