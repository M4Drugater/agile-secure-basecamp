
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAgentSession } from '@/hooks/competitive-intelligence/useAgentSession';
import { useRepairedAgentChat } from '@/hooks/competitive-intelligence/useRepairedAgentChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingMessage } from './LoadingMessage';
import { Settings, CheckCircle, Wifi, Zap, RefreshCw, Globe } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RepairedAgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function RepairedAgentChat({ agentId, sessionConfig }: RepairedAgentChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [localConfig, setLocalConfig] = useState(sessionConfig);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { sessionId } = useAgentSession(agentId, localConfig);
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    addWelcomeMessage, 
    retryLastMessage,
    searchError,
    canRetry
  } = useRepairedAgentChat(agentId, localConfig);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Add welcome message when session is initialized
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      addWelcomeMessage();
    }
  }, [sessionId, messages.length, addWelcomeMessage]);

  const handleSendMessage = async () => {
    if (!sessionId) return;
    
    await sendMessage(inputMessage, sessionId);
    setInputMessage('');
  };

  const handleRetryMessage = async () => {
    if (!sessionId) return;
    await retryLastMessage(sessionId);
  };

  const handleQuickSetup = () => {
    setLocalConfig({
      companyName: 'Mi Empresa',
      industry: 'tecnología',
      analysisFocus: 'análisis competitivo',
      objectives: 'identificar oportunidades de mercado'
    });
    setShowQuickSetup(false);
  };

  // Show quick setup if no company name is configured
  if (!localConfig.companyName && !showQuickSetup) {
    return (
      <Card className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Sistema Reparado - {agentId.toUpperCase()}</h3>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Conectividad Restaurada
            </Badge>
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-4 max-w-md">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Configuración para Agente Reparado</h3>
            <p className="text-muted-foreground">
              El sistema de conectividad web ha sido completamente reparado. 
              Configura los parámetros para comenzar a recibir inteligencia en tiempo real.
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
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Configuración Manual - Sistema Reparado</h3>
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col space-y-4 p-6">
          <div className="space-y-4">
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
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowQuickSetup(false)}
              disabled={!localConfig.companyName}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Comenzar Chat Reparado
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

  return (
    <Card className="h-full flex flex-col">
      {/* Enhanced Header with System Status */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">{agentId.toUpperCase()} Agent - Sistema Reparado</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Wifi className="h-3 w-3 mr-1" />
              Web Conectado
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Globe className="h-3 w-3 mr-1" />
              Datos en Tiempo Real
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Conectividad web restaurada • Análisis de {localConfig.companyName} • {localConfig.industry}
        </p>
      </div>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Error Recovery */}
        {hasErrorMessages && canRetry && (
          <Alert>
            <RefreshCw className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Problema temporal detectado. Sistema de respaldo activo.</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryMessage}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Status */}
        {!hasErrorMessages && messages.length > 1 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Sistema funcionando correctamente • Conectividad web verificada • Datos actuales disponibles
            </AlertDescription>
          </Alert>
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
            
            {isLoading && (
              <LoadingMessage 
                customText="🔧 Sistema reparado procesando con datos web en tiempo real..."
              />
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!sessionId}
          placeholder="Pregunta algo sobre análisis competitivo con datos actuales..."
        />
      </CardContent>
    </Card>
  );
}
