
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Brain, 
  Users, 
  Clock, 
  Target,
  Save 
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface CollaborativeSettingsProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function CollaborativeSettings({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: CollaborativeSettingsProps) {
  const updateConfig = (key: string, value: any) => {
    setSessionConfig((prev: any) => ({
      ...prev,
      collaborative: {
        ...prev.collaborative,
        [key]: value
      }
    }));
  };

  const collaborativeConfig = sessionConfig.collaborative || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Colaboración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Orchestration Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <Label className="text-base font-medium">Orquestación</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orchestrator">Agente Orquestador</Label>
                <Select 
                  value={collaborativeConfig.orchestrator || 'clipogino'}
                  onValueChange={(value) => updateConfig('orchestrator', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar orquestador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clipogino">CLIPOGINO (Recomendado)</SelectItem>
                    <SelectItem value="auto">Automático por contexto</SelectItem>
                    <SelectItem value="none">Sin orquestador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="synthesis">Modo de Síntesis</Label>
                <Select 
                  value={collaborativeConfig.synthesisMode || 'comprehensive'}
                  onValueChange={(value) => updateConfig('synthesisMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Modo de síntesis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Síntesis Completa</SelectItem>
                    <SelectItem value="summary">Resumen Ejecutivo</SelectItem>
                    <SelectItem value="consensus">Solo Consensos</SelectItem>
                    <SelectItem value="none">Sin síntesis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Síntesis automática</Label>
                <p className="text-sm text-muted-foreground">
                  Generar síntesis automáticamente después de cada ronda
                </p>
              </div>
              <Switch 
                checked={collaborativeConfig.autoSynthesis !== false}
                onCheckedChange={(checked) => updateConfig('autoSynthesis', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Collaboration Flow */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Label className="text-base font-medium">Flujo de Colaboración</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Orden de Respuesta</Label>
                <Select 
                  value={collaborativeConfig.responseOrder || 'parallel'}
                  onValueChange={(value) => updateConfig('responseOrder', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Orden de respuesta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parallel">Paralelo (todos a la vez)</SelectItem>
                    <SelectItem value="sequential">Secuencial (uno tras otro)</SelectItem>
                    <SelectItem value="priority">Por prioridad</SelectItem>
                    <SelectItem value="expertise">Por expertise relevante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tiempo de respuesta por agente (segundos)</Label>
                <div className="px-3">
                  <Slider
                    value={[collaborativeConfig.responseTimeout || 10]}
                    onValueChange={([value]) => updateConfig('responseTimeout', value)}
                    max={30}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5s</span>
                    <span>{collaborativeConfig.responseTimeout || 10}s</span>
                    <span>30s</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compartir contexto entre agentes</Label>
                  <p className="text-sm text-muted-foreground">
                    Los agentes pueden ver las respuestas de otros
                  </p>
                </div>
                <Switch 
                  checked={collaborativeConfig.shareContext !== false}
                  onCheckedChange={(checked) => updateConfig('shareContext', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Session Objectives */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <Label className="text-base font-medium">Objetivos de la Sesión</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">Objetivos específicos</Label>
                <Textarea
                  id="objectives"
                  value={collaborativeConfig.objectives || ''}
                  onChange={(e) => updateConfig('objectives', e.target.value)}
                  placeholder="Describe los objetivos específicos de esta sesión colaborativa..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focus">Área de enfoque</Label>
                <Select 
                  value={collaborativeConfig.focusArea || 'general'}
                  onValueChange={(value) => updateConfig('focusArea', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Área de enfoque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Análisis general</SelectItem>
                    <SelectItem value="competitive">Inteligencia competitiva</SelectItem>
                    <SelectItem value="strategic">Planificación estratégica</SelectItem>
                    <SelectItem value="content">Creación de contenido</SelectItem>
                    <SelectItem value="research">Investigación de mercado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label className="text-base font-medium">Configuración Avanzada</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo debug</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostrar información técnica
                  </p>
                </div>
                <Switch 
                  checked={collaborativeConfig.debugMode || false}
                  onCheckedChange={(checked) => updateConfig('debugMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Logging detallado</Label>
                  <p className="text-sm text-muted-foreground">
                    Registrar toda la actividad
                  </p>
                </div>
                <Switch 
                  checked={collaborativeConfig.detailedLogging || false}
                  onCheckedChange={(checked) => updateConfig('detailedLogging', checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent Configuration Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Agentes en esta Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-10 h-10 ${agent.color} rounded-full flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
