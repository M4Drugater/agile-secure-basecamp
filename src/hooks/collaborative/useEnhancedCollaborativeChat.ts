
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { useElitePromptEngine } from '@/hooks/prompts/useElitePromptEngine';
import { AgentConfig } from '@/components/agents/UnifiedAgentWorkspace';

interface CollaborativeMessage {
  id: string;
  type: 'user' | 'orchestrator' | 'agent-response' | 'synthesis';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  agentIcon?: any;
  agentColor?: string;
}

interface UseEnhancedCollaborativeChatProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
}

export function useEnhancedCollaborativeChat({ 
  selectedAgents, 
  sessionConfig 
}: UseEnhancedCollaborativeChatProps) {
  const [messages, setMessages] = useState<CollaborativeMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  
  const { supabase, user } = useSupabase();
  const { buildFullContextString, getContextSummary } = useContextBuilder();
  const { buildEliteSystemPrompt } = useElitePromptEngine();

  const sendCollaborativeMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isProcessing || !user) return;

    const userMsg: CollaborativeMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // 1. Construir contexto completo del usuario
      console.log('🔍 Construyendo contexto personalizado...');
      const fullUserContext = await buildFullContextString(userMessage);
      const contextSummary = getContextSummary();

      // 2. Mensaje de orquestador
      const orchestratorMsg: CollaborativeMessage = {
        id: `orchestrator-${Date.now()}`,
        type: 'orchestrator',
        content: `Perfecto. Voy a coordinar las respuestas de ${selectedAgents.length} agentes especializados usando tu contexto personalizado (${contextSummary.knowledgeCount} documentos, ${contextSummary.conversationCount} conversaciones). Analizando...`,
        timestamp: new Date(),
        agentId: 'clipogino',
        agentName: 'CLIPOGINO - Orquestador'
      };

      setMessages(prev => [...prev, orchestratorMsg]);

      // 3. Generar respuestas personalizadas de cada agente
      for (const agent of selectedAgents) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setCurrentStep(`Consultando con ${agent.name} usando tu contexto...`);

        // Construir prompt especializado para el agente
        const systemPrompt = await buildEliteSystemPrompt({
          agentType: agent.id as 'clipogino' | 'cdv' | 'cir' | 'cia',
          currentPage: '/unified-agents',
          sessionConfig,
          analysisDepth: 'comprehensive',
          outputFormat: 'conversational',
          contextLevel: 'elite'
        });

        // Preparar mensajes para la API
        const apiMessages = [
          { 
            role: 'system' as const, 
            content: `${systemPrompt}\n\n${fullUserContext}` 
          },
          { 
            role: 'user' as const, 
            content: userMessage 
          }
        ];

        try {
          // Llamar a la función edge con contexto completo
          const { data, error } = await supabase.functions.invoke('competitive-intelligence-chat', {
            body: {
              messages: apiMessages,
              agentType: agent.id as 'clipogino' | 'cdv' | 'cir' | 'cia',
              sessionConfig: {
                ...sessionConfig,
                contextQuality: 'elite',
                personalizationLevel: 'high'
              },
              userContext: {
                userId: user.id,
                sessionId: sessionConfig.sessionId || 'collaborative-session',
                contextSummary,
                fullContext: fullUserContext
              }
            }
          });

          if (error) throw error;

          const agentResponse: CollaborativeMessage = {
            id: `${agent.id}-${Date.now()}`,
            type: 'agent-response',
            content: data.response,
            timestamp: new Date(),
            agentId: agent.id,
            agentName: agent.name,
            agentIcon: agent.icon,
            agentColor: agent.color
          };

          setMessages(prev => [...prev, agentResponse]);

        } catch (error) {
          console.error(`Error con agente ${agent.name}:`, error);
          
          const errorResponse: CollaborativeMessage = {
            id: `${agent.id}-error-${Date.now()}`,
            type: 'agent-response',
            content: `Disculpa, ${agent.name} está experimentando dificultades técnicas. Reintentando...`,
            timestamp: new Date(),
            agentId: agent.id,
            agentName: agent.name,
            agentIcon: agent.icon,
            agentColor: agent.color
          };

          setMessages(prev => [...prev, errorResponse]);
        }
      }

      // 4. Síntesis final personalizada
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep('Generando síntesis personalizada...');

      const synthesisPrompt = await buildEliteSystemPrompt({
        agentType: 'clipogino',
        currentPage: '/unified-agents',
        sessionConfig,
        analysisDepth: 'comprehensive',
        outputFormat: 'executive',
        contextLevel: 'elite'
      });

      const synthesisMessages = [
        { 
          role: 'system' as const, 
          content: `${synthesisPrompt}\n\n${fullUserContext}\n\nYour task: Synthesize the collaborative insights from ${selectedAgents.length} specialized agents into a personalized, actionable strategic recommendation.` 
        },
        { 
          role: 'user' as const, 
          content: `Based on all agent responses about "${userMessage}", provide a personalized synthesis that integrates my profile, knowledge base, and the collaborative insights.` 
        }
      ];

      const { data: synthesisData, error: synthesisError } = await supabase.functions.invoke('clipogino-chat', {
        body: {
          messages: synthesisMessages,
          userContext: {
            userId: user.id,
            contextSummary,
            fullContext: fullUserContext
          }
        }
      });

      if (!synthesisError && synthesisData) {
        const synthesisMsg: CollaborativeMessage = {
          id: `synthesis-${Date.now()}`,
          type: 'synthesis',
          content: synthesisData.response,
          timestamp: new Date(),
          agentId: 'clipogino',
          agentName: 'CLIPOGINO - Síntesis Personalizada'
        };

        setMessages(prev => [...prev, synthesisMsg]);
      }

    } catch (error) {
      console.error('Error en chat colaborativo:', error);
      
      const errorMsg: CollaborativeMessage = {
        id: `error-${Date.now()}`,
        type: 'orchestrator',
        content: 'Disculpa, hubo un error coordinando las respuestas. Por favor, inténtalo de nuevo.',
        timestamp: new Date(),
        agentId: 'clipogino',
        agentName: 'CLIPOGINO - Error'
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
      setCurrentStep('');
    }
  };

  const initializeCollaborativeChat = async () => {
    if (selectedAgents.length === 0 || messages.length > 0) return;

    const contextSummary = getContextSummary();
    
    const welcomeMessage: CollaborativeMessage = {
      id: 'welcome',
      type: 'orchestrator',
      content: `¡Hola! Soy CLIPOGINO y voy a orquestar esta sesión colaborativa personalizada con ${selectedAgents.length} agentes especializados.

**Tu contexto personalizado:**
• Perfil profesional: ${contextSummary.hasProfile ? 'Completo' : 'Básico'}
• Base de conocimiento: ${contextSummary.knowledgeCount} documentos
• Historial de conversaciones: ${contextSummary.conversationCount} interacciones
• Contenido creado: ${contextSummary.contentCount} piezas

**Agentes especializados activos:**
${selectedAgents.map(agent => `• **${agent.name}**: ${agent.description}`).join('\n')}

Todos los agentes van a usar tu información personal y profesional para darte respuestas verdaderamente personalizadas. ¿En qué te puedo ayudar?`,
      timestamp: new Date(),
      agentId: 'clipogino',
      agentName: 'CLIPOGINO - Orquestador Personalizado'
    };

    setMessages([welcomeMessage]);
  };

  return {
    messages,
    isProcessing,
    currentStep,
    sendCollaborativeMessage,
    initializeCollaborativeChat,
    setMessages
  };
}
