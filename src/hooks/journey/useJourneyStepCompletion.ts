
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { UserJourney } from './types';

export function useJourneyStepCompletion(userJourney: UserJourney | null) {
  const { profile } = useAuth();
  const { documents } = useKnowledgeBase();
  const { files: userKnowledgeFiles } = useUserKnowledgeFiles();
  
  const [completionStates, setCompletionStates] = useState({
    profile: false,
    knowledge: false,
    chat: false,
    agents: false,
    content: false
  });

  useEffect(() => {
    // Debug logging to understand what's happening
    console.log('Journey Step Completion Debug:', {
      documents: documents?.length || 0,
      userKnowledgeFiles: userKnowledgeFiles?.length || 0,
      profile_completeness: profile?.profile_completeness,
      userJourney,
      fullProfile: profile
    });

    // Check multiple sources for knowledge files
    const hasKnowledgeFiles = (documents && documents.length > 0) || 
                             (userKnowledgeFiles && userKnowledgeFiles.length > 0);

    // Enhanced profile completion check
    const profileComplete = !!(
      profile?.full_name && 
      profile?.industry && 
      profile?.current_position &&
      (profile?.profile_completeness || 0) >= 70
    );

    // Enhanced chat completion check
    const chatComplete = userJourney?.first_chat_completed || false;

    const newStates = {
      // Profile: completado si el perfil tiene información suficiente
      profile: profileComplete,
      
      // Knowledge: completado si tiene al menos un archivo subido
      knowledge: hasKnowledgeFiles,
      
      // Chat: usar el estado del journey con logging mejorado
      chat: chatComplete,
      
      // Agents: usar el estado del journey  
      agents: userJourney?.cdv_introduced || false,
      
      // Content: usar el estado del journey
      content: userJourney?.first_content_created || false
    };

    console.log('Computed completion states:', {
      previous: completionStates,
      new: newStates,
      userJourneyChat: userJourney?.first_chat_completed,
      changes: {
        profile: completionStates.profile !== newStates.profile,
        knowledge: completionStates.knowledge !== newStates.knowledge,
        chat: completionStates.chat !== newStates.chat,
        agents: completionStates.agents !== newStates.agents,
        content: completionStates.content !== newStates.content
      }
    });

    setCompletionStates(newStates);
  }, [profile, documents, userKnowledgeFiles, userJourney]);

  return completionStates;
}
