
import React from 'react';
import { ClipoginoChat } from '@/components/chat/ClipoginoChat';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';

export default function Chat() {
  return (
    <div className="min-h-screen bg-background">
      <ChatErrorBoundary>
        <ClipoginoChat />
      </ChatErrorBoundary>
    </div>
  );
}
