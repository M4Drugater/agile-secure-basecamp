
import React from 'react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { ConsolidatedAgentChat } from './ConsolidatedAgentChat';
import { EnhancedContentGenerator } from '@/components/content/EnhancedContentGenerator';

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
  const primaryAgent = selectedAgents[0];

  if (!primaryAgent) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No agent selected</p>
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
