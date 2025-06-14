
import { Eye, Brain, Activity } from 'lucide-react';

export const agents = {
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
