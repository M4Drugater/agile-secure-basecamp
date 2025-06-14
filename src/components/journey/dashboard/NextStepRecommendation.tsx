
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { JourneyStep } from '@/hooks/useProgressiveJourney';

interface NextStepRecommendationProps {
  nextStep: JourneyStep;
  onGetStarted: () => void;
}

export function NextStepRecommendation({ nextStep, onGetStarted }: NextStepRecommendationProps) {
  return (
    <Card className="mb-8 border-2 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Sparkles className="h-5 w-5" />
          Recommended Next Step
        </CardTitle>
        <CardDescription>
          Complete this step to unlock more AI-powered features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{nextStep.title}</h4>
            <p className="text-sm text-muted-foreground">{nextStep.description}</p>
          </div>
          <Button onClick={onGetStarted}>
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
