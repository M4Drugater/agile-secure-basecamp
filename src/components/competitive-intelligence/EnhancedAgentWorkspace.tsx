
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Brain, BarChart3, Settings, Monitor, Globe } from 'lucide-react';
import { AgentInfoPanel } from './AgentInfoPanel';
import { AgentConfigurationPanel } from './AgentConfigurationPanel';
import { AgentChat } from './AgentChat';
import { StrategicAnalysisPanel } from './StrategicAnalysisPanel';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { ContinuousMonitoringPanel } from './ContinuousMonitoringPanel';
import { RealTimeIntelligencePanel } from './RealTimeIntelligencePanel';

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
  const [activeTab, setActiveTab] = useState('realtime');
  const [analysisData, setAnalysisData] = useState({});

  const agentCapabilities = {
    cdv: {
      name: 'Competitor Discovery & Validator',
      frameworks: ['Porter\'s Five Forces', 'Competitive Landscape Mapping', 'Threat Assessment Matrix'],
      specialties: ['Market Discovery', 'Threat Validation', 'Competitive Positioning', 'Early Warning Systems']
    },
    cir: {
      name: 'Competitive Intelligence Retriever', 
      frameworks: ['Financial Analysis', 'Operational Metrics', 'Market Intelligence'],
      specialties: ['Data Intelligence', 'Market Metrics', 'Performance Benchmarking', 'Financial Analysis']
    },
    cia: {
      name: 'Competitive Intelligence Analysis',
      frameworks: ['McKinsey 7-S', '3-Horizons Planning', 'BCG Matrix', 'Strategic Options Analysis'],
      specialties: ['Strategic Analysis', 'Scenario Planning', 'Executive Intelligence', 'Implementation Roadmaps']
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
          <Badge variant="outline">McKinsey-Level Analysis</Badge>
          <Badge variant="default">Real-Time Intelligence</Badge>
          <Badge className="bg-green-600">Enhanced AI Engine</Badge>
        </div>
      </div>

      {/* Enhanced Workspace Tabs with Real-Time Intelligence */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Real-Time Intel
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Agent Chat
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Strategic Analysis
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Executive Dashboard
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-0">
          <RealTimeIntelligencePanel 
            companyName={sessionConfig.companyName}
            industry={sessionConfig.industry}
          />
        </TabsContent>

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

        <TabsContent value="dashboard" className="space-y-0">
          <ExecutiveDashboard companyContext={sessionConfig} />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-0">
          <ContinuousMonitoringPanel companyContext={sessionConfig} />
        </TabsContent>

        <TabsContent value="config" className="space-y-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AgentConfigurationPanel 
              sessionConfig={sessionConfig} 
              setSessionConfig={setSessionConfig} 
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Enhanced Agent Capabilities</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Strategic Frameworks</h4>
                  <div className="space-y-1">
                    {currentAgent?.frameworks.map((framework) => (
                      <div key={framework} className="p-2 border rounded-lg text-sm">
                        {framework}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Core Specialties</h4>
                  <div className="space-y-1">
                    {currentAgent?.specialties.map((specialty) => (
                      <div key={specialty} className="p-2 bg-muted rounded-lg text-sm">
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Real-Time Capabilities</h4>
                  <div className="space-y-1">
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                      Live Web Search & Analysis
                    </div>
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      Financial Data Retrieval
                    </div>
                    <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
                      Market Intelligence Monitoring
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
