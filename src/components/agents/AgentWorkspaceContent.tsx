
import React from 'react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { ConsolidatedAgentChat } from './ConsolidatedAgentChat';
import { EnhancedContentGenerator } from '@/components/content/EnhancedContentGenerator';
import { AgentSelectionGrid } from './components/AgentSelectionGrid';
import { useConsolidatedAgentsHub } from './hooks/useConsolidatedAgentsHub';

interface AgentWorkspaceContentProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function AgentWorkspaceContent({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: AgentWorkspaceContentProps) {
  const { handleAgentSelect } = useConsolidatedAgentsHub();
  const primaryAgent = selectedAgents[0];

  // Show agent selection grid when no agent is selected
  if (!primaryAgent) {
    return (
      <div className="py-8">
        <AgentSelectionGrid 
          onAgentSelect={handleAgentSelect}
          selectedAgentId={undefined}
        />
      </div>
    );
  }

  // Special handling for Enhanced Content Generator
  if (primaryAgent.id === 'enhanced-content-generator') {
    return <EnhancedContentGenerator />;
  }

  // Use consolidated chat for all other agents
  return (
    <ConsolidatedAgentChat
      selectedAgent={primaryAgent}
      sessionConfig={sessionConfig}
      onUpdateConfig={setSessionConfig}
    />
  );
}
