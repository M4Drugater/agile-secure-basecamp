
import { useSessionCreator } from './useSessionCreator';
import { useSessionUpdater } from './useSessionUpdater';
import { useAgentManager } from './useAgentManager';

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

export function useSessionOperations() {
  const { createSession } = useSessionCreator();
  const { updateSessionState, completeSession } = useSessionUpdater();
  const { addAgentToSession, updateAgentProgress } = useAgentManager();

  return {
    createSession,
    updateSessionState,
    completeSession,
    addAgentToSession,
    updateAgentProgress
  };
}
