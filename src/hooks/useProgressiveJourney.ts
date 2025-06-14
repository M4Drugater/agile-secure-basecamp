
import { useState } from 'react';
import { UserJourney } from './journey/types';
import { useJourneyData } from './journey/useJourneyData';
import { useJourneySteps } from './journey/useJourneySteps';
import { useProgressNotifications } from './journey/useProgressNotifications';

export function useProgressiveJourney() {
  const { userJourney, isLoading, updateJourney } = useJourneyData();
  const { 
    getJourneySteps, 
    getNextStep, 
    getCurrentStepIndex, 
    isJourneyComplete,
    getCompletedStepsCount,
    getTotalStepsCount
  } = useJourneySteps(userJourney);

  const { addNotification } = useProgressNotifications();
  const [lastCompletedStep, setLastCompletedStep] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const completeStep = (stepId: string) => {
    console.log(`Completing step: ${stepId}`);
    
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
    
    // Set up celebration state
    setLastCompletedStep(stepId);
    setShowCelebration(true);
    
    // Update in database
    updateJourney.mutate(updates);

    console.log(`Step ${stepId} completion updates:`, updates);
  };

  const dismissCelebration = () => {
    setShowCelebration(false);
    setLastCompletedStep(null);
  };

  const getEarnedAchievements = () => {
    const steps = getJourneySteps();
    return steps
      .filter(step => step.completed)
      .map(step => step.id as 'profile' | 'knowledge' | 'chat' | 'agents' | 'content');
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
    getCompletedStepsCount,
    getTotalStepsCount,
    lastCompletedStep,
    showCelebration,
    dismissCelebration,
    getEarnedAchievements,
  };
}

// Re-export types for backward compatibility
export type { JourneyStep, UserJourney } from './journey/types';
