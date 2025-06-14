
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface WelcomeHeaderProps {
  userName: string;
  isJourneyComplete: boolean;
  completedSteps: number;
  totalSteps: number;
  newModulesCount: number;
  onCompleteSetup: () => void;
}

export function WelcomeHeader({
  userName,
  isJourneyComplete,
  completedSteps,
  totalSteps,
  newModulesCount,
  onCompleteSetup
}: WelcomeHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Welcome back, {userName}! 👋
            {newModulesCount > 0 && (
              <Badge className="bg-green-500 animate-pulse">
                {newModulesCount} New!
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            {isJourneyComplete 
              ? 'Your AI-powered workspace is ready for professional growth'
              : `Continue your setup to unlock more AI-powered features (${completedSteps}/${totalSteps} completed)`
            }
          </p>
        </div>
        {!isJourneyComplete && (
          <Button 
            variant="outline" 
            onClick={onCompleteSetup}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
