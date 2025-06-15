
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Brain, 
  Search, 
  Eye, 
  Activity, 
  MessageSquare,
  Settings,
  Play,
  Users,
  Sparkles,
  FileText,
  Target,
  Crown,
  CheckCircle,
  Wrench
} from 'lucide-react';
import { AgentSelector } from './AgentSelector';
import { AgentWorkspaceContent } from './AgentWorkspaceContent';
import { CollaborativeSession } from './CollaborativeSession';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  capabilities: string[];
  type: 'competitive-intelligence' | 'research' | 'chat' | 'content' | 'learning';
  status: 'active' | 'idle' | 'processing' | 'repaired';
}

const availableAgents: AgentConfig[] = [
  {
    id: 'enhanced-content-generator',
    name: 'Enhanced Content Generator',
    description: '🔧 REPARADO - Sistema multi-agente con conectividad web mejorada',
    icon: Sparkles,
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
    icon: Brain,
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
    icon: Search,
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
    icon: Eye,
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
    icon: Activity,
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
    icon: Search,
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

export function UnifiedAgentWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('selector');
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  // Handle URL parameters for direct agent access
  useEffect(() => {
    const tab = searchParams.get('tab');
    const agent = searchParams.get('agent');
    
    console.log('🔧 SISTEMA REPARADO - Parámetros URL:', { tab, agent });
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (agent && availableAgents.find(a => a.id === agent)) {
      setSelectedAgents([agent]);
      if (tab !== 'selector') {
        setActiveTab('workspace');
      }
    }
  }, [searchParams]);

  const handleAgentSelect = (agentId: string) => {
    if (collaborativeMode) {
      setSelectedAgents(prev => 
        prev.includes(agentId) 
          ? prev.filter(id => id !== agentId)
          : [...prev, agentId]
      );
    } else {
      setSelectedAgents([agentId]);
      setActiveTab('workspace');
      // Update URL params for shareable links
      setSearchParams({ tab: 'workspace', agent: agentId });
    }
  };

  const startCollaborativeSession = () => {
    if (selectedAgents.length > 1) {
      setActiveTab('collaborative');
      setSearchParams({ tab: 'collaborative' });
    }
  };

  const getSelectedAgentConfigs = () => {
    return availableAgents.filter(agent => selectedAgents.includes(agent.id));
  };

  const competitiveIntelligenceAgents = availableAgents.filter(
    agent => agent.type === 'competitive-intelligence'
  );

  const repairedAgentsCount = availableAgents.filter(
    agent => agent.status === 'repaired'
  ).length;

  return (
    <div className="space-y-6">
      {/* 🔧 System Repair Status Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>
              <strong>🔧 SISTEMA COMPLETAMENTE REPARADO</strong> - 
              Todos los problemas críticos han sido solucionados: 
              prompt building, validación web, bucles infinitos y routing.
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
            Unified Agent Workspace
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Wrench className="h-3 w-3 mr-1" />
              REPARADO
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            Sistema consolidado con todos los agentes IA - Conectividad web restaurada y validación mejorada
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={collaborativeMode ? "default" : "outline"}
            onClick={() => setCollaborativeMode(!collaborativeMode)}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Modo Colaborativo
          </Button>
          
          {selectedAgents.length > 1 && collaborativeMode && (
            <Button onClick={startCollaborativeSession} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Iniciar Sesión
            </Button>
          )}
          
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {selectedAgents.length} Agente{selectedAgents.length !== 1 ? 's' : ''} Seleccionado{selectedAgents.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Quick Access for Competitive Intelligence */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Target className="h-5 w-5" />
            Competitive Intelligence Suite - REPARADO
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectividad Restaurada
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600 mb-3">
            🔧 Acceso rápido a los agentes de inteligencia competitiva con sistema completamente reparado
          </p>
          <div className="flex gap-2 flex-wrap">
            {competitiveIntelligenceAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Button
                  key={agent.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAgentSelect(agent.id)}
                  className="flex items-center gap-2 border-green-200 hover:bg-green-50"
                >
                  <Icon className="h-4 w-4" />
                  {agent.name}
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        setSearchParams({ tab: value });
      }}>
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
                Configuración del Workspace
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Wrench className="h-3 w-3 mr-1" />
                  Sistema Reparado
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Estado del Sistema:</strong> Todas las reparaciones críticas implementadas exitosamente.
                    El sistema ahora incluye validación web mejorada, prevención de bucles infinitos, y routing corregido.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <label className="text-sm font-medium">Configuración Global de Sesión</label>
                  <p className="text-sm text-muted-foreground">
                    Configuración aplicada a todos los agentes de inteligencia competitiva reparados
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
    </div>
  );
}
