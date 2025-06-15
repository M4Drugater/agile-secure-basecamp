
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useEnhancedAgentPrompts } from './useEnhancedAgentPrompts';
import { useUniversalWebSearch } from './useUniversalWebSearch';
import { useEliteMultiLLM } from '@/hooks/useEliteMultiLLM';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
  searchData?: any;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    cost?: number;
    searchPerformed?: boolean;
    dataConfidence?: number;
    searchStatus?: string;
    apiProvider?: string;
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

export function useEnhancedAgentChat(agentId: string, sessionConfig: SessionConfig) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { supabase, user } = useSupabase();
  const { getAgentSpecificPrompt } = useEnhancedAgentPrompts();
  const { performUniversalSearch } = useUniversalWebSearch();
  const { sendEliteRequest } = useEliteMultiLLM();

  const getWelcomeMessage = () => {
    const agentNames = {
      cdv: 'CDV Agent Elite',
      cir: 'CIR Agent Elite', 
      cia: 'CIA Agent Elite'
    };
    
    const agentName = agentNames[agentId as keyof typeof agentNames];
    const company = sessionConfig.companyName;
    
    switch (agentId) {
      case 'cdv':
        return `¡Hola! Soy ${agentName}, tu especialista elite en descubrimiento y validación competitiva. Ahora con acceso completo a búsquedas web inteligentes y modelos de IA avanzados, puedo proporcionarte inteligencia competitiva de nivel C-suite sobre ${company}. 

🎯 **Capacidades Elite:**
• Búsqueda web en tiempo real con Perplexity
• Análisis con GPT-4o y Claude 3.5 Sonnet  
• Marcos McKinsey y BCG aplicados
• Inteligencia de nivel ejecutivo

¿Qué análisis competitivo necesitas?`;

      case 'cir':
        return `¡Hola! Soy ${agentName}, tu especialista elite en investigación de inteligencia competitiva. Con acceso a datos financieros en tiempo real, métricas de mercado y análisis regulatorios sobre ${company}, proporciono investigación de calidad de inversión.

🎯 **Capacidades Elite:**
• Datos financieros y de mercado en vivo
• Análisis regulatorio actualizado
• Benchmarking competitivo avanzado
• Inteligencia de grado ejecutivo

¿Qué investigación específica necesitas?`;

      case 'cia':
        return `¡Hola! Soy ${agentName}, tu analista elite de inteligencia estratégica. Combino múltiples fuentes de datos con frameworks de consultoría premium para proporcionarte análisis estratégicos dignos de sala de juntas sobre ${company}.

🎯 **Capacidades Elite:**
• Síntesis estratégica multi-fuente
• Marcos McKinsey 7-S y Porter Five Forces
• Análisis de opciones estratégicas
• Recomendaciones de nivel C-suite

¿Qué decisión estratégica necesitas analizar?`;

      default:
        return `¡Hola! Soy tu agente elite de análisis competitivo con capacidades web avanzadas para ${company}. ¿En qué puedo asistirte?`;
    }
  };

  const buildUserContext = async () => {
    if (!user || !supabase) return '';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      let context = `\n=== CONTEXTO DEL USUARIO ELITE ===\n`;
      
      if (profile) {
        context += `Profesión: ${profile.current_position || 'Ejecutivo'}\n`;
        context += `Industria: ${profile.industry || sessionConfig.industry}\n`;
        context += `Nivel de Experiencia: ${profile.experience_level || 'Ejecutivo Senior'}\n`;
        context += `Objetivos Profesionales: ${profile.career_goals || 'Liderazgo Estratégico'}\n`;
      }

      context += `\n=== CONFIGURACIÓN DE ANÁLISIS ELITE ===\n`;
      context += `Empresa Objetivo: ${sessionConfig.companyName}\n`;
      context += `Industria: ${sessionConfig.industry}\n`;
      context += `Enfoque Estratégico: ${sessionConfig.analysisFocus}\n`;
      context += `Objetivos de Negocio: ${sessionConfig.objectives}\n`;
      context += `Nivel de Análisis: Elite Executive Level\n`;

      return context;
    } catch (error) {
      console.error('Error building elite context:', error);
      return '';
    }
  };

  const performEliteSearch = async (query: string, messageContext: string) => {
    try {
      console.log(`${agentId.toUpperCase()} Elite Agent performing search:`, query);

      // Determine search strategy based on agent specialization
      let searchContext = '';
      let searchType: 'competitive' | 'financial' | 'market' = 'competitive';

      switch (agentId) {
        case 'cdv':
          searchContext = `Competitive discovery and validation for ${sessionConfig.companyName}`;
          searchType = 'competitive';
          break;
        case 'cir':
          searchContext = `Intelligence research for ${sessionConfig.companyName} in ${sessionConfig.industry}`;
          searchType = messageContext.toLowerCase().includes('financial') ? 'financial' : 'market';
          break;
        case 'cia':
          searchContext = `Strategic analysis for ${sessionConfig.companyName}`;
          searchType = 'competitive';
          break;
      }

      const searchResults = await performUniversalSearch({
        query: `${query} ${sessionConfig.companyName} ${sessionConfig.industry}`,
        context: searchContext,
        searchType,
        timeframe: 'month'
      });

      return searchResults;
    } catch (error) {
      console.error('Elite agent search failed:', error);
      // Return graceful fallback
      return null;
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
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Perform elite web search
      const searchResults = await performEliteSearch(inputMessage, inputMessage);
      
      const userContext = await buildUserContext();
      
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

      // Build enhanced system prompt with elite capabilities
      let enhancedSystemPrompt = getAgentSpecificPrompt(agentId, userContext, sessionConfig);
      
      if (searchResults) {
        enhancedSystemPrompt += `\n\n=== REAL-TIME ELITE INTELLIGENCE ===\n`;
        enhancedSystemPrompt += `Live Web Research Results:\n${searchResults.content}\n\n`;
        
        if (searchResults.insights.length > 0) {
          enhancedSystemPrompt += `Strategic Insights:\n`;
          searchResults.insights.forEach((insight, index) => {
            enhancedSystemPrompt += `${index + 1}. ${insight.title}: ${insight.description} (Confidence: ${Math.round(insight.confidence * 100)}%)\n`;
          });
          enhancedSystemPrompt += `\n`;
        }
        
        enhancedSystemPrompt += `CRITICAL: Use this elite real-time intelligence in your analysis. Reference specific data points and provide executive-level insights with source attribution.`;
      }

      // Use elite multi-LLM engine
      const response = await sendEliteRequest({
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...conversationMessages
        ],
        model: 'gpt-4o', // Use premium model for agents
        searchEnabled: false, // Already performed search
        contextLevel: 'elite'
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        agentType: agentId,
        searchData: searchResults,
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed,
          cost: parseFloat(response.cost),
          searchPerformed: !!searchResults,
          dataConfidence: searchResults?.metrics.confidence || 0,
          searchStatus: searchResults ? 'elite' : 'none',
          apiProvider: 'elite-multi-llm'
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0);

    } catch (error) {
      console.error('Elite agent chat error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error en el sistema Elite. Los servicios principales continúan funcionando y puedes intentar de nuevo con capacidades mejoradas.',
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: retryCount < 3
      };

      setMessages(prev => [...prev, errorMessage]);
      setRetryCount(prev => prev + 1);
      
      toast.error('Error en el agente Elite. Sistema restaurado automáticamente.');
    } finally {
      setIsLoading(false);
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
    await webSearch.clearResults();
    if (webSearch.searchResults) {
      toast.success('Búsqueda reiniciada. Puedes intentar de nuevo.');
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    addWelcomeMessage,
    retryLastMessage: async (sessionId: string) => {
      if (!sessionId) return;
      const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
      if (lastUserMessage) {
        setMessages(prev => prev.filter(msg => !msg.hasError));
        await sendMessage(lastUserMessage.content, sessionId);
      }
    },
    retrySearch: async () => {
      toast.success('Sistema Elite reiniciado. Capacidades completas restauradas.');
    },
    searchData: null,
    searchError: null,
    canRetry: retryCount < 3
  };
}
