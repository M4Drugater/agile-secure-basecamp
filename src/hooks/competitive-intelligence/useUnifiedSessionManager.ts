
import { useSessionManager } from './useSessionManager';
import { useSessionOperations } from './useSessionOperations';

export function useUnifiedSessionManager() {
  const { currentSession, sessions, isLoading, setCurrentSession, loadSessions } = useSessionManager();
  const { createSession, updateSessionState, completeSession, addAgentToSession, updateAgentProgress } = useSessionOperations();

  return {
    currentSession,
    sessions,
    isLoading,
    setCurrentSession,
    createSession: async (config: any, selectedAgents: string[]) => {
      const session = await createSession(config, selectedAgents);
      setCurrentSession(session);
      await loadSessions();
      return session;
    },
    updateSessionState: async (sessionId: string, updates: any) => {
      const session = await updateSessionState(sessionId, updates);
      if (currentSession?.id === sessionId) {
        setCurrentSession(session);
      }
      await loadSessions();
      return session;
    },
    addAgentToSession: (sessionId: string, agentType: string) => 
      addAgentToSession(sessionId, agentType, sessions),
    updateAgentProgress: (sessionId: string, agentType: string, progress: number, status: string) =>
      updateAgentProgress(sessionId, agentType, progress, status, sessions),
    completeSession: (sessionId: string) => completeSession(sessionId, sessions),
    loadSessions
  };
}
