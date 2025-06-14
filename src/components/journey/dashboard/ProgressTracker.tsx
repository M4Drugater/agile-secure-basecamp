
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';
import { JourneyStep } from '@/hooks/useProgressiveJourney';

interface ProgressTrackerProps {
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  nextStep: JourneyStep | null;
  onContinueNext: () => void;
}

export function ProgressTracker({
  completedSteps,
  totalSteps,
  progressPercentage,
  nextStep,
  onContinueNext
}: ProgressTrackerProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Setup Progress</h3>
            <p className="text-sm text-muted-foreground">
              {completedSteps} of {totalSteps} steps completed
            </p>
          </div>
          <Badge className="bg-blue-500">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>
        <Progress value={progressPercentage} className="mb-3" />
        {nextStep && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Next: {nextStep.title}</span>
            <Button 
              size="sm" 
              onClick={onContinueNext}
              className="flex items-center gap-1"
            >
              Continue
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
