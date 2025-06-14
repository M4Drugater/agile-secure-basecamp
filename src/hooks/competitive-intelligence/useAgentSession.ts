
import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

export function useAgentSession(agentId: string, sessionConfig: SessionConfig) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { supabase, user } = useSupabase();

  const agentNames = {
    cdv: 'CDV Agent',
    cir: 'CIR Agent', 
    cia: 'CIA Agent'
  };

  const initializeSession = async () => {
    if (!user || !supabase || !sessionConfig.companyName) return;

    try {
      const { data, error } = await supabase
        .from('competitive_intelligence_sessions')
        .insert({
          user_id: user.id,
          session_name: `${agentNames[agentId as keyof typeof agentNames]} - ${sessionConfig.companyName}`,
          agent_type: agentId,
          company_name: sessionConfig.companyName,
          industry: sessionConfig.industry,
          analysis_focus: sessionConfig.analysisFocus,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  useEffect(() => {
    if (sessionConfig.companyName && !sessionId) {
      initializeSession();
    }
  }, [sessionConfig, sessionId]);

  return {
    sessionId,
    initializeSession
  };
}
