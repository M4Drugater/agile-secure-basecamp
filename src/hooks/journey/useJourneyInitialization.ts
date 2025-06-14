
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJourneyData } from './useJourneyData';
import { supabase } from '@/integrations/supabase/client';

export function useJourneyInitialization() {
  const { user, profile } = useAuth();
  const { userJourney, updateJourney } = useJourneyData();

  useEffect(() => {
    if (!user || userJourney !== null) return;

    // Auto-initialize journey for users without a record
    const initializeJourney = async () => {
      try {
        console.log('Initializing journey for user:', user.id);
        
        // Check if user has existing conversations (retroactive detection)
        const { data: conversations } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        const hasExistingConversations = conversations && conversations.length > 0;
        
        // Check if user has knowledge files
        const { data: knowledgeFiles } = await supabase
          .from('user_knowledge_files')
          .select('id')
          .eq('user_id', user.id)
          .eq('processing_status', 'completed')
          .limit(1);

        const hasKnowledgeFiles = knowledgeFiles && knowledgeFiles.length > 0;

        // Determine profile completion status
        const profileCompleted = !!(
          profile?.full_name && 
          profile?.industry && 
          profile?.current_position &&
          (profile?.profile_completeness || 0) >= 70
        );

        const initialJourneyData = {
          current_step: hasExistingConversations ? 3 : (hasKnowledgeFiles ? 2 : (profileCompleted ? 1 : 0)),
          profile_completed: profileCompleted,
          knowledge_setup: hasKnowledgeFiles,
          first_chat_completed: hasExistingConversations, // Auto-heal for existing conversations
          first_content_created: false,
          cdv_introduced: false
        };

        console.log('Creating initial journey with data:', initialJourneyData);

        await updateJourney.mutate(initialJourneyData);
        
        console.log('Journey initialized successfully');
      } catch (error) {
        console.error('Error initializing journey:', error);
      }
    };

    initializeJourney();
  }, [user, userJourney, updateJourney, profile]);

  return { isInitialized: userJourney !== null };
}
