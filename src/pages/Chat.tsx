
import React from 'react';
import { ClipoginoChat } from '@/components/chat/ClipoginoChat';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';
import { UniversalLayout } from '@/components/layout/UniversalLayout';

export default function Chat() {
  return (
    <UniversalLayout>
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <ChatErrorBoundary>
            <ClipoginoChat />
          </ChatErrorBoundary>
        </div>
      </div>
    </UniversalLayout>
  );
}
