
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentConfig } from '../../UnifiedAgentWorkspace';

interface AgentPerformanceTabProps {
  agentActivities: any[];
  selectedAgents: AgentConfig[];
}

export function AgentPerformanceTab({ agentActivities, selectedAgents }: AgentPerformanceTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento de Agentes en Tiempo Real</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agentActivities.map((activity) => {
            const agent = selectedAgents.find(a => a.id === activity.agentId);
            if (!agent) return null;
            
            const Icon = agent.icon;
            return (
              <div key={activity.agentId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${agent.color} rounded-full flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">{agent.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`} />
                    <Badge variant={activity.status === 'active' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Contribuciones</span>
                    <div className="font-medium">{activity.contributions}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Precisión</span>
                    <div className="font-medium">{activity.accuracy}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tiempo Resp.</span>
                    <div className="font-medium">{activity.responseTime}s</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Última Actividad</span>
                    <div className="font-medium text-xs">
                      {activity.lastActivity.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
