
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Play, 
  Loader2,
  CheckCircle,
  Brain,
  Search,
  Sparkles,
  Target
} from 'lucide-react';
import { useLaigentMasterOrchestrator } from '@/hooks/orchestrators/useLaigentMasterOrchestrator';
import type { LaigentRequest } from '@/hooks/orchestrators/types';

interface WorkflowConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia' | 'research-engine' | 'enhanced-content-generator';
  complexity: 'basic' | 'advanced' | 'elite';
  estimatedTime: string;
  defaultPrompt: string;
}

interface LaigentWorkflowInterfaceProps {
  selectedBucket: {
    id: string;
    title: string;
    workflows: string[];
  };
  onBack: () => void;
}

const workflowConfigs: Record<string, WorkflowConfig[]> = {
  strategic: [
    {
      id: 'executive-analysis',
      title: 'Análisis Ejecutivo',
      description: 'Análisis estratégico profundo con CLIPOGINO y CIA',
      icon: Brain,
      agentType: 'clipogino',
      complexity: 'elite',
      estimatedTime: '6-8 min',
      defaultPrompt: 'Necesito un análisis estratégico ejecutivo sobre...'
    }
  ],
  research: [
    {
      id: 'market-research',
      title: 'Investigación de Mercado',
      description: 'Investigación profunda con Perplexity y análisis Claude',
      icon: Search,
      agentType: 'research-engine',
      complexity: 'advanced',
      estimatedTime: '4-6 min',
      defaultPrompt: 'Investiga en profundidad sobre...'
    }
  ],
  content: [
    {
      id: 'content-generation',
      title: 'Generación de Contenido',
      description: 'Creación de contenido profesional optimizado',
      icon: Sparkles,
      agentType: 'enhanced-content-generator',
      complexity: 'advanced',
      estimatedTime: '3-5 min',
      defaultPrompt: 'Genera contenido profesional sobre...'
    }
  ],
  intelligence: [
    {
      id: 'competitive-analysis',
      title: 'Análisis Competitivo',
      description: 'Inteligencia competitiva con CDV y CIR',
      icon: Target,
      agentType: 'cdv',
      complexity: 'elite',
      estimatedTime: '5-7 min',
      defaultPrompt: 'Analiza la competencia en el sector de...'
    }
  ],
  development: [
    {
      id: 'mentoring-session',
      title: 'Sesión de Mentoring',
      description: 'Coaching personalizado con CLIPOGINO',
      icon: Brain,
      agentType: 'clipogino',
      complexity: 'basic',
      estimatedTime: '2-4 min',
      defaultPrompt: 'Necesito orientación profesional sobre...'
    }
  ]
};

export function LaigentWorkflowInterface({ selectedBucket, onBack }: LaigentWorkflowInterfaceProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowConfig | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  
  const { 
    executeLaigentOrchestration, 
    isOrchestrating, 
    orchestrationStage,
    getOrchestrationStatus 
  } = useLaigentMasterOrchestrator();

  const workflows = workflowConfigs[selectedBucket.id] || [];
  const status = getOrchestrationStatus();

  const handleExecuteOrchestration = async () => {
    if (!selectedWorkflow || !userQuery.trim()) return;

    const request: LaigentRequest = {
      userQuery,
      agentType: selectedWorkflow.agentType,
      orchestrationLevel: selectedWorkflow.complexity === 'elite' ? 'elite' : 
                          selectedWorkflow.complexity === 'advanced' ? 'advanced' : 'standard',
      customParameters: {
        researchDepth: 'comprehensive',
        stylingFormality: 'executive',
        outputFormat: 'comprehensive'
      }
    };

    try {
      const orchestrationResult = await executeLaigentOrchestration(request);
      setResult(orchestrationResult);
    } catch (error) {
      console.error('Orchestration failed:', error);
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'context-building': return 'Construyendo contexto avanzado...';
      case 'research-execution': return 'Ejecutando investigación profunda...';
      case 'content-styling': return 'Aplicando estilo ejecutivo...';
      case 'quality-assurance': return 'Control de calidad final...';
      default: return 'Preparando orquestación...';
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setResult(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nueva Orquestación
          </Button>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">Orquestación Completada</h2>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resultado de {selectedWorkflow?.title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">
                Calidad: {Math.round((result.qualityAssurance?.overallScore || 0) * 100)}%
              </Badge>
              <Badge variant="outline">
                Tiempo: {Math.round((result.performanceAnalytics?.contextBuildTime + 
                                 result.performanceAnalytics?.researchTime + 
                                 result.performanceAnalytics?.stylingTime) / 1000)}s
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: result.finalContent.replace(/\n/g, '<br />') 
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Buckets
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{selectedBucket.title}</h2>
          <p className="text-muted-foreground">Selecciona un flujo de trabajo para comenzar</p>
        </div>
      </div>

      {!selectedWorkflow ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((workflow) => {
            const Icon = workflow.icon;
            return (
              <Card 
                key={workflow.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">{workflow.title}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{workflow.complexity.toUpperCase()}</Badge>
                    <span className="text-sm text-muted-foreground">⏱ {workflow.estimatedTime}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedWorkflow.icon className="h-6 w-6 text-purple-600" />
                  <div>
                    <CardTitle>{selectedWorkflow.title}</CardTitle>
                    <CardDescription>{selectedWorkflow.description}</CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                  Cambiar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe tu consulta para la orquestación:
                </label>
                <Textarea
                  placeholder={selectedWorkflow.defaultPrompt}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {isOrchestrating && (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progreso de Orquestación</span>
                      <span className="text-sm text-muted-foreground">{status.stageProgress}%</span>
                    </div>
                    <Progress value={status.stageProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {getStageDescription(orchestrationStage)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleExecuteOrchestration}
                  disabled={!userQuery.trim() || isOrchestrating}
                  className="flex-1"
                >
                  {isOrchestrating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Orquestando...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Ejecutar Orquestación
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
