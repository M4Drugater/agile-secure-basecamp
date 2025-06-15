
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Brain, Activity } from 'lucide-react';

interface ChatContextStatusProps {
  contextSummary: any;
  showContextDetails: boolean;
  setShowContextDetails: (show: boolean) => void;
}

export function ChatContextStatus({ 
  contextSummary, 
  showContextDetails, 
  setShowContextDetails 
}: ChatContextStatusProps) {
  const getContextQualityColor = () => {
    if (contextSummary.quality === 'excellent') return 'bg-green-500';
    if (contextSummary.quality === 'good') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Alert className="border-blue-200 bg-blue-50/50">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>Context Quality: {contextSummary.quality}</strong>
              <p className="text-sm text-muted-foreground mt-1">
                CLIPOGINO has access to {contextSummary.knowledgeCount} knowledge items, 
                {contextSummary.contentCount} content pieces, and {contextSummary.activityCount} recent activities.
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
                Enhanced context with {contextSummary.conversationCount} recent conversations
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
  );
}
