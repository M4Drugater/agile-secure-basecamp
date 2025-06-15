
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  Activity, 
  CheckCircle, 
  Clock,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface ClipoginoOrchestratorProps {
  selectedAgents: AgentConfig[];
  isSessionActive: boolean;
  sessionMetrics: any;
  onStartSession: () => void;
  onPauseSession: () => void;
  onSimulateEvent: (eventType: 'consensus' | 'divergence' | 'breakthrough') => void;
}

export function ClipoginoOrchestrator({ 
  selectedAgents, 
  isSessionActive, 
  sessionMetrics,
  onStartSession,
  onPauseSession,
  onSimulateEvent
}: ClipoginoOrchestratorProps) {
  const [orchestrationPhase, setOrchestrationPhase] = useState<'planning' | 'coordinating' | 'synthesizing'>('planning');

  useEffect(() => {
    if (isSessionActive) {
      const phases = ['planning', 'coordinating', 'synthesizing'] as const;
      const interval = setInterval(() => {
        setOrchestrationPhase(prev => {
          const currentIndex = phases.indexOf(prev);
          return phases[(currentIndex + 1) % phases.length];
        });
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isSessionActive]);

  const getPhaseDescription = () => {
    switch (orchestrationPhase) {
      case 'planning':
        return 'Analizando objetivos y asignando tareas especializadas';
      case 'coordinating':
        return 'Facilitando colaboración entre agentes especializados';
      case 'synthesizing':
        return 'Integrando perspectivas y generando síntesis final';
      default:
        return 'Listo para orquestar la sesión colaborativa';
    }
  };

  const getPhaseIcon = () => {
    switch (orchestrationPhase) {
      case 'planning': return Target;
      case 'coordinating': return Users;
      case 'synthesizing': return Zap;
      default: return Brain;
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          CLIPOGINO - Orquestador Principal
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Orchestration Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado de Orquestación</span>
            <Badge variant={isSessionActive ? "default" : "secondary"}>
              {isSessionActive ? 'Activo' : 'En espera'}
            </Badge>
          </div>
          
          {isSessionActive && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {React.createElement(getPhaseIcon(), { className: 'h-4 w-4 text-blue-600' })}
                <span className="text-sm">{getPhaseDescription()}</span>
              </div>
              <Progress value={sessionMetrics.sessionProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* Agent Coordination Status */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Agentes Bajo Coordinación</span>
          <div className="grid grid-cols-2 gap-2">
            {selectedAgents.map(agent => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                  <div className={`w-6 h-6 ${agent.color} rounded-full flex items-center justify-center`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium">{agent.name}</span>
                  {isSessionActive && (
                    <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Metrics */}
        {isSessionActive && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {sessionMetrics.collaborationScore}%
              </div>
              <div className="text-xs text-muted-foreground">Sinergia</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {sessionMetrics.consensusLevel}%
              </div>
              <div className="text-xs text-muted-foreground">Consenso</div>
            </div>
          </div>
        )}

        {/* Control Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            onClick={isSessionActive ? onPauseSession : onStartSession}
            className="flex-1"
            variant={isSessionActive ? "outline" : "default"}
          >
            {isSessionActive ? 'Pausar' : 'Iniciar Orquestación'}
          </Button>
          
          {isSessionActive && (
            <Button
              onClick={() => onSimulateEvent('consensus')}
              variant="outline"
              size="sm"
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
