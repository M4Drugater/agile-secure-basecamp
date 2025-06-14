
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Send, 
  TrendingUp, 
  Zap,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  moduleActivated?: string;
}

export function AssistedModelChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mensaje de bienvenida inicial
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu **Modelo Asistido** de LAIGENT. Estoy aquí para ayudarte a navegar por nuestros módulos especializados. Puedes preguntarme sobre tendencias, contenido, conocimiento y mucho más.',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const detectIntent = (userInput: string): { intent: string; module?: string; confidence: number } => {
    const input = userInput.toLowerCase();
    
    // Palabras clave para detectar intención de tendencias
    const trendsKeywords = [
      'tendencias', 'trends', 'reddit', 'trending', 'viral',
      'popularidad', 'moda', 'actualidad', 'novedad',
      'descubrimiento', 'explorar', 'mercado', 'subreddit'
    ];

    // Otras intenciones futuras
    const contentKeywords = ['contenido', 'content', 'generar', 'crear', 'escribir'];
    const knowledgeKeywords = ['conocimiento', 'knowledge', 'aprender', 'documentos', 'archivos'];

    if (trendsKeywords.some(keyword => input.includes(keyword))) {
      return { intent: 'trends', module: 'trends-discovery', confidence: 0.9 };
    }

    if (contentKeywords.some(keyword => input.includes(keyword))) {
      return { intent: 'content', module: 'content-generator', confidence: 0.8 };
    }

    if (knowledgeKeywords.some(keyword => input.includes(keyword))) {
      return { intent: 'knowledge', module: 'knowledge-base', confidence: 0.8 };
    }

    return { intent: 'general', confidence: 0.5 };
  };

  const activateModule = (moduleName: string, userInput: string) => {
    switch (moduleName) {
      case 'trends-discovery':
        toast({
          title: '🚀 Módulo Activado',
          description: 'Redirigiendo al Descubrimiento de Tendencias...',
          duration: 2000,
        });
        setTimeout(() => {
          navigate('/trends');
        }, 1500);
        return 'He detectado que te interesan las **tendencias**. Activando el módulo de **Descubrimiento de Tendencias** para mostrarte las últimas tendencias de Reddit en tiempo real. Te redirigiré en un momento...';

      case 'content-generator':
        toast({
          title: '📝 Módulo Activado',
          description: 'Redirigiendo al Generador de Contenido...',
          duration: 2000,
        });
        setTimeout(() => {
          navigate('/content/generator');
        }, 1500);
        return 'Perfecto, necesitas crear **contenido**. Activando el módulo de **Generación de Contenido** con IA para ayudarte a crear contenido profesional de alta calidad.';

      case 'knowledge-base':
        toast({
          title: '📚 Módulo Activado',
          description: 'Redirigiendo a la Base de Conocimiento...',
          duration: 2000,
        });
        setTimeout(() => {
          navigate('/knowledge');
        }, 1500);
        return 'Entiendo que buscas información de tu **base de conocimiento**. Activando el módulo de **Gestión de Conocimiento** para acceder a tus documentos y recursos.';

      default:
        return 'Lo siento, no pude identificar el módulo específico que necesitas. ¿Podrías ser más específico sobre lo que te gustaría hacer?';
    }
  };

  const generateResponse = (userInput: string): string => {
    const { intent, module, confidence } = detectIntent(userInput);

    if (intent === 'trends' && module && confidence > 0.8) {
      return activateModule(module, userInput);
    }

    if (intent === 'content' && module && confidence > 0.7) {
      return activateModule(module, userInput);
    }

    if (intent === 'knowledge' && module && confidence > 0.7) {
      return activateModule(module, userInput);
    }

    // Respuesta general si no se detecta una intención clara
    return `Como tu **Modelo Asistido**, puedo ayudarte con:

• **Tendencias**: Descubre las últimas tendencias de Reddit y mercado
• **Contenido**: Genera contenido profesional con IA
• **Conocimiento**: Gestiona y consulta tu base de conocimiento
• **Aprendizaje**: Accede a cursos y rutas de aprendizaje

¿En qué área específica te gustaría que te asista?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simular procesamiento
    setTimeout(() => {
      const assistantResponse = generateResponse(inputValue);
      const { intent, module } = detectIntent(inputValue);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        moduleActivated: module,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Ver Tendencias', action: () => navigate('/trends'), icon: TrendingUp },
    { label: 'Generar Contenido', action: () => navigate('/content/generator'), icon: Zap },
    { label: 'Base de Conocimiento', action: () => navigate('/knowledge'), icon: MessageSquare },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Bot className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Modelo Asistido LAIGENT
          </h1>
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            IA v2.0
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Tu asistente inteligente para navegar y activar módulos especializados
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full h-auto p-4 flex items-center gap-3"
                onClick={action.action}
              >
                <action.icon className="h-6 w-6 text-blue-600" />
                <span className="font-medium">{action.label}</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Chat con Modelo Asistido
            <Badge variant="outline" className="ml-auto">
              Detección de Intenciones Activada
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                    </div>
                    {message.moduleActivated && (
                      <Badge variant="secondary" className="mt-2">
                        Módulo: {message.moduleActivated}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 animate-pulse" />
                      <span>Analizando solicitud...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu consulta (ej: 'quiero ver las tendencias de Reddit')"
                disabled={isProcessing}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>Modelo Asistido Inteligente:</strong> Este chatbot utiliza procesamiento de lenguaje natural para 
          detectar tus intenciones y activar automáticamente los módulos apropiados. Simplemente describe lo que necesitas hacer.
        </AlertDescription>
      </Alert>
    </div>
  );
}
