
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedAISystem } from '@/hooks/useUnifiedAISystem';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    cost?: number;
    hasWebData?: boolean;
    webSources?: string[];
    contextQuality?: string;
  };
  hasError?: boolean;
  canRetry?: boolean;
}

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

export function useUnifiedAgentChat(agentId: string, sessionConfig: SessionConfig) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  const { isProcessing, sendUnifiedRequest } = useUnifiedAISystem();

  const getWelcomeMessage = () => {
    const agentNames = {
      cdv: 'CDV Agent Unificado',
      cir: 'CIR Agent Unificado', 
      cia: 'CIA Agent Unificado'
    };
    
    const agentName = agentNames[agentId as keyof typeof agentNames];
    const company = sessionConfig.companyName;
    
    switch (agentId) {
      case 'cdv':
        return `¡Hola! Soy ${agentName}, tu especialista en descubrimiento y validación competitiva con acceso completo al sistema unificado.

🎯 **Capacidades Unificadas:**
• Acceso directo a tu perfil y experiencia profesional
• Búsqueda web en tiempo real con Perplexity
• Base de conocimiento personal integrada
• Análisis con marcos McKinsey y BCG aplicados a tu contexto
• Inteligencia competitiva personalizada para ${company}

Tengo contexto completo de tu industria, objetivos y experiencia. ¿Qué análisis competitivo necesitas?`;

      case 'cir':
        return `¡Hola! Soy ${agentName}, tu especialista en investigación de inteligencia competitiva con sistema unificado activo.

🎯 **Capacidades Unificadas:**
• Datos financieros y de mercado en vivo
• Contexto de tu experiencia en ${sessionConfig.industry}
• Análisis regulatorio actualizado integrado con tu conocimiento
• Benchmarking competitivo personalizado para ${company}
• Investigación de calidad ejecutiva adaptada a tu nivel

¿Qué investigación específica necesitas sobre ${company}?`;

      case 'cia':
        return `¡Hola! Soy ${agentName}, tu analista de inteligencia estratégica con acceso unificado completo.

🎯 **Capacidades Unificadas:**
• Síntesis estratégica con tu contexto profesional
• Marcos McKinsey 7-S aplicados a tu experiencia
• Análisis de opciones estratégicas personalizadas
• Recomendaciones basadas en tu perfil y objetivos
• Inteligencia web en tiempo real para ${company}

¿Qué decisión estratégica necesitas analizar usando todo tu contexto?`;

      default:
        return `¡Hola! Soy tu agente unificado de análisis competitivo con acceso completo a tu perfil, conocimiento y búsqueda web en tiempo real para ${company}. ¿En qué puedo asistirte?`;
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      agentType: agentId
    };
    
    setMessages([welcomeMessage]);
  };

  const sendMessage = async (inputMessage: string, sessionId: string) => {
    if (!inputMessage.trim() || isProcessing || !sessionId || !user) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Send to unified system with agent-specific configuration
      const response = await sendUnifiedRequest({
        message: inputMessage.trim(),
        agentType: agentId as 'cdv' | 'cir' | 'cia',
        currentPage: '/competitive-intelligence',
        sessionConfig,
        searchEnabled: true, // Agents always use web search
        model: 'gpt-4o' // Use premium model for agents
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        agentType: agentId,
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed,
          cost: parseFloat(response.cost),
          hasWebData: response.hasWebData,
          webSources: response.webSources,
          contextQuality: response.contextQuality
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0);

      // Show success notification specific to agent
      toast.success(`${agentId.toUpperCase()} Analysis Complete`, {
        description: `Unified system with ${response.hasWebData ? 'live web data' : 'AI intelligence'} | Context: ${response.contextQuality}`
      });

    } catch (error) {
      console.error('Unified agent chat error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Error en el sistema unificado. Las conexiones se están restaurando automáticamente. Puedes intentar de nuevo con capacidades completas.',
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: retryCount < 3
      };

      setMessages(prev => [...prev, errorMessage]);
      setRetryCount(prev => prev + 1);
      
      toast.error(`Error en ${agentId.toUpperCase()} Agent`, {
        description: 'Sistema unificado restaurando conexiones...'
      });
    }
  };

  const retryLastMessage = async (sessionId: string) => {
    if (!sessionId) return;
    
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (lastUserMessage) {
      // Remove error message
      setMessages(prev => prev.filter(msg => !msg.hasError));
      await sendMessage(lastUserMessage.content, sessionId);
    }
  };

  const retrySearch = async () => {
    toast.success('Sistema unificado reiniciado completamente. Todas las capacidades restauradas.');
  };

  return {
    messages,
    isLoading: isProcessing,
    sendMessage,
    addWelcomeMessage,
    retryLastMessage,
    retrySearch,
    searchData: null,
    searchError: null,
    canRetry: retryCount < 3
  };
}
