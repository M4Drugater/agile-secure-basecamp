
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Users, 
  Play, 
  Pause,
  Clock,
  Target
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { CollaborativeChatInterface } from './CollaborativeChatInterface';
import { CollaborativeSettings } from './CollaborativeSettings';
import { CollaborativeAnalysis } from './CollaborativeAnalysis';

interface CollaborativeSessionProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function CollaborativeSession({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: CollaborativeSessionProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
    setActiveTab('chat'); // Switch to chat when starting session
  };

  const pauseSession = () => {
    setIsSessionActive(false);
  };

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
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Sesión Colaborativa Multi-Agente
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedAgents.length} agentes especializados trabajando en equipo
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
                onClick={isSessionActive ? pauseSession : startSession}
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
                <span className="text-sm font-medium">Sesión Activa</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Todos los agentes están listos para colaborar. Ve a la pestaña "Chat" para comenzar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Colaborativo
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análisis
          </TabsTrigger>
          <TabsTrigger value="coordination" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Coordinación
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <CollaborativeChatInterface
            selectedAgents={selectedAgents}
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <CollaborativeAnalysis
            selectedAgents={selectedAgents}
            sessionConfig={sessionConfig}
          />
        </TabsContent>

        <TabsContent value="coordination">
          <Card>
            <CardHeader>
              <CardTitle>Panel de Coordinación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coordinación de Agentes</h3>
                <p className="text-muted-foreground mb-4">
                  Gestiona cómo los agentes se coordinan y comparten información durante la sesión
                </p>
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="text-left space-y-2">
                    <h4 className="font-medium">Funcionalidades planeadas:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Asignación dinámica de tareas</li>
                      <li>• Monitoreo de dependencias entre agentes</li>
                      <li>• Escalación automática de conflictos</li>
                      <li>• Optimización de flujos de trabajo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <CollaborativeSettings
            selectedAgents={selectedAgents}
            sessionConfig={sessionConfig}
            setSessionConfig={setSessionConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
