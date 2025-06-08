
import React from 'react';
import { EnhancedClipoginoChat } from '@/components/chat/EnhancedClipoginoChat';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';
import { UniversalLayout } from '@/components/layout/UniversalLayout';

export default function Chat() {
  return (
    <UniversalLayout>
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <ChatErrorBoundary>
            <EnhancedClipoginoChat />
          </ChatErrorBoundary>
        </div>
      </div>
    </UniversalLayout>
  );
}
