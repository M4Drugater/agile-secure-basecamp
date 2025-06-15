
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
  geographicScope?: string;
  analysisDepth?: string;
}

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

export function useSessionCreator() {
  const { user } = useAuth();

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

      const typedData = {
        ...data,
        status: data.status as UnifiedSession['status']
      } as UnifiedSession;

      return typedData;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  return { createSession };
}
