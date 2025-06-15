
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface CollaborativeSessionProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function CollaborativeSession({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: CollaborativeSessionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborative Agent Session</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Collaborative sessions with {selectedAgents.length} agents will be implemented here
          </p>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Selected agents: {selectedAgents.map(agent => agent.name).join(', ')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
