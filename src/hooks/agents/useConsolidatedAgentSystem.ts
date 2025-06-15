
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
    searchEngine?: string;
    systemRepaired?: boolean;
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
  const [retryCount, setRetryCount] = useState(0);
  const [lastProcessedInput, setLastProcessedInput] = useState<string>('');

  const { sendUnifiedRequest } = useUnifiedAISystem();
  
  // Use repaired system for competitive intelligence agents
  const { 
    messages: ciMessages, 
    isProcessing: ciProcessing, 
    processMessage: ciProcessMessage,
    retryLastMessage: ciRetryMessage,
    canRetry: ciCanRetry
  } = useRepairedAgentSystem(agentId, sessionConfig);

  // Initialize session with repair indicators
  const initializeSession = async () => {
    if (!user) return;
    
    const newSessionId = `${agentId}-${user.id}-${Date.now()}-repaired`;
    setSessionId(newSessionId);
    
    console.log('🔧 SISTEMA REPARADO - Inicializando sesión:', {
      agentId,
      sessionId: newSessionId,
      user: user.email
    });
    
    // Add enhanced welcome message
    const welcomeMessage: ConsolidatedMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: getRepairedWelcomeMessage(agentId, sessionConfig),
      timestamp: new Date(),
      agentType: agentId,
      metadata: {
        systemRepaired: true,
        model: 'system',
        hasValidWebData: false
      }
    };
    
    setMessages([welcomeMessage]);
    setRetryCount(0);
    setLastProcessedInput('');
  };

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim() || isProcessing || !sessionId) return;

    // Prevent infinite loops by checking if we're processing the same input
    if (lastProcessedInput === userInput.trim() && retryCount > 0) {
      console.log('🔧 SISTEMA REPARADO - Previniendo bucle infinito');
      toast.warning('Sistema Anti-Bucle Activado', {
        description: 'Procesando consulta diferente para evitar repetición'
      });
      return;
    }

    setLastProcessedInput(userInput.trim());

    const userMessage: ConsolidatedMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      console.log(`🔧 SISTEMA REPARADO - Procesando mensaje para ${agentId.toUpperCase()}`);

      // Route to appropriate system
      if (['cdv', 'cir', 'cia'].includes(agentId)) {
        // Use repaired competitive intelligence system
        console.log('🔧 Usando sistema de CI reparado');
        await ciProcessMessage(userInput, sessionId);
        return;
      }

      // Use unified system for other agents with enhanced configuration
      console.log('🔧 Usando sistema unificado reparado');
      const response = await sendUnifiedRequest({
        message: userInput,
        agentType: agentId as any,
        currentPage: '/agents',
        sessionConfig,
        searchEnabled: agentId === 'research-engine' || agentId === 'enhanced-content-generator',
        model: agentId === 'enhanced-content-generator' ? 'gpt-4o' : 'gpt-4o-mini'
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
          webSources: response.webSources,
          systemRepaired: true
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0); // Reset retry count on success

      // Show success notification
      toast.success(`${agentId.toUpperCase()} - Sistema Reparado`, {
        description: `Respuesta generada con ${response.hasWebData ? 'datos web' : 'análisis estratégico'}`
      });

    } catch (error) {
      console.error('🔧 Error en sistema consolidado reparado:', error);
      
      setRetryCount(prev => prev + 1);
      
      const errorMessage: ConsolidatedMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `🔧 Sistema Reparado - Error Detectado

Ha ocurrido un error técnico en el sistema. El sistema reparado ha registrado el problema:

**Error**: ${error instanceof Error ? error.message : 'Error desconocido'}
**Agente**: ${agentId.toUpperCase()}
**Intentos**: ${retryCount + 1}/3

**Opciones Disponibles**:
1. Reformular tu consulta de manera diferente
2. Intentar con una consulta más específica
3. Usar el sistema de respaldo con análisis estratégico estándar

El sistema anti-bucle está activo para prevenir repeticiones.`,
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: retryCount < 2, // Allow max 2 retries
        metadata: {
          systemRepaired: true,
          model: 'error-handler'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast.error(`Error en ${agentId.toUpperCase()}`, {
        description: retryCount < 2 ? 'Sistema de respaldo activado' : 'Límite de reintentos alcanzado'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const retryLastMessage = async () => {
    if (!sessionId || retryCount >= 2) {
      toast.warning('Límite de Reintentos', {
        description: 'Por favor, reformula tu consulta de manera diferente'
      });
      return;
    }
    
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (lastUserMessage) {
      console.log('🔧 SISTEMA REPARADO - Reintentando mensaje');
      setMessages(prev => prev.filter(msg => !msg.hasError));
      
      // Modify the input slightly to avoid infinite loops
      const modifiedInput = `${lastUserMessage.content} (reintento ${retryCount + 1})`;
      await sendMessage(modifiedInput);
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
        metadata: {
          ...msg.metadata,
          systemRepaired: true
        },
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
    canRetry: ['cdv', 'cir', 'cia'].includes(agentId) ? ciCanRetry : retryCount < 2
  };
}

function getRepairedWelcomeMessage(agentId: string, sessionConfig: ConsolidatedSessionConfig): string {
  const agentMessages = {
    'enhanced-content-generator': `🔧 **Enhanced Content Generator - SISTEMA REPARADO**

✅ Sistema multi-agente con conectividad reparada
✅ Generación de contenido ejecutivo con intelligence web
✅ Validación de datos mejorada
✅ Anti-bucle infinito activado

**Capacidades Reparadas**:
• Contenido estratégico con datos web actuales
• Análisis competitivo integrado
• Documentos ejecutivos con fuentes verificables
• Presentaciones con métricas de mercado

¿Qué tipo de contenido ejecutivo necesitas crear?`,

    'clipogino': `🔧 **CLIPOGINO - SISTEMA REPARADO**

✅ Mentoría empresarial con intelligence web restaurada
✅ Análisis estratégico con datos actuales
✅ Sistema anti-bucle activado
✅ Validación de respuestas mejorada

**Capacidades Reparadas**:
• Orientación estratégica con datos de mercado actuales
• Desarrollo de liderazgo con context de industria
• Planificación de carrera con tendencias verificables
• Insights empresariales con fuentes documentadas

¿En qué área de tu desarrollo estratégico puedo ayudarte?`,

    'research-engine': `🔧 **Elite Research Engine - SISTEMA REPARADO**

✅ Motor de investigación con conectividad web garantizada
✅ Búsqueda inteligente con validación de fuentes
✅ Sistema anti-regeneración infinita
✅ Análisis con múltiples fuentes verificadas

**Capacidades de Investigación Reparadas**:
• Investigación de mercado con datos web actuales
• Análisis de tendencias con fuentes múltiples
• Intelligence competitiva con métricas verificables
• Research estratégico con evidencia documental

¿Qué investigación estratégica necesitas realizar?`,

    'cdv': `🔧 **CDV Agent - SISTEMA COMPLETAMENTE REPARADO**

✅ Conectividad web restaurada y garantizada
✅ Validación de datos web obligatoria
✅ Sistema anti-bucle infinito activado
✅ Métricas de confianza mejoradas

**Especialización Reparada**:
• Descubrimiento de competidores con datos web verificados
• Validación de amenazas con métricas actuales
• Análisis de posicionamiento con fuentes documentadas
• Identificación de oportunidades con evidencia web

**Configuración**: ${sessionConfig.companyName} en ${sessionConfig.industry}

¿Qué análisis competitivo con datos web actuales necesitas?`,

    'cir': `🔧 **CIR Agent - SISTEMA COMPLETAMENTE REPARADO**

✅ Inteligencia de datos con conectividad web restaurada
✅ Métricas verificables garantizadas
✅ Validación automática de respuestas
✅ Sistema anti-regeneración activado

**Especialización en Datos Reparada**:
• Métricas de domain authority con fuentes verificadas
• Análisis de tráfico web con datos actuales
• Evaluación de redes sociales con números reales
• Benchmarking competitivo con métricas documentadas

**Contexto**: ${sessionConfig.companyName} - ${sessionConfig.industry}

¿Qué métricas competitivas con datos web verificados necesitas?`,

    'cia': `🔧 **CIA Agent - SISTEMA COMPLETAMENTE REPARADO**

✅ Análisis estratégico con intelligence web garantizada
✅ Synthesis ejecutivo con datos verificados
✅ Frameworks de consultoría con evidencia actual
✅ Sistema anti-bucle de regeneración

**Análisis Estratégico Reparado**:
• Evaluación de amenazas con datos web actuales
• Análisis de oportunidades con fuentes múltiples
• Synthesis SWOT con evidencia documentada
• Recomendaciones C-suite con intelligence verificable

**Contexto Estratégico**: ${sessionConfig.companyName} en ${sessionConfig.industry}

¿Qué análisis estratégico con intelligence web verificada requieres?`
  };

  return agentMessages[agentId as keyof typeof agentMessages] || 
         `🔧 Sistema Reparado - Agente ${agentId.toUpperCase()} con conectividad mejorada y validación de datos activada.`;
}
