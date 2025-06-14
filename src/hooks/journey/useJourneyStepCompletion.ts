
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

      // Profile completion check - now requires 80% completion
      const profileComplete = !!(
        profile?.full_name && 
        profile?.industry &&
        (profile?.profile_completeness || 0) >= 80 // Increased to 80%
      );

      // Chat completion - mark as complete when journey record exists and user has visited chat
      let chatComplete = userJourney?.first_chat_completed || false;
      
      // Auto-complete chat if user has any conversation history
      if (!chatComplete && userJourney && profile?.id) {
        try {
          const { data: conversations, error } = await supabase
            .from('chat_conversations')
            .select('id, message_count')
            .eq('user_id', profile.id)
            .limit(1);
          
          if (!error && conversations && conversations.length > 0) {
            console.log('Found existing conversations, auto-completing chat step');
            chatComplete = true;
          }
        } catch (error) {
          console.error('Error checking for existing conversations:', error);
        }
      }

      // Agents completion - mark as complete when user visits the page or has CI sessions
      let agentsComplete = userJourney?.cdv_introduced || false;
      
      if (!agentsComplete && profile?.id) {
        try {
          // Check if user has any competitive intelligence sessions
          const { data: ciSessions, error } = await supabase
            .from('competitive_intelligence_sessions')
            .select('id')
            .eq('user_id', profile.id)
            .limit(1);
          
          if (!error && ciSessions && ciSessions.length > 0) {
            console.log('Found CI sessions, marking agents step as complete');
            agentsComplete = true;
          }
        } catch (error) {
          console.error('Error checking for CI sessions:', error);
        }
      }

      // Content completion - use journey state or check for any generated content
      let contentComplete = userJourney?.first_content_created || false;
      
      if (!contentComplete && profile?.id) {
        try {
          // Check if user has any generated content
          const { data: content, error } = await supabase
            .from('content_items')
            .select('id')
            .eq('user_id', profile.id)
            .limit(1);
          
          if (!error && content && content.length > 0) {
            console.log('Found generated content, marking content step as complete');
            contentComplete = true;
          }
        } catch (error) {
          console.error('Error checking for generated content:', error);
        }
      }

      const newStates = {
        // Profile: requires 80% completion
        profile: profileComplete,
        
        // Knowledge: requires at least one file uploaded (mandatory)
        knowledge: hasKnowledgeFiles,
        
        // Chat: auto-complete when user visits or has conversations
        chat: chatComplete,
        
        // Agents: auto-complete when user visits or has CI sessions
        agents: agentsComplete,
        
        // Content: auto-complete when user visits or has generated content
        content: contentComplete
      };

      console.log('Computed completion states:', {
        previous: completionStates,
        new: newStates,
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
