
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { SessionHeader } from './SessionHeader';
import { SessionTabNavigation } from './SessionTabNavigation';
import { CoordinationPanel } from './CoordinationPanel';
import { CollaborativeChatInterface } from './CollaborativeChatInterface';
import { EnhancedCollaborativeSettings } from './EnhancedCollaborativeSettings';
import { RealTimeCollaborativeAnalysis } from './RealTimeCollaborativeAnalysis';
import { ClipoginoOrchestrator } from './ClipoginoOrchestrator';
import { useRealTimeSessionData } from '@/hooks/collaborative/useRealTimeSessionData';

interface CollaborativeSessionProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function CollaborativeSession({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: CollaborativeSessionProps) {
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('orchestrator');
  
  const {
    sessionMetrics,
    agentActivities,
    insights,
    isSessionActive,
    isGeneratingResults,
    completionResults,
    hasBeenCompleted,
    startSession,
    pauseSession,
    simulateCollaborativeEvent,
    triggerManualCompletion
  } = useRealTimeSessionData('session-1', selectedAgents);

  const handleStartSession = () => {
    startSession();
    setSessionStartTime(new Date());
    setActiveTab('chat'); // Switch to chat when starting session
  };

  const handlePauseSession = () => {
    pauseSession();
  };

  return (
    <div className="space-y-6">
      <SessionHeader
        selectedAgents={selectedAgents}
        sessionStartTime={sessionStartTime}
        isSessionActive={isSessionActive}
        onStartSession={handleStartSession}
        onPauseSession={handlePauseSession}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <SessionTabNavigation />

        <TabsContent value="orchestrator">
          <ClipoginoOrchestrator
            selectedAgents={selectedAgents}
            isSessionActive={isSessionActive}
            sessionMetrics={sessionMetrics}
            onStartSession={handleStartSession}
            onPauseSession={handlePauseSession}
            onSimulateEvent={simulateCollaborativeEvent}
          />
        </TabsContent>

        <TabsContent value="chat">
          <CollaborativeChatInterface
            selectedAgents={selectedAgents}
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <RealTimeCollaborativeAnalysis
            selectedAgents={selectedAgents}
            sessionMetrics={sessionMetrics}
            agentActivities={agentActivities}
            insights={insights}
            isSessionActive={isSessionActive}
            isGeneratingResults={isGeneratingResults}
            completionResults={completionResults}
            triggerManualCompletion={triggerManualCompletion}
          />
        </TabsContent>

        <TabsContent value="coordination">
          <CoordinationPanel />
        </TabsContent>

        <TabsContent value="settings">
          <EnhancedCollaborativeSettings
            selectedAgents={selectedAgents}
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
