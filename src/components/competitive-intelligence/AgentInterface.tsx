
import React, { useState } from 'react';
import { AgentSelectionView } from './AgentSelectionView';
import { AgentWorkspace } from './AgentWorkspace';
import { useAgentInterface } from '@/hooks/competitive-intelligence/useAgentInterface';

interface AgentInterfaceProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
}

export function AgentInterface({ selectedAgent, onAgentSelect }: AgentInterfaceProps) {
  const { sessionConfig, setSessionConfig } = useAgentInterface();
  const [localSelectedAgent, setLocalSelectedAgent] = useState<string>(selectedAgent || '');

  const handleAgentSelected = () => {
    if (localSelectedAgent) {
      onAgentSelect(localSelectedAgent);
    }
  };

  if (!selectedAgent) {
    return (
      <AgentSelectionView 
        selectedAgent={localSelectedAgent}
        setSelectedAgent={setLocalSelectedAgent}
        onAgentSelected={handleAgentSelected}
      />
    );
  }

  return (
    <AgentWorkspace 
      selectedAgent={selectedAgent}
      sessionConfig={sessionConfig}
      setSessionConfig={setSessionConfig}
    />
  );
}
