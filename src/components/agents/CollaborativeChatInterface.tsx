
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Users, 
  Brain, 
  Bot,
  Sparkles,
  Eye,
  Activity,
  Search,
  Loader2
} from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';

interface CollaborativeMessage {
  id: string;
  type: 'user' | 'orchestrator' | 'agent-response' | 'synthesis';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  agentIcon?: React.ComponentType<any>;
  agentColor?: string;
}

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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

  const getAgentIcon = (message: CollaborativeMessage) => {
    if (message.agentIcon) {
      const Icon = message.agentIcon;
      return <Icon className="h-4 w-4 text-white" />;
    }
    return <Bot className="h-4 w-4 text-white" />;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Chat Colaborativo Multi-Agente
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {selectedAgents.map(agent => (
            <Badge key={agent.id} variant="secondary" className="flex items-center gap-2">
              <div className={`w-3 h-3 ${agent.color} rounded-full flex items-center justify-center`}>
                {React.createElement(agent.icon, { className: 'h-2 w-2 text-white' })}
              </div>
              {agent.name}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {message.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-3xl">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 ${message.agentColor || 'bg-gray-500'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {getAgentIcon(message)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{message.agentName}</span>
                        <Badge variant="outline" className="text-xs">
                          {message.type === 'orchestrator' ? 'Orquestador' : 
                           message.type === 'synthesis' ? 'Síntesis' : 'Especialista'}
                        </Badge>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                )}
                <Separator className="my-2" />
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    {currentStep || 'Procesando con los agentes...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="space-y-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Haz una pregunta para que todos los agentes colaboren en la respuesta..."
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </p>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isProcessing}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Enviar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
