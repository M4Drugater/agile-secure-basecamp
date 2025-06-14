
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
      // Only log in development or when there are actual issues
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      // Check multiple sources for knowledge files
      const hasKnowledgeFiles = (documents && documents.length > 0) || 
                               (userKnowledgeFiles && userKnowledgeFiles.length > 0);

      // Profile completion check - requires 80% completion
      const profileComplete = !!(
        profile?.full_name && 
        profile?.industry &&
        (profile?.profile_completeness || 0) >= 80
      );

      // Chat completion - mark as complete when journey record exists and user has visited chat
      let chatComplete = userJourney?.first_chat_completed || false;
      
      // Auto-complete chat if user has any conversation history (only check once)
      if (!chatComplete && userJourney && profile?.id) {
        try {
          const { data: conversations, error } = await supabase
            .from('chat_conversations')
            .select('id, message_count')
            .eq('user_id', profile.id)
            .limit(1);
          
          if (!error && conversations && conversations.length > 0) {
            if (isDevelopment) {
              console.log('Auto-completing chat step - found existing conversations');
            }
            chatComplete = true;
          }
        } catch (error) {
          if (isDevelopment) {
            console.error('Error checking conversations:', error);
          }
        }
      }

      // Agents completion - mark as complete when user visits the page or has CI sessions
      let agentsComplete = userJourney?.cdv_introduced || false;
      
      if (!agentsComplete && profile?.id) {
        try {
          const { data: ciSessions, error } = await supabase
            .from('competitive_intelligence_sessions')
            .select('id')
            .eq('user_id', profile.id)
            .limit(1);
          
          if (!error && ciSessions && ciSessions.length > 0) {
            if (isDevelopment) {
              console.log('Auto-completing agents step - found CI sessions');
            }
            agentsComplete = true;
          }
        } catch (error) {
          if (isDevelopment) {
            console.error('Error checking CI sessions:', error);
          }
        }
      }

      // Content completion - use journey state or check for any generated content
      let contentComplete = userJourney?.first_content_created || false;
      
      if (!contentComplete && profile?.id) {
        try {
          const { data: content, error } = await supabase
            .from('content_items')
            .select('id')
            .eq('user_id', profile.id)
            .limit(1);
          
          if (!error && content && content.length > 0) {
            if (isDevelopment) {
              console.log('Auto-completing content step - found generated content');
            }
            contentComplete = true;
          }
        } catch (error) {
          if (isDevelopment) {
            console.error('Error checking content:', error);
          }
        }
      }

      const newStates = {
        profile: profileComplete,
        knowledge: hasKnowledgeFiles,
        chat: chatComplete,
        agents: agentsComplete,
        content: contentComplete
      };

      // Only log changes in development
      if (isDevelopment) {
        const hasChanges = Object.keys(newStates).some(
          key => completionStates[key as keyof typeof completionStates] !== newStates[key as keyof typeof newStates]
        );
        
        if (hasChanges) {
          console.log('Journey completion states updated:', newStates);
        }
      }

      setCompletionStates(newStates);
    };

    calculateCompletionStates();
  }, [profile, documents, userKnowledgeFiles, userJourney, completionStates]);

  return completionStates;
}
