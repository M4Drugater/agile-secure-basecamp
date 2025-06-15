
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Brain, 
  Users, 
  Clock, 
  Target,
  Save,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface EnhancedCollaborativeSettingsProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function EnhancedCollaborativeSettings({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: EnhancedCollaborativeSettingsProps) {
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
      {/* CLIPOGINO Orchestration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Configuración de Orquestación CLIPOGINO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estilo de Liderazgo</Label>
              <Select 
                value={collaborativeConfig.leadershipStyle || 'collaborative'}
                onValueChange={(value) => updateConfig('leadershipStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estilo de liderazgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collaborative">Colaborativo</SelectItem>
                  <SelectItem value="directive">Directivo</SelectItem>
                  <SelectItem value="facilitative">Facilitador</SelectItem>
                  <SelectItem value="adaptive">Adaptativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frecuencia de Síntesis</Label>
              <Select 
                value={collaborativeConfig.synthesisFrequency || 'after-each-round'}
                onValueChange={(value) => updateConfig('synthesisFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Frecuencia de síntesis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-time">Tiempo Real</SelectItem>
                  <SelectItem value="after-each-round">Después de cada ronda</SelectItem>
                  <SelectItem value="milestone-based">Por hitos</SelectItem>
                  <SelectItem value="on-demand">Bajo demanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nivel de Intervención de CLIPOGINO</Label>
            <div className="px-3">
              <Slider
                value={[collaborativeConfig.interventionLevel || 5]}
                onValueChange={([value]) => updateConfig('interventionLevel', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Mínima</span>
                <span>Nivel {collaborativeConfig.interventionLevel || 5}</span>
                <span>Máxima</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Análisis predictivo de conflictos</Label>
              <p className="text-sm text-muted-foreground">
                CLIPOGINO detecta y previene posibles conflictos entre agentes
              </p>
            </div>
            <Switch 
              checked={collaborativeConfig.conflictPrediction !== false}
              onCheckedChange={(checked) => updateConfig('conflictPrediction', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Agent Collaboration Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Matriz de Colaboración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Patrón de Interacción</Label>
            <Select 
              value={collaborativeConfig.interactionPattern || 'hub-and-spoke'}
              onValueChange={(value) => updateConfig('interactionPattern', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Patrón de interacción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hub-and-spoke">Hub Central (CLIPOGINO)</SelectItem>
                <SelectItem value="mesh">Malla Completa</SelectItem>
                <SelectItem value="sequential">Secuencial</SelectItem>
                <SelectItem value="expertise-based">Basado en Expertise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Umbral de Consenso (%)</Label>
            <div className="px-3">
              <Slider
                value={[collaborativeConfig.consensusThreshold || 75]}
                onValueChange={([value]) => updateConfig('consensusThreshold', value)}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>50%</span>
                <span>{collaborativeConfig.consensusThreshold || 75}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Validación cruzada</Label>
                <p className="text-sm text-muted-foreground">
                  Los agentes validan conclusiones de otros
                </p>
              </div>
              <Switch 
                checked={collaborativeConfig.crossValidation !== false}
                onCheckedChange={(checked) => updateConfig('crossValidation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Especialización dinámica</Label>
                <p className="text-sm text-muted-foreground">
                  Asignación automática por expertise
                </p>
              </div>
              <Switch 
                checked={collaborativeConfig.dynamicSpecialization !== false}
                onCheckedChange={(checked) => updateConfig('dynamicSpecialization', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance & Quality Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rendimiento y Calidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tiempo máximo por agente (segundos)</Label>
              <Input
                type="number"
                value={collaborativeConfig.maxResponseTime || 15}
                onChange={(e) => updateConfig('maxResponseTime', parseInt(e.target.value))}
                min={5}
                max={60}
              />
            </div>

            <div className="space-y-2">
              <Label>Iteraciones máximas</Label>
              <Input
                type="number"
                value={collaborativeConfig.maxIterations || 5}
                onChange={(e) => updateConfig('maxIterations', parseInt(e.target.value))}
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Umbral de Calidad (%)</Label>
            <div className="px-3">
              <Slider
                value={[collaborativeConfig.qualityThreshold || 80]}
                onValueChange={([value]) => updateConfig('qualityThreshold', value)}
                max={100}
                min={60}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>60%</span>
                <span>{collaborativeConfig.qualityThreshold || 80}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Optimización automática</Label>
              <p className="text-sm text-muted-foreground">
                Ajustar parámetros basado en rendimiento
              </p>
            </div>
            <Switch 
              checked={collaborativeConfig.autoOptimization || false}
              onCheckedChange={(checked) => updateConfig('autoOptimization', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Contexto de la Sesión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionObjective">Objetivo Principal</Label>
            <Textarea
              id="sessionObjective"
              value={collaborativeConfig.sessionObjective || ''}
              onChange={(e) => updateConfig('sessionObjective', e.target.value)}
              placeholder="Describe el objetivo principal de esta sesión colaborativa..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="successCriteria">Criterios de Éxito</Label>
            <Textarea
              id="successCriteria"
              value={collaborativeConfig.successCriteria || ''}
              onChange={(e) => updateConfig('successCriteria', e.target.value)}
              placeholder="Define qué constituye el éxito en esta sesión..."
              className="min-h-[60px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad de Sesión</Label>
              <Select 
                value={collaborativeConfig.sessionPriority || 'medium'}
                onValueChange={(value) => updateConfig('sessionPriority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duración Estimada</Label>
              <Select 
                value={collaborativeConfig.estimatedDuration || '30-60min'}
                onValueChange={(value) => updateConfig('estimatedDuration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15-30min">15-30 minutos</SelectItem>
                  <SelectItem value="30-60min">30-60 minutos</SelectItem>
                  <SelectItem value="1-2hours">1-2 horas</SelectItem>
                  <SelectItem value="2plus-hours">2+ horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Configuration */}
      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
