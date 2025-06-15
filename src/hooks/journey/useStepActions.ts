
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useJourneyNavigation } from './useJourneyNavigation';

export function useStepActions() {
  const { completeStep, getJourneySteps } = useProgressiveJourney();
  const { navigateToStep } = useJourneyNavigation();

  const handleStepClick = (step: any) => {
    if (step.route) {
      navigateToStep(step.id, step.route);
    }
  };

  const handleSkipStep = (stepId: string) => {
    completeStep(stepId);
  };

  const handleCompleteAll = () => {
    const steps = getJourneySteps();
    steps.forEach(step => {
      if (!step.completed) {
        completeStep(step.id);
      }
    });
  };

  return {
    handleStepClick,
    handleSkipStep,
    handleCompleteAll
  };
}
