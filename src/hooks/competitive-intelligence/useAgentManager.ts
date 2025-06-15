
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedSession {
  id: string;
  session_name: string;
  company_name: string;
  industry: string;
  analysis_focus: string;
  objectives: string;
  geographic_scope: string;
  analysis_depth: string;
  session_state: any;
  active_agents: string[];
  progress_tracker: any;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export function useAgentManager() {
  const { user } = useAuth();

  const updateSessionState = async (sessionId: string, updates: Partial<UnifiedSession>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('unified_ci_sessions')
        .update(updates)
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        status: data.status as UnifiedSession['status']
      } as UnifiedSession;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  const addAgentToSession = async (sessionId: string, agentType: string, sessions: UnifiedSession[]) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const updatedAgents = [...session.active_agents, agentType];
    const updatedState = {
      ...session.session_state,
      agentProgress: {
        ...session.session_state.agentProgress,
        [agentType]: { status: 'pending', progress: 0 }
      }
    };

    return updateSessionState(sessionId, {
      active_agents: updatedAgents,
      session_state: updatedState
    });
  };

  const updateAgentProgress = async (sessionId: string, agentType: string, progress: number, status: string, sessions: UnifiedSession[]) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const updatedState = {
      ...session.session_state,
      agentProgress: {
        ...session.session_state.agentProgress,
        [agentType]: { status, progress }
      }
    };

    return updateSessionState(sessionId, {
      session_state: updatedState
    });
  };

  return {
    addAgentToSession,
    updateAgentProgress
  };
}
