
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { UserJourney } from './types';
import { supabase } from '@/integrations/supabase/client';

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
    const calculateCompletionStates = async () => {
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

      // Enhanced chat completion check - includes retroactive detection
      let chatComplete = userJourney?.first_chat_completed || false;
      
      // If not marked as complete but we have a journey record, check for existing conversations
      if (!chatComplete && userJourney && profile?.id) {
        try {
          const { data: conversations, error } = await supabase
            .from('chat_conversations')
            .select('id, message_count')
            .eq('user_id', profile.id)
            .gt('message_count', 1) // At least one exchange
            .limit(1);
          
          if (!error && conversations && conversations.length > 0) {
            console.log('Found existing conversations, should auto-complete chat step');
            chatComplete = true;
          }
        } catch (error) {
          console.error('Error checking for existing conversations:', error);
        }
      }

      const newStates = {
        // Profile: completado si el perfil tiene información suficiente
        profile: profileComplete,
        
        // Knowledge: completado si tiene al menos un archivo subido
        knowledge: hasKnowledgeFiles,
        
        // Chat: usar el estado del journey con detección retroactiva
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
        retroactiveChat: chatComplete,
        changes: {
          profile: completionStates.profile !== newStates.profile,
          knowledge: completionStates.knowledge !== newStates.knowledge,
          chat: completionStates.chat !== newStates.chat,
          agents: completionStates.agents !== newStates.agents,
          content: completionStates.content !== newStates.content
        }
      });

      setCompletionStates(newStates);
    };

    calculateCompletionStates();
  }, [profile, documents, userKnowledgeFiles, userJourney]);

  return completionStates;
}
