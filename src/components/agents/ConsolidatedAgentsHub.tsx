import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Zap, 
  CheckCircle,
  Wrench,
  Crown,
  MessageSquare,
  Settings,
  Users
} from 'lucide-react';
import { LaigentBucketSelector } from '@/components/orchestrators/LaigentBucketSelector';
import { LaigentWorkflowInterface } from '@/components/orchestrators/LaigentWorkflowInterface';
import { AgentSelector } from './AgentSelector';
import { AgentWorkspaceContent } from './AgentWorkspaceContent';
import { CollaborativeSession } from './CollaborativeSession';
import type { AgentConfig } from './UnifiedAgentWorkspace';

const availableAgents: AgentConfig[] = [
  {
    id: 'enhanced-content-generator',
    name: 'Enhanced Content Generator',
    description: '🚀 SISTEMA TRIPARTITE - Contenido ejecutivo con flujo OpenAI→Perplexity→Claude',
    icon: Zap,
    color: 'bg-purple-500',
    capabilities: [
      'Flujo tripartite unificado garantizado',
      'Contenido ejecutivo con datos web verificados',
      'Síntesis multi-agente estandarizada',
      'Intelligence estratégica con métricas consistentes',
      'Outputs C-suite con validación triple'
    ],
    type: 'content',
    status: 'unified'
  },
  {
    id: 'clipogino',
    name: 'CLIPOGINO',
    description: '🚀 SISTEMA TRIPARTITE - Mentor profesional con metodología unificada',
    icon: Zap,
    color: 'bg-blue-500',
    capabilities: [
      'Flujo tripartite estandarizado para mentoría',
      'Desarrollo profesional con contexto web actual',
      'Insights estratégicos con validación triple',
      'Recomendaciones con evidencia verificable',
      'Planificación con tendencias documentadas'
    ],
    type: 'chat',
    status: 'unified'
  },
  {
    id: 'research-engine',
    name: 'Elite Research Engine',
    description: '🚀 SISTEMA TRIPARTITE - Investigación con metodología unificada',
    icon: Zap,
    color: 'bg-indigo-500',
    capabilities: [
      'Research con flujo tripartite garantizado',
      'Análisis con múltiples fuentes verificadas',
      'Intelligence competitiva estandarizada',
      'Validación automática con métricas consistentes',
      'Síntesis estratégica con evidencia triple'
    ],
    type: 'research',
    status: 'unified'
  },
  {
    id: 'cdv',
    name: 'CDV - Competitor Discovery & Validator',
    description: '🚀 SISTEMA TRIPARTITE - Descubrimiento competitivo con metodología unificada',
    icon: Zap,
    color: 'bg-purple-500',
    capabilities: [
      'Flujo tripartite aplicado a descubrimiento',
      'Validación con métricas estandarizadas',
      'Análisis de posicionamiento con evidencia triple',
      'Identificación de oportunidades verificables',
      'Sistema anti-bucle con calidad garantizada'
    ],
    type: 'competitive-intelligence',
    status: 'unified'
  },
  {
    id: 'cia',
    name: 'CIA - Competitive Intelligence Analysis',
    description: '🚀 SISTEMA TRIPARTITE - Análisis estratégico con metodología unificada',
    icon: Zap,
    color: 'bg-green-500',
    capabilities: [
      'Análisis estratégico con flujo tripartite',
      'Evaluación de amenazas estandarizada',
      'Síntesis ejecutiva con validación triple',
      'Recomendaciones C-suite verificables',
      'Frameworks con datos actuales garantizados'
    ],
    type: 'competitive-intelligence',
    status: 'unified'
  },
  {
    id: 'cir',
    name: 'CIR - Competitive Intelligence Retriever',
    description: '🚀 SISTEMA TRIPARTITE - Métricas competitivas con metodología unificada',
    icon: Zap,
    color: 'bg-orange-500',
    capabilities: [
      'Métricas con flujo tripartite garantizado',
      'Domain authority con fuentes verificadas',
      'Análisis de tráfico con validación triple',
      'Benchmarking con números estandarizados',
      'Evaluación con evidencia documentada'
    ],
    type: 'competitive-intelligence',
    status: 'unified'
  }
];

export function ConsolidatedAgentsHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMode, setActiveMode] = useState<'orchestrator' | 'workspace'>('orchestrator');
  const [selectedBucket, setSelectedBucket] = useState<any>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  // Handle URL parameters for direct agent access
  useEffect(() => {
    const mode = searchParams.get('mode') || 'orchestrator';
    const tab = searchParams.get('tab');
    const agent = searchParams.get('agent');
    
    if (mode === 'workspace' || tab || agent) {
      setActiveMode('workspace');
      if (agent && availableAgents.find(a => a.id === agent)) {
        setSelectedAgents([agent]);
      }
    } else {
      setActiveMode('orchestrator');
    }
  }, [searchParams]);

  const handleModeSwitch = (mode: 'orchestrator' | 'workspace') => {
    setActiveMode(mode);
    setSearchParams({ mode });
    // Reset states when switching modes
    if (mode === 'orchestrator') {
      setSelectedAgents([]);
      setSelectedBucket(null);
    }
  };

  const handleSelectBucket = (bucket: any) => {
    setSelectedBucket(bucket);
  };

  const handleBackToBuckets = () => {
    setSelectedBucket(null);
  };

  const handleAgentSelect = (agentId: string) => {
    if (collaborativeMode) {
      setSelectedAgents(prev => 
        prev.includes(agentId) 
          ? prev.filter(id => id !== agentId)
          : [...prev, agentId]
      );
    } else {
      setSelectedAgents([agentId]);
      setSearchParams({ mode: 'workspace', agent: agentId });
    }
  };

  const getSelectedAgentConfigs = () => {
    return availableAgents.filter(agent => selectedAgents.includes(agent.id));
  };

  const repairedAgentsCount = availableAgents.filter(
    agent => agent.status === 'unified'
  ).length;

  return (
    <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
      {/* Enhanced Header with Unified Status */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Consolidated Agents Hub
          <Crown className="h-8 w-8 text-yellow-500" />
        </h1>
        <p className="text-muted-foreground mb-4">
          Sistema tripartite unificado - Todos los agentes ahora usan la metodología estandarizada OpenAI → Perplexity → Claude
        </p>
        
        {/* Unified System Status */}
        <Alert className="border-green-200 bg-green-50 mb-6">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✅ <strong>Sistema Tripartite Unificado Activo</strong> - Todos los agentes implementan la misma metodología para garantizar consistencia, calidad y métricas comparables.
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2">
          <Badge variant="default">Metodología Unificada</Badge>
          <Badge variant="default">Flujo Tripartite</Badge>
          <Badge variant="default">Métricas Consistentes</Badge>
          <Badge variant="default">Calidad Garantizada</Badge>
        </div>
      </div>

      <Tabs value={activeMode} onValueChange={(value) => handleModeSwitch(value as 'orchestrator' | 'workspace')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orchestrator" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            LAIGENT Orchestrator
          </TabsTrigger>
          <TabsTrigger value="workspace" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Agent Workspace
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orchestrator" className="mt-6">
          {!selectedBucket ? (
            <LaigentBucketSelector onSelectBucket={handleSelectBucket} />
          ) : (
            <LaigentWorkflowInterface 
              selectedBucket={selectedBucket}
              onBack={handleBackToBuckets}
            />
          )}
        </TabsContent>

        <TabsContent value="workspace" className="mt-6">
          {collaborativeMode ? (
            <CollaborativeSession
              selectedAgents={selectedAgents.map(id => availableAgents.find(a => a.id === id)!)}
              sessionConfig={sessionConfig}
              onUpdateConfig={setSessionConfig}
              onBack={() => {
                setCollaborativeMode(false);
                setSelectedAgents([]);
              }}
            />
          ) : (
            <AgentWorkspaceContent
              availableAgents={availableAgents}
              selectedAgents={selectedAgents}
              collaborativeMode={collaborativeMode}
              sessionConfig={sessionConfig}
              onAgentSelect={handleAgentSelect}
              onToggleCollaborative={() => setCollaborativeMode(!collaborativeMode)}
              onUpdateConfig={setSessionConfig}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
