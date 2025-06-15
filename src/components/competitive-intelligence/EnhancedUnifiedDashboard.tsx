
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Target, Network, FileText, Lightbulb, Settings } from 'lucide-react';
import { useUnifiedSessionManager } from '@/hooks/competitive-intelligence/useUnifiedSessionManager';
import { useCollaborativeAgents } from '@/hooks/competitive-intelligence/useCollaborativeAgents';
import { useIntelligentOutputs } from '@/hooks/competitive-intelligence/useIntelligentOutputs';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SessionStatusCard } from './dashboard/SessionStatusCard';
import { OverviewTab } from './dashboard/OverviewTab';

interface EnhancedUnifiedDashboardProps {
  selectedAgent?: string;
  onAgentSelect?: (agentId: string) => void;
}

export function EnhancedUnifiedDashboard({ selectedAgent, onAgentSelect }: EnhancedUnifiedDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentSession, sessions, loadSessions } = useUnifiedSessionManager();
  const { collaborations, getCollaborationInsights, loadCollaborations } = useCollaborativeAgents();
  const { outputs, loadOutputs } = useIntelligentOutputs();

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
      <DashboardHeader />
      
      <SessionStatusCard 
        currentSession={currentSession} 
        sessionInsights={sessionInsights} 
      />

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
          <OverviewTab 
            sessions={sessions}
            collaborations={collaborations}
            outputs={outputs}
          />
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
