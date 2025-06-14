
import React from 'react';
import { Bot } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { agents } from './agentConfig';

interface AgentSelectionViewProps {
  onAgentSelect: (agentId: string) => void;
}

export function AgentSelectionView({ onAgentSelect }: AgentSelectionViewProps) {
  return (
    <div className="text-center py-12">
      <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Selecciona un Agente de IA</h3>
      <p className="text-muted-foreground mb-6">
        Elige un agente especializado en inteligencia competitiva para comenzar tu análisis
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {Object.entries(agents).map(([id, agent]) => (
          <AgentCard
            key={id}
            id={id}
            name={agent.name}
            description={agent.description}
            icon={agent.icon}
            color={agent.color}
            onSelect={onAgentSelect}
          />
        ))}
      </div>
    </div>
  );
}
