
import React from 'react';
import { Button } from '@/components/ui/button';
import { JourneyStep } from '@/hooks/useProgressiveJourney';

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
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={onGoToDashboard}
          className="text-muted-foreground"
        >
          Ir al Dashboard
        </Button>
        {completedSteps >= 2 && (
          <Button 
            onClick={onCompleteAll}
            variant="secondary"
          >
            Completar Todo y Continuar
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        El onboarding es opcional. Puedes completar estos pasos más tarde desde el dashboard.
      </p>
    </div>
  );
}
