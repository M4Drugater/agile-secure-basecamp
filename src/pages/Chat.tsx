
import React from 'react';
import { ConsolidatedChat } from '@/components/chat/ConsolidatedChat';

export default function Chat() {
  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Chat with CLIPOGINO</h1>
          <p className="text-muted-foreground">Optimized AI assistant for professional development</p>
        </div>
        <ConsolidatedChat />
      </div>
    </div>
  );
}
