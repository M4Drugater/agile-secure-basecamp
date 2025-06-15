
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Search, 
  Sparkles, 
  Target, 
  Activity, 
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useLaigentMasterOrchestrator } from '@/hooks/orchestrators/useLaigentMasterOrchestrator';
import { useAgentSpecificOrchestrators } from '@/hooks/orchestrators/useAgentSpecificOrchestrators';

interface LaigentOrchestrationPanelProps {
  sessionConfig?: any;
  onOrchestrationComplete?: (result: any) => void;
}

export function LaigentOrchestrationPanel({ 
  sessionConfig, 
  onOrchestrationComplete 
}: LaigentOrchestrationPanelProps) {
  const [query, setQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('clipogino');
  const [orchestrationLevel, setOrchestrationLevel] = useState<'standard' | 'advanced' | 'elite'>('elite');
  
  const { 
    executeLaigentOrchestration, 
    getOrchestrationStatus, 
    isOrchestrating 
  } = useLaigentMasterOrchestrator();
  
  const {
    executeClipoginoOrchestration,
    executeCdvOrchestration,
    executeCirOrchestration,
    executeCiaOrchestration,
    executeResearchEngineOrchestration,
    executeEnhancedContentGeneratorOrchestration,
    getDefaultConfig,
    activeAgent
  } = useAgentSpecificOrchestrators();

  const { currentStage, stageProgress } = getOrchestrationStatus();

  const agents = [
    {
      id: 'clipogino',
      name: 'CLIPOGINO',
      description: 'Strategic Mentor & Business Advisor',
      icon: Brain,
      color: 'bg-blue-500',
      capabilities: ['Strategic Planning', 'Leadership Development', 'Executive Coaching']
    },
    {
      id: 'cdv',
      name: 'CDV Agent',
      description: 'Competitive Discovery & Validation',
      icon: Target,
      color: 'bg-purple-500',
      capabilities: ['Market Discovery', 'Competitor Analysis', 'Threat Assessment']
    },
    {
      id: 'cir',
      name: 'CIR Agent',
      description: 'Competitive Intelligence Research',
      icon: Search,
      color: 'bg-green-500',
      capabilities: ['Data Research', 'Market Analysis', 'Intelligence Gathering']
    },
    {
      id: 'cia',
      name: 'CIA Agent',
      description: 'Strategic Intelligence Analysis',
      icon: Shield,
      color: 'bg-orange-500',
      capabilities: ['Strategic Analysis', 'Framework Application', 'Executive Insights']
    },
    {
      id: 'research-engine',
      name: 'Research Engine',
      description: 'Advanced Research & Analytics',
      icon: Activity,
      color: 'bg-indigo-500',
      capabilities: ['Comprehensive Research', 'Trend Analysis', 'Data Synthesis']
    },
    {
      id: 'enhanced-content-generator',
      name: 'Content Generator',
      description: 'Executive Content Creation',
      icon: Sparkles,
      color: 'bg-pink-500',
      capabilities: ['Executive Writing', 'Strategic Content', 'Professional Documents']
    }
  ];

  const orchestrationStages = [
    { id: 'context-building', name: 'Context Building', description: 'Advanced user and business context' },
    { id: 'research-execution', name: 'Research Execution', description: 'Multi-vector Perplexity research' },
    { id: 'content-styling', name: 'Content Styling', description: 'Sophisticated Claude transformation' },
    { id: 'quality-assurance', name: 'Quality Assurance', description: 'Final validation and metrics' }
  ];

  const handleExecuteOrchestration = async () => {
    if (!query.trim()) return;

    try {
      let result;

      // Use agent-specific orchestration if available
      const config = getDefaultConfig(selectedAgent);
      
      switch (selectedAgent) {
        case 'clipogino':
          result = await executeClipoginoOrchestration(query, config, sessionConfig);
          break;
        case 'cdv':
          result = await executeCdvOrchestration(query, config, sessionConfig);
          break;
        case 'cir':
          result = await executeCirOrchestration(query, config, sessionConfig);
          break;
        case 'cia':
          result = await executeCiaOrchestration(query, config, sessionConfig);
          break;
        case 'research-engine':
          result = await executeResearchEngineOrchestration(query, sessionConfig);
          break;
        case 'enhanced-content-generator':
          result = await executeEnhancedContentGeneratorOrchestration(query, sessionConfig);
          break;
        default:
          // Fallback to master orchestrator
          result = await executeLaigentOrchestration({
            userQuery: query,
            agentType: selectedAgent as any,
            sessionConfig,
            orchestrationLevel,
            customParameters: {
              researchDepth: 'comprehensive',
              stylingFormality: 'executive',
              outputFormat: 'comprehensive'
            }
          });
      }

      onOrchestrationComplete?.(result);
    } catch (error) {
      console.error('Orchestration error:', error);
    }
  };

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            LAIGENT Master Orchestrator
          </CardTitle>
          <CardDescription>
            Advanced AI orchestration with multi-agent coordination and elite intelligence
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="orchestration" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
          <TabsTrigger value="agents">Agent Selection</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="orchestration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orchestration Configuration</CardTitle>
              <CardDescription>
                Configure your LAIGENT orchestration parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Query Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Strategic Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your strategic query for LAIGENT orchestration..."
                  className="w-full h-24 p-3 border rounded-lg resize-none"
                />
              </div>

              {/* Orchestration Level */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Orchestration Level
                </label>
                <div className="flex gap-2">
                  {(['standard', 'advanced', 'elite'] as const).map(level => (
                    <Button
                      key={level}
                      variant={orchestrationLevel === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setOrchestrationLevel(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selected Agent Display */}
              {selectedAgentData && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 ${selectedAgentData.color} rounded-lg flex items-center justify-center`}>
                      <selectedAgentData.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedAgentData.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedAgentData.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgentData.capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <Button 
                onClick={handleExecuteOrchestration}
                disabled={isOrchestrating || !query.trim()}
                className="w-full"
                size="lg"
              >
                {isOrchestrating ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Orchestrating LAIGENT...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Execute LAIGENT Orchestration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card 
                  key={agent.id}
                  className={`cursor-pointer transition-all ${
                    selectedAgent === agent.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${agent.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                      </div>
                      {selectedAgent === agent.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {agent.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs mr-1">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Orchestration Monitoring
              </CardTitle>
              <CardDescription>
                Real-time status of LAIGENT orchestration stages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{stageProgress}%</span>
                </div>
                <Progress value={stageProgress} className="w-full" />
              </div>

              {/* Stage Details */}
              <div className="space-y-3">
                {orchestrationStages.map((stage, index) => {
                  const isActive = currentStage === stage.id;
                  const isCompleted = stageProgress > (index + 1) * 25;
                  
                  return (
                    <div 
                      key={stage.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isActive ? 'bg-blue-50 border-blue-200' :
                        isCompleted ? 'bg-green-50 border-green-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isActive ? 'bg-blue-500 text-white animate-pulse' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{stage.name}</h4>
                        <p className="text-xs text-muted-foreground">{stage.description}</p>
                      </div>
                      
                      {isActive && (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <Clock className="w-3 h-3" />
                          Processing
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Active Agent Indicator */}
              {activeAgent && (
                <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-sm">Active Agent: {activeAgent.toUpperCase()}</span>
                  </div>
                </div>
              )}

              {/* System Status */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">●</div>
                  <div className="text-xs text-muted-foreground">OpenAI</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">●</div>
                  <div className="text-xs text-muted-foreground">Perplexity</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">●</div>
                  <div className="text-xs text-muted-foreground">Claude</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
