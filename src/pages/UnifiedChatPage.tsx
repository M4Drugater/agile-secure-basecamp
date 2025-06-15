
import React from 'react';
import { UnifiedClipoginoInterface } from '@/components/chat/UnifiedClipoginoInterface';
import { ConsolidatedAppLayout } from '@/components/layout/ConsolidatedAppLayout';

export default function UnifiedChatPage() {
  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <UnifiedClipoginoInterface />
      </div>
    </ConsolidatedAppLayout>
  );
}
