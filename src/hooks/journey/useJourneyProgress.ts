
import { useJourneyData } from './useJourneyData';
import { useJourneySteps } from './useJourneySteps';

export function useJourneyProgress() {
  const { userJourney } = useJourneyData();
  const { getJourneySteps, getCompletedStepsCount, getTotalStepsCount } = useJourneySteps(userJourney);

  const getProgressPercentage = () => {
    const completed = getCompletedStepsCount();
    const total = getTotalStepsCount();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const getProgressStats = () => ({
    completed: getCompletedStepsCount(),
    total: getTotalStepsCount(),
    percentage: getProgressPercentage()
  });

  return {
    getProgressPercentage,
    getProgressStats
  };
}
