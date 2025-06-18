
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Zap, Search, Eye, Brain, Activity, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IndividualAgentChat } from './IndividualAgentChat';
import { AgentConfigurationPanel } from './AgentConfigurationPanel';

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  type: string;
  systemPrompt: string;
}

interface IndividualAgentInterfaceProps {
  agentConfig: AgentConfig;
}

const agentIcons = {
  'clipogino': MessageSquare,
  'enhanced-content-generator': Zap,
  'research-engine': Search,
  'cdv': Eye,
  'cia': Brain,
  'cir': Activity
};

const agentColors = {
  'clipogino': 'bg-blue-500',
  'enhanced-content-generator': 'bg-purple-500',
  'research-engine': 'bg-indigo-500',
  'cdv': 'bg-green-500',
  'cia': 'bg-red-500',
  'cir': 'bg-orange-500'
};

export function IndividualAgentInterface({ agentConfig }: IndividualAgentInterfaceProps) {
  const navigate = useNavigate();
  const [showConfig, setShowConfig] = useState(false);
  const [sessionConfig, setSessionConfig] = useState({
    companyName: '',
    industry: '',
    analysisFocus: '',
    objectives: ''
  });

  const Icon = agentIcons[agentConfig.id] || MessageSquare;
  const colorClass = agentColors[agentConfig.id] || 'bg-blue-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Agentes
          </Button>
          
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agentConfig.name}</h1>
              <p className="text-muted-foreground">{agentConfig.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            ✅ Sistema Tripartite
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            🚀 Modo Independiente
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {showConfig ? 'Ocultar Config' : 'Configuración'}
          </Button>
        </div>
      </div>

      {/* Agent Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Agente Independiente Activo
          </CardTitle>
          <CardDescription>
            Este agente opera con autonomía completa y acceso directo al sistema tripartite (OpenAI → Perplexity → Claude) 
            para proporcionar el máximo nivel de especialización y capacidades.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuration Panel */}
      {showConfig && (
        <AgentConfigurationPanel 
          sessionConfig={sessionConfig}
          setSessionConfig={setSessionConfig}
          agentType={agentConfig.type}
        />
      )}

      {/* Chat Interface */}
      <IndividualAgentChat 
        agentConfig={agentConfig}
        sessionConfig={sessionConfig}
      />
    </div>
  );
}
