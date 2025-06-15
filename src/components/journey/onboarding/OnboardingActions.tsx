
import React from 'react';
import { JourneyStep } from '@/hooks/useProgressiveJourney';
import { ActionButtons } from './ActionButtons';

interface OnboardingActionsProps {
  completedSteps: number;
  onGoToDashboard: () => void;
  onCompleteAll: () => void;
  steps: JourneyStep[];
}

export function OnboardingActions({ 
  completedSteps, 
  onGoToDashboard, 
  onCompleteAll, 
  steps 
}: OnboardingActionsProps) {
  return (
    <div className="text-center mt-8 space-y-4">
      <ActionButtons
        completedSteps={completedSteps}
        onGoToDashboard={onGoToDashboard}
        onCompleteAll={onCompleteAll}
      />
      <p className="text-sm text-muted-foreground">
        El onboarding es opcional. Puedes completar estos pasos más tarde desde el dashboard.
      </p>
    </div>
  );
}
