
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedAISystem } from '@/hooks/useUnifiedAISystem';
import { supabase } from '@/integrations/supabase/client';

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
    activeAgent?: string;
    tripartiteFlow?: boolean;
  };
}

export function useUnifiedClipoginoChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const { isProcessing, sendUnifiedRequest, getContextSummary } = useUnifiedAISystem();

  // Add welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `¡Bienvenido al CLIPOGINO Sistema Unificado! 🎯

Ahora tienes acceso completo a:

✨ **Tu Perfil Profesional**: Posición, experiencia, objetivos de carrera
📚 **Tu Base de Conocimiento**: Todos tus documentos y recursos personales
🌐 **Inteligencia Web en Vivo**: Datos actualizados del mercado y competencia
🧠 **Contexto Completo**: Historial de conversaciones y actividad
🤖 **5 Agentes Especializados**: Integrados con metodología tripartite

**Agentes disponibles:**
• **Enhanced Content Generator** - Contenido ejecutivo tripartite
• **Elite Research Engine** - Investigación Fortune 500
• **CDV** - Descubrimiento competitivo
• **CIA** - Análisis de inteligencia competitiva  
• **CIR** - Métricas y domain authority

Puedo proporcionarte asesoría estratégica verdaderamente personalizada con capacidades especializadas. ¿En qué decisión profesional puedo ayudarte hoy?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const detectAgentActivation = (message: string): string | null => {
    const agentTriggers = {
      'Enhanced Content Generator': ['contenido', 'content', 'generar', 'escritura', 'artículo', 'blog'],
      'Elite Research Engine': ['investigación', 'research', 'buscar', 'analizar', 'datos', 'fuentes'],
      'CDV': ['competidor', 'competitor', 'descubrir', 'validar', 'mercado'],
      'CIA': ['inteligencia', 'intelligence', 'análisis', 'estrategia', 'amenaza'],
      'CIR': ['métricas', 'metrics', 'domain', 'authority', 'tráfico', 'seo']
    };

    // Direct activation
    for (const [agentName, triggers] of Object.entries(agentTriggers)) {
      if (message.toLowerCase().includes(`activa el modo "${agentName.toLowerCase()}"`)) {
        return agentName;
      }
    }

    // Implicit activation based on content
    const messageLower = message.toLowerCase();
    for (const [agentName, triggers] of Object.entries(agentTriggers)) {
      const matchCount = triggers.filter(trigger => messageLower.includes(trigger)).length;
      if (matchCount >= 2) { // Require at least 2 trigger words
        return agentName;
      }
    }

    return null;
  };

  const buildAgentSystemPrompt = (agentName: string): string => {
    const agentPrompts = {
      'Enhanced Content Generator': `Actúa como el Enhanced Content Generator del sistema CLIPOGINO. Usa metodología tripartite para crear contenido ejecutivo de alta calidad. Enfócate en generar contenido estratégico, bien investigado y optimizado para audiencias profesionales.`,
      
      'Elite Research Engine': `Actúa como el Elite Research Engine del sistema CLIPOGINO. Usa metodología tripartite para realizar investigación de nivel Fortune 500. Proporciona análisis profundos con fuentes verificables y insights estratégicos.`,
      
      'CDV': `Actúa como el Competitor Discovery & Validator del sistema CLIPOGINO. Usa metodología tripartite para descubrir y validar información competitiva. Enfócate en identificar oportunidades y amenazas en el mercado.`,
      
      'CIA': `Actúa como el Competitive Intelligence Analysis del sistema CLIPOGINO. Usa metodología tripartite para análisis estratégico de inteligencia competitiva. Proporciona evaluaciones ejecutivas y recomendaciones C-suite.`,
      
      'CIR': `Actúa como el Competitive Intelligence Retriever del sistema CLIPOGINO. Usa metodología tripartite para obtener métricas competitivas, domain authority y análisis de tráfico con datos verificables.`
    };

    return agentPrompts[agentName] || '';
  };

  const sendMessage = async (input: string, currentPage?: string) => {
    if (!input.trim() || isProcessing || !user) return;

    // Detect agent activation
    const detectedAgent = detectAgentActivation(input);
    if (detectedAgent) {
      setActiveAgent(detectedAgent);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Build system prompt with agent specialization
      let systemPrompt = '';
      if (activeAgent) {
        systemPrompt = buildAgentSystemPrompt(activeAgent);
      }

      // Send to unified AI system
      const response = await sendUnifiedRequest({
        message: input.trim(),
        agentType: activeAgent ? activeAgent.toLowerCase().replace(/ /g, '-') : 'clipogino',
        currentPage: currentPage || '/chat',
        searchEnabled: webSearchEnabled,
        model: selectedModel,
        systemPrompt
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
          activeAgent: activeAgent || undefined,
          tripartiteFlow: true
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to database
      await saveMessageToHistory(userMessage);
      await saveMessageToHistory(assistantMessage);

    } catch (error) {
      console.error('Unified chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. El sistema unificado está restaurando las conexiones automáticamente. Puedes intentar de nuevo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const saveMessageToHistory = async (message: ChatMessage) => {
    if (!user) return;

    try {
      // Create conversation if doesn't exist
      if (!currentConversationId) {
        const { data: conversation, error: convError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            title: message.content.substring(0, 50) + '...'
          })
          .select()
          .single();

        if (convError) throw convError;
        setCurrentConversationId(conversation.id);
      }

      // Save message
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: currentConversationId,
          role: message.role,
          content: message.content
        });

      if (error) throw error;

    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setActiveAgent(null);
    setMessages([]);
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      role: 'assistant',
      content: '¡Nueva conversación iniciada! El sistema unificado está listo con acceso completo a tu contexto y todos los agentes especializados. ¿En qué puedo ayudarte?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const contextSummary = getContextSummary();

  return {
    messages,
    isLoading: isProcessing,
    selectedModel,
    setSelectedModel,
    webSearchEnabled,
    setWebSearchEnabled,
    sendMessage,
    startNewConversation,
    contextSummary,
    hasProfileContext: contextSummary.hasProfile,
    knowledgeRecommendations: [],
    activeAgent
  };
}
