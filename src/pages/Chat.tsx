
import React from 'react';
import { EliteClipoginoInterface } from '@/components/chat/EliteClipoginoInterface';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function Chat() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ChatErrorBoundary>
          <EliteClipoginoInterface />
        </ChatErrorBoundary>
      </div>
    </UnifiedAppLayout>
  );
}
