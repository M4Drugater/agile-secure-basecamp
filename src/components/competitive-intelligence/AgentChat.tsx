
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle,
  Eye,
  Brain,
  Activity
} from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAgentPrompts } from '@/hooks/competitive-intelligence/useAgentPrompts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
}

interface AgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

const agentNames = {
  cdv: 'CDV Agent',
  cir: 'CIR Agent', 
  cia: 'CIA Agent'
};

const agentIcons = {
  cdv: Eye,
  cir: Activity,
  cia: Brain
};

export function AgentChat({ agentId, sessionConfig }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { supabase, user } = useSupabase();
  const { getSystemPrompt } = useAgentPrompts();

  const AgentIcon = agentIcons[agentId as keyof typeof agentIcons];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize session when configuration is ready
  useEffect(() => {
    if (sessionConfig.companyName && !sessionId) {
      initializeSession();
    }
  }, [sessionConfig, sessionId]);

  const initializeSession = async () => {
    if (!user || !supabase || !sessionConfig.companyName) return;

    try {
      const { data, error } = await supabase
        .from('competitive_intelligence_sessions')
        .insert({
          user_id: user.id,
          session_name: `${agentNames[agentId as keyof typeof agentNames]} - ${sessionConfig.companyName}`,
          agent_type: agentId,
          company_name: sessionConfig.companyName,
          industry: sessionConfig.industry,
          analysis_focus: sessionConfig.analysisFocus,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessionId(data.id);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        agentType: agentId
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const getWelcomeMessage = () => {
    const agentName = agentNames[agentId as keyof typeof agentNames];
    const company = sessionConfig.companyName;
    
    switch (agentId) {
      case 'cdv':
        return `¡Hola! Soy ${agentName}, tu especialista en descubrimiento y validación competitiva. Estoy listo para ayudarte a analizar ${company} y descubrir oportunidades estratégicas. ¿Por dónde te gustaría empezar?`;
      case 'cir':
        return `¡Hola! Soy ${agentName}, tu especialista en inteligencia de datos. Puedo proporcionarte métricas específicas y datos de mercado sobre ${company}. ¿Qué datos te interesan más?`;
      case 'cia':
        return `¡Hola! Soy ${agentName}, tu analista de inteligencia estratégica. Estoy aquí para ayudarte con análisis profundos sobre ${company} y el panorama competitivo. ¿Qué aspectos estratégicos quieres explorar?`;
      default:
        return `¡Hola! Estoy aquí para ayudarte con el análisis competitivo de ${company}. ¿En qué puedo asistirte?`;
    }
  };

  const buildUserContext = async () => {
    if (!user || !supabase) return '';

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Build context
      let context = `\n=== CONTEXTO DEL USUARIO ===\n`;
      
      if (profile) {
        context += `Profesión: ${profile.profession || 'No especificada'}\n`;
        context += `Industria: ${profile.industry || 'No especificada'}\n`;
        context += `Experiencia: ${profile.experience_level || 'No especificada'}\n`;
        context += `Objetivos: ${profile.career_goals || 'No especificados'}\n`;
      }

      context += `\n=== CONFIGURACIÓN DE ANÁLISIS ===\n`;
      context += `Empresa objetivo: ${sessionConfig.companyName}\n`;
      context += `Industria: ${sessionConfig.industry}\n`;
      context += `Enfoque: ${sessionConfig.analysisFocus}\n`;
      context += `Objetivos: ${sessionConfig.objectives}\n`;

      return context;
    } catch (error) {
      console.error('Error building context:', error);
      return '';
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build context
      const userContext = await buildUserContext();
      
      // Prepare messages for API
      const conversationMessages = [
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: inputMessage.trim()
        }
      ];

      // Add system prompt
      const systemPrompt = getSystemPrompt(agentId, userContext, sessionConfig);
      const apiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationMessages
      ];

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('competitive-intelligence-chat', {
        body: {
          messages: apiMessages,
          agentType: agentId,
          sessionConfig,
          userContext: {
            userId: user?.id,
            sessionId
          }
        }
      });

      if (error) throw error;

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        agentType: agentId
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        timestamp: new Date(),
        agentType: agentId
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!sessionConfig.companyName) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold mb-2">Configuración Requerida</h3>
              <p className="text-muted-foreground text-sm">
                Completa la configuración de sesión para comenzar a chatear con el agente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <AgentIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{agentNames[agentId as keyof typeof agentNames]}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {sessionConfig.companyName}
              </Badge>
              {sessionConfig.industry && (
                <Badge variant="outline" className="text-xs">
                  {sessionConfig.industry}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Analizando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Escribe tu mensaje..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
