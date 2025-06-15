
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from 'lucide-react';
import { useProfileContext } from '@/hooks/useProfileContext';
import { useChatConfiguration } from '@/hooks/chat/useChatConfiguration';
import { UnifiedChatInterface } from './UnifiedChatInterface';
import { ChatHeader } from './ChatHeader';
import { UsageWarning } from './UsageWarning';

export function ClipoginoChat() {
  const profileContext = useProfileContext();
  const { getPreset } = useChatConfiguration();
  
  // Use basic chat configuration
  const chatConfig = getPreset('basic')!.config;

  const handleViewKnowledgeResource = (resource: any) => {
    console.log('View knowledge resource:', resource);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <ChatHeader />
      <UsageWarning />

      {/* Profile Integration Status */}
      {!profileContext && (
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            Complete your profile to get personalized mentoring and advice tailored to your career goals and experience.
          </AlertDescription>
        </Alert>
      )}

      <UnifiedChatInterface
        config={chatConfig}
        onViewKnowledgeResource={handleViewKnowledgeResource}
      />
    </div>
  );
}
