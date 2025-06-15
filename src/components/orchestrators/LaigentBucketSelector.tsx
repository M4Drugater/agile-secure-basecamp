
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Search, 
  FileText, 
  Target, 
  Code,
  Zap,
  ArrowRight
} from 'lucide-react';

interface OrchestrationBucket {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  workflows: string[];
  complexity: 'basic' | 'advanced' | 'elite';
  estimatedTime: string;
}

const orchestrationBuckets: OrchestrationBucket[] = [
  {
    id: 'strategic',
    title: 'Orquestación Estratégica',
    description: 'Análisis estratégico y toma de decisiones ejecutivas',
    icon: Brain,
    workflows: ['CLIPOGINO + CIA', 'Executive Analysis', 'Strategic Planning'],
    complexity: 'elite',
    estimatedTime: '5-8 min'
  },
  {
    id: 'research',
    title: 'Motor de Investigación',
    description: 'Investigación profunda y análisis de mercado',
    icon: Search,
    workflows: ['Perplexity + Claude', 'Market Research', 'Trend Analysis'],
    complexity: 'advanced',
    estimatedTime: '3-5 min'
  },
  {
    id: 'content',
    title: 'Creación de Contenido',
    description: 'Generación y optimización de contenido profesional',
    icon: FileText,
    workflows: ['Content Generation', 'SEO Optimization', 'Multi-format Output'],
    complexity: 'advanced',
    estimatedTime: '2-4 min'
  },
  {
    id: 'intelligence',
    title: 'Inteligencia Competitiva',
    description: 'Análisis competitivo y vigilancia estratégica',
    icon: Target,
    workflows: ['CDV + CIR', 'Competitive Analysis', 'Threat Assessment'],
    complexity: 'elite',
    estimatedTime: '4-7 min'
  },
  {
    id: 'development',
    title: 'Desarrollo Profesional',
    description: 'Coaching personalizado y planes de crecimiento',
    icon: Code,
    workflows: ['CLIPOGINO Mentoring', 'Skill Assessment', 'Learning Paths'],
    complexity: 'basic',
    estimatedTime: '2-3 min'
  }
];

interface LaigentBucketSelectorProps {
  onSelectBucket: (bucket: OrchestrationBucket) => void;
}

export function LaigentBucketSelector({ onSelectBucket }: LaigentBucketSelectorProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800 border-green-200';
      case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'elite': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            LAIGENT Orchestrator
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Selecciona el tipo de orquestación de IA que necesitas. Cada bucket combina múltiples agentes 
          especializados para brindarte resultados de calidad ejecutiva.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orchestrationBuckets.map((bucket) => {
          const Icon = bucket.icon;
          return (
            <Card 
              key={bucket.id}
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-purple-200"
              onClick={() => onSelectBucket(bucket)}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200 transition-colors">
                    <Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getComplexityColor(bucket.complexity)}
                  >
                    {bucket.complexity.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <CardTitle className="text-lg group-hover:text-purple-700 transition-colors">
                    {bucket.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {bucket.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Flujos de trabajo:</p>
                  <div className="flex flex-wrap gap-1">
                    {bucket.workflows.map((workflow) => (
                      <Badge key={workflow} variant="secondary" className="text-xs">
                        {workflow}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">
                    ⏱ {bucket.estimatedTime}
                  </span>
                  <Button 
                    size="sm" 
                    className="group-hover:bg-purple-600 group-hover:text-white transition-colors"
                  >
                    Iniciar
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-purple-100">
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-900 mb-2">¿Qué es la Orquestación LAIGENT?</h3>
            <p className="text-purple-800 text-sm">
              Cada bucket combina múltiples agentes de IA especializados (OpenAI, Claude, Perplexity) 
              trabajando en coordinación para generar resultados de calidad ejecutiva. Los agentes 
              se especializan en diferentes aspectos: contexto, investigación, análisis y síntesis final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
