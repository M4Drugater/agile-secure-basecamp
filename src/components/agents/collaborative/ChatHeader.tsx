
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { AgentConfig } from '../UnifiedAgentWorkspace';

interface ChatHeaderProps {
  selectedAgents: AgentConfig[];
}

export function ChatHeader({ selectedAgents }: ChatHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Chat Colaborativo Multi-Agente
      </CardTitle>
      <div className="flex flex-wrap gap-2">
        {selectedAgents.map(agent => (
          <Badge key={agent.id} variant="secondary" className="flex items-center gap-2">
            <div className={`w-3 h-3 ${agent.color} rounded-full flex items-center justify-center`}>
              {React.createElement(agent.icon, { className: 'h-2 w-2 text-white' })}
            </div>
            {agent.name}
          </Badge>
        ))}
      </div>
    </CardHeader>
  );
}
