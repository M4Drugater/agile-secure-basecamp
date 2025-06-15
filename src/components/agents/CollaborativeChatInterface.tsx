
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Sparkles } from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { ChatHeader } from './collaborative/ChatHeader';
import { MessageList } from './collaborative/MessageList';
import { ChatInput } from './collaborative/ChatInput';
import { CollaborativeMessage } from './collaborative/types';

interface CollaborativeChatInterfaceProps {
  selectedAgents: AgentConfig[];
  sessionConfig: any;
  setSessionConfig: React.Dispatch<React.SetStateAction<any>>;
}

export function CollaborativeChatInterface({ 
  selectedAgents, 
  sessionConfig, 
  setSessionConfig 
}: CollaborativeChatInterfaceProps) {
  const [messages, setMessages] = useState<CollaborativeMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Welcome message when agents are loaded
  useEffect(() => {
    if (selectedAgents.length > 0 && messages.length === 0) {
      const welcomeMessage: CollaborativeMessage = {
        id: 'welcome',
        type: 'orchestrator',
        content: `¡Hola! Soy CLIPOGINO y voy a orquestar esta sesión colaborativa con ${selectedAgents.length} agentes especializados. 

**Agentes en esta sesión:**
${selectedAgents.map(agent => `• **${agent.name}**: ${agent.description}`).join('\n')}

Puedes hacer cualquier pregunta y coordinaré las respuestas de todos los agentes para darte una perspectiva completa. ¿En qué te puedo ayudar?`,
        timestamp: new Date(),
        agentId: 'clipogino',
        agentName: 'CLIPOGINO - Orquestador',
        agentIcon: Brain,
        agentColor: 'bg-blue-500'
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedAgents]);

  const simulateAgentResponses = async (userQuestion: string) => {
    const agentResponses: Record<string, string> = {
      'enhanced-content-generator': `Como generador de contenido, puedo ayudarte creando materiales ejecutivos profesionales sobre "${userQuestion}". Podría desarrollar:

• Memos ejecutivos estructurados
• Presentaciones para junta directiva  
• Análisis estratégicos documentados
• Comunicaciones para inversores

¿Te gustaría que genere algún tipo específico de contenido sobre este tema?`,

      'cdv': `Desde la perspectiva de descubrimiento competitivo, analizando "${userQuestion}":

**Competidores identificados:**
• Principales players del mercado con ofertas similares
• Startups emergentes con enfoques disruptivos
• Gigantes tecnológicos expandiendo a este espacio

**Validación de amenazas:**
• Nivel de amenaza: Medio-Alto
• Diferenciadores clave identificados
• Oportunidades de posicionamiento

Recomiendo profundizar en el análisis de gaps competitivos.`,

      'cia': `Mi análisis estratégico de inteligencia competitiva sobre "${userQuestion}":

**Evaluación SWOT:**
• Fortalezas: Posición actual del mercado
• Debilidades: Áreas de mejora identificadas  
• Oportunidades: Segmentos desatendidos
• Amenazas: Disruptores potenciales

**Recomendaciones estratégicas:**
1. Fortalecer ventajas competitivas actuales
2. Desarrollar capacidades en áreas clave
3. Monitorear amenazas emergentes

Este tema requiere análisis continuo para mantener ventaja competitiva.`,

      'cir': `Datos de inteligencia competitiva para "${userQuestion}":

**Métricas del mercado:**
• Autoridad de dominio promedio: 65-80
• Tráfico web estimado: 50K-500K visitas/mes
• Presencia en redes sociales: 10K-100K seguidores
• Tamaño de equipos: 20-200 empleados

**Análisis de contenido:**
• Volumen de publicaciones: 2-5 posts/semana
• Engagement promedio: 3-8%
• Palabras clave principales identificadas

Estos datos sugieren un mercado maduro con oportunidades en nichos específicos.`,

      'research-engine': `Investigación completa sobre "${userQuestion}":

**Hallazgos clave:**
• Tendencias del mercado en los últimos 12 meses
• Tecnologías emergentes relevantes
• Cambios regulatorios que impactan el sector
• Patrones de comportamiento del consumidor

**Fuentes analizadas:**
• Informes de industria (McKinsey, Gartner, etc.)
• Estudios académicos recientes
• Análisis de redes sociales y foros
• Datos de patentes y propiedades intelectuales

**Pronósticos:**
El sector muestra signos de crecimiento sostenido con disrupciones esperadas en tecnologías de IA.`
    };

    // Add orchestrator message
    const orchestratorMsg: CollaborativeMessage = {
      id: `orchestrator-${Date.now()}`,
      type: 'orchestrator',
      content: `Excelente pregunta. Voy a coordinar las respuestas de todos los agentes especializados para darte una perspectiva completa. Déjame consultar con cada uno...`,
      timestamp: new Date(),
      agentId: 'clipogino',
      agentName: 'CLIPOGINO - Orquestador',
      agentIcon: Brain,
      agentColor: 'bg-blue-500'
    };

    setMessages(prev => [...prev, orchestratorMsg]);

    // Simulate delay and add each agent response
    for (const agent of selectedAgents) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentStep(`Consultando con ${agent.name}...`);
      
      const agentResponse: CollaborativeMessage = {
        id: `${agent.id}-${Date.now()}`,
        type: 'agent-response',
        content: agentResponses[agent.id] || `Como ${agent.name}, proporciono mi perspectiva especializada sobre "${userQuestion}". Mi análisis sugiere [respuesta específica del agente].`,
        timestamp: new Date(),
        agentId: agent.id,
        agentName: agent.name,
        agentIcon: agent.icon,
        agentColor: agent.color
      };

      setMessages(prev => [...prev, agentResponse]);
    }

    // Final synthesis
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep('Sintetizando respuestas...');

    const synthesisMsg: CollaborativeMessage = {
      id: `synthesis-${Date.now()}`,
      type: 'synthesis',
      content: `**Síntesis Colaborativa - CLIPOGINO**

Basado en las perspectivas de todos los agentes, aquí está mi análisis integrado:

**Consenso entre agentes:**
• Todos coinciden en la importancia estratégica del tema
• Se identifican oportunidades de mercado claras
• Existe necesidad de monitoreo continuo

**Recomendaciones priorizadas:**
1. **Acción inmediata**: Implementar análisis competitivo continuo
2. **Medio plazo**: Desarrollar contenido diferenciado
3. **Largo plazo**: Establecer ventajas competitivas sostenibles

**Próximos pasos sugeridos:**
• Profundizar en análisis específicos según tu prioridad
• Desarrollar plan de acción basado en insights
• Establecer métricas de seguimiento

¿Te gustaría que profundice en algún aspecto específico o que los agentes colaboren en una tarea particular?`,
      timestamp: new Date(),
      agentId: 'clipogino',
      agentName: 'CLIPOGINO - Síntesis Final',
      agentIcon: Sparkles,
      agentColor: 'bg-purple-500'
    };

    setMessages(prev => [...prev, synthesisMsg]);
    setCurrentStep('');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: CollaborativeMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    const currentInput = inputMessage;
    setInputMessage('');

    try {
      await simulateAgentResponses(currentInput);
    } catch (error) {
      console.error('Error processing collaborative chat:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <ChatHeader selectedAgents={selectedAgents} />

      <CardContent className="flex-1 flex flex-col space-y-4">
        <MessageList 
          messages={messages} 
          isProcessing={isProcessing} 
          currentStep={currentStep} 
        />

        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      </CardContent>
    </Card>
  );
}
