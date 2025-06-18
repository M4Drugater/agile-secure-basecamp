
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Search, 
  Eye, 
  Brain, 
  Activity, 
  MessageSquare,
  ArrowRight,
  Crown
} from 'lucide-react';

const independentAgents = [
  {
    id: 'clipogino',
    name: 'CLIPOGINO',
    description: 'Mentor profesional con metodología tripartite completa. Tu guía estratégico personal con contexto profundo.',
    icon: MessageSquare,
    color: 'bg-blue-500',
    route: '/agents/clipogino',
    capabilities: [
      'Mentoría ejecutiva personalizada',
      'Planificación estratégica de carrera',
      'Insights con datos web actuales',
      'Recomendaciones contextualizadas',
      'Desarrollo profesional integral'
    ],
    status: 'elite'
  },
  {
    id: 'enhanced-content-generator',
    name: 'Enhanced Content Generator',
    description: 'Generador de contenido ejecutivo con sistema tripartite. Creación de contenido de nivel Fortune 500.',
    icon: Zap,
    color: 'bg-purple-500',
    route: '/agents/content-generator',
    capabilities: [
      'Contenido ejecutivo tripartite',
      'Artículos con investigación web',
      'Copywriting persuasivo avanzado',
      'Optimización SEO inteligente',
      'Adaptación de tono y estilo'
    ],
    status: 'elite'
  },
  {
    id: 'research-engine',
    name: 'Elite Research Engine',
    description: 'Motor de investigación Fortune 500 con metodología tripartite. Análisis profundo y verificado.',
    icon: Search,
    color: 'bg-indigo-500',
    route: '/agents/research-engine',
    capabilities: [
      'Investigación tripartite verificada',
      'Análisis competitivo profundo',
      'Fuentes múltiples validadas',
      'Insights estratégicos ejecutivos',
      'Reportes de nivel C-suite'
    ],
    status: 'elite'
  },
  {
    id: 'cdv',
    name: 'CDV - Competitor Discovery & Validator',
    description: 'Especialista en descubrimiento y validación competitiva con sistema tripartite avanzado.',
    icon: Eye,
    color: 'bg-green-500',
    route: '/agents/cdv',
    capabilities: [
      'Descubrimiento competitivo tripartite',
      'Validación de amenazas en tiempo real',
      'Análisis de posicionamiento',
      'Identificación de oportunidades',
      'Evaluación de brechas competitivas'
    ],
    status: 'elite'
  },
  {
    id: 'cia',
    name: 'CIA - Competitive Intelligence Analysis',
    description: 'Analista estratégico de inteligencia competitiva con metodología tripartite empresarial.',
    icon: Brain,
    color: 'bg-red-500',
    route: '/agents/cia',
    capabilities: [
      'Análisis estratégico tripartite',
      'Evaluación de amenazas ejecutivas',
      'Intelligence competitiva avanzada',
      'Recomendaciones C-level',
      'Perfilado competitivo profundo'
    ],
    status: 'elite'
  },
  {
    id: 'cir',
    name: 'CIR - Competitive Intelligence Retriever',
    description: 'Especialista en métricas competitivas con sistema tripartite para datos verificables.',
    icon: Activity,
    color: 'bg-orange-500',
    route: '/agents/cir',
    capabilities: [
      'Métricas tripartite verificadas',
      'Domain authority y SEO metrics',
      'Análisis de tráfico competitivo',
      'Evaluación de equipos y recursos',
      'Benchmarking cuantitativo'
    ],
    status: 'elite'
  }
];

export function IndependentAgentsHub() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Agentes IA Independientes
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Accede directamente a cada agente especializado con su poder completo e individual. 
          Cada agente mantiene su metodología tripartite y capacidades específicas.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            ✅ Sistema Tripartite Activo
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            🚀 Autonomía Completa
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            👑 Nivel Fortune 500
          </Badge>
        </div>
      </div>

      {/* Tripartite System Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Sistema Tripartite Unificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold">OpenAI GPT-4</h4>
              <p className="text-sm text-muted-foreground">Análisis de contexto y comprensión</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold">Perplexity AI</h4>
              <p className="text-sm text-muted-foreground">Investigación web en tiempo real</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold">Claude Sonnet</h4>
              <p className="text-sm text-muted-foreground">Síntesis y refinamiento</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {independentAgents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card 
              key={agent.id} 
              className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300 cursor-pointer group"
              onClick={() => navigate(agent.route)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${agent.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300"
                  >
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {agent.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2 text-gray-700">Capacidades Principales:</h5>
                  <ul className="space-y-1">
                    {agent.capabilities.slice(0, 3).map((capability, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start">
                        <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        {capability}
                      </li>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <li className="text-xs text-blue-600 font-medium">
                        +{agent.capabilities.length - 3} capacidades más
                      </li>
                    )}
                  </ul>
                </div>
                
                <Button 
                  className="w-full group-hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(agent.route);
                  }}
                >
                  Acceder al Agente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">¿Necesitas usar múltiples agentes?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Cada agente es independiente y mantiene su especialización. Para flujos colaborativos, 
            puedes usar CLIPOGINO que puede coordinar con otros agentes según sea necesario.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/agents/clipogino')}
          >
            Usar CLIPOGINO como Coordinador
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
