
import { Zap, Search } from 'lucide-react';
import type { AgentConfig } from '../UnifiedAgentWorkspace';

export const availableAgents: AgentConfig[] = [
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
    description: '🚀 SISTEMA TRIPARTITE - Investigación Fortune 500 con metodología unificada',
    icon: Search,
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
