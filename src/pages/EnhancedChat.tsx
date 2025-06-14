
import React from 'react';
import { EnhancedClipoginoChat } from '@/components/chat/EnhancedClipoginoChat';
import { ConsolidatedAppLayout } from '@/components/layout/ConsolidatedAppLayout';

export default function EnhancedChatPage() {
  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <EnhancedClipoginoChat />
      </div>
    </ConsolidatedAppLayout>
  );
}
