
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  Eye, 
  Target, 
  TrendingUp,
  Plus,
  Zap,
  Shield,
  Brain
} from 'lucide-react';
import { AgentInterface } from './AgentInterface';
import { SessionManager } from './SessionManager';
import { ReportsOverview } from './ReportsOverview';
import { InsightsHub } from './InsightsHub';

const agents = [
  {
    id: 'cdv',
    name: 'CDV - Competitor Discovery & Validator',
    description: 'Discovers, analyzes, and validates competitive threats and opportunities',
    icon: Target,
    color: 'bg-blue-500',
    features: ['Competitor Discovery', 'Competitive Validation', 'Market Opportunity Analysis', 'Threat Assessment']
  },
  {
    id: 'cia',
    name: 'CIA - Intelligence Analysis',
    description: 'Provides strategic intelligence and comprehensive market analysis',
    icon: Brain,
    color: 'bg-purple-500',
    features: ['Strategic Analysis', 'Risk Assessment', 'Market Intelligence', 'Scenario Planning']
  },
  {
    id: 'cir',
    name: 'CIR - Intelligence Reporting',
    description: 'Generates actionable reports and strategic recommendations',
    icon: Target,
    color: 'bg-green-500',
    features: ['Executive Reports', 'Action Plans', 'Strategic Recommendations', 'Decision Support']
  }
];

export function CompetitiveIntelligenceDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Competitive Intelligence System
          </h1>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Advanced competitive intelligence with specialized AI agents for data visualization, 
          strategic analysis, and actionable reporting
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Agents Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedAgent(agent.id);
                      setActiveTab('agents');
                    }}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${agent.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <agent.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">{agent.description}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {agent.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    <Bot className="h-4 w-4 mr-2" />
                    Activate Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Active Sessions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Reports Generated</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Insights Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Companies Analyzed</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <AgentInterface selectedAgent={selectedAgent} onAgentSelect={setSelectedAgent} />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <SessionManager />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsHub />
        </TabsContent>
      </Tabs>
    </div>
  );
}
