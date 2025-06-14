
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AgentSelectionView } from './AgentSelectionView';
import { EnhancedAgentWorkspace } from './EnhancedAgentWorkspace';
import { SessionManager } from './SessionManager';
import { InsightsHub } from './InsightsHub';
import { OpenAIKeyCheck } from '@/components/admin/OpenAIKeyCheck';
import { Brain, Zap, BarChart3, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function CompetitiveIntelligenceDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  useEffect(() => {
    checkSystemReadiness();
  }, []);

  const checkSystemReadiness = async () => {
    try {
      // Quick system health check
      const { data, error } = await supabase.functions.invoke('competitive-intelligence-chat', {
        body: {
          messages: [{ role: 'user', content: 'System check' }],
          agentType: 'cia',
          sessionConfig: {
            companyName: 'Test',
            industry: 'Technology',
            analysisFocus: 'System Check',
            objectives: 'Verify system readiness'
          },
          userContext: { userId: 'system-check' }
        },
      });

      if (error) {
        console.error('System check failed:', error);
        setSystemStatus('error');
      } else {
        console.log('System check passed:', data);
        setSystemStatus('ready');
      }
    } catch (error) {
      console.error('System check error:', error);
      setSystemStatus('error');
    }
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
  };

  const handleBackToSelection = () => {
    setSelectedAgent(null);
  };

  const getSystemStatusAlert = () => {
    switch (systemStatus) {
      case 'checking':
        return (
          <Alert className="border-blue-200 bg-blue-50/50">
            <Brain className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>System Check in Progress...</strong> Verifying OpenAI connectivity and agent readiness.
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div><strong>System Not Ready:</strong> OpenAI API connectivity issue detected.</div>
                <div className="text-sm">Please check the OpenAI API configuration below and try again.</div>
              </div>
            </AlertDescription>
          </Alert>
        );
      case 'ready':
        return (
          <Alert className="border-green-200 bg-green-50/50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>🚀 All Systems Operational!</strong> Competitive intelligence agents are ready for McKinsey-level analysis.
            </AlertDescription>
          </Alert>
        );
    }
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
          <Badge 
            variant={systemStatus === 'ready' ? 'default' : systemStatus === 'error' ? 'destructive' : 'outline'} 
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            {systemStatus === 'ready' ? 'System Ready' : systemStatus === 'error' ? 'System Error' : 'Checking...'}
          </Badge>
        </div>
      </div>

      {/* System Status Alert */}
      {getSystemStatusAlert()}

      {/* OpenAI API Status Check - Show if system is not ready */}
      {systemStatus === 'error' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">System Configuration</h2>
          <OpenAIKeyCheck />
          <Button onClick={checkSystemReadiness} className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Recheck System Status
          </Button>
        </div>
      )}

      {/* Enhanced Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={systemStatus !== 'ready' ? 'opacity-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">McKinsey 7-S</p>
                <p className="text-2xl font-bold">{systemStatus === 'ready' ? '✓' : '⚠'}</p>
              </div>
              <Brain className={`h-8 w-8 ${systemStatus === 'ready' ? 'text-blue-500' : 'text-gray-300'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={systemStatus !== 'ready' ? 'opacity-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Porter's 5 Forces</p>
                <p className="text-2xl font-bold">{systemStatus === 'ready' ? '✓' : '⚠'}</p>
              </div>
              <BarChart3 className={`h-8 w-8 ${systemStatus === 'ready' ? 'text-green-500' : 'text-gray-300'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={systemStatus !== 'ready' ? 'opacity-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">BCG Matrix</p>
                <p className="text-2xl font-bold">{systemStatus === 'ready' ? '✓' : '⚠'}</p>
              </div>
              <Target className={`h-8 w-8 ${systemStatus === 'ready' ? 'text-purple-500' : 'text-gray-300'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={systemStatus !== 'ready' ? 'opacity-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">3-Horizons</p>
                <p className="text-2xl font-bold">{systemStatus === 'ready' ? '✓' : '⚠'}</p>
              </div>
              <Zap className={`h-8 w-8 ${systemStatus === 'ready' ? 'text-orange-500' : 'text-gray-300'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface - Only show if system is ready */}
      {systemStatus === 'ready' && (
        <>
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
        </>
      )}

      {/* System Not Ready State */}
      {systemStatus === 'error' && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Agents Not Available</h3>
            <p className="text-muted-foreground mb-4">
              The competitive intelligence agents require a valid OpenAI API key to function.
              Please configure your OpenAI API key above to unlock the full potential of McKinsey-level analysis.
            </p>
            <Badge variant="outline">
              System will automatically enable once OpenAI API is configured
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
