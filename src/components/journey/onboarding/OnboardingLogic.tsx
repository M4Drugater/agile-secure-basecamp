
import React from 'react';
import { useOnboardingState } from '@/hooks/journey/useOnboardingState';
import { useStepActions } from '@/hooks/journey/useStepActions';
import { useJourneyNavigation } from '@/hooks/journey/useJourneyNavigation';

interface OnboardingLogicProps {
  children: (props: {
    steps: any[];
    nextStep: any;
    completedSteps: number;
    totalSteps: number;
    earnedAchievements: any[];
    onStepClick: (step: any) => void;
    onSkipStep: (stepId: string) => void;
    onSkipToNext: () => void;
    onGoToDashboard: () => void;
    onCompleteAll: () => void;
  }) => React.ReactNode;
}

export function OnboardingLogic({ children }: OnboardingLogicProps) {
  const onboardingState = useOnboardingState();
  const { handleStepClick, handleSkipStep, handleCompleteAll } = useStepActions();
  const { navigateToNext, navigateToDashboard } = useJourneyNavigation();

  return (
    <>
      {children({
        ...onboardingState,
        onStepClick: handleStepClick,
        onSkipStep: handleSkipStep,
        onSkipToNext: navigateToNext,
        onGoToDashboard: navigateToDashboard,
        onCompleteAll: handleCompleteAll
      })}
    </>
  );
}
