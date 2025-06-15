
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Crown, Zap, ArrowRight } from 'lucide-react';
import { useProfileContext } from '@/hooks/useProfileContext';
import { useChatConfiguration } from '@/hooks/chat/useChatConfiguration';
import { UnifiedChatInterface } from './UnifiedChatInterface';
import { ChatHeader } from './ChatHeader';
import { UsageWarning } from './UsageWarning';

export function ClipoginoChat() {
  const profileContext = useProfileContext();
  const { getPreset } = useChatConfiguration();
  const [showEliteUpgrade, setShowEliteUpgrade] = useState(true);
  
  // Use enhanced chat configuration
  const chatConfig = getPreset('enhanced')!.config;

  const handleViewKnowledgeResource = (resource: any) => {
    console.log('View knowledge resource:', resource);
  };

  const handleUpgradeToElite = () => {
    window.location.href = '/enhanced-chat';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <ChatHeader />
      <UsageWarning />

      {/* Elite Upgrade Banner */}
      {showEliteUpgrade && (
        <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <Crown className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>🚀 CLIPOGINO Elite Available!</strong> Multi-LLM AI (GPT-4o + Claude), real-time web search, and premium business frameworks.
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleUpgradeToElite} className="h-8 bg-gradient-to-r from-purple-600 to-blue-600">
                <Crown className="h-3 w-3 mr-1" />
                Upgrade to Elite
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowEliteUpgrade(false)}
                className="h-8 text-xs"
              >
                Later
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
