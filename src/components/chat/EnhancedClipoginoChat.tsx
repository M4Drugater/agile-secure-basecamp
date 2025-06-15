
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Activity } from 'lucide-react';
import { useChatConfiguration } from '@/hooks/chat/useChatConfiguration';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { UnifiedChatInterface } from './UnifiedChatInterface';
import { UsageWarning } from './UsageWarning';
import { ChatContextDetails } from './ChatContextDetails';

export function EnhancedClipoginoChat() {
  const { getPreset } = useChatConfiguration();
  const { getContextSummary } = useContextBuilder();
  const [showContextDetails, setShowContextDetails] = React.useState(false);
  
  // Use enhanced chat configuration
  const chatConfig = getPreset('enhanced')!.config;
  const contextSummary = getContextSummary();

  const getContextQualityColor = () => {
    const totalItems = (contextSummary.knowledgeCount || 0) + (contextSummary.contentCount || 0) + (contextSummary.learningCount || 0);
    if (totalItems >= 10) return 'bg-green-500';
    if (totalItems >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getContextQualityLabel = () => {
    const totalItems = (contextSummary.knowledgeCount || 0) + (contextSummary.contentCount || 0) + (contextSummary.learningCount || 0);
    if (totalItems >= 10) return 'Excellent';
    if (totalItems >= 5) return 'Good';
    return 'Basic';
  };

  const handleViewKnowledgeResource = (resource: any) => {
    console.log('View knowledge resource:', resource);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Chat with CLIPOGINO</h1>
          <p className="text-muted-foreground">Enhanced AI assistant for professional development</p>
        </div>
      </div>

      <UsageWarning />

      {/* Enhanced Context Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className="border-blue-200 bg-blue-50/50">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Context Quality: {getContextQualityLabel()}</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  CLIPOGINO has access to {contextSummary.knowledgeCount || 0} knowledge items, 
                  {contextSummary.contentCount || 0} content pieces, and {contextSummary.activityCount || 0} recent activities.
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getContextQualityColor()}`}></div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-purple-200 bg-purple-50/50">
          <Activity className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>AI Enhancement: Active</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Enhanced context building with {contextSummary.conversationCount || 0} recent conversations
                  and comprehensive activity tracking.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContextDetails(!showContextDetails)}
                className="text-purple-600 hover:text-purple-700"
              >
                {showContextDetails ? 'Hide' : 'Details'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Context Details Expansion */}
      {showContextDetails && (
        <ChatContextDetails contextSummary={contextSummary} />
      )}

      <UnifiedChatInterface
        config={chatConfig}
        onViewKnowledgeResource={handleViewKnowledgeResource}
      />
    </div>
  );
}
