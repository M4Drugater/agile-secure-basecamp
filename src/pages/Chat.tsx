
import React from 'react';
import { ClipoginoChat } from '@/components/chat/ClipoginoChat';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';

export default function Chat() {
  return (
    <ChatErrorBoundary>
      <ClipoginoChat />
    </ChatErrorBoundary>
  );
}
