
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedAISystem } from '@/hooks/useUnifiedAISystem';
import { useRepairedAgentSystem } from '@/hooks/competitive-intelligence/useRepairedAgentSystem';
import { toast } from 'sonner';

interface ConsolidatedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    cost?: number;
    hasValidWebData?: boolean;
    validationScore?: number;
    webSources?: string[];
  };
  hasError?: boolean;
  canRetry?: boolean;
}

interface ConsolidatedSessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

export function useConsolidatedAgentSystem(agentId: string, sessionConfig: ConsolidatedSessionConfig) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ConsolidatedMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { sendUnifiedRequest } = useUnifiedAISystem();
  
  // Use repaired system for competitive intelligence agents
  const { 
    messages: ciMessages, 
    isProcessing: ciProcessing, 
    processMessage: ciProcessMessage,
    retryLastMessage: ciRetryMessage,
    canRetry: ciCanRetry
  } = useRepairedAgentSystem(agentId, sessionConfig);

  // Initialize session
  const initializeSession = async () => {
    if (!user) return;
    
    const newSessionId = `${agentId}-${user.id}-${Date.now()}`;
    setSessionId(newSessionId);
    
    // Add welcome message
    const welcomeMessage: ConsolidatedMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: getWelcomeMessage(agentId, sessionConfig),
      timestamp: new Date(),
      agentType: agentId
    };
    
    setMessages([welcomeMessage]);
  };

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim() || isProcessing || !sessionId) return;

    const userMessage: ConsolidatedMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Route to appropriate agent system
      if (['cdv', 'cir', 'cia'].includes(agentId)) {
        // Use competitive intelligence system
        await ciProcessMessage(userInput, sessionId);
        return;
      }

      // Use unified system for other agents
      const response = await sendUnifiedRequest({
        message: userInput,
        agentType: agentId as any,
        currentPage: '/agents',
        sessionConfig,
        searchEnabled: agentId === 'research-engine',
        model: 'gpt-4o-mini'
      });

      const assistantMessage: ConsolidatedMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        agentType: agentId,
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed,
          cost: parseFloat(response.cost),
          hasValidWebData: response.hasWebData,
          webSources: response.webSources
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error in consolidated agent system:', error);
      
      const errorMessage: ConsolidatedMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: true
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('Agent Error', { description: 'Please try again' });
    } finally {
      setIsProcessing(false);
    }
  };

  const retryLastMessage = async () => {
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (lastUserMessage && sessionId) {
      setMessages(prev => prev.filter(msg => !msg.hasError));
      await sendMessage(lastUserMessage.content);
    }
  };

  // Sync CI messages with consolidated messages
  const consolidatedMessages = ['cdv', 'cir', 'cia'].includes(agentId) 
    ? ciMessages.map(msg => ({
        ...msg,
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        agentType: msg.agentType,
        metadata: msg.metadata,
        hasError: msg.hasError,
        canRetry: msg.canRetry
      } as ConsolidatedMessage))
    : messages;

  const consolidatedIsProcessing = ['cdv', 'cir', 'cia'].includes(agentId) 
    ? ciProcessing 
    : isProcessing;

  return {
    messages: consolidatedMessages,
    isProcessing: consolidatedIsProcessing,
    sessionId,
    initializeSession,
    sendMessage: ['cdv', 'cir', 'cia'].includes(agentId) ? 
      (msg: string) => ciProcessMessage(msg, sessionId!) : 
      sendMessage,
    retryLastMessage: ['cdv', 'cir', 'cia'].includes(agentId) ? 
      () => ciRetryMessage(sessionId!) : 
      retryLastMessage,
    canRetry: ['cdv', 'cir', 'cia'].includes(agentId) ? ciCanRetry : true
  };
}

function getWelcomeMessage(agentId: string, sessionConfig: ConsolidatedSessionConfig): string {
  const agentMessages = {
    'enhanced-content-generator': `🎯 **Enhanced Content Generator**

Soy tu sistema avanzado de generación de contenido ejecutivo. Puedo crear:
• Contenido estratégico de nivel C-suite
• Documentos profesionales y presentaciones
• Análisis de mercado y competitive intelligence
• Propuestas y planes de negocio

¿Qué tipo de contenido necesitas crear hoy?`,

    'clipogino': `🧠 **CLIPOGINO - Tu Mentor Profesional**

¡Hola! Soy CLIPOGINO, tu mentor de desarrollo profesional impulsado por IA.

Estoy aquí para ayudarte con:
• Orientación profesional y planificación de carrera
• Desarrollo de habilidades y competencias
• Estrategias de liderazgo y gestión
• Insights de industria y tendencias

¿En qué área de tu desarrollo profesional te gustaría trabajar?`,

    'research-engine': `🔍 **Elite Research Engine**

Sistema de investigación avanzada con inteligencia estratégica activado.

Capacidades disponibles:
• Investigación de mercado comprehensiva
• Análisis profundo de industrias
• Investigación competitiva
• Análisis de tendencias y forecasting

¿Qué investigación estratégica necesitas realizar?`,

    'cdv': `👁️ **CDV Agent - Competitor Discovery & Validation**

Sistema reparado activado con datos web garantizados.

Especializado en:
• Descubrimiento de competidores
• Validación de amenazas competitivas
• Análisis de posicionamiento de mercado
• Identificación de oportunidades estratégicas

Configuración actual: ${sessionConfig.companyName} en ${sessionConfig.industry}

¿Qué análisis competitivo necesitas?`,

    'cir': `📊 **CIR Agent - Competitive Intelligence Retriever**

Sistema de inteligencia de datos con conectividad web reparada.

Especializado en:
• Estimación de domain authority
• Análisis de tráfico web
• Métricas de redes sociales
• Evaluación de tamaño de equipos

Para ${sessionConfig.companyName} - ${sessionConfig.industry}

¿Qué métricas competitivas necesitas analizar?`,

    'cia': `🎯 **CIA Agent - Competitive Intelligence Analysis**

Sistema de análisis estratégico de nivel ejecutivo activado.

Especializado en:
• Evaluación estratégica de amenazas
• Análisis de oportunidades de mercado
• Perfilado de competidores
• Análisis SWOT y evaluación de riesgo

Contexto: ${sessionConfig.companyName} en ${sessionConfig.industry}

¿Qué análisis estratégico requieres?`
  };

  return agentMessages[agentId as keyof typeof agentMessages] || 
         `Agente ${agentId.toUpperCase()} activado. ¿En qué puedo ayudarte?`;
}
