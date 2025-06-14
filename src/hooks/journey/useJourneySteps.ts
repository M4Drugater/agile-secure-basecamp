
import { JourneyStep, UserJourney } from './types';
import { JOURNEY_STEPS } from './journeySteps';
import { useJourneyStepCompletion } from './useJourneyStepCompletion';

export function useJourneySteps(userJourney: UserJourney | null) {
  const completionStates = useJourneyStepCompletion(userJourney);

  const getJourneySteps = (): JourneyStep[] => {
    return JOURNEY_STEPS.map((step, index) => {
      const isCompleted = completionStates[step.id as keyof typeof completionStates];
      
      // Determinar si está bloqueado basado en el paso anterior
      let locked = false;
      if (index > 0) {
        const previousStep = JOURNEY_STEPS[index - 1];
        const previousCompleted = completionStates[previousStep.id as keyof typeof completionStates];
        locked = !previousCompleted;
      }

      return {
        ...step,
        completed: isCompleted,
        locked
      };
    });
  };

  const getNextStep = (): JourneyStep | null => {
    const steps = getJourneySteps();
    return steps.find(step => !step.completed && !step.locked) || null;
  };

  const getCurrentStepIndex = (): number => {
    const steps = getJourneySteps();
    const nextStep = getNextStep();
    if (!nextStep) return steps.length;
    return steps.findIndex(step => step.id === nextStep.id);
  };

  const isJourneyComplete = (): boolean => {
    const steps = getJourneySteps();
    return steps.every(step => step.completed);
  };

  const getCompletedStepsCount = (): number => {
    const steps = getJourneySteps();
    return steps.filter(step => step.completed).length;
  };

  const getTotalStepsCount = (): number => {
    return JOURNEY_STEPS.length;
  };

  return {
    getJourneySteps,
    getNextStep,
    getCurrentStepIndex,
    isJourneyComplete,
    getCompletedStepsCount,
    getTotalStepsCount
  };
}
