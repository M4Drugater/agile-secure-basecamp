
import React from 'react';
import { ConsolidatedAgentsHeader } from './ConsolidatedAgentsHeader';
import { ConsolidatedAgentsInterface } from './ConsolidatedAgentsInterface';
import { useConsolidatedAgentsHub } from '../hooks/useConsolidatedAgentsHub';

export function ConsolidatedAgentsContainer() {
  const {
    activeMode,
    selectedBucket,
    collaborativeMode,
    sessionConfig,
    handleModeSwitch,
    handleSelectBucket,
    handleBackToBuckets,
    handleBackFromCollaborative,
    getSelectedAgentConfigs,
    setSessionConfig
  } = useConsolidatedAgentsHub();

  return (
    <>
      <ConsolidatedAgentsHeader />

      <ConsolidatedAgentsInterface
        activeMode={activeMode}
        selectedBucket={selectedBucket}
        selectedAgents={getSelectedAgentConfigs()}
        collaborativeMode={collaborativeMode}
        sessionConfig={sessionConfig}
        onModeSwitch={handleModeSwitch}
        onSelectBucket={handleSelectBucket}
        onBackToBuckets={handleBackToBuckets}
        onUpdateConfig={setSessionConfig}
        onBackFromCollaborative={handleBackFromCollaborative}
      />
    </>
  );
}
