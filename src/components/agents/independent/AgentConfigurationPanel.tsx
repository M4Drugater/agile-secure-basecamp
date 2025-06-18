
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

interface AgentConfigurationPanelProps {
  sessionConfig: SessionConfig;
  setSessionConfig: React.Dispatch<React.SetStateAction<SessionConfig>>;
  agentType: string;
}

export function AgentConfigurationPanel({ 
  sessionConfig, 
  setSessionConfig, 
  agentType 
}: AgentConfigurationPanelProps) {
  
  const getConfigurationFields = () => {
    switch (agentType) {
      case 'mentor':
        return {
          title: 'Configuración de Mentoría',
          fields: [
            { key: 'companyName', label: 'Empresa/Posición Actual', placeholder: 'Ej: Senior Manager en Microsoft' },
            { key: 'industry', label: 'Industria/Sector', placeholder: 'Ej: Tecnología, Consultoría, Finanzas' },
            { key: 'analysisFocus', label: 'Área de Desarrollo', placeholder: 'Ej: Liderazgo, Estrategia, Career Growth' },
            { key: 'objectives', label: 'Objetivos Profesionales', placeholder: 'Ej: Ascender a VP en 2 años, mejorar skills técnicos' }
          ]
        };
      case 'content':
        return {
          title: 'Configuración de Contenido',
          fields: [
            { key: 'companyName', label: 'Marca/Empresa', placeholder: 'Ej: Tu empresa o marca personal' },
            { key: 'industry', label: 'Industria/Nicho', placeholder: 'Ej: SaaS, Marketing, E-commerce' },
            { key: 'analysisFocus', label: 'Tipo de Contenido', placeholder: 'Ej: LinkedIn posts, Blog articles, Email campaigns' },
            { key: 'objectives', label: 'Objetivos de Contenido', placeholder: 'Ej: Generar leads, brand awareness, thought leadership' }
          ]
        };
      case 'research':
        return {
          title: 'Configuración de Investigación',
          fields: [
            { key: 'companyName', label: 'Empresa/Proyecto', placeholder: 'Ej: Empresa que investigar o proyecto' },
            { key: 'industry', label: 'Sector/Mercado', placeholder: 'Ej: FinTech, HealthTech, Retail' },
            { key: 'analysisFocus', label: 'Tipo de Research', placeholder: 'Ej: Market analysis, Competitor research, Trend analysis' },
            { key: 'objectives', label: 'Objetivos de Investigación', placeholder: 'Ej: Due diligence, market entry, competitive analysis' }
          ]
        };
      case 'competitive-intelligence':
        return {
          title: 'Configuración de Intelligence',
          fields: [
            { key: 'companyName', label: 'Empresa a Analizar', placeholder: 'Ej: Empresa objetivo del análisis' },
            { key: 'industry', label: 'Sector/Industria', placeholder: 'Ej: SaaS, E-commerce, Healthcare' },
            { key: 'analysisFocus', label: 'Foco del Análisis', placeholder: 'Ej: Competitive positioning, threat assessment, market gaps' },
            { key: 'objectives', label: 'Objetivos de Intelligence', placeholder: 'Ej: Identificar amenazas, oportunidades, estrategias competitivas' }
          ]
        };
      default:
        return {
          title: 'Configuración General',
          fields: [
            { key: 'companyName', label: 'Empresa/Contexto', placeholder: 'Contexto empresarial' },
            { key: 'industry', label: 'Industria', placeholder: 'Sector de actividad' },
            { key: 'analysisFocus', label: 'Foco de Análisis', placeholder: 'Área de enfoque' },
            { key: 'objectives', label: 'Objetivos', placeholder: 'Objetivos principales' }
          ]
        };
    }
  };

  const config = getConfigurationFields();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {config.title}
        </CardTitle>
        <CardDescription>
          Configura el contexto específico para optimizar las respuestas del agente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.slice(0, 2).map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                value={sessionConfig[field.key]}
                onChange={(e) => setSessionConfig(prev => ({ 
                  ...prev, 
                  [field.key]: e.target.value 
                }))}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={config.fields[2].key}>{config.fields[2].label}</Label>
          <Input
            id={config.fields[2].key}
            value={sessionConfig[config.fields[2].key]}
            onChange={(e) => setSessionConfig(prev => ({ 
              ...prev, 
              [config.fields[2].key]: e.target.value 
            }))}
            placeholder={config.fields[2].placeholder}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={config.fields[3].key}>{config.fields[3].label}</Label>
          <Textarea
            id={config.fields[3].key}
            value={sessionConfig[config.fields[3].key]}
            onChange={(e) => setSessionConfig(prev => ({ 
              ...prev, 
              [config.fields[3].key]: e.target.value 
            }))}
            placeholder={config.fields[3].placeholder}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
