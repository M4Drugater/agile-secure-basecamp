
import { UserJourney } from './journey/types';
import { useJourneyData } from './journey/useJourneyData';
import { useJourneySteps } from './journey/useJourneySteps';

export function useProgressiveJourney() {
  const { userJourney, isLoading, updateJourney } = useJourneyData();
  const { getJourneySteps, getNextStep, getCurrentStepIndex, isJourneyComplete } = useJourneySteps(userJourney);

  const completeStep = (stepId: string) => {
    const updates: Partial<UserJourney> = {};
    
    switch (stepId) {
      case 'profile':
        updates.profile_completed = true;
        break;
      case 'knowledge':
        updates.knowledge_setup = true;
        break;
      case 'chat':
        updates.first_chat_completed = true;
        break;
      case 'agents':
        updates.cdv_introduced = true;
        break;
      case 'content':
        updates.first_content_created = true;
        break;
    }

    updates.current_step = Math.max(getCurrentStepIndex() + 1, userJourney?.current_step || 0);
    updateJourney.mutate(updates);
  };

  return {
    userJourney,
    isLoading,
    getJourneySteps,
    getNextStep,
    getCurrentStepIndex,
    completeStep,
    isJourneyComplete,
    updateJourney: updateJourney.mutate,
  };
}

// Re-export types for backward compatibility
export type { JourneyStep, UserJourney } from './journey/types';
