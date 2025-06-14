
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAgentPrompts } from './useAgentPrompts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
}

interface SessionConfig {
  companyName: string;
  industry: string;
  analysisFocus: string;
  objectives: string;
}

export function useAgentChatMessages(agentId: string, sessionConfig: SessionConfig) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { supabase, user } = useSupabase();
  const { getSystemPrompt } = useAgentPrompts();

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

      const systemPrompt = getSystemPrompt(agentId, userContext, sessionConfig);
      const apiMessages = [
        { role: 'system' as const, content: systemPrompt },
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

  return {
    messages,
    isLoading,
    sendMessage,
    addWelcomeMessage
  };
}
