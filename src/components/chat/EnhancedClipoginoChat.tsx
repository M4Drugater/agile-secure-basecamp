
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  Globe, 
  Brain,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useEliteMultiLLM } from '@/hooks/useEliteMultiLLM';
import { useElitePromptEngine } from '@/hooks/prompts/useElitePromptEngine';
import { useConsolidatedContext } from '@/hooks/useConsolidatedContext';
import { EliteModelSelector } from './EliteModelSelector';
import { ChatMessage } from '@/components/competitive-intelligence/ChatMessage';
import { ChatInput } from '@/components/competitive-intelligence/ChatInput';
import { LoadingMessage } from '@/components/competitive-intelligence/LoadingMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    cost?: string;
    hasWebData?: boolean;
    searchEnabled?: boolean;
    webSources?: string[];
  };
}

export function EnhancedClipoginoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { 
    isProcessing, 
    lastResponse, 
    sendEliteRequest 
  } = useEliteMultiLLM();

  const { buildEliteSystemPrompt } = useElitePromptEngine();
  const { getContextSummary } = useConsolidatedContext();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Add welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `¡Bienvenido al CLIPOGINO Elite! 🎯

Soy tu asesor ejecutivo de inteligencia artificial más avanzado, ahora potenciado con:

✨ **Multi-LLM Intelligence**: OpenAI GPT-4o y Claude 3.5 Sonnet
🌐 **Real-Time Web Search**: Datos en vivo del mercado y competencia  
🧠 **Elite Prompts**: Marcos de consultoría McKinsey y BCG
📊 **Business Intelligence**: Análisis de nivel C-suite

Tengo acceso completo a tu perfil profesional, base de conocimiento, y capacidades de búsqueda web en tiempo real. ¿En qué decisión estratégica puedo asesorarte hoy?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const extractSearchQuery = (message: string): string => {
    // Smart search query extraction
    const searchTriggers = [
      'busca', 'investiga', 'analiza', 'encuentra', 'datos sobre',
      'search', 'research', 'analyze', 'find', 'data about',
      'competencia', 'mercado', 'tendencias', 'noticias',
      'competition', 'market', 'trends', 'news'
    ];

    const hasSearchTrigger = searchTriggers.some(trigger => 
      message.toLowerCase().includes(trigger)
    );

    if (hasSearchTrigger || webSearchEnabled) {
      // Extract the main topic for search
      return message.slice(0, 100); // Limit query length
    }

    return '';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');

    try {
      // Build elite system prompt
      const systemPrompt = await buildEliteSystemPrompt({
        agentType: 'clipogino',
        currentPage: '/chat',
        analysisDepth: 'comprehensive',
        outputFormat: 'conversational',
        contextLevel: 'elite'
      });

      // Prepare conversation messages
      const conversationMessages = [
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: currentInput
        }
      ];

      // Extract search query if needed
      const searchQuery = extractSearchQuery(currentInput);

      // Send elite request
      const response = await sendEliteRequest({
        messages: conversationMessages,
        model: selectedModel,
        systemPrompt,
        searchEnabled: webSearchEnabled && !!searchQuery,
        searchQuery,
        contextLevel: 'elite'
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed,
          cost: response.cost,
          hasWebData: !!response.webSearchData,
          searchEnabled: response.searchEnabled,
          webSources: response.webSearchData?.sources || []
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Elite chat error:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error en el sistema Elite. El servicio continúa funcionando y puedes intentar de nuevo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const contextSummary = getContextSummary();

  return (
    <div className="space-y-6">
      {/* Elite Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            CLIPOGINO Elite
          </h1>
          <p className="text-muted-foreground mt-1">
            Multi-LLM AI with real-time intelligence and elite business frameworks
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600">
            <Crown className="h-3 w-3" />
            Elite
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Web Search
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4 mr-1" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>
      </div>

      {/* Context Status */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Elite Context Active:</strong> {contextSummary.knowledgeCount} knowledge assets, 
          {contextSummary.conversationCount} conversations analyzed. 
          Quality: {contextSummary.quality.toUpperCase()}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="lg:col-span-1">
            <EliteModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              webSearchEnabled={webSearchEnabled}
              onWebSearchToggle={setWebSearchEnabled}
              disabled={isProcessing}
            />
          </div>
        )}

        {/* Main Chat Interface */}
        <div className={`${showAdvanced ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 flex flex-col space-y-4 p-6">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message}
                      showMetadata={true}
                    />
                  ))}
                  
                  {isProcessing && (
                    <div className="flex items-center gap-2">
                      <LoadingMessage />
                      <div className="text-xs text-muted-foreground">
                        Processing with {selectedModel}
                        {webSearchEnabled && ' + web search'}...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <ChatInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSendMessage={handleSendMessage}
                isLoading={isProcessing}
                placeholder="Ask CLIPOGINO Elite anything... (with real-time web intelligence)"
              />

              {/* Status Bar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Model: {selectedModel}</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Web: {webSearchEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {lastResponse && (
                  <span>
                    Last: {lastResponse.tokensUsed} tokens, ${lastResponse.cost}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
