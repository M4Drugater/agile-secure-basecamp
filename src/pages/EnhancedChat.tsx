
import React from 'react';
import { EnhancedClipoginoChat } from '@/components/chat/EnhancedClipoginoChat';
import { UnifiedAppLayout } from '@/components/layout/UnifiedAppLayout';

export default function EnhancedChatPage() {
  return (
    <UnifiedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <EnhancedClipoginoChat />
      </div>
    </UnifiedAppLayout>
  );
}
