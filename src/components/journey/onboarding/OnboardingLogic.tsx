
import React from 'react';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
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
  const { 
    getJourneySteps, 
    getNextStep, 
    getCompletedStepsCount,
    getTotalStepsCount,
    getEarnedAchievements
  } = useProgressiveJourney();

  const { handleStepClick, handleSkipStep, handleCompleteAll } = useStepActions();
  const { navigateToNext, navigateToDashboard } = useJourneyNavigation();

  const steps = getJourneySteps();
  const nextStep = getNextStep();
  const completedSteps = getCompletedStepsCount();
  const totalSteps = getTotalStepsCount();
  const earnedAchievements = getEarnedAchievements();

  return (
    <>
      {children({
        steps,
        nextStep,
        completedSteps,
        totalSteps,
        earnedAchievements,
        onStepClick: handleStepClick,
        onSkipStep: handleSkipStep,
        onSkipToNext: navigateToNext,
        onGoToDashboard: navigateToDashboard,
        onCompleteAll: handleCompleteAll
      })}
    </>
  );
}
