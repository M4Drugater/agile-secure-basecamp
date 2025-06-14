
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentSelectionView } from './AgentSelectionView';
import { EnhancedAgentWorkspace } from './EnhancedAgentWorkspace';
import { SessionManager } from './SessionManager';
import { InsightsHub } from './InsightsHub';
import { Brain, Zap, BarChart3, Target } from 'lucide-react';

export function CompetitiveIntelligenceDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
  };

  const handleBackToSelection = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            McKinsey-Level Competitive Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered strategic analysis using proven consulting frameworks
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Enhanced Prompts v2.0
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategic Frameworks Active
          </Badge>
        </div>
      </div>

      {/* Enhanced Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">McKinsey 7-S</p>
                <p className="text-2xl font-bold">✓</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Porter's 5 Forces</p>
                <p className="text-2xl font-bold">✓</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">BCG Matrix</p>
                <p className="text-2xl font-bold">✓</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">3-Horizons</p>
                <p className="text-2xl font-bold">✓</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      {!selectedAgent ? (
        <div className="space-y-6">
          <AgentSelectionView onAgentSelect={handleAgentSelect} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SessionManager />
            <InsightsHub />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToSelection}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              ← Back to Agent Selection
            </button>
            <Badge variant="default">
              Enhanced with Strategic Frameworks
            </Badge>
          </div>
          
          <EnhancedAgentWorkspace 
            selectedAgent={selectedAgent}
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
          />
        </div>
      )}
    </div>
  );
}
