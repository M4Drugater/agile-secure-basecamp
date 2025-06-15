
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';

export function useOnboardingState() {
  const { 
    getJourneySteps, 
    getNextStep, 
    getCompletedStepsCount,
    getTotalStepsCount,
    getEarnedAchievements
  } = useProgressiveJourney();

  const steps = getJourneySteps();
  const nextStep = getNextStep();
  const completedSteps = getCompletedStepsCount();
  const totalSteps = getTotalStepsCount();
  const earnedAchievements = getEarnedAchievements();

  return {
    steps,
    nextStep,
    completedSteps,
    totalSteps,
    earnedAchievements
  };
}
