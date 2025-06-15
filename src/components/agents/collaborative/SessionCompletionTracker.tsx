
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Zap,
  Download,
  AlertTriangle
} from 'lucide-react';

interface SessionCompletionTrackerProps {
  sessionMetrics: any;
  isGeneratingResults: boolean;
  completionResults: any;
  onTriggerCompletion: () => void;
  isSessionActive: boolean;
}

export function SessionCompletionTracker({
  sessionMetrics,
  isGeneratingResults,
  completionResults,
  onTriggerCompletion,
  isSessionActive
}: SessionCompletionTrackerProps) {
  const isNearCompletion = sessionMetrics.sessionProgress >= 80;
  const isCompleted = sessionMetrics.sessionProgress >= 100 || completionResults;

  // Calcular estado de finalización
  const getCompletionStatus = () => {
    if (completionResults) return 'completed';
    if (isGeneratingResults) return 'generating';
    if (sessionMetrics.sessionProgress >= 95) return 'ready';
    if (isNearCompletion) return 'approaching';
    return 'in-progress';
  };

  const completionStatus = getCompletionStatus();

  const getStatusConfig = () => {
    switch (completionStatus) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          title: '✅ Sesión Completada',
          description: 'Todos los resultados han sido generados exitosamente'
        };
      case 'generating':
        return {
          icon: Zap,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200',
          title: '⚡ Generando Resultados',
          description: 'Creando reportes finales y síntesis colaborativa...'
        };
      case 'ready':
        return {
          icon: Target,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 border-orange-200',
          title: '🎯 Listo para Finalizar',
          description: 'La sesión está lista para generar resultados finales'
        };
      case 'approaching':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          title: '⏱️ Acercándose a la Meta',
          description: 'La sesión está próxima a completarse'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
          title: '🔄 En Progreso',
          description: 'La sesión colaborativa está en desarrollo'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={`${statusConfig.bgColor} transition-all duration-300`}>
      <CardContent className="p-4 space-y-4">
        {/* Header de Estado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            <span className="font-medium">{statusConfig.title}</span>
          </div>
          <Badge 
            variant={isCompleted ? 'default' : 'secondary'}
            className={isCompleted ? 'bg-green-500' : ''}
          >
            {sessionMetrics.sessionProgress.toFixed(0)}%
          </Badge>
        </div>

        {/* Barra de Progreso */}
        <div className="space-y-2">
          <Progress 
            value={sessionMetrics.sessionProgress} 
            className="h-3"
          />
          <p className="text-xs text-muted-foreground">
            {statusConfig.description}
          </p>
        </div>

        {/* Métricas de Finalización */}
        {isNearCompletion && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-bold">
                {sessionMetrics.consensusLevel}%
              </div>
              <div className="text-xs text-muted-foreground">Consenso</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {sessionMetrics.collaborationScore}%
              </div>
              <div className="text-xs text-muted-foreground">Colaboración</div>
            </div>
          </div>
        )}

        {/* Acción de Finalización */}
        {completionStatus === 'ready' && !isGeneratingResults && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>¿Generar resultados finales ahora?</span>
              <Button 
                size="sm" 
                onClick={onTriggerCompletion}
                className="ml-2"
              >
                Finalizar Sesión
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Estado de Generación */}
        {isGeneratingResults && (
          <div className="flex items-center gap-2 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span>Generando resultados colaborativos...</span>
          </div>
        )}

        {/* Resultados Disponibles */}
        {completionResults && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium text-green-600">
              ✅ Resultados disponibles
            </span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Ver Resultados
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
