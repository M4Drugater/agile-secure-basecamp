
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ChatContextDetailsProps {
  contextSummary: any;
}

export function ChatContextDetails({ contextSummary }: ChatContextDetailsProps) {
  return (
    <Card className="border-purple-200">
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-600">{contextSummary.knowledgeCount}</div>
            <div className="text-sm text-muted-foreground">Knowledge Items</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">{contextSummary.contentCount}</div>
            <div className="text-sm text-muted-foreground">Content Created</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-600">{contextSummary.learningCount}</div>
            <div className="text-sm text-muted-foreground">Learning Paths</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-600">{contextSummary.activityCount}</div>
            <div className="text-sm text-muted-foreground">Recent Activities</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-600">{contextSummary.conversationCount}</div>
            <div className="text-sm text-muted-foreground">Conversations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
