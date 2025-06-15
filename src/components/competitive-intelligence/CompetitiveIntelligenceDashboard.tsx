
import React, { useState } from 'react';
import { AgentSelectionView } from './AgentSelectionView';
import { EnhancedAgentWorkspace } from './EnhancedAgentWorkspace';
import { EnhancedUnifiedDashboard } from './EnhancedUnifiedDashboard';
import { SessionManager } from './SessionManager';
import { SystemValidator } from './SystemValidator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Settings, History, Zap, Star, Target, Network } from 'lucide-react';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
  customIndustry?: string;
  subIndustries?: string[];
  competitorCompanies?: string[];
  geographicScope?: string;
  analysisDepth?: string;
}

export function CompetitiveIntelligenceDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>({
    companyName: '',
    industry: 'technology',
    analysisFocus: '',
    objectives: ''
  });
  const [activeView, setActiveView] = useState<'unified' | 'agents' | 'workspace' | 'sessions' | 'system'>('unified');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                LAIGENT v2.0 - Competitive Intelligence Platform
              </h1>
              <p className="text-lg text-gray-600">
                Enterprise-grade AI-first competitive intelligence with collaborative agents
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 flex items-center gap-1 px-4 py-2">
                <Zap className="h-4 w-4" />
                AI-Powered
              </Badge>
              <Badge className="bg-green-600 flex items-center gap-1 px-4 py-2">
                <Network className="h-4 w-4" />
                Collaborative
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-4 py-2">
                <Star className="h-4 w-4" />
                Enterprise Grade
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="mb-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="unified" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Unified
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="workspace" disabled={!selectedAgent}>
              <Zap className="h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <History className="h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="system">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unified" className="space-y-0">
            <EnhancedUnifiedDashboard 
              selectedAgent={selectedAgent}
              onAgentSelect={setSelectedAgent}
            />
          </TabsContent>

          <TabsContent value="agents" className="space-y-0">
            <AgentSelectionView 
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
              onAgentSelected={() => setActiveView('workspace')}
            />
          </TabsContent>

          <TabsContent value="workspace" className="space-y-0">
            {selectedAgent ? (
              <EnhancedAgentWorkspace
                selectedAgent={selectedAgent}
                sessionConfig={sessionConfig}
                setSessionConfig={setSessionConfig}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Agent Selected
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Please select an agent from the Agents tab to begin your analysis.
                  </p>
                  <Button onClick={() => setActiveView('agents')}>
                    Select Agent
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-0">
            <SessionManager />
          </TabsContent>

          <TabsContent value="system" className="space-y-0">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Enhanced System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemValidator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
