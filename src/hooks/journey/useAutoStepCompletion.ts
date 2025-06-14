
import { useEffect, useRef } from 'react';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useProgressNotifications } from './useProgressNotifications';

interface UseAutoStepCompletionProps {
  stepId: string;
  shouldComplete: boolean;
  completionMessage?: string;
}

export function useAutoStepCompletion({ 
  stepId, 
  shouldComplete, 
  completionMessage 
}: UseAutoStepCompletionProps) {
  const { completeStep, getJourneySteps } = useProgressiveJourney();
  const { addNotification } = useProgressNotifications();
  const hasCompleted = useRef(false);

  useEffect(() => {
    const steps = getJourneySteps();
    const currentStep = steps.find(step => step.id === stepId);
    
    if (shouldComplete && currentStep && !currentStep.completed && !hasCompleted.current) {
      hasCompleted.current = true;
      
      // Mark step as complete
      completeStep(stepId);
      
      // Show notification
      addNotification({
        type: 'step_completed',
        title: `${currentStep.title} Completado`,
        message: completionMessage || `¡Has completado exitosamente: ${currentStep.title}!`,
        stepId
      });

      console.log(`Auto-completed step: ${stepId}`);
    }
  }, [stepId, shouldComplete, completeStep, addNotification, completionMessage, getJourneySteps]);

  return { hasCompleted: hasCompleted.current };
}
