
import { useState, useEffect } from 'react';
import { AgentConfig } from '@/components/agents/UnifiedAgentWorkspace';
import { useSessionCompletion } from './useSessionCompletion';

interface SessionMetrics {
  sessionProgress: number;
  totalInteractions: number;
  consensusLevel: number;
  activeAgents: number;
  completedTasks: number;
  pendingTasks: number;
  averageResponseTime: number;
  collaborationScore: number;
}

interface AgentActivity {
  agentId: string;
  contributions: number;
  accuracy: number;
  responseTime: number;
  status: 'active' | 'processing' | 'idle';
  lastActivity: Date;
}

interface CollaborativeInsight {
  id: string;
  type: 'consensus' | 'divergence' | 'synthesis' | 'breakthrough';
  title: string;
  description: string;
  confidence: number;
  agents: string[];
  timestamp: Date;
  impact: 'high' | 'medium' | 'low';
}

export function useRealTimeSessionData(sessionId: string, selectedAgents: AgentConfig[]) {
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    sessionProgress: 0,
    totalInteractions: 0,
    consensusLevel: 0,
    activeAgents: 0,
    completedTasks: 0,
    pendingTasks: 0,
    averageResponseTime: 0,
    collaborationScore: 0
  });

  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [insights, setInsights] = useState<CollaborativeInsight[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Hook de finalización de sesión
  const {
    isGeneratingResults,
    completionResults,
    hasBeenCompleted,
    detectSessionCompletion,
    generateFinalResults,
    resetCompletion
  } = useSessionCompletion(sessionId, selectedAgents);

  // Initialize session data
  useEffect(() => {
    if (selectedAgents.length > 0) {
      setAgentActivities(selectedAgents.map(agent => ({
        agentId: agent.id,
        contributions: 0,
        accuracy: Math.floor(Math.random() * 20) + 80,
        responseTime: Math.floor(Math.random() * 3) + 1,
        status: 'idle' as const,
        lastActivity: new Date()
      })));
    }
  }, [selectedAgents]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isSessionActive || hasBeenCompleted) return;

    const interval = setInterval(() => {
      // Update session metrics with completion detection
      setSessionMetrics(prev => {
        const newProgress = Math.min(prev.sessionProgress + Math.random() * 3, 100);
        const newConsensus = Math.max(50, Math.min(100, prev.consensusLevel + (Math.random() - 0.4) * 8));
        const newCollaborationScore = Math.max(60, Math.min(100, prev.collaborationScore + (Math.random() - 0.3) * 5));

        const updatedMetrics = {
          ...prev,
          sessionProgress: newProgress,
          totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 3),
          consensusLevel: newConsensus,
          activeAgents: selectedAgents.length,
          completedTasks: prev.completedTasks + (Math.random() > 0.8 ? 1 : 0),
          averageResponseTime: Math.floor(Math.random() * 5) + 2,
          collaborationScore: newCollaborationScore
        };

        // Detectar finalización automáticamente
        detectSessionCompletion(updatedMetrics);

        return updatedMetrics;
      });

      // Update agent activities
      setAgentActivities(prev => prev.map(agent => ({
        ...agent,
        contributions: agent.contributions + Math.floor(Math.random() * 2),
        status: Math.random() > 0.7 ? 'active' : agent.status,
        lastActivity: Math.random() > 0.8 ? new Date() : agent.lastActivity
      })));

      // Generate insights based on progress
      if (Math.random() > 0.85) {
        const insightTypes = ['consensus', 'synthesis', 'breakthrough'] as const;
        const randomType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
        simulateCollaborativeEvent(randomType);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isSessionActive, hasBeenCompleted, selectedAgents.length]);

  const startSession = () => {
    setIsSessionActive(true);
    resetCompletion(); // Reset any previous completion state
    addInsight({
      type: 'synthesis',
      title: 'Sesión colaborativa iniciada',
      description: `CLIPOGINO ha iniciado la coordinación de ${selectedAgents.length} agentes especializados`,
      confidence: 100,
      agents: ['CLIPOGINO'],
      impact: 'high'
    });
  };

  const pauseSession = () => {
    setIsSessionActive(false);
  };

  const triggerManualCompletion = () => {
    generateFinalResults(sessionMetrics);
  };

  const addInsight = (insight: Omit<CollaborativeInsight, 'id' | 'timestamp'>) => {
    const newInsight: CollaborativeInsight = {
      ...insight,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setInsights(prev => [newInsight, ...prev].slice(0, 15)); // Keep more insights for completion tracking
  };

  const simulateCollaborativeEvent = (eventType: 'consensus' | 'divergence' | 'breakthrough') => {
    const events = {
      consensus: {
        title: 'Consenso alcanzado entre agentes',
        description: 'Los agentes han llegado a un acuerdo sobre la estrategia recomendada',
        confidence: Math.floor(Math.random() * 20) + 80
      },
      divergence: {
        title: 'Perspectivas divergentes identificadas',
        description: 'Se han detectado enfoques diferentes que requieren análisis adicional',
        confidence: Math.floor(Math.random() * 30) + 60
      },
      breakthrough: {
        title: 'Insight innovador descubierto',
        description: 'La colaboración ha producido una perspectiva única y valiosa',
        confidence: Math.floor(Math.random() * 15) + 85
      }
    };

    addInsight({
      type: eventType,
      ...events[eventType],
      agents: selectedAgents.slice(0, Math.floor(Math.random() * selectedAgents.length) + 1).map(a => a.name),
      impact: Math.random() > 0.6 ? 'high' : 'medium'
    });
  };

  return {
    sessionMetrics,
    agentActivities,
    insights,
    isSessionActive,
    isGeneratingResults,
    completionResults,
    hasBeenCompleted,
    startSession,
    pauseSession,
    addInsight,
    simulateCollaborativeEvent,
    triggerManualCompletion
  };
}
