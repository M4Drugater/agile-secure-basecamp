
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Brain, BarChart3, Settings } from 'lucide-react';
import { AgentInfoPanel } from './AgentInfoPanel';
import { AgentConfigurationPanel } from './AgentConfigurationPanel';
import { AgentChat } from './AgentChat';
import { StrategicAnalysisPanel } from './StrategicAnalysisPanel';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

interface EnhancedAgentWorkspaceProps {
  selectedAgent: string;
  sessionConfig: SessionConfig;
  setSessionConfig: React.Dispatch<React.SetStateAction<SessionConfig>>;
}

export function EnhancedAgentWorkspace({ 
  selectedAgent, 
  sessionConfig, 
  setSessionConfig 
}: EnhancedAgentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState('chat');
  const [analysisData, setAnalysisData] = useState({});

  const agentCapabilities = {
    cdv: {
      name: 'Competitor Discovery & Validator',
      frameworks: ['Porter\'s Five Forces', 'Competitive Landscape Mapping'],
      specialties: ['Market Discovery', 'Threat Validation', 'Competitive Positioning']
    },
    cir: {
      name: 'Competitive Intelligence Retriever', 
      frameworks: ['Financial Analysis', 'Operational Metrics'],
      specialties: ['Data Intelligence', 'Market Metrics', 'Performance Benchmarking']
    },
    cia: {
      name: 'Competitive Intelligence Analysis',
      frameworks: ['McKinsey 7-S', '3-Horizons Planning', 'BCG Matrix'],
      specialties: ['Strategic Analysis', 'Scenario Planning', 'Executive Intelligence']
    }
  };

  const currentAgent = agentCapabilities[selectedAgent as keyof typeof agentCapabilities];

  return (
    <div className="space-y-6">
      {/* Enhanced Agent Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{currentAgent?.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            {currentAgent?.frameworks.map((framework) => (
              <Badge key={framework} variant="secondary" className="text-xs">
                {framework}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Enhanced with McKinsey Frameworks</Badge>
          <Badge variant="default">AI-Powered</Badge>
        </div>
      </div>

      {/* Main Workspace Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Agent Chat
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Strategic Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Intelligence Hub
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <AgentInfoPanel agentId={selectedAgent} />
            </div>
            <div className="lg:col-span-3">
              <AgentChat agentId={selectedAgent} sessionConfig={sessionConfig} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-0">
          <StrategicAnalysisPanel 
            agentType={selectedAgent} 
            analysisData={analysisData}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Intelligence widgets would go here */}
            <div className="col-span-full text-center text-muted-foreground py-8">
              Intelligence Hub - Coming in Phase 2
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgentConfigurationPanel 
              sessionConfig={sessionConfig} 
              setSessionConfig={setSessionConfig} 
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agent Specialties</h3>
              <div className="space-y-2">
                {currentAgent?.specialties.map((specialty) => (
                  <div key={specialty} className="p-3 border rounded-lg">
                    <span className="text-sm font-medium">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
