
import React from 'react';
import { OnboardingHeader } from './OnboardingHeader';
import { NextStepCard } from './NextStepCard';
import { StepsList } from './StepsList';
import { OnboardingActions } from './OnboardingActions';

interface OnboardingContainerProps {
  completedSteps: number;
  totalSteps: number;
  earnedAchievements: ('profile' | 'knowledge' | 'chat' | 'agents' | 'content')[];
  nextStep: any;
  steps: any[];
  onStepClick: (step: any) => void;
  onSkipStep: (stepId: string) => void;
  onSkipToNext: () => void;
  onGoToDashboard: () => void;
  onCompleteAll: () => void;
}

export function OnboardingContainer({
  completedSteps,
  totalSteps,
  earnedAchievements,
  nextStep,
  steps,
  onStepClick,
  onSkipStep,
  onSkipToNext,
  onGoToDashboard,
  onCompleteAll
}: OnboardingContainerProps) {
  return (
    <div className="container mx-auto max-w-4xl">
      <OnboardingHeader 
        completedSteps={completedSteps}
        totalSteps={totalSteps}
        earnedAchievements={earnedAchievements}
      />

      {nextStep && (
        <NextStepCard
          nextStep={nextStep}
          onContinue={onSkipToNext}
          onSkip={() => onSkipStep(nextStep.id)}
        />
      )}

      <StepsList
        steps={steps}
        onStepClick={onStepClick}
        onSkipStep={onSkipStep}
      />

      <OnboardingActions
        completedSteps={completedSteps}
        onGoToDashboard={onGoToDashboard}
        onCompleteAll={onCompleteAll}
        steps={steps}
      />
    </div>
  );
}
