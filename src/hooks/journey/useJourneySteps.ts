
import { JourneyStep, UserJourney } from './types';
import { JOURNEY_STEPS } from './journeySteps';
import { useJourneyStepCompletion } from './useJourneyStepCompletion';

export function useJourneySteps(userJourney: UserJourney | null) {
  const completionStates = useJourneyStepCompletion(userJourney);

  const getJourneySteps = (): JourneyStep[] => {
    return JOURNEY_STEPS.map((step, index) => {
      const isCompleted = completionStates[step.id as keyof typeof completionStates];
      
      // New simplified locking logic:
      // - Profile and Knowledge are mandatory and unlock sequentially
      // - Chat, Agents, Content can be visited anytime (no locking)
      let locked = false;
      
      if (step.id === 'knowledge') {
        // Knowledge is unlocked only after profile is completed
        locked = !completionStates.profile;
      } else if (['chat', 'agents', 'content'].includes(step.id)) {
        // These steps are always unlocked for easier access
        locked = false;
      }
      // Profile is never locked (first step)

      return {
        ...step,
        completed: isCompleted,
        locked
      };
    });
  };

  const getNextStep = (): JourneyStep | null => {
    const steps = getJourneySteps();
    
    // First, check for mandatory incomplete steps
    const mandatoryIncomplete = steps.find(step => 
      ['profile', 'knowledge'].includes(step.id) && !step.completed && !step.locked
    );
    
    if (mandatoryIncomplete) {
      return mandatoryIncomplete;
    }
    
    // Then, check for any other incomplete steps
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
