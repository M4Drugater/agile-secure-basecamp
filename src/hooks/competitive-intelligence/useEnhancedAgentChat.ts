
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAgentPrompts } from './useAgentPrompts';
import { useRealTimeWebSearch } from './useRealTimeWebSearch';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
  searchData?: any;
  metadata?: any;
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
  const { getSystemPrompt } = useAgentPrompts();
  const webSearch = useRealTimeWebSearch();

  const getWelcomeMessage = () => {
    const agentNames = {
      cdv: 'CDV Agent',
      cir: 'CIR Agent', 
      cia: 'CIA Agent'
    };
    
    const agentName = agentNames[agentId as keyof typeof agentNames];
    const company = sessionConfig.companyName;
    
    switch (agentId) {
      case 'cdv':
        return `¡Hola! Soy ${agentName}, tu especialista en descubrimiento y validación competitiva. Tengo acceso a búsquedas web inteligentes para proporcionarte inteligencia competitiva sobre ${company}. Puedo ayudarte a identificar competidores, analizar amenazas y descubrir oportunidades de mercado.`;
      case 'cir':
        return `¡Hola! Soy ${agentName}, tu especialista en investigación de inteligencia competitiva. Utilizo búsquedas web inteligentes para obtener datos financieros, métricas de mercado y análisis regulatorios sobre ${company}. ¿Qué datos específicos te interesan?`;
      case 'cia':
        return `¡Hola! Soy ${agentName}, tu analista de inteligencia estratégica. Combino múltiples fuentes de datos para proporcionarte análisis estratégicos profundos sobre ${company} y el panorama competitivo. ¿Qué aspectos estratégicos quieres explorar?`;
      default:
        return `¡Hola! Estoy aquí para ayudarte con análisis competitivo de ${company}. ¿En qué puedo asistirte?`;
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

      let context = `\n=== CONTEXTO DEL USUARIO ===\n`;
      
      if (profile) {
        context += `Profesión: ${profile.current_position || 'No especificada'}\n`;
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

  const performAgentSearch = async (query: string, messageContext: string) => {
    try {
      console.log(`${agentId.toUpperCase()} Agent performing search:`, query);

      // Determine search type based on agent specialization
      let searchType: 'news' | 'financial' | 'competitive' | 'market' | 'regulatory' = 'competitive';
      let timeframe: 'hour' | 'day' | 'week' | 'month' | 'quarter' = 'week';

      switch (agentId) {
        case 'cdv':
          searchType = messageContext.toLowerCase().includes('financ') ? 'financial' : 'competitive';
          break;
        case 'cir':
          searchType = messageContext.toLowerCase().includes('regulat') ? 'regulatory' : 'financial';
          timeframe = 'month';
          break;
        case 'cia':
          searchType = messageContext.toLowerCase().includes('market') ? 'market' : 'competitive';
          timeframe = 'quarter';
          break;
      }

      const searchResults = await webSearch.performWebSearch({
        query: `${query} ${sessionConfig.companyName} ${sessionConfig.industry}`,
        companyName: sessionConfig.companyName,
        industry: sessionConfig.industry,
        searchType,
        timeframe
      });

      return searchResults;
    } catch (error) {
      console.error('Agent search failed:', error);
      // Don't throw - return null to allow chat to continue
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
      // Perform web search (will gracefully handle failures)
      const searchResults = await performAgentSearch(inputMessage, inputMessage);
      
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

      // Build enhanced system prompt with search data
      let enhancedSystemPrompt = getSystemPrompt(agentId, userContext, sessionConfig);
      
      if (searchResults && searchResults.metadata?.apiProvider !== 'fallback') {
        enhancedSystemPrompt += `\n\n=== REAL-TIME INTELLIGENCE DATA ===\n`;
        enhancedSystemPrompt += `Recent Web Intelligence:\n${searchResults.searchResults.webData}\n\n`;
        enhancedSystemPrompt += `Strategic Analysis:\n${searchResults.searchResults.strategicAnalysis}\n\n`;
        
        if (searchResults.insights.length > 0) {
          enhancedSystemPrompt += `Key Insights:\n`;
          searchResults.insights.forEach((insight, index) => {
            enhancedSystemPrompt += `${index + 1}. ${insight.title}: ${insight.description}\n`;
          });
          enhancedSystemPrompt += `\n`;
        }
        
        enhancedSystemPrompt += `IMPORTANT: Use this real-time data in your analysis. Reference specific data points and insights.`;
      } else if (searchResults?.metadata?.apiProvider === 'fallback') {
        enhancedSystemPrompt += `\n\n=== SYSTEM STATUS ===\nNote: Real-time search is operating in fallback mode. Provide analysis based on general market knowledge and advise the user that live data is temporarily limited.`;
      }

      const apiMessages = [
        { role: 'system' as const, content: enhancedSystemPrompt },
        ...conversationMessages
      ];

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

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        agentType: agentId,
        searchData: searchResults,
        metadata: {
          model: data.model,
          tokensUsed: data.tokensUsed,
          cost: data.cost,
          searchPerformed: !!searchResults,
          dataConfidence: searchResults?.metadata?.dataConfidence || 0,
          searchStatus: searchResults?.metadata?.apiProvider || 'none'
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0); // Reset retry count on success

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. El sistema continúa funcionando y puedes intentar de nuevo. Si el problema persiste, por favor contacta al soporte.',
        timestamp: new Date(),
        agentType: agentId,
        hasError: true,
        canRetry: retryCount < 3
      };

      setMessages(prev => [...prev, errorMessage]);
      setRetryCount(prev => prev + 1);
      
      toast.error('Error en el chat. Puedes intentar de nuevo.');
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
    retryLastMessage,
    retrySearch,
    searchData: webSearch.searchResults,
    searchError: webSearch.error,
    canRetry: retryCount < 3
  };
}
