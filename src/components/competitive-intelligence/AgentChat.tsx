
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgentSession } from '@/hooks/competitive-intelligence/useAgentSession';
import { useAgentChatMessages } from '@/hooks/competitive-intelligence/useAgentChatMessages';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingMessage } from './LoadingMessage';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface AgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function AgentChat({ agentId, sessionConfig }: AgentChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [localConfig, setLocalConfig] = useState(sessionConfig);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { sessionId } = useAgentSession(agentId, localConfig);
  const { messages, isLoading, sendMessage, addWelcomeMessage } = useAgentChatMessages(agentId, localConfig);

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
  }, [sessionId, messages.length]);

  const handleSendMessage = async () => {
    if (!sessionId) return;
    
    await sendMessage(inputMessage, sessionId);
    setInputMessage('');
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
              Para comenzar a chatear con el agente, puedes usar una configuración rápida 
              o configurar manualmente los parámetros de sesión.
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

  return (
    <Card className="h-full flex flex-col">
      <ChatHeader agentId={agentId} sessionConfig={localConfig} />

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
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
