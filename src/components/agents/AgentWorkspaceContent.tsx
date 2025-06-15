
import React from 'react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { ClipoginoChat } from '@/components/chat/ClipoginoChat';
import { EnhancedAgentWorkspace } from '@/components/competitive-intelligence/EnhancedAgentWorkspace';
import { OptimizedResearchWorkbench } from '@/components/research/OptimizedResearchWorkbench';

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

  // Route to the appropriate agent interface based on type and ID
  switch (primaryAgent.id) {
    case 'clipogino':
      return <ClipoginoChat />;
    
    case 'research-engine':
      return <OptimizedResearchWorkbench />;
    
    case 'cdv':
    case 'cia':
    case 'cir':
      return (
        <EnhancedAgentWorkspace
          selectedAgent={primaryAgent.id}
          sessionConfig={sessionConfig}
          setSessionConfig={setSessionConfig}
        />
      );
    
    default:
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Agent interface for {primaryAgent.name} is not yet implemented
          </p>
        </div>
      );
  }
}
