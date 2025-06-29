import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Shield, 
  AlertTriangle, 
  RefreshCw, 
  Settings,
  Zap,
  Bot,
  Clock,
  Target,
  Globe
} from 'lucide-react';
import { useConsolidatedAgentSystem } from '@/hooks/agents/useConsolidatedAgentSystem';
import { ChatMessage } from '@/components/competitive-intelligence/ChatMessage';
import { ChatInput } from '@/components/competitive-intelligence/ChatInput';
import { LoadingMessage } from '@/components/competitive-intelligence/LoadingMessage';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface ConsolidatedAgentChatProps {
  selectedAgent: AgentConfig;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
  onUpdateConfig?: (config: any) => void;
}

export function ConsolidatedAgentChat({ 
  selectedAgent, 
  sessionConfig, 
  onUpdateConfig 
}: ConsolidatedAgentChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [localConfig, setLocalConfig] = useState(sessionConfig);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isProcessing,
    sessionId,
    initializeSession,
    sendMessage,
    retryLastMessage,
    canRetry
  } = useConsolidatedAgentSystem(selectedAgent.id, localConfig);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize session when agent or config changes
  useEffect(() => {
    if (selectedAgent && (localConfig.companyName || !requiresConfig(selectedAgent.id))) {
      initializeSession();
    }
  }, [selectedAgent.id, localConfig.companyName]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;
    
    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const requiresConfig = (agentId: string) => {
    return ['cdv', 'cir', 'cia'].includes(agentId);
  };

  const handleQuickSetup = () => {
    const quickConfig = {
      companyName: 'Mi Empresa',
      industry: 'tecnología',
      analysisFocus: 'análisis competitivo',
      objectives: 'identificar oportunidades de mercado'
    };
    
    setLocalConfig(quickConfig);
    onUpdateConfig?.(quickConfig);
    setShowQuickSetup(false);
  };

  const handleManualSetup = () => {
    if (localConfig.companyName) {
      onUpdateConfig?.(localConfig);
      setShowQuickSetup(false);
    }
  };

  // Show quick setup if configuration is required but missing
  if (requiresConfig(selectedAgent.id) && !localConfig.companyName && !showQuickSetup) {
    return (
      <Card className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <selectedAgent.icon className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">{selectedAgent.name}</h3>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Configuración Requerida
            </Badge>
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-4 max-w-md">
            <Settings className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="text-lg font-semibold">Configuración de Sesión</h3>
            <p className="text-muted-foreground">
              Este agente requiere configuración de empresa e industria para proporcionar 
              análisis personalizado y relevante.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleQuickSetup}>
              <Zap className="h-4 w-4 mr-2" />
              Configuración Rápida
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowQuickSetup(true)}
            >
              Configurar Manualmente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show manual configuration form
  if (showQuickSetup) {
    return (
      <Card className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <selectedAgent.icon className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Configuración Manual</h3>
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col space-y-4 p-6">
          <div>
            <label className="text-sm font-medium">Nombre de la Empresa</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={localConfig.companyName}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Ej: Mi Empresa Tech"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Industria</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={localConfig.industry}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="Ej: tecnología, finanzas, retail"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Enfoque de Análisis</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={localConfig.analysisFocus}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, analysisFocus: e.target.value }))}
              placeholder="Ej: análisis competitivo, investigación de mercado"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Objetivos</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              value={localConfig.objectives}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, objectives: e.target.value }))}
              placeholder="Ej: identificar oportunidades de mercado y amenazas competitivas"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleManualSetup}
              disabled={!localConfig.companyName}
            >
              <Bot className="h-4 w-4 mr-2" />
              Iniciar Chat
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowQuickSetup(false)}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasErrorMessages = messages.some(msg => msg.hasError);
  const lastMessage = messages[messages.length - 1];
  const tripartiteMetrics = lastMessage?.metadata?.tripartiteMetrics;
  const qualityScore = lastMessage?.metadata?.qualityScore || 0;
  const isTripartiteEnabled = lastMessage?.metadata?.tripartiteFlow;

  return (
    <Card className="h-full flex flex-col">
      {/* Enhanced Header with Tripartite Status */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <selectedAgent.icon className="h-5 w-5" style={{ color: selectedAgent.color.replace('bg-', '#') }} />
            <h3 className="font-semibold">{selectedAgent.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {isTripartiteEnabled && (
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                <Zap className="h-3 w-3 mr-1" />
                Tripartite Unified
              </Badge>
            )}
            {tripartiteMetrics && (
              <Badge variant="outline" className={
                qualityScore >= 0.8 ? 'text-green-600 border-green-600' :
                qualityScore >= 0.6 ? 'text-yellow-600 border-yellow-600' :
                'text-red-600 border-red-600'
              }>
                <Target className="h-3 w-3 mr-1" />
                Quality: {Math.round(qualityScore * 100)}%
              </Badge>
            )}
            {tripartiteMetrics?.webSources?.length > 0 && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Globe className="h-3 w-3 mr-1" />
                {tripartiteMetrics.webSources.length} Sources
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedAgent.description}
          {localConfig.companyName && ` • ${localConfig.companyName} • ${localConfig.industry}`}
        </p>
        
        {/* Tripartite Flow Indicator */}
        {isTripartiteEnabled && (
          <div className="flex items-center gap-1 mt-2 text-xs text-purple-600">
            <CheckCircle className="h-3 w-3" />
            <span>OpenAI</span>
            <span>→</span>
            <CheckCircle className="h-3 w-3" />
            <span>Perplexity</span>
            <span>→</span>
            <CheckCircle className="h-3 w-3" />
            <span>Claude</span>
          </div>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Enhanced Status Alerts */}
        {isTripartiteEnabled && qualityScore >= 0.8 && (
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Sistema Tripartite funcionando óptimamente - Calidad: {Math.round(qualityScore * 100)}%
            </AlertDescription>
          </Alert>
        )}

        {isTripartiteEnabled && qualityScore > 0 && qualityScore < 0.8 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              ⚠️ Flujo tripartite parcial - Calidad: {Math.round(qualityScore * 100)}%
            </AlertDescription>
          </Alert>
        )}

        {hasErrorMessages && canRetry && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 flex items-center justify-between">
              <span>Error en sistema tripartite unificado</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryLastMessage}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Performance Metrics Display */}
        {tripartiteMetrics && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              OpenAI: {Math.round(tripartiteMetrics.stages?.openaiTime / 1000 || 0)}s
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              Perplexity: {Math.round(tripartiteMetrics.stages?.perplexityTime / 1000 || 0)}s
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              Claude: {Math.round(tripartiteMetrics.stages?.claudeTime / 1000 || 0)}s
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                showMetadata={true}
              />
            ))}
            
            {isProcessing && (
              <LoadingMessage 
                customText={`${selectedAgent.name} ejecutando flujo tripartite...`}
              />
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isProcessing}
          disabled={!sessionId}
          placeholder={`Chatea con ${selectedAgent.name} (Sistema Tripartite)...`}
        />
      </CardContent>
    </Card>
  );
}
