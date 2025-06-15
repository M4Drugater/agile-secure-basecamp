
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Play, 
  Pause,
  Clock,
  Target
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface SessionHeaderProps {
  selectedAgents: AgentConfig[];
  sessionStartTime: Date | null;
  isSessionActive: boolean;
  onStartSession: () => void;
  onPauseSession: () => void;
}

export function SessionHeader({ 
  selectedAgents, 
  sessionStartTime, 
  isSessionActive,
  onStartSession,
  onPauseSession
}: SessionHeaderProps) {
  const getSessionDuration = () => {
    if (!sessionStartTime) return '00:00:00';
    const now = new Date();
    const diff = now.getTime() - sessionStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sesión Colaborativa Multi-Agente
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedAgents.length} agentes especializados coordinados por CLIPOGINO
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {sessionStartTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {getSessionDuration()}
              </div>
            )}
            
            <Button
              onClick={isSessionActive ? onPauseSession : onStartSession}
              className="flex items-center gap-2"
              variant={isSessionActive ? "outline" : "default"}
            >
              {isSessionActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pausar Sesión
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {selectedAgents.map(agent => {
            const Icon = agent.icon;
            return (
              <Badge 
                key={agent.id} 
                variant="secondary" 
                className="flex items-center gap-2 px-3 py-1"
              >
                <div className={`w-3 h-3 ${agent.color} rounded-full flex items-center justify-center`}>
                  <Icon className="h-2 w-2 text-white" />
                </div>
                {agent.name}
              </Badge>
            );
          })}
        </div>
        
        {isSessionActive && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Sesión Activa - CLIPOGINO Orquestando</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              CLIPOGINO está coordinando la colaboración entre todos los agentes especializados en tiempo real.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
