
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Sparkles, 
  Globe, 
  Brain,
  User,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Zap,
  RefreshCw,
  Send,
  Bot,
  Search,
  FileText,
  BarChart3
} from 'lucide-react';
import { useUnifiedClipoginoChat } from '@/hooks/chat/useUnifiedClipoginoChat';
import { useLocation } from 'react-router-dom';
import { ChatMessage } from '@/components/competitive-intelligence/ChatMessage';
import { LoadingMessage } from '@/components/competitive-intelligence/LoadingMessage';

interface UnifiedChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

function UnifiedChatInput({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading 
}: UnifiedChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Pregunta cualquier cosa... (Sistema unificado con todos los agentes IA especializados)"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <Button 
        onClick={onSendMessage} 
        disabled={!inputMessage.trim() || isLoading}
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-blue-600"
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

interface AgentCapabilityProps {
  agent: {
    name: string;
    icon: any;
    description: string;
    color: string;
  };
  onActivate: (agentName: string) => void;
}

function AgentCapability({ agent, onActivate }: AgentCapabilityProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onActivate(agent.name)}
      className="flex items-center gap-2 h-auto p-3 text-left justify-start"
    >
      <agent.icon className={`h-4 w-4 ${agent.color}`} />
      <div className="flex-1">
        <div className="font-medium text-sm">{agent.name}</div>
        <div className="text-xs text-muted-foreground truncate">{agent.description}</div>
      </div>
    </Button>
  );
}

export function UnifiedClipoginoInterface() {
  const location = useLocation();
  const [inputMessage, setInputMessage] = useState('');
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { 
    messages, 
    isLoading, 
    selectedModel, 
    setSelectedModel,
    webSearchEnabled,
    setWebSearchEnabled,
    sendMessage, 
    startNewConversation,
    contextSummary,
    hasProfileContext
  } = useUnifiedClipoginoChat();

  // Specialized agent capabilities
  const specializedAgents = [
    {
      name: 'Enhanced Content Generator',
      icon: FileText,
      description: 'Generación de contenido ejecutivo tripartite',
      color: 'text-purple-600'
    },
    {
      name: 'Elite Research Engine', 
      icon: Search,
      description: 'Investigación Fortune 500 con fuentes verificadas',
      color: 'text-blue-600'
    },
    {
      name: 'CDV - Competitor Discovery',
      icon: Target,
      description: 'Descubrimiento competitivo con validación',
      color: 'text-green-600'
    },
    {
      name: 'CIA - Competitive Intelligence',
      icon: BarChart3,
      description: 'Análisis estratégico de competencia',
      color: 'text-orange-600'
    },
    {
      name: 'CIR - Intelligence Retriever',
      icon: TrendingUp,
      description: 'Métricas competitivas y domain authority',
      color: 'text-red-600'
    }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    await sendMessage(inputMessage, location.pathname);
    setInputMessage('');
  };

  const handleAgentActivation = (agentName: string) => {
    const activationMessage = `Activa el modo "${agentName}" para esta conversación. Usa tu metodología tripartite especializada en ${agentName.toLowerCase()}.`;
    setInputMessage(activationMessage);
    setShowAgentPanel(false);
  };

  const getContextQualityColor = () => {
    const totalItems = (contextSummary?.knowledgeCount || 0) + (contextSummary?.contentCount || 0);
    if (totalItems >= 15) return 'bg-emerald-500';
    if (totalItems >= 8) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getContextQualityLabel = () => {
    const totalItems = (contextSummary?.knowledgeCount || 0) + (contextSummary?.contentCount || 0);
    if (totalItems >= 15) return 'Elite';
    if (totalItems >= 8) return 'Avanzado';
    return 'Desarrollando';
  };

  return (
    <div className="space-y-6">
      {/* Unified Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CLIPOGINO Sistema Unificado
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Award className="h-3 w-3 mr-1" />
              Unificado v3.0
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            IA estratégica unificada con todos los agentes especializados y sistema tripartite
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600">
            <Brain className="h-3 w-3" />
            Sistema Unificado
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Web Activa
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Bot className="h-3 w-3" />
            Todos los Agentes
          </Badge>
        </div>
      </div>

      {/* Unified Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Alert className="border-emerald-200 bg-emerald-50/50">
          <Target className="h-4 w-4 text-emerald-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Contexto: {getContextQualityLabel()}</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  {contextSummary?.knowledgeCount || 0} recursos, {contextSummary?.activityCount || 0} interacciones
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getContextQualityColor()}`}></div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-blue-200 bg-blue-50/50">
          <User className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div>
              <strong>Perfil: {hasProfileContext ? 'Conectado' : 'Básico'}</strong>
              <p className="text-sm text-muted-foreground mt-1">
                {hasProfileContext ? 'Acceso completo a tu información' : 'Completa tu perfil para mejor contexto'}
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-purple-200 bg-purple-50/50">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div>
              <strong>Agentes IA: 5 Especializados</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Sistema tripartite con capacidades especializadas unificadas
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Specialized Agents Panel */}
      {showAgentPanel && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader className="pb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              Agentes IA Especializados
            </h3>
            <p className="text-sm text-muted-foreground">
              Activa un agente especializado para obtener capacidades específicas con metodología tripartite
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {specializedAgents.map((agent) => (
                <AgentCapability
                  key={agent.name}
                  agent={agent}
                  onActivate={handleAgentActivation}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Chat Interface */}
      <Card className="h-[600px] flex flex-col border-2 border-gradient-to-r from-purple-200 to-blue-200">
        <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Sistema Unificado - Sesión Estratégica</span>
              
              {hasProfileContext && (
                <Badge variant="default" className="ml-2 bg-emerald-600">
                  <User className="h-3 w-3 mr-1" />
                  Perfil Activo
                </Badge>
              )}
              
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Brain className="h-3 w-3 mr-1" />
                Contexto Unificado
              </Badge>
              
              <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-700">
                <Zap className="h-3 w-3 mr-1" />
                Tripartite v3.0
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAgentPanel(!showAgentPanel)}
              >
                <Bot className="h-4 w-4 mr-1" />
                {showAgentPanel ? 'Ocultar' : 'Agentes'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={startNewConversation}
                disabled={isLoading}
              >
                Nueva Conversación
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <Crown className="h-16 w-16 text-yellow-500 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Sistema Unificado Activo</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Tu asesor estratégico con acceso completo a tu perfil, conocimiento personal,
                      búsqueda web en tiempo real y todos los agentes especializados unificados.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <Badge variant="secondary">Perfil Integrado</Badge>
                      <Badge variant="secondary">Conocimiento Personal</Badge>
                      <Badge variant="secondary">Web en Tiempo Real</Badge>
                      <Badge variant="secondary">5 Agentes Especializados</Badge>
                      <Badge variant="secondary">Sistema Tripartite</Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id || index} 
                  message={message}
                  showMetadata={true}
                />
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2">
                  <LoadingMessage />
                  <div className="text-xs text-muted-foreground">
                    Procesando con sistema unificado tripartite ({selectedModel})...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <UnifiedChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />

          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Modelo: {selectedModel}</span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Web: {webSearchEnabled ? 'Activa' : 'Inactiva'}
              </span>
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Contexto: {contextSummary?.quality || 'Estándar'}
              </span>
              <span className="flex items-center gap-1">
                <Bot className="h-3 w-3" />
                Agentes: Unificados
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
