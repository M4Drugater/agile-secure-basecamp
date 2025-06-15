
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

export function useSessionManager() {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<UnifiedSession | null>(null);
  const [sessions, setSessions] = useState<UnifiedSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    loadSessions
  };
}
