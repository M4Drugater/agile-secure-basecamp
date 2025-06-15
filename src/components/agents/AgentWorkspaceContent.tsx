
import React from 'react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { ClipoginoChat } from '@/components/chat/ClipoginoChat';
import { EnhancedAgentWorkspace } from '@/components/competitive-intelligence/EnhancedAgentWorkspace';
import { OptimizedResearchWorkbench } from '@/components/research/OptimizedResearchWorkbench';
import { EnhancedContentGenerator } from '@/components/content/EnhancedContentGenerator';
import { AgentChat } from '@/components/competitive-intelligence/AgentChat';

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

  // Initialize default session config for competitive intelligence agents if not set
  const ensureSessionConfig = () => {
    if (!sessionConfig.companyName && (primaryAgent.type === 'competitive-intelligence')) {
      return {
        companyName: '',
        industry: '',
        analysisFocus: '',
        objectives: '',
        ...sessionConfig
      };
    }
    return sessionConfig;
  };

  const currentSessionConfig = ensureSessionConfig();

  // Route to the appropriate agent interface based on type and ID
  switch (primaryAgent.id) {
    case 'enhanced-content-generator':
      return <EnhancedContentGenerator />;
      
    case 'clipogino':
      return <ClipoginoChat />;
    
    case 'research-engine':
      return <OptimizedResearchWorkbench />;
    
    case 'cdv':
    case 'cia':
    case 'cir':
      // For competitive intelligence agents, use the direct chat interface
      // instead of the full workspace when in single-agent mode
      return (
        <div className="max-w-4xl mx-auto">
          <AgentChat
            agentId={primaryAgent.id}
            sessionConfig={currentSessionConfig}
          />
        </div>
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
