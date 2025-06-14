
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Play } from 'lucide-react';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

interface AgentConfigurationPanelProps {
  sessionConfig: SessionConfig;
  setSessionConfig: React.Dispatch<React.SetStateAction<SessionConfig>>;
}

export function AgentConfigurationPanel({ sessionConfig, setSessionConfig }: AgentConfigurationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuración de Sesión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="companyName">Empresa Objetivo</Label>
          <Input
            id="companyName"
            placeholder="Empresa a analizar"
            value={sessionConfig.companyName}
            onChange={(e) => setSessionConfig(prev => ({ ...prev, companyName: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="industry">Industria</Label>
          <Select value={sessionConfig.industry} onValueChange={(value) => 
            setSessionConfig(prev => ({ ...prev, industry: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona industria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Tecnología</SelectItem>
              <SelectItem value="finance">Finanzas</SelectItem>
              <SelectItem value="healthcare">Salud</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufactura</SelectItem>
              <SelectItem value="education">Educación</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="analysisFocus">Enfoque de Análisis</Label>
          <Select value={sessionConfig.analysisFocus} onValueChange={(value) => 
            setSessionConfig(prev => ({ ...prev, analysisFocus: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona enfoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market-share">Participación de Mercado</SelectItem>
              <SelectItem value="pricing">Estrategia de Precios</SelectItem>
              <SelectItem value="product-features">Características de Producto</SelectItem>
              <SelectItem value="marketing">Estrategia de Marketing</SelectItem>
              <SelectItem value="financial">Rendimiento Financiero</SelectItem>
              <SelectItem value="technology">Análisis Tecnológico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="objectives">Objetivos del Análisis</Label>
          <Textarea
            id="objectives"
            placeholder="¿Qué quieres lograr con este análisis?"
            value={sessionConfig.objectives}
            onChange={(e) => setSessionConfig(prev => ({ ...prev, objectives: e.target.value }))}
          />
        </div>

        <Button className="w-full" disabled={!sessionConfig.companyName}>
          <Play className="h-4 w-4 mr-2" />
          Iniciar Sesión de Análisis
        </Button>
      </CardContent>
    </Card>
  );
}
