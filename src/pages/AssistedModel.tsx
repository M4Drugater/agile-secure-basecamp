
import React from 'react';
import { AssistedModelChat } from '@/components/chat/AssistedModelChat';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function AssistedModelPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <AssistedModelChat />
      </div>
    </UnifiedAppLayout>
  );
}
