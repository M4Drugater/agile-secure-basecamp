
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  Search, 
  Eye, 
  Activity, 
  MessageSquare,
  Settings,
  Play,
  Users
} from 'lucide-react';
import { AgentSelector } from './AgentSelector';
import { AgentWorkspaceContent } from './AgentWorkspaceContent';
import { CollaborativeSession } from './CollaborativeSession';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  capabilities: string[];
  type: 'competitive-intelligence' | 'research' | 'chat' | 'learning';
  status: 'active' | 'idle' | 'processing';
}

const availableAgents: AgentConfig[] = [
  {
    id: 'clipogino',
    name: 'CLIPOGINO',
    description: 'AI-powered professional mentor and career advisor',
    icon: Brain,
    color: 'bg-blue-500',
    capabilities: [
      'Career guidance and mentoring',
      'Professional development advice',
      'Industry insights and trends',
      'Skill development recommendations',
      'Strategic career planning'
    ],
    type: 'chat',
    status: 'active'
  },
  {
    id: 'cdv',
    name: 'CDV - Competitor Discovery & Validator',
    description: 'Specialized in discovering, analyzing and validating competitive threats',
    icon: Eye,
    color: 'bg-purple-500',
    capabilities: [
      'Competitor discovery and analysis',
      'Threat validation and assessment',
      'Market positioning analysis',
      'Strategic opportunity identification',
      'Competitive gap analysis'
    ],
    type: 'competitive-intelligence',
    status: 'active'
  },
  {
    id: 'cia',
    name: 'CIA - Competitive Intelligence Analysis',
    description: 'Expert in strategic analysis and advanced competitive intelligence',
    icon: Activity,
    color: 'bg-green-500',
    capabilities: [
      'Strategic threat assessment',
      'Market opportunity analysis',
      'Competitor profiling',
      'SWOT analysis',
      'Risk evaluation'
    ],
    type: 'competitive-intelligence',
    status: 'active'
  },
  {
    id: 'cir',
    name: 'CIR - Competitive Intelligence Retriever',
    description: 'Data intelligence specialist providing real metrics and market data',
    icon: Search,
    color: 'bg-orange-500',
    capabilities: [
      'Domain authority estimation',
      'Web traffic analysis',
      'Social media metrics',
      'Team size evaluation',
      'Content volume analysis'
    ],
    type: 'competitive-intelligence',
    status: 'active'
  },
  {
    id: 'research-engine',
    name: 'Elite Research Engine',
    description: 'Advanced AI-powered research with strategic insights',
    icon: Search,
    color: 'bg-indigo-500',
    capabilities: [
      'Comprehensive market research',
      'Industry deep-dive analysis',
      'Competitive landscape research',
      'Trend analysis and forecasting',
      'Strategic intelligence gathering'
    ],
    type: 'research',
    status: 'active'
  }
];

export function UnifiedAgentWorkspace() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('selector');
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [sessionConfig, setSessionConfig] = useState<any>({});

  const handleAgentSelect = (agentId: string) => {
    if (collaborativeMode) {
      setSelectedAgents(prev => 
        prev.includes(agentId) 
          ? prev.filter(id => id !== agentId)
          : [...prev, agentId]
      );
    } else {
      setSelectedAgents([agentId]);
      setActiveTab('workspace');
    }
  };

  const startCollaborativeSession = () => {
    if (selectedAgents.length > 1) {
      setActiveTab('collaborative');
    }
  };

  const getSelectedAgentConfigs = () => {
    return availableAgents.filter(agent => selectedAgents.includes(agent.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-500" />
            Unified Agent Workspace
          </h1>
          <p className="text-muted-foreground mt-2">
            Centralized interface for all AI agents and collaborative workflows
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={collaborativeMode ? "default" : "outline"}
            onClick={() => setCollaborativeMode(!collaborativeMode)}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Collaborative Mode
          </Button>
          
          {selectedAgents.length > 1 && collaborativeMode && (
            <Button onClick={startCollaborativeSession} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Session
            </Button>
          )}
          
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {selectedAgents.length} Agent{selectedAgents.length !== 1 ? 's' : ''} Selected
          </Badge>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="selector" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agent Selection
          </TabsTrigger>
          <TabsTrigger 
            value="workspace" 
            disabled={selectedAgents.length === 0}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Workspace
          </TabsTrigger>
          <TabsTrigger 
            value="collaborative"
            disabled={selectedAgents.length < 2}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Collaborative Session
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="selector" className="mt-6">
          <AgentSelector
            agents={availableAgents}
            selectedAgents={selectedAgents}
            onAgentSelect={handleAgentSelect}
            collaborativeMode={collaborativeMode}
          />
        </TabsContent>

        <TabsContent value="workspace" className="mt-6">
          <AgentWorkspaceContent
            selectedAgents={getSelectedAgentConfigs()}
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
          />
        </TabsContent>

        <TabsContent value="collaborative" className="mt-6">
          <CollaborativeSession
            selectedAgents={getSelectedAgentConfigs()}
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Workspace Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configure your agent workspace preferences and collaboration settings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
