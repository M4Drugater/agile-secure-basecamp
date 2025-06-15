
import React from 'react';
import { Bot } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { availableAgents } from '../config/availableAgents';

interface AgentSelectionGridProps {
  onAgentSelect: (agentId: string) => void;
  selectedAgentId?: string;
}

export function AgentSelectionGrid({ onAgentSelect, selectedAgentId }: AgentSelectionGridProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Bot className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Select an AI Agent</h3>
        <p className="text-muted-foreground text-lg">
          Choose a specialized AI agent to start your session
        </p>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            🚀 All agents now use the <strong>Tripartite System</strong> (OpenAI → Perplexity → Claude) for enhanced accuracy
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            id={agent.id}
            name={agent.name}
            description={agent.description}
            icon={agent.icon}
            color={agent.color}
            capabilities={agent.capabilities}
            status={agent.status}
            onSelect={onAgentSelect}
            isSelected={selectedAgentId === agent.id}
          />
        ))}
      </div>
    </div>
  );
}
