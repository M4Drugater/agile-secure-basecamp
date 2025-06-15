
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
  Clock
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

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

  const startSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(new Date());
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
                Collaborative Session
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedAgents.length} agents working together
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
              >
                {isSessionActive ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause Session
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Session
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
        </CardContent>
      </Card>

      {/* Session Interface */}
      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="coordination" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Coordination
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Agent Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Collaborative Chat Interface</h3>
                <p className="text-muted-foreground">
                  Chat with multiple agents simultaneously for comprehensive analysis
                </p>
                {!isSessionActive && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Start the session to begin chatting with your selected agents
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Collaborative Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Cross-Agent Analysis</h3>
                <p className="text-muted-foreground">
                  View combined insights and analysis from all active agents
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coordination">
          <Card>
            <CardHeader>
              <CardTitle>Agent Coordination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Agent Coordination Panel</h3>
                <p className="text-muted-foreground">
                  Manage how agents work together and share information
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Collaborative Settings</h3>
                <p className="text-muted-foreground">
                  Configure how agents collaborate and share context
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
