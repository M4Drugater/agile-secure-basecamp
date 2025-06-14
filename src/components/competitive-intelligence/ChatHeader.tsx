
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Brain, Activity } from 'lucide-react';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

interface ChatHeaderProps {
  agentId: string;
  sessionConfig: SessionConfig;
}

const agentNames = {
  cdv: 'CDV Agent',
  cir: 'CIR Agent', 
  cia: 'CIA Agent'
};

const agentIcons = {
  cdv: Eye,
  cir: Activity,
  cia: Brain
};

export function ChatHeader({ agentId, sessionConfig }: ChatHeaderProps) {
  const AgentIcon = agentIcons[agentId as keyof typeof agentIcons];

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <AgentIcon className="h-4 w-4 text-white" />
        </div>
        <div>
          <CardTitle className="text-lg">{agentNames[agentId as keyof typeof agentNames]}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {sessionConfig.companyName}
            </Badge>
            {sessionConfig.industry && (
              <Badge variant="outline" className="text-xs">
                {sessionConfig.industry}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
