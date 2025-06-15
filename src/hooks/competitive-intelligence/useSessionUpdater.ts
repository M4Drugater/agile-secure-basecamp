
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

export function useSessionUpdater() {
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

      const typedData = {
        ...data,
        status: data.status as UnifiedSession['status']
      } as UnifiedSession;

      return typedData;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  const completeSession = async (sessionId: string, sessions: UnifiedSession[]) => {
    return updateSessionState(sessionId, {
      status: 'completed',
      progress_tracker: {
        ...sessions.find(s => s.id === sessionId)?.progress_tracker,
        currentStep: 5,
        completedAt: new Date().toISOString()
      }
    });
  };

  return { updateSessionState, completeSession };
}
