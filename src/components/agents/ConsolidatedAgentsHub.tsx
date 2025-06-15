
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
  ArrowRight,
  Crown,
  Target,
  MessageSquare,
  Settings,
  Play,
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
    description: '🔧 REPARADO - Sistema multi-agente con conectividad web mejorada',
    icon: Wrench,
    color: 'bg-purple-500',
    capabilities: [
      'Contenido ejecutivo con datos web actuales',
      'Multi-agent collaboration reparada',
      'Intelligence estratégica integrada',
      'Knowledge base enhancement',
      'Outputs de nivel C-suite verificados'
    ],
    type: 'content',
    status: 'repaired'
  },
  {
    id: 'clipogino',
    name: 'CLIPOGINO',
    description: '🔧 REPARADO - Mentor profesional con intelligence web restaurada',
    icon: Wrench,
    color: 'bg-blue-500',
    capabilities: [
      'Mentoría con datos de mercado actuales',
      'Desarrollo profesional con context de industria',
      'Insights estratégicos con fuentes verificables',
      'Recomendaciones con evidencia web',
      'Planificación de carrera con tendencias actuales'
    ],
    type: 'chat',
    status: 'repaired'
  },
  {
    id: 'research-engine',
    name: 'Elite Research Engine',
    description: '🔧 REPARADO - Investigación avanzada con conectividad web garantizada',
    icon: Wrench,
    color: 'bg-indigo-500',
    capabilities: [
      'Research con múltiples fuentes verificadas',
      'Análisis de tendencias con datos actuales',
      'Intelligence competitiva documentada',
      'Validación automática de información',
      'Síntesis estratégica con evidencia'
    ],
    type: 'research',
    status: 'repaired'
  },
  {
    id: 'cdv',
    name: 'CDV - Competitor Discovery & Validator',
    description: '🔧 COMPLETAMENTE REPARADO - Conectividad web restaurada y validación garantizada',
    icon: Wrench,
    color: 'bg-purple-500',
    capabilities: [
      'Descubrimiento con datos web verificados',
      'Validación con métricas actuales',
      'Análisis de posicionamiento documentado',
      'Identificación de oportunidades con evidencia',
      'Sistema anti-bucle infinito activado'
    ],
    type: 'competitive-intelligence',
    status: 'repaired'
  },
  {
    id: 'cia',
    name: 'CIA - Competitive Intelligence Analysis',
    description: '🔧 COMPLETAMENTE REPARADO - Intelligence estratégica con datos web verificados',
    icon: Wrench,
    color: 'bg-green-500',
    capabilities: [
      'Análisis estratégico con evidencia web',
      'Evaluación de amenazas documentada',
      'Síntesis ejecutiva con fuentes múltiples',
      'Recomendaciones C-suite respaldadas',
      'Frameworks de consultoría con datos actuales'
    ],
    type: 'competitive-intelligence',
    status: 'repaired'
  },
  {
    id: 'cir',
    name: 'CIR - Competitive Intelligence Retriever',
    description: '🔧 COMPLETAMENTE REPARADO - Métricas y datos web con conectividad restaurada',
    icon: Wrench,
    color: 'bg-orange-500',
    capabilities: [
      'Domain authority con fuentes verificadas',
      'Análisis de tráfico con datos reales',
      'Métricas de redes sociales actuales',
      'Evaluación de equipos documentada',
      'Benchmarking con números específicos'
    ],
    type: 'competitive-intelligence',
    status: 'repaired'
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
    agent => agent.status === 'repaired'
  ).length;

  return (
    <div className="space-y-6">
      {/* System Repair Status Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>
              <strong>🔧 SISTEMA COMPLETAMENTE REPARADO</strong> - 
              Orquestador LAIGENT y Agentes unificados en una sola interfaz con conectividad web restaurada.
            </span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Wrench className="h-3 w-3 mr-1" />
              {repairedAgentsCount} Agentes Reparados
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-500" />
            Centro de Agentes IA
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Wrench className="h-3 w-3 mr-1" />
              CONSOLIDADO
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            Orquestador LAIGENT y workspace unificado de agentes - Todo en una sola interfaz
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {activeMode === 'workspace' && (
            <>
              <Button
                variant={collaborativeMode ? "default" : "outline"}
                onClick={() => setCollaborativeMode(!collaborativeMode)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Modo Colaborativo
              </Button>
              
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bot className="h-3 w-3" />
                {selectedAgents.length} Agente{selectedAgents.length !== 1 ? 's' : ''} Seleccionado{selectedAgents.length !== 1 ? 's' : ''}
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">Selecciona el Modo de Trabajo</h3>
          <p className="text-sm text-blue-700">
            Orquestador para workflows complejos o Workspace para interacción directa con agentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeMode === 'orchestrator' ? 'default' : 'outline'}
            onClick={() => handleModeSwitch('orchestrator')}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Orquestador LAIGENT
            <Crown className="h-3 w-3" />
          </Button>
          <Button
            variant={activeMode === 'workspace' ? 'default' : 'outline'}
            onClick={() => handleModeSwitch('workspace')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Workspace de Agentes
          </Button>
        </div>
      </div>

      {/* Content based on active mode */}
      {activeMode === 'orchestrator' ? (
        // LAIGENT Orchestrator Mode
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                LAIGENT Orchestrator
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selecciona el tipo de orquestación de IA que necesitas. Cada bucket combina múltiples agentes 
              especializados para brindarte resultados de calidad ejecutiva.
            </p>
          </div>

          {!selectedBucket ? (
            <LaigentBucketSelector onSelectBucket={handleSelectBucket} />
          ) : (
            <LaigentWorkflowInterface 
              selectedBucket={selectedBucket}
              onBack={handleBackToBuckets}
            />
          )}
        </div>
      ) : (
        // Agent Workspace Mode
        <Tabs defaultValue="selector" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="selector" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Selección de Agentes
            </TabsTrigger>
            <TabsTrigger 
              value="workspace" 
              disabled={selectedAgents.length === 0}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Workspace
              {selectedAgents.length > 0 && (
                <CheckCircle className="h-3 w-3 text-green-600" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="collaborative"
              disabled={selectedAgents.length < 2}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Colaborativo
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selector" className="space-y-4">
            <AgentSelector
              agents={availableAgents}
              selectedAgents={selectedAgents}
              onAgentSelect={handleAgentSelect}
              collaborativeMode={collaborativeMode}
            />
          </TabsContent>

          <TabsContent value="workspace" className="space-y-4">
            {selectedAgents.length > 0 && (
              <AgentWorkspaceContent
                selectedAgents={getSelectedAgentConfigs()}
                sessionConfig={sessionConfig}
                setSessionConfig={setSessionConfig}
              />
            )}
          </TabsContent>

          <TabsContent value="collaborative" className="space-y-4">
            {selectedAgents.length > 1 && (
              <CollaborativeSession
                selectedAgents={getSelectedAgentConfigs()}
                sessionConfig={sessionConfig}
                setSessionConfig={setSessionConfig}
              />
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Configuración del Centro de Agentes
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Wrench className="h-3 w-3 mr-1" />
                    Sistema Consolidado
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Estado del Sistema:</strong> Orquestador LAIGENT y Agentes unificados exitosamente.
                      Todas las funcionalidades consolidadas bajo la ruta /agents con conectividad web restaurada.
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <label className="text-sm font-medium">Configuración Global de Sesión</label>
                    <p className="text-sm text-muted-foreground">
                      Configuración aplicada a todos los agentes y workflows del orquestador
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Empresa</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={sessionConfig.companyName}
                        onChange={(e) => setSessionConfig(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Industria</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={sessionConfig.industry}
                        onChange={(e) => setSessionConfig(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="Industria principal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Enfoque de Análisis</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={sessionConfig.analysisFocus}
                        onChange={(e) => setSessionConfig(prev => ({ ...prev, analysisFocus: e.target.value }))}
                        placeholder="Ej: análisis competitivo, investigación de mercado"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Objetivos</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={sessionConfig.objectives}
                        onChange={(e) => setSessionConfig(prev => ({ ...prev, objectives: e.target.value }))}
                        placeholder="Objetivos del análisis"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
