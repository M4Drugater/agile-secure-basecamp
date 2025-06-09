
import React from 'react';
import { EnhancedClipoginoChat } from '@/components/chat/EnhancedClipoginoChat';
import { ChatErrorBoundary } from '@/components/chat/ChatErrorBoundary';
import { EnhancedTopNav } from '@/components/layout/EnhancedTopNav';

export default function Chat() {
  return (
    <div className="min-h-screen bg-background">
      <EnhancedTopNav />
      <div className="pt-16">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <ChatErrorBoundary>
            <EnhancedClipoginoChat />
          </ChatErrorBoundary>
        </div>
      </div>
    </div>
  );
}
