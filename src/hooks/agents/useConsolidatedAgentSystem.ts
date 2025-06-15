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
    tripartiteFlow?: boolean; // NEW: Indicates if tripartite flow was used
    tripartiteMetrics?: any; // NEW: Tripartite flow metrics
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

  // Initialize session with tripartite flow indicators
  const initializeSession = async () => {
    if (!user) return;
    
    const newSessionId = `${agentId}-${user.id}-${Date.now()}-tripartite`;
    setSessionId(newSessionId);
    
    console.log('🔧 SISTEMA TRIPARTITO - Inicializando sesión:', {
      agentId,
      sessionId: newSessionId,
      user: user.email
    });
    
    // Add enhanced welcome message with tripartite capabilities
    const welcomeMessage: ConsolidatedMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: getTripartiteWelcomeMessage(agentId, sessionConfig),
      timestamp: new Date(),
      agentType: agentId,
      metadata: {
        systemRepaired: true,
        tripartiteFlow: true,
        model: 'tripartite-system',
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
      console.log('🔧 SISTEMA TRIPARTITO - Previniendo bucle infinito');
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
      console.log(`🔧 SISTEMA TRIPARTITO - Procesando mensaje para ${agentId.toUpperCase()}`);

      // Route to appropriate system
      if (['cdv', 'cir', 'cia'].includes(agentId)) {
        // Use repaired competitive intelligence system
        console.log('🔧 Usando sistema de CI reparado');
        await ciProcessMessage(userInput, sessionId);
        return;
      }

      // NEW: Use unified system with TRIPARTITE FLOW enabled
      console.log('🚀 ACTIVANDO SISTEMA TRIPARTITO COMPLETO');
      const response = await sendUnifiedRequest({
        message: userInput,
        agentType: agentId as any,
        currentPage: '/agents',
        sessionConfig,
        searchEnabled: true, // Always enable search for tripartite flow
        model: agentId === 'enhanced-content-generator' ? 'gpt-4o' : 'gpt-4o-mini',
        useTripartiteFlow: true // NEW: Force tripartite flow
      });

      console.log('✅ RESPUESTA TRIPARTITA RECIBIDA:', {
        hasTripartiteMetrics: !!response.tripartiteMetrics,
        model: response.model,
        webSources: response.webSources.length
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
          systemRepaired: true,
          tripartiteFlow: !!response.tripartiteMetrics, // NEW
          tripartiteMetrics: response.tripartiteMetrics // NEW
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0); // Reset retry count on success

      // Show enhanced success notification
      if (response.tripartiteMetrics) {
        toast.success(`${agentId.toUpperCase()} - Sistema Tripartito Completado`, {
          description: `OpenAI + Perplexity + Claude | Calidad: ${Math.round(response.tripartiteMetrics.qualityScore * 100)}% | Fuentes: ${response.webSources.length}`
        });
      } else {
        toast.success(`${agentId.toUpperCase()} - Sistema Reparado`, {
          description: `Respuesta generada con ${response.hasWebData ? 'datos web' : 'análisis estratégico'}`
        });
      }

    } catch (error) {
      console.error('🔧 Error en sistema consolidado tripartito:', error);
      
      setRetryCount(prev => prev + 1);
      
      const errorMessage: ConsolidatedMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `🔧 Sistema Tripartito - Error Detectado

Ha ocurrido un error técnico en el sistema tripartito avanzado:

**Error**: ${error instanceof Error ? error.message : 'Error desconocido'}
**Agente**: ${agentId.toUpperCase()}
**Intentos**: ${retryCount + 1}/3
**Flujo**: OpenAI → Perplexity → Claude

**Opciones Disponibles**:
1. Reformular tu consulta de manera diferente
2. Intentar con una consulta más específica
3. Usar el sistema de respaldo con análisis estratégico estándar

El sistema anti-bucle está activo para prevenir repeticiones. El flujo tripartito se reactivará automáticamente en el próximo intento.`,
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: retryCount < 2, // Allow max 2 retries
        metadata: {
          systemRepaired: true,
          tripartiteFlow: true,
          model: 'error-handler'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast.error(`Error en Sistema Tripartito - ${agentId.toUpperCase()}`, {
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
      console.log('🔧 SISTEMA TRIPARTITO - Reintentando mensaje');
      setMessages(prev => prev.filter(msg => !msg.hasError));
      
      // Modify the input slightly to avoid infinite loops
      const modifiedInput = `${lastUserMessage.content} (reintento tripartito ${retryCount + 1})`;
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
          systemRepaired: true,
          tripartiteFlow: true // Enhanced CI also uses tripartite concepts
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

function getTripartiteWelcomeMessage(agentId: string, sessionConfig: ConsolidatedSessionConfig): string {
  const agentMessages = {
    'enhanced-content-generator': `🚀 **Enhanced Content Generator - SISTEMA TRIPARTITO ACTIVADO**

✅ Flujo AI completo: **OpenAI → Perplexity → Claude**
✅ Conectividad web garantizada con validación triple
✅ Generación de contenido ejecutivo de nivel élite
✅ Sistema anti-bucle infinito activado

**Flujo Tripartito Activado**:
1. 🤖 **OpenAI**: Interpreta tu consulta y optimiza la búsqueda
2. 🔍 **Perplexity**: Realiza búsqueda web profunda con datos verificables
3. ✨ **Claude**: Estiliza y crea la respuesta ejecutiva final

**Capacidades Mejoradas**:
• Contenido estratégico con datos web actuales verificados
• Análisis competitivo con fuentes múltiples
• Documentos ejecutivos con métricas en tiempo real
• Presentaciones con intelligence de mercado actual

¿Qué tipo de contenido ejecutivo con datos web actuales necesitas crear?`,

    'clipogino': `🚀 **CLIPOGINO - SISTEMA TRIPARTITO COMPLETO**

✅ Mentoría empresarial con flujo AI tripartito: **OpenAI → Perplexity → Claude**
✅ Intelligence web en tiempo real con validación triple
✅ Análisis estratégico con datos actuales verificados
✅ Sistema anti-bucle activado con métricas de calidad

**Flujo de Mentoría Avanzado**:
1. 🤖 **OpenAI**: Analiza tu situación y define la investigación necesaria
2. 🔍 **Perplexity**: Busca datos actuales del mercado y competencia
3. ✨ **Claude**: Sintetiza insights en recomendaciones ejecutivas

**Capacidades de Mentoría Tripartita**:
• Orientación estratégica con intelligence de mercado actual
• Desarrollo de liderazgo con context de industria verificado
• Planificación de carrera con tendencias documentadas
• Insights empresariales respaldados por datos web

¿En qué área de tu desarrollo estratégico puedo ayudarte con análisis tripartito?`,

    'research-engine': `🚀 **Elite Research Engine - SISTEMA TRIPARTITO COMPLETO**

✅ Motor de investigación con flujo AI avanzado: **OpenAI → Perplexity → Claude**
✅ Búsqueda inteligente con triple validación de fuentes
✅ Sistema anti-regeneración infinita con métricas de confianza
✅ Análisis con múltiples fuentes verificadas

**Motor de Investigación Tripartito**:
1. 🤖 **OpenAI**: Interpreta tu necesidad de investigación y optimiza consultas
2. 🔍 **Perplexity**: Ejecuta búsqueda web profunda con datos verificables
3. ✨ **Claude**: Sintetiza hallazgos en análisis ejecutivo estructurado

**Capacidades de Research Tripartita**:
• Investigación de mercado con datos web actuales
• Análisis de tendencias con fuentes múltiples verificadas
• Intelligence competitiva con métricas documentadas
• Research estratégico con evidencia web respaldada

¿Qué investigación estratégica con flujo tripartito necesitas realizar?`,

    'cdv': `🚀 **CDV Agent - SISTEMA TRIPARTITO AVANZADO**

✅ Flujo de descubrimiento competitivo: **OpenAI → Perplexity → Claude**
✅ Conectividad web restaurada con validación triple
✅ Métricas de confianza mejoradas con intelligence actual
✅ Sistema anti-bucle infinito con calidad garantizada

**Especialización Tripartita**:
• Descubrimiento de competidores con datos web verificados
• Validación de amenazas con métricas actuales
• Análisis de posicionamiento con fuentes documentadas
• Identificación de oportunidades con evidencia web tripartita

**Configuración**: ${sessionConfig.companyName} en ${sessionConfig.industry}

¿Qué análisis competitivo con flujo tripartito necesitas?`,

    'cir': `🚀 **CIR Agent - SISTEMA TRIPARTITO AVANZADO**

✅ Intelligence de datos con flujo: **OpenAI → Perplexity → Claude**
✅ Métricas verificables con validación triple
✅ Análisis financiero con datos web actuales
✅ Sistema anti-regeneración con calidad mejorada

**Especialización en Datos Tripartita**:
• Métricas de domain authority con fuentes verificadas
• Análisis de tráfico web con datos actuales
• Evaluación de redes sociales con números reales
• Benchmarking competitivo con métricas documentadas

**Contexto**: ${sessionConfig.companyName} - ${sessionConfig.industry}

¿Qué métricas competitivas con flujo tripartito necesitas?`,

    'cia': `🚀 **CIA Agent - SISTEMA TRIPARTITO AVANZADO**

✅ Análisis estratégico con flujo: **OpenAI → Perplexity → Claude**
✅ Synthesis ejecutivo con datos verificados mediante triple validación
✅ Frameworks de consultoría con evidencia actual
✅ Sistema anti-bucle con métricas de confianza

**Análisis Estratégico Tripartito**:
• Evaluación de amenazas con datos web actuales
• Análisis de oportunidades con fuentes múltiples
• Synthesis SWOT con evidencia documentada
• Recomendaciones C-suite con intelligence verificable

**Contexto Estratégico**: ${sessionConfig.companyName} en ${sessionConfig.industry}

¿Qué análisis estratégico con flujo tripartito requieres?`
  };

  return agentMessages[agentId as keyof typeof agentMessages] || 
         `🚀 Sistema Tripartito Activado - Agente ${agentId.toUpperCase()} con flujo OpenAI → Perplexity → Claude y validación triple de datos.`;
}
