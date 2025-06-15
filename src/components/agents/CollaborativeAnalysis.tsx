
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
  Brain
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface CollaborativeAnalysisProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
}

export function CollaborativeAnalysis({ selectedAgents, sessionConfig }: CollaborativeAnalysisProps) {
  // Mock data for analysis
  const analysisData = {
    sessionProgress: 75,
    totalInteractions: 28,
    consensusLevel: 85,
    activeAgents: selectedAgents.length,
    completedTasks: 12,
    pendingTasks: 4,
    insights: [
      {
        id: 1,
        type: 'consensus',
        title: 'Consenso en estrategia de mercado',
        description: 'Todos los agentes coinciden en la oportunidad de expansión',
        confidence: 92,
        agents: ['CLIPOGINO', 'CIA', 'CDV']
      },
      {
        id: 2,
        type: 'divergence',
        title: 'Divergencia en timing de implementación',
        description: 'Opiniones divididas sobre el cronograma óptimo',
        confidence: 67,
        agents: ['Enhanced Content Generator', 'Research Engine']
      },
      {
        id: 3,
        type: 'synthesis',
        title: 'Síntesis de recomendaciones',
        description: 'Recomendaciones integradas basadas en todos los análisis',
        confidence: 88,
        agents: ['CLIPOGINO']
      }
    ],
    agentPerformance: selectedAgents.map((agent, index) => ({
      ...agent,
      contributions: Math.floor(Math.random() * 15) + 5,
      accuracy: Math.floor(Math.random() * 20) + 80,
      responseTime: Math.floor(Math.random() * 5) + 2,
      status: ['active', 'completed', 'processing'][Math.floor(Math.random() * 3)]
    }))
  };

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Progreso</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{analysisData.sessionProgress}%</div>
              <Progress value={analysisData.sessionProgress} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Agentes Activos</span>
            </div>
            <div className="text-2xl font-bold mt-2">{analysisData.activeAgents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Interacciones</span>
            </div>
            <div className="text-2xl font-bold mt-2">{analysisData.totalInteractions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Consenso</span>
            </div>
            <div className="text-2xl font-bold mt-2">{analysisData.consensusLevel}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights Colaborativos</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento de Agentes</TabsTrigger>
          <TabsTrigger value="patterns">Patrones de Colaboración</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights de la Sesión Colaborativa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {insight.type === 'consensus' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {insight.type === 'divergence' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {insight.type === 'synthesis' && <Brain className="h-4 w-4 text-purple-500" />}
                        <h3 className="font-medium">{insight.title}</h3>
                      </div>
                      <Badge variant={insight.type === 'consensus' ? 'default' : insight.type === 'divergence' ? 'secondary' : 'outline'}>
                        {insight.confidence}% confianza
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.agents.map((agent) => (
                        <Badge key={agent} variant="outline" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Individual de Agentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.agentPerformance.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <div key={agent.id} className="border rounded-lg p-4">
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
                        <Badge variant={agent.status === 'active' ? 'default' : agent.status === 'completed' ? 'secondary' : 'outline'}>
                          {agent.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Contribuciones</span>
                          <div className="font-medium">{agent.contributions}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Precisión</span>
                          <div className="font-medium">{agent.accuracy}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tiempo Resp.</span>
                          <div className="font-medium">{agent.responseTime}s</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patrones de Colaboración Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Sinergia Alto Nivel</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    CLIPOGINO y CIA muestran alta complementariedad en análisis estratégicos
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Eficiencia mejorada en 35%</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Especialización Cruzada</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enhanced Content Generator aprovecha insights de agentes de inteligencia competitiva
                  </p>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Calidad de contenido mejorada</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Validación Cruzada</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Los agentes validan automáticamente las conclusiones de otros
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Precisión aumentada en 42%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
