
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Brain, Globe, Zap } from 'lucide-react';
import { useUnifiedAISystem } from '@/hooks/useUnifiedAISystem';

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  type: string;
  systemPrompt: string;
}

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    cost?: string;
    hasWebData?: boolean;
    webSources?: string[];
    contextQuality?: string;
    tripartiteFlow?: boolean;
  };
}

interface IndividualAgentChatProps {
  agentConfig: AgentConfig;
  sessionConfig: SessionConfig;
}

export function IndividualAgentChat({ agentConfig, sessionConfig }: IndividualAgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { isProcessing, sendUnifiedRequest } = useUnifiedAISystem();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `¡Bienvenido al ${agentConfig.name} en modo independiente! 🚀

Ahora tienes acceso completo y directo a mis capacidades especializadas con el sistema tripartite completo:

✨ **Metodología Tripartite Activa**: OpenAI → Perplexity → Claude
🎯 **Especialización Completa**: Acceso directo a todas mis capacidades específicas
🌐 **Investigación Web en Vivo**: Datos actualizados para cada análisis
🧠 **Autonomía Total**: Sin limitaciones de otros sistemas

Como ${agentConfig.name} independiente, puedo proporcionarte análisis y resultados de máxima calidad en mi área de especialización. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
      metadata: {
        tripartiteFlow: true,
        contextQuality: 'elite'
      }
    };
    setMessages([welcomeMessage]);
  }, [agentConfig]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Convert agent ID to valid agent type
  const getValidAgentType = (agentId: string) => {
    const agentTypeMap = {
      'clipogino': 'clipogino',
      'enhanced-content-generator': 'enhanced-content-generator',
      'research-engine': 'research-engine',
      'cdv': 'cdv',
      'cia': 'cia',
      'cir': 'cir'
    };
    return agentTypeMap[agentId] || 'clipogino';
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendUnifiedRequest({
        message: input.trim(),
        agentType: getValidAgentType(agentConfig.id),
        currentPage: `/agents/${agentConfig.id}`,
        searchEnabled: true,
        useTripartiteFlow: true,
        systemPrompt: agentConfig.systemPrompt,
        sessionConfig
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed,
          cost: response.cost,
          hasWebData: response.hasWebData,
          webSources: response.webSources,
          contextQuality: response.contextQuality,
          tripartiteFlow: true
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error in individual agent chat:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Lo siento, hubo un error al procesar tu mensaje. Como agente independiente, estoy reestableciendo las conexiones automáticamente. Puedes intentar de nuevo.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Chat Area */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Chat con {agentConfig.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  Tripartite
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  Web Live
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      
                      {message.metadata && message.role === 'assistant' && (
                        <div className="mt-2 pt-2 border-t border-gray-200 flex flex-wrap gap-1">
                          {message.metadata.tripartiteFlow && (
                            <Badge variant="outline" className="text-xs">
                              <Zap className="h-2 w-2 mr-1" />
                              Tripartite
                            </Badge>
                          )}
                          {message.metadata.hasWebData && (
                            <Badge variant="outline" className="text-xs">
                              <Globe className="h-2 w-2 mr-1" />
                              Web Data
                            </Badge>
                          )}
                          {message.metadata.model && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.model}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">
                        {agentConfig.name} está procesando tu solicitud con metodología tripartite...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Escribe tu mensaje para ${agentConfig.name}...`}
                  className="min-h-[60px] resize-none"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isProcessing}
                  size="lg"
                  className="px-6"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar with agent info */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Estado del Agente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sistema Tripartite:</span>
                <Badge className="bg-green-100 text-green-700">Activo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Búsqueda Web:</span>
                <Badge className="bg-blue-100 text-blue-700">Habilitada</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Modo:</span>
                <Badge className="bg-purple-100 text-purple-700">Independiente</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Especialización:</h4>
              <p className="text-xs text-muted-foreground">
                {agentConfig.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Flujo Tripartite:</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>OpenAI GPT-4</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Perplexity AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Claude Sonnet</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
