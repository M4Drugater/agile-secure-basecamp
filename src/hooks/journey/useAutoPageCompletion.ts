
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';

export function useAutoPageCompletion() {
  const location = useLocation();
  const { completeStep, getJourneySteps, isInitialized } = useProgressiveJourney();

  useEffect(() => {
    if (!isInitialized) {
      console.log('Journey not initialized yet, skipping auto page completion');
      return;
    }

    const steps = getJourneySteps();
    const currentPath = location.pathname;

    // Auto-complete steps based on page visit
    switch (currentPath) {
      case '/chat':
        const chatStep = steps.find(step => step.id === 'chat');
        if (chatStep && !chatStep.completed) {
          console.log('User visited chat page, auto-completing chat step');
          completeStep('chat');
        }
        break;

      case '/competitive-intelligence':
        const agentsStep = steps.find(step => step.id === 'agents');
        if (agentsStep && !agentsStep.completed) {
          console.log('User visited competitive intelligence page, auto-completing agents step');
          completeStep('agents');
        }
        break;

      case '/content-generator':
      case '/content/generator':
        const contentStep = steps.find(step => step.id === 'content');
        if (contentStep && !contentStep.completed) {
          console.log('User visited content generator page, auto-completing content step');
          completeStep('content');
        }
        break;

      default:
        // No auto-completion for other pages
        break;
    }
  }, [location.pathname, completeStep, getJourneySteps, isInitialized]);
}
