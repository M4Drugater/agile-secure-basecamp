
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AgentCollaboration {
  id: string;
  session_id: string;
  source_agent: string;
  target_agent: string;
  interaction_type: 'data_sharing' | 'insight_validation' | 'recommendation_merge';
  interaction_data: any;
  confidence_score: number;
  created_at: string;
}

interface CollaborationRequest {
  sourceAgent: string;
  targetAgent: string;
  interactionType: 'data_sharing' | 'insight_validation' | 'recommendation_merge';
  data: any;
  confidenceScore?: number;
}

export function useCollaborationCreator() {
  const { user } = useAuth();

  const createCollaboration = async (sessionId: string, request: CollaborationRequest) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agent_collaborations')
        .insert({
          session_id: sessionId,
          source_agent: request.sourceAgent,
          target_agent: request.targetAgent,
          interaction_type: request.interactionType,
          interaction_data: request.data,
          confidence_score: request.confidenceScore || 85
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        interaction_type: data.interaction_type as AgentCollaboration['interaction_type']
      } as AgentCollaboration;

      return typedData;
    } catch (error) {
      console.error('Error creating collaboration:', error);
      throw error;
    }
  };

  return { createCollaboration };
}
