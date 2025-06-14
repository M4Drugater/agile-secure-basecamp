
import { JourneyStep, UserJourney } from './types';
import { JOURNEY_STEPS } from './journeySteps';
import { useAuth } from '@/contexts/AuthContext';

export function useJourneySteps(userJourney: UserJourney | null) {
  const { profile } = useAuth();

  const getJourneySteps = (): JourneyStep[] => {
    if (!userJourney) {
      return JOURNEY_STEPS.map((step, index) => ({
        ...step,
        completed: false,
        locked: index > 0
      }));
    }

    return JOURNEY_STEPS.map((step, index) => {
      let completed = false;
      let locked = false;

      switch (step.id) {
        case 'profile':
          // More generous profile completion check
          completed = userJourney.profile_completed || (profile?.profile_completeness || 0) >= 50;
          locked = false;
          break;
        case 'knowledge':
          completed = userJourney.knowledge_setup;
          locked = !userJourney.profile_completed && (profile?.profile_completeness || 0) < 50;
          break;
        case 'chat':
          completed = userJourney.first_chat_completed;
          locked = !userJourney.knowledge_setup;
          break;
        case 'agents':
          completed = userJourney.cdv_introduced;
          locked = !userJourney.first_chat_completed;
          break;
        case 'content':
          completed = userJourney.first_content_created;
          locked = !userJourney.cdv_introduced;
          break;
      }

      return {
        ...step,
        completed,
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
