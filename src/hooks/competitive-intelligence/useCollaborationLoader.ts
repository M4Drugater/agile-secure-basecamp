
import { useState } from 'react';
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

export function useCollaborationLoader() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState<AgentCollaboration[]>([]);

  const loadCollaborations = async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agent_collaborations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        interaction_type: item.interaction_type as AgentCollaboration['interaction_type']
      })) as AgentCollaboration[];
      
      setCollaborations(typedData);
    } catch (error) {
      console.error('Error loading collaborations:', error);
    }
  };

  return { collaborations, setCollaborations, loadCollaborations };
}
