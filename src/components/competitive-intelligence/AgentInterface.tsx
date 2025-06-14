
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Eye, 
  Target, 
  Brain,
  Send,
  Settings,
  Play,
  Zap,
  Activity
} from 'lucide-react';
import { AgentChat } from './AgentChat';

interface AgentInterfaceProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
}

const agents = {
  cdv: {
    name: 'CDV - Competitor Discovery & Validator',
    icon: Eye,
    color: 'bg-blue-500',
    description: 'Especializado en descubrir, analizar y validar amenazas competitivas y oportunidades de mercado',
    capabilities: [
      'Descubrimiento de competidores directos e indirectos',
      'Validación de amenazas competitivas',
      'Análisis de posicionamiento de mercado',
      'Identificación de oportunidades estratégicas',
      'Evaluación de brechas competitivas'
    ]
  },
  cir: {
    name: 'CIR - Competitive Intelligence Retriever',
    icon: Activity,
    color: 'bg-green-500',
    description: 'Especialista en inteligencia de datos que proporciona métricas reales y datos de mercado',
    capabilities: [
      'Estimaciones de autoridad de dominio',
      'Análisis de tráfico web',
      'Métricas de redes sociales',
      'Evaluación de tamaño de equipos',
      'Análisis de volumen de contenido'
    ]
  },
  cia: {
    name: 'CIA - Competitive Intelligence Analysis',
    icon: Brain,
    color: 'bg-purple-500',
    description: 'Experto en análisis estratégico y recopilación de inteligencia competitiva avanzada',
    capabilities: [
      'Evaluación de amenazas estratégicas',
      'Análisis de oportunidades de mercado',
      'Perfilado de competidores',
      'Análisis SWOT',
      'Evaluación de riesgos'
    ]
  }
};

export function AgentInterface({ selectedAgent, onAgentSelect }: AgentInterfaceProps) {
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  if (!selectedAgent) {
    return (
      <div className="text-center py-12">
        <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Selecciona un Agente de IA</h3>
        <p className="text-muted-foreground mb-6">
          Elige un agente especializado en inteligencia competitiva para comenzar tu análisis
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {Object.entries(agents).map(([id, agent]) => (
            <Card key={id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onAgentSelect(id)}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <agent.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">{agent.name}</h4>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const agent = agents[selectedAgent as keyof typeof agents];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agent Configuration */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${agent.color} rounded-full flex items-center justify-center`}>
                <agent.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{agent.description}</p>
            
            <div>
              <h4 className="font-medium mb-2">Capacidades:</h4>
              <div className="space-y-1">
                {agent.capabilities.map((capability, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración de Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Empresa Objetivo</Label>
              <Input
                id="companyName"
                placeholder="Empresa a analizar"
                value={sessionConfig.companyName}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industria</Label>
              <Select value={sessionConfig.industry} onValueChange={(value) => 
                setSessionConfig(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona industria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Tecnología</SelectItem>
                  <SelectItem value="finance">Finanzas</SelectItem>
                  <SelectItem value="healthcare">Salud</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufactura</SelectItem>
                  <SelectItem value="education">Educación</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="analysisFocus">Enfoque de Análisis</Label>
              <Select value={sessionConfig.analysisFocus} onValueChange={(value) => 
                setSessionConfig(prev => ({ ...prev, analysisFocus: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona enfoque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market-share">Participación de Mercado</SelectItem>
                  <SelectItem value="pricing">Estrategia de Precios</SelectItem>
                  <SelectItem value="product-features">Características de Producto</SelectItem>
                  <SelectItem value="marketing">Estrategia de Marketing</SelectItem>
                  <SelectItem value="financial">Rendimiento Financiero</SelectItem>
                  <SelectItem value="technology">Análisis Tecnológico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="objectives">Objetivos del Análisis</Label>
              <Textarea
                id="objectives"
                placeholder="¿Qué quieres lograr con este análisis?"
                value={sessionConfig.objectives}
                onChange={(e) => setSessionConfig(prev => ({ ...prev, objectives: e.target.value }))}
              />
            </div>

            <Button className="w-full" disabled={!sessionConfig.companyName}>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Sesión de Análisis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Agent Chat Interface */}
      <div className="lg:col-span-2">
        <AgentChat agentId={selectedAgent} sessionConfig={sessionConfig} />
      </div>
    </div>
  );
}
