
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgentSession } from '@/hooks/competitive-intelligence/useAgentSession';
import { useEnhancedAgentChat } from '@/hooks/competitive-intelligence/useEnhancedAgentChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingMessage } from './LoadingMessage';
import { RealTimeSearchStatus } from './RealTimeSearchStatus';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EnhancedAgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function EnhancedAgentChat({ agentId, sessionConfig }: EnhancedAgentChatProps) {
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
    retrySearch,
    searchData, 
    searchError,
    canRetry
  } = useEnhancedAgentChat(agentId, localConfig);

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

  const handleRetrySearch = async () => {
    await retrySearch();
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
        <ChatHeader agentId={agentId} sessionConfig={localConfig} />
        <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-4 max-w-md">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">Configuración Rápida</h3>
            <p className="text-muted-foreground">
              Para comenzar a chatear con el agente de inteligencia competitiva, 
              configura los parámetros de sesión para obtener datos reales del mercado.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleQuickSetup}>
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
        <ChatHeader agentId={agentId} sessionConfig={localConfig} />
        <CardContent className="flex-1 flex flex-col space-y-4 p-6">
          <h3 className="text-lg font-semibold">Configuración de Sesión</h3>
          
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
              Comenzar Chat
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
      <ChatHeader agentId={agentId} sessionConfig={localConfig} />

      {/* Real-time Intelligence Status */}
      <div className="px-4 py-2 border-b">
        <RealTimeSearchStatus
          searchData={searchData}
          searchError={searchError}
          isSearching={isLoading}
          onRetry={handleRetrySearch}
        />
      </div>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Error Recovery */}
        {hasErrorMessages && canRetry && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Hubo un error en la conversación. Puedes intentar de nuevo.</span>
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
            
            {isLoading && <LoadingMessage />}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!sessionId}
        />
      </CardContent>
    </Card>
  );
}
