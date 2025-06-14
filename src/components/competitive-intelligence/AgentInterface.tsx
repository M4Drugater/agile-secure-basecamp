
import React, { useState } from 'react';
import { AgentSelectionView } from './AgentSelectionView';
import { AgentInfoPanel } from './AgentInfoPanel';
import { AgentConfigurationPanel } from './AgentConfigurationPanel';
import { AgentChat } from './AgentChat';

interface AgentInterfaceProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
}

export function AgentInterface({ selectedAgent, onAgentSelect }: AgentInterfaceProps) {
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  if (!selectedAgent) {
    return <AgentSelectionView onAgentSelect={onAgentSelect} />;
  }

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
