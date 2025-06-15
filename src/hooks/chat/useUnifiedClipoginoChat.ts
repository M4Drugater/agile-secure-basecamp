
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
  };
}

export function useUnifiedClipoginoChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const { isProcessing, sendUnifiedRequest, getContextSummary } = useUnifiedAISystem();

  // Add welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `¡Bienvenido al CLIPOGINO Unificado! 🎯

Ahora tengo acceso completo y en tiempo real a:

✨ **Tu Perfil Profesional**: Posición, experiencia, objetivos de carrera
📚 **Tu Base de Conocimiento**: Todos tus documentos y recursos personales
🌐 **Inteligencia Web en Vivo**: Datos actualizados del mercado y competencia
🧠 **Contexto Completo**: Historial de conversaciones y actividad

Puedo proporcionarte asesoría estratégica verdaderamente personalizada y basada en datos reales. ¿En qué decisión profesional puedo ayudarte hoy?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async (input: string, currentPage?: string) => {
    if (!input.trim() || isProcessing || !user) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Send to unified AI system
      const response = await sendUnifiedRequest({
        message: input.trim(),
        agentType: 'clipogino',
        currentPage: currentPage || '/chat',
        searchEnabled: webSearchEnabled,
        model: selectedModel
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
          contextQuality: response.contextQuality
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to database
      await saveMessageToHistory(userMessage);
      await saveMessageToHistory(assistantMessage);

    } catch (error) {
      console.error('Chat error:', error);
      
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
    setMessages([]);
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      role: 'assistant',
      content: '¡Nueva conversación iniciada! El sistema unificado está listo con acceso completo a tu contexto. ¿En qué puedo ayudarte?',
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
    knowledgeRecommendations: []
  };
}
