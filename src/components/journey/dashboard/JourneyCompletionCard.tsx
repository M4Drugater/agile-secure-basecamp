
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageSquare, Shield } from 'lucide-react';
import { AchievementBadge } from '../AchievementBadge';

interface JourneyCompletionCardProps {
  onStartChat: () => void;
  onExploreAgents: () => void;
}

export function JourneyCompletionCard({ onStartChat, onExploreAgents }: JourneyCompletionCardProps) {
  return (
    <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">Setup Complete! 🎉</h3>
        <p className="text-muted-foreground mb-4">
          You've unlocked the full power of LAIGENT. Your AI-powered professional development journey begins now!
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <AchievementBadge type="master" earned={true} size="lg" showLabel={true} />
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={onStartChat}>
            Start with CLIPOGINO
            <MessageSquare className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={onExploreAgents}>
            Explore AI Agents
            <Shield className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
