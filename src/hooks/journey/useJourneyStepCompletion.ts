
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { UserJourney } from './types';

export function useJourneyStepCompletion(userJourney: UserJourney | null) {
  const { profile } = useAuth();
  const { userFiles } = useKnowledgeBase();
  
  const [completionStates, setCompletionStates] = useState({
    profile: false,
    knowledge: false,
    chat: false,
    agents: false,
    content: false
  });

  useEffect(() => {
    const newStates = {
      // Profile: completado si el perfil tiene información básica
      profile: !!(profile?.full_name && profile?.industry && (profile?.profile_completeness || 0) >= 50),
      
      // Knowledge: completado si tiene al menos un archivo subido
      knowledge: userFiles && userFiles.length > 0,
      
      // Chat: usar el estado del journey
      chat: userJourney?.first_chat_completed || false,
      
      // Agents: usar el estado del journey  
      agents: userJourney?.cdv_introduced || false,
      
      // Content: usar el estado del journey
      content: userJourney?.first_content_created || false
    };

    setCompletionStates(newStates);
  }, [profile, userFiles, userJourney]);

  return completionStates;
}
