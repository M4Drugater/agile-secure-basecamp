
import { useNavigate } from 'react-router-dom';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';

export function useJourneyNavigation() {
  const navigate = useNavigate();
  const { getNextStep, completeStep } = useProgressiveJourney();

  const navigateToStep = (stepId: string, route?: string) => {
    if (route) {
      // Auto-complete if it's a non-mandatory step
      if (['chat', 'agents', 'content'].includes(stepId)) {
        completeStep(stepId);
      }
      navigate(route);
    }
  };

  const navigateToNext = () => {
    const nextStep = getNextStep();
    if (nextStep?.route) {
      navigateToStep(nextStep.id, nextStep.route);
    } else {
      navigate('/dashboard');
    }
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  return {
    navigateToStep,
    navigateToNext,
    navigateToDashboard
  };
}
