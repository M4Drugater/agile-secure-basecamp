
import { useState } from 'react';

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

export function useSessionState() {
  const [currentSession, setCurrentSession] = useState<UnifiedSession | null>(null);
  const [sessions, setSessions] = useState<UnifiedSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    currentSession,
    setCurrentSession,
    sessions,
    setSessions,
    isLoading,
    setIsLoading
  };
}
