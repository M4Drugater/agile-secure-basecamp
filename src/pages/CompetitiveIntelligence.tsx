
import React, { useState } from 'react';
import { ConsolidatedAppLayout } from '@/components/layout/ConsolidatedAppLayout';
import { ComprehensivePlatformDashboard } from '@/components/competitive-intelligence/phase4/ComprehensivePlatformDashboard';
import { BusinessIntelligenceDashboard } from '@/components/competitive-intelligence/phase2/BusinessIntelligenceDashboard';
import { RealTimeIntelligencePanel } from '@/components/competitive-intelligence/RealTimeIntelligencePanel';
import { EnhancedAgentWorkspace } from '@/components/competitive-intelligence/EnhancedAgentWorkspace';
import { AgentControlPanel } from '@/components/competitive-intelligence/AgentControlPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Brain, 
  Zap, 
  Settings,
  Target,
  Activity
} from 'lucide-react';

export default function CompetitiveIntelligence() {
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  return (
    <ConsolidatedAppLayout>
      <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Elite Platform
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Business Intelligence
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Real-Time Intel
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Agent Workspace
            </TabsTrigger>
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Agent Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform">
            <ComprehensivePlatformDashboard />
          </TabsContent>

          <TabsContent value="business">
            <BusinessIntelligenceDashboard />
          </TabsContent>

          <TabsContent value="realtime">
            {sessionConfig.companyName ? (
              <RealTimeIntelligencePanel 
                companyName={sessionConfig.companyName}
                industry={sessionConfig.industry}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Configure Session</h3>
                  <p className="text-muted-foreground">
                    Please configure your competitive intelligence session in the Agent Workspace to access real-time intelligence features.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="agents">
            <EnhancedAgentWorkspace 
              selectedAgent="cia"
              sessionConfig={sessionConfig}
              setSessionConfig={setSessionConfig}
            />
          </TabsContent>

          <TabsContent value="control">
            <AgentControlPanel />
          </TabsContent>
        </Tabs>
      </div>
    </ConsolidatedAppLayout>
  );
}
