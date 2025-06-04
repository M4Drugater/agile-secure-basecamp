
import React from 'react';
import { ClipoginoChat } from '@/components/chat/ClipoginoChat';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';

export default function Chat() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <ChatErrorBoundary>
          <ClipoginoChat />
        </ChatErrorBoundary>
      </div>
    </div>
  );
}
