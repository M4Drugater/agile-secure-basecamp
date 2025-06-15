
import { useJourneyProgress } from './useJourneyProgress';
import { useOnboardingState } from './useOnboardingState';

export function useJourneyMetrics() {
  const { getProgressStats } = useJourneyProgress();
  const { completedSteps, totalSteps } = useOnboardingState();

  const progressStats = getProgressStats();
  
  const isJourneyStarted = completedSteps > 0;
  const isJourneyHalfComplete = completedSteps >= Math.ceil(totalSteps / 2);
  const isJourneyNearComplete = completedSteps >= totalSteps - 1;

  return {
    ...progressStats,
    isJourneyStarted,
    isJourneyHalfComplete,
    isJourneyNearComplete,
    remainingSteps: totalSteps - completedSteps
  };
}
