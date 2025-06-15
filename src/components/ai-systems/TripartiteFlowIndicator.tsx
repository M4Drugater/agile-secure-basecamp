
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Bot, Search, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface TripartiteFlowIndicatorProps {
  currentStep: 'interpreting' | 'searching' | 'styling' | 'complete';
  isProcessing: boolean;
  metrics?: {
    totalTokens: number;
    totalCost: string;
    webSources: string[];
    confidenceScore: number;
    processingTime: number;
  };
}

export function TripartiteFlowIndicator({ 
  currentStep, 
  isProcessing, 
  metrics 
}: TripartiteFlowIndicatorProps) {
  const steps = [
    {
      id: 'interpreting',
      title: 'OpenAI Interpretando',
      description: 'Analizando consulta y optimizando búsqueda',
      icon: Bot,
      color: 'text-blue-500'
    },
    {
      id: 'searching',
      title: 'Perplexity Buscando',
      description: 'Realizando búsqueda web profunda',
      icon: Search,
      color: 'text-green-500'
    },
    {
      id: 'styling',
      title: 'Claude Estilizando',
      description: 'Creando respuesta ejecutiva final',
      icon: Sparkles,
      color: 'text-purple-500'
    }
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (currentStep === 'complete') return 'completed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex && isProcessing) return 'active';
    return 'pending';
  };

  const getProgressValue = () => {
    if (currentStep === 'complete') return 100;
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Sistema Tripartito AI
          <Badge variant={isProcessing ? "default" : "secondary"}>
            {isProcessing ? "Procesando" : "Completado"}
          </Badge>
        </CardTitle>
        <Progress value={getProgressValue()} className="w-full" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Flow Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  status === 'active' ? 'bg-blue-50 border-blue-200' :
                  status === 'completed' ? 'bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                  status === 'completed' ? 'bg-green-500 text-white' :
                  status === 'active' ? 'bg-blue-500 text-white animate-pulse' :
                  'bg-gray-300 text-gray-500'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    {status === 'active' && (
                      <Badge variant="outline" className="text-xs">
                        En Proceso
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
                
                {/* Step number */}
                <div className={`text-xs px-2 py-1 rounded ${
                  status === 'completed' ? 'bg-green-100 text-green-700' :
                  status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Metrics Display */}
        {metrics && currentStep === 'complete' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              📊 Métricas del Flujo
              <Badge variant="secondary">Completado</Badge>
            </h5>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Tokens:</span>
                <span className="font-medium">{metrics.totalTokens.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Costo:</span>
                <span className="font-medium">${metrics.totalCost}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Fuentes:</span>
                <span className="font-medium">{metrics.webSources.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Confianza:</span>
                <span className="font-medium">{Math.round(metrics.confidenceScore * 100)}%</span>
              </div>
              
              <div className="flex justify-between col-span-2">
                <span className="text-gray-600">Tiempo:</span>
                <span className="font-medium">{Math.round(metrics.processingTime / 1000)}s</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Quality Indicator */}
        {metrics && (
          <div className="flex items-center gap-2 text-xs">
            {metrics.confidenceScore > 0.8 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-gray-600">
              Calidad: {metrics.confidenceScore > 0.8 ? 'Alta' : 'Media'} 
              ({Math.round(metrics.confidenceScore * 100)}%)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
