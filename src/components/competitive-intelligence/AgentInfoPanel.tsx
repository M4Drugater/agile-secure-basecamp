
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { agents } from './agentConfig';

interface AgentInfoPanelProps {
  agentId: string;
}

export function AgentInfoPanel({ agentId }: AgentInfoPanelProps) {
  const agent = agents[agentId as keyof typeof agents];

  if (!agent) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${agent.color} rounded-full flex items-center justify-center`}>
            <agent.icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              <Zap className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{agent.description}</p>
        
        <div>
          <h4 className="font-medium mb-2">Capacidades:</h4>
          <div className="space-y-1">
            {agent.capabilities.map((capability, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {capability}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
