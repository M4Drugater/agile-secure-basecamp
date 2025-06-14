
import React from 'react';
import { AgentInfoPanel } from './AgentInfoPanel';
import { AgentConfigurationPanel } from './AgentConfigurationPanel';
import { AgentChat } from './AgentChat';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

interface AgentWorkspaceProps {
  selectedAgent: string;
  sessionConfig: SessionConfig;
  setSessionConfig: React.Dispatch<React.SetStateAction<SessionConfig>>;
}

export function AgentWorkspace({ 
  selectedAgent, 
  sessionConfig, 
  setSessionConfig 
}: AgentWorkspaceProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agent Configuration */}
      <div className="lg:col-span-1 space-y-6">
        <AgentInfoPanel agentId={selectedAgent} />
        <AgentConfigurationPanel 
          sessionConfig={sessionConfig} 
          setSessionConfig={setSessionConfig} 
        />
      </div>

      {/* Agent Chat Interface */}
      <div className="lg:col-span-2">
        <AgentChat agentId={selectedAgent} sessionConfig={sessionConfig} />
      </div>
    </div>
  );
}
