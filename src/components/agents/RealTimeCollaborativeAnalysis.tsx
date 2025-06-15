
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Clock,
  CheckCircle,
  AlertCircle,
  Brain,
  Zap,
  Activity,
  Eye
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface RealTimeCollaborativeAnalysisProps {
  selectedAgents: AgentConfig[];
  sessionMetrics: any;
  agentActivities: any[];
  insights: any[];
  isSessionActive: boolean;
}

export function RealTimeCollaborativeAnalysis({ 
  selectedAgents, 
  sessionMetrics,
  agentActivities,
  insights,
  isSessionActive
}: RealTimeCollaborativeAnalysisProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'consensus': return CheckCircle;
      case 'divergence': return AlertCircle;
      case 'synthesis': return Brain;
      case 'breakthrough': return Zap;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Session Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Estado General</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {isSessionActive ? sessionMetrics.sessionProgress.toFixed(0) : 0}%
              </div>
              <Progress value={sessionMetrics.sessionProgress} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Colaboración</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {sessionMetrics.collaborationScore}%
            </div>
            <div className="text-xs text-muted-foreground">Sinergia entre agentes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Interacciones</span>
            </div>
            <div className="text-2xl font-bold mt-2">{sessionMetrics.totalInteractions}</div>
            <div className="text-xs text-muted-foreground">
              {isSessionActive ? 'En tiempo real' : 'Sesión pausada'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Consenso</span>
            </div>
            <div className="text-2xl font-bold mt-2">{sessionMetrics.consensusLevel}%</div>
            <div className="text-xs text-muted-foreground">Nivel de acuerdo</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="live-insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-insights">Insights en Vivo</TabsTrigger>
          <TabsTrigger value="agent-performance">Rendimiento de Agentes</TabsTrigger>
          <TabsTrigger value="collaboration-patterns">Patrones de Colaboración</TabsTrigger>
          <TabsTrigger value="session-timeline">Timeline de Sesión</TabsTrigger>
        </TabsList>

        <TabsContent value="live-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights Colaborativos en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              {insights.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {isSessionActive ? 'Generando insights...' : 'Inicia la sesión para ver insights en tiempo real'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight) => {
                    const Icon = getInsightIcon(insight.type);
                    return (
                      <div key={insight.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${
                              insight.type === 'consensus' ? 'text-green-500' :
                              insight.type === 'divergence' ? 'text-yellow-500' :
                              insight.type === 'breakthrough' ? 'text-purple-500' :
                              'text-blue-500'
                            }`} />
                            <h3 className="font-medium">{insight.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                              {insight.confidence}% confianza
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {insight.impact} impacto
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {insight.agents.map((agent: string) => (
                              <Badge key={agent} variant="outline" className="text-xs">
                                {agent}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {insight.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent-performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Agentes en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentActivities.map((activity) => {
                  const agent = selectedAgents.find(a => a.agentId === activity.agentId);
                  if (!agent) return null;
                  
                  const Icon = agent.icon;
                  return (
                    <div key={activity.agentId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${agent.color} rounded-full flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{agent.name}</h3>
                            <p className="text-xs text-muted-foreground">{agent.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`} />
                          <Badge variant={activity.status === 'active' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Contribuciones</span>
                          <div className="font-medium">{activity.contributions}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Precisión</span>
                          <div className="font-medium">{activity.accuracy}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tiempo Resp.</span>
                          <div className="font-medium">{activity.responseTime}s</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Última Actividad</span>
                          <div className="font-medium text-xs">
                            {activity.lastActivity.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration-patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patrones de Colaboración Emergentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Orquestación CLIPOGINO</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    CLIPOGINO actúa como hub central, coordinando efectivamente a todos los agentes especializados
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Eficiencia de coordinación: {sessionMetrics.collaborationScore}%</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Especialización Complementaria</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Los agentes aprovechan sus fortalezas únicas para abordar diferentes aspectos del problema
                  </p>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Cobertura de expertise: 95%</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Validación Cruzada Activa</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Los agentes validan y refinan las conclusiones de otros, mejorando la calidad general
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Validaciones exitosas: {Math.floor(sessionMetrics.totalInteractions * 0.3)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session-timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de la Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice().reverse().map((insight, index) => (
                  <div key={insight.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        insight.type === 'synthesis' ? 'bg-blue-500' :
                        insight.type === 'consensus' ? 'bg-green-500' :
                        insight.type === 'breakthrough' ? 'bg-purple-500' :
                        'bg-yellow-500'
                      }`} />
                      {index < insights.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{insight.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {insight.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                ))}
                
                {insights.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      El timeline se poblará durante la sesión activa
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
