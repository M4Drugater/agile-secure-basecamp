
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  Network,
  Zap,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { useUnifiedSessionManager } from '@/hooks/competitive-intelligence/useUnifiedSessionManager';
import { useCollaborativeAgents } from '@/hooks/competitive-intelligence/useCollaborativeAgents';
import { useIntelligentOutputs } from '@/hooks/competitive-intelligence/useIntelligentOutputs';

interface EnhancedUnifiedDashboardProps {
  selectedAgent?: string;
  onAgentSelect?: (agentId: string) => void;
}

export function EnhancedUnifiedDashboard({ selectedAgent, onAgentSelect }: EnhancedUnifiedDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    currentSession,
    sessions,
    isLoading: sessionLoading,
    createSession,
    updateSessionState
  } = useUnifiedSessionManager();
  
  const {
    collaborations,
    getCollaborationInsights,
    loadCollaborations
  } = useCollaborativeAgents();

  const {
    outputs,
    loadOutputs,
    generateOutput,
    isGenerating
  } = useIntelligentOutputs();

  // Load data when session changes
  useEffect(() => {
    if (currentSession) {
      loadCollaborations(currentSession.id);
      loadOutputs(currentSession.id);
    }
  }, [currentSession]);

  // Get session insights
  const sessionInsights = currentSession ? {
    progressPercentage: ((currentSession.progress_tracker?.currentStep || 1) / 5) * 100,
    activeAgents: currentSession.active_agents.length,
    collaborationInsights: getCollaborationInsights(currentSession.id),
    outputsGenerated: outputs.filter(o => o.session_id === currentSession.id).length
  } : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Enhanced Competitive Intelligence Platform
          </h1>
          <p className="text-gray-600 mt-1">
            Unified collaborative analysis with intelligent outputs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-600 flex items-center gap-1 px-4 py-2">
            <Zap className="h-4 w-4" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 px-4 py-2">
            <Network className="h-4 w-4" />
            Collaborative
          </Badge>
        </div>
      </div>

      {/* Session Status */}
      {currentSession && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Session: {currentSession.session_name}
              </CardTitle>
              <Badge variant={currentSession.status === 'active' ? 'default' : 'secondary'}>
                {currentSession.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {sessionInsights?.progressPercentage.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
                <Progress value={sessionInsights?.progressPercentage} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sessionInsights?.activeAgents}
                </div>
                <div className="text-sm text-gray-600">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {sessionInsights?.collaborationInsights.totalCollaborations}
                </div>
                <div className="text-sm text-gray-600">Collaborations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {sessionInsights?.outputsGenerated}
                </div>
                <div className="text-sm text-gray-600">Outputs Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Collaboration
          </TabsTrigger>
          <TabsTrigger value="outputs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Outputs
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Sessions</span>
                  <span className="font-semibold">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Collaborations</span>
                  <span className="font-semibold">{collaborations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Generated Outputs</span>
                  <span className="font-semibold">{outputs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {outputs.slice(0, 3).map((output) => (
                  <div key={output.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{output.title}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(output.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {outputs.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No recent activity
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Start New Session</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Begin a new competitive intelligence analysis
                </p>
                <Button size="sm" className="w-full">
                  Create Session
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <Network className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Agent Collaboration</h3>
                <p className="text-sm text-gray-600 mb-4">
                  View collaborative agent interactions
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Network
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Generate Output</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create intelligent reports and insights
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Session Management Coming Soon
                </h3>
                <p className="text-gray-500">
                  Enhanced session management interface will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Collaboration Network</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Collaboration Network Coming Soon
                </h3>
                <p className="text-gray-500">
                  Interactive collaboration visualization will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outputs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Outputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Output Management Coming Soon
                </h3>
                <p className="text-gray-500">
                  Intelligent output generation and management interface will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Insights Dashboard Coming Soon
                </h3>
                <p className="text-gray-500">
                  Comprehensive insights visualization will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Settings Panel Coming Soon
                </h3>
                <p className="text-gray-500">
                  Platform configuration options will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
