
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { MetricsCards } from './collaborative/analysis/MetricsCards';
import { LiveInsightsTab } from './collaborative/analysis/LiveInsightsTab';
import { AgentPerformanceTab } from './collaborative/analysis/AgentPerformanceTab';
import { CollaborationPatternsTab } from './collaborative/analysis/CollaborationPatternsTab';
import { SessionTimelineTab } from './collaborative/analysis/SessionTimelineTab';
import { SessionCompletionTracker } from './collaborative/SessionCompletionTracker';
import { CompletionResultsModal } from './collaborative/CompletionResultsModal';

interface RealTimeCollaborativeAnalysisProps {
  selectedAgents: AgentConfig[];
  sessionMetrics: any;
  agentActivities: any[];
  insights: any[];
  isSessionActive: boolean;
  isGeneratingResults?: boolean;
  completionResults?: any;
  triggerManualCompletion?: () => void;
}

export function RealTimeCollaborativeAnalysis({ 
  selectedAgents, 
  sessionMetrics,
  agentActivities,
  insights,
  isSessionActive,
  isGeneratingResults = false,
  completionResults,
  triggerManualCompletion
}: RealTimeCollaborativeAnalysisProps) {
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Mostrar modal automáticamente cuando se completen los resultados
  React.useEffect(() => {
    if (completionResults && !showResultsModal) {
      setShowResultsModal(true);
    }
  }, [completionResults, showResultsModal]);

  return (
    <div className="space-y-6">
      {/* Tracker de Finalización */}
      <SessionCompletionTracker
        sessionMetrics={sessionMetrics}
        isGeneratingResults={isGeneratingResults}
        completionResults={completionResults}
        onTriggerCompletion={() => {
          triggerManualCompletion?.();
        }}
        isSessionActive={isSessionActive}
      />

      {/* Real-time Session Metrics */}
      <MetricsCards 
        sessionMetrics={sessionMetrics}
        isSessionActive={isSessionActive}
      />

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="live-insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-insights">Insights en Vivo</TabsTrigger>
          <TabsTrigger value="agent-performance">Rendimiento de Agentes</TabsTrigger>
          <TabsTrigger value="collaboration-patterns">Patrones de Colaboración</TabsTrigger>
          <TabsTrigger value="session-timeline">Timeline de Sesión</TabsTrigger>
        </TabsList>

        <TabsContent value="live-insights" className="space-y-4">
          <LiveInsightsTab 
            insights={insights}
            isSessionActive={isSessionActive}
          />
        </TabsContent>

        <TabsContent value="agent-performance" className="space-y-4">
          <AgentPerformanceTab 
            agentActivities={agentActivities}
            selectedAgents={selectedAgents}
          />
        </TabsContent>

        <TabsContent value="collaboration-patterns" className="space-y-4">
          <CollaborationPatternsTab 
            sessionMetrics={sessionMetrics}
          />
        </TabsContent>

        <TabsContent value="session-timeline" className="space-y-4">
          <SessionTimelineTab 
            insights={insights}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de Resultados */}
      <CompletionResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        completionResults={completionResults}
        agentCount={selectedAgents.length}
      />
    </div>
  );
}
