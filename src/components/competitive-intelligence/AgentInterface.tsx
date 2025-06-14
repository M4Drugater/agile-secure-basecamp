
import React from 'react';
import { AgentSelectionView } from './AgentSelectionView';
import { AgentWorkspace } from './AgentWorkspace';
import { useAgentInterface } from '@/hooks/competitive-intelligence/useAgentInterface';

interface AgentInterfaceProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
}

export function AgentInterface({ selectedAgent, onAgentSelect }: AgentInterfaceProps) {
  const { sessionConfig, setSessionConfig } = useAgentInterface();

  if (!selectedAgent) {
    return <AgentSelectionView onAgentSelect={onAgentSelect} />;
  }

  return (
    <AgentWorkspace 
      selectedAgent={selectedAgent}
      sessionConfig={sessionConfig}
      setSessionConfig={setSessionConfig}
    />
  );
}
