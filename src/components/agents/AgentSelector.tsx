
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface AgentSelectorProps {
  agents: AgentConfig[];
  selectedAgents: string[];
  onAgentSelect: (agentId: string) => void;
  collaborativeMode: boolean;
}

export function AgentSelector({ 
  agents, 
  selectedAgents, 
  onAgentSelect, 
  collaborativeMode 
}: AgentSelectorProps) {
  const getAgentsByType = (type: AgentConfig['type']) => {
    return agents.filter(agent => agent.type === type);
  };

  const agentTypes = [
    { type: 'chat' as const, label: 'AI Chat & Mentoring', description: 'Personal guidance and mentoring' },
    { type: 'competitive-intelligence' as const, label: 'Competitive Intelligence', description: 'Market analysis and competitor research' },
    { type: 'research' as const, label: 'Research & Analysis', description: 'Deep research and strategic insights' },
    { type: 'content' as const, label: 'Content Creation', description: 'Content generation and optimization' },
    { type: 'learning' as const, label: 'Learning Management', description: 'Education and skill development' }
  ];

  const AgentCard = ({ agent }: { agent: AgentConfig }) => {
    const isSelected = selectedAgents.includes(agent.id);
    const Icon = agent.icon;

    return (
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected 
            ? 'ring-2 ring-blue-500 bg-blue-50' 
            : 'hover:bg-muted/50'
        }`}
        onClick={() => onAgentSelect(agent.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center flex-shrink-0`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm">{agent.name}</h4>
                <Badge 
                  variant={agent.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {agent.status}
                </Badge>
                {isSelected && (
                  <div className="ml-auto">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {agent.description}
              </p>
              
              <div className="space-y-1">
                <h5 className="text-xs font-medium text-muted-foreground">Key Capabilities:</h5>
                <div className="space-y-1">
                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      {capability}
                    </div>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{agent.capabilities.length - 3} more capabilities
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {collaborativeMode && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="w-full flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onAgentSelect(agent.id);
                }}
              >
                {isSelected ? (
                  <>
                    <Check className="h-3 w-3" />
                    Selected
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" />
                    Add to Session
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select AI Agents</h2>
        <p className="text-muted-foreground">
          {collaborativeMode 
            ? 'Choose multiple agents to work together in a collaborative session'
            : 'Choose an agent to start working with'
          }
        </p>
      </div>

      {agentTypes.map(({ type, label, description }) => {
        const typeAgents = getAgentsByType(type);
        
        if (typeAgents.length === 0) return null;

        return (
          <div key={type} className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{label}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
