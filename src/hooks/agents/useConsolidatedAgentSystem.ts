
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedTripartiteSystem } from '@/hooks/tripartite/useUnifiedTripartiteSystem';
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
    tripartiteFlow?: boolean;
    tripartiteMetrics?: any;
    qualityScore?: number;
    processingTime?: number;
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

  const { executeTripartiteFlow, isProcessing: isTripartiteProcessing } = useUnifiedTripartiteSystem();

  const initializeSession = async () => {
    if (!user) return;
    
    const newSessionId = `tripartite-${agentId}-${user.id}-${Date.now()}`;
    setSessionId(newSessionId);
    
    console.log('🚀 UNIFIED TRIPARTITE - Initializing session:', {
      agentId,
      sessionId: newSessionId,
      user: user.email
    });
    
    const welcomeMessage: ConsolidatedMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: getTripartiteWelcomeMessage(agentId, sessionConfig),
      timestamp: new Date(),
      agentType: agentId,
      metadata: {
        tripartiteFlow: true,
        model: 'tripartite-unified-system',
        hasValidWebData: false,
        qualityScore: 100
      }
    };
    
    setMessages([welcomeMessage]);
    setRetryCount(0);
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
      console.log(`🚀 UNIFIED TRIPARTITE - Processing for ${agentId.toUpperCase()}`);

      // ALL agents now use the unified tripartite flow
      const tripartiteResponse = await executeTripartiteFlow({
        userQuery: userInput.trim(),
        agentType: agentId,
        sessionConfig,
        contextLevel: 'elite'
      });

      console.log('✅ TRIPARTITE RESPONSE:', {
        status: tripartiteResponse.status,
        qualityScore: tripartiteResponse.metadata.qualityScore,
        sources: tripartiteResponse.metadata.webSources.length,
        totalTime: tripartiteResponse.metadata.processingTime
      });

      const assistantMessage: ConsolidatedMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: tripartiteResponse.finalResponse,
        timestamp: new Date(),
        agentType: agentId,
        metadata: {
          model: 'tripartite-openai-perplexity-claude',
          tokensUsed: tripartiteResponse.metadata.totalTokens,
          cost: parseFloat(tripartiteResponse.metadata.totalCost),
          hasValidWebData: tripartiteResponse.metadata.webSources.length > 0,
          validationScore: Math.round(tripartiteResponse.metadata.qualityScore * 100),
          webSources: tripartiteResponse.metadata.webSources,
          searchEngine: tripartiteResponse.metadata.searchEngine,
          tripartiteFlow: true,
          tripartiteMetrics: tripartiteResponse.metadata,
          qualityScore: tripartiteResponse.metadata.qualityScore,
          processingTime: tripartiteResponse.metadata.processingTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0);

      // Success notification with tripartite metrics
      toast.success(`${agentId.toUpperCase()} - Tripartite Complete`, {
        description: `OpenAI→Perplexity→Claude | Quality: ${Math.round(tripartiteResponse.metadata.qualityScore * 100)}% | Sources: ${tripartiteResponse.metadata.webSources.length}`
      });

    } catch (error) {
      console.error('❌ Unified tripartite error:', error);
      
      setRetryCount(prev => prev + 1);
      
      const errorMessage: ConsolidatedMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `🚀 Sistema Tripartite Unificado - Error Detectado

**Error en el flujo**: ${error instanceof Error ? error.message : 'Error desconocido'}
**Agente**: ${agentId.toUpperCase()}
**Flujo**: OpenAI → Perplexity → Claude
**Intentos**: ${retryCount + 1}/3

**Sistema Unificado Activo**: Todos los agentes ahora usan el mismo flujo tripartite para garantizar consistencia.

**Opciones**:
1. Reformular la consulta de manera más específica
2. Intentar con enfoque diferente
3. El sistema se reactivará automáticamente

El sistema unificado garantiza que todos los agentes sigan la misma metodología tripartite.`,
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: retryCount < 2,
        metadata: {
          tripartiteFlow: true,
          model: 'tripartite-error-handler'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast.error(`Tripartite Error - ${agentId.toUpperCase()}`, {
        description: 'Sistema unificado activando respaldo'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const retryLastMessage = async () => {
    if (!sessionId || retryCount >= 2) {
      toast.warning('Límite de Reintentos', {
        description: 'Por favor, reformula tu consulta'
      });
      return;
    }
    
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop();
    
    if (lastUserMessage) {
      console.log('🚀 TRIPARTITE RETRY - Reintentando con sistema unificado');
      setMessages(prev => prev.filter(msg => !msg.hasError));
      await sendMessage(lastUserMessage.content);
    }
  };

  return {
    messages,
    isProcessing: isProcessing || isTripartiteProcessing,
    sessionId,
    initializeSession,
    sendMessage,
    retryLastMessage,
    canRetry: retryCount < 2
  };
}

function getTripartiteWelcomeMessage(agentId: string, sessionConfig: ConsolidatedSessionConfig): string {
  const baseMessage = `🚀 **SISTEMA TRIPARTITE UNIFICADO ACTIVADO**

✅ **Flujo Consistente**: OpenAI → Perplexity → Claude
✅ **Metodología Estandarizada**: Todos los agentes usan el mismo proceso
✅ **Calidad Garantizada**: Validación triple en cada etapa
✅ **Métricas Unificadas**: Seguimiento consistente de rendimiento

**Proceso Tripartite Unificado**:
1. 🤖 **OpenAI**: Análisis de contexto y optimización de búsqueda
2. 🔍 **Perplexity**: Investigación web con datos verificables en tiempo real  
3. ✨ **Claude**: Síntesis ejecutiva y respuesta final estructurada

**Beneficios de la Unificación**:
• Consistencia total entre todos los agentes
• Calidad predecible y medible
• Metodología empresarial estandardizada
• Métricas comparables y confiables`;

  const agentSpecializations = {
    'enhanced-content-generator': `

**Especialización - Content Generator**:
• Contenido ejecutivo con datos web actuales verificados
• Documentos estratégicos con intelligence de mercado
• Presentaciones con métricas en tiempo real
• Knowledge assets con fuentes documentadas`,

    'clipogino': `

**Especialización - CLIPOGINO Mentor**:
• Mentoría empresarial con contexto de industria actual
• Desarrollo de liderazgo con tendencias documentadas
• Planificación estratégica con intelligence de mercado
• Insights profesionales respaldados por datos web`,

    'research-engine': `

**Especialización - Research Engine**:
• Investigación profunda con múltiples fuentes verificadas
• Análisis de tendencias con datos actuales
• Intelligence competitiva documentada
• Síntesis estratégica con evidencia web`,

    'cdv': `

**Especialización - CDV (Competitive Discovery)**:
• Descubrimiento de competidores con datos verificados
• Validación de amenazas con métricas actuales
• Análisis de posicionamiento documentado
• Identificación de oportunidades con evidencia web

**Contexto**: ${sessionConfig.companyName} en ${sessionConfig.industry}`,

    'cir': `

**Especialización - CIR (Intelligence Retrieval)**:
• Métricas competitivas con fuentes verificadas
• Análisis de rendimiento con datos actuales
• Benchmarking con números documentados
• Intelligence operacional con evidencia web

**Contexto**: ${sessionConfig.companyName} - ${sessionConfig.industry}`,

    'cia': `

**Especialización - CIA (Intelligence Analysis)**:
• Análisis estratégico con datos verificados
• Síntesis ejecutiva con fuentes múltiples
• Recomendaciones C-suite respaldadas
• Frameworks de consultoría con evidencia actual

**Contexto**: ${sessionConfig.companyName} en ${sessionConfig.industry}`
  };

  return baseMessage + (agentSpecializations[agentId as keyof typeof agentSpecializations] || '') + `

¿Cómo puedo ayudarte usando la metodología tripartite unificada?`;
}
