import { useState, useEffect } from 'react';
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

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
  geographicScope?: string;
  analysisDepth?: string;
}

export function useUnifiedSessionManager() {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<UnifiedSession | null>(null);
  const [sessions, setSessions] = useState<UnifiedSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user sessions
  const loadSessions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('unified_ci_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure compatibility with our interface
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as UnifiedSession['status']
      })) as UnifiedSession[];
      
      setSessions(typedData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new unified session
  const createSession = async (config: SessionConfig, selectedAgents: string[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const sessionName = `${config.companyName} - ${config.industry} Analysis`;
      
      const { data, error } = await supabase
        .from('unified_ci_sessions')
        .insert({
          user_id: user.id,
          session_name: sessionName,
          company_name: config.companyName,
          industry: config.industry,
          analysis_focus: config.analysisFocus,
          objectives: config.objectives,
          geographic_scope: config.geographicScope || 'Global',
          analysis_depth: config.analysisDepth || 'Detailed',
          active_agents: selectedAgents,
          session_state: {
            currentStep: 'configuration',
            completedSteps: [],
            agentProgress: selectedAgents.reduce((acc, agent) => {
              acc[agent] = { status: 'pending', progress: 0 };
              return acc;
            }, {} as Record<string, any>)
          },
          progress_tracker: {
            totalSteps: 5,
            currentStep: 1,
            stepNames: ['Configuration', 'Data Collection', 'Analysis', 'Collaboration', 'Output Generation']
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the returned data
      const typedData = {
        ...data,
        status: data.status as UnifiedSession['status']
      } as UnifiedSession;

      setCurrentSession(typedData);
      await loadSessions();
      
      return typedData;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  // Update session state
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

      // Type assertion for the returned data
      const typedData = {
        ...data,
        status: data.status as UnifiedSession['status']
      } as UnifiedSession;

      if (currentSession?.id === sessionId) {
        setCurrentSession(typedData);
      }
      await loadSessions();
      
      return typedData;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  // Add agent to session
  const addAgentToSession = async (sessionId: string, agentType: string) => {
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

  // Update agent progress
  const updateAgentProgress = async (sessionId: string, agentType: string, progress: number, status: string) => {
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

  // Complete session
  const completeSession = async (sessionId: string) => {
    return updateSessionState(sessionId, {
      status: 'completed',
      progress_tracker: {
        ...sessions.find(s => s.id === sessionId)?.progress_tracker,
        currentStep: 5,
        completedAt: new Date().toISOString()
      }
    });
  };

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  return {
    currentSession,
    sessions,
    isLoading,
    setCurrentSession,
    createSession,
    updateSessionState,
    addAgentToSession,
    updateAgentProgress,
    completeSession,
    loadSessions
  };
}
