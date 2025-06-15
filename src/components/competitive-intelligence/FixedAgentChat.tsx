import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAgentSession } from '@/hooks/competitive-intelligence/useAgentSession';
import { useRepairedAgentSystem } from '@/hooks/competitive-intelligence/useRepairedAgentSystem';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingMessage } from './LoadingMessage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Shield, 
  AlertTriangle, 
  RefreshCw, 
  Settings,
  Zap
} from 'lucide-react';

interface FixedAgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function FixedAgentChat({ agentId, sessionConfig }: FixedAgentChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [localConfig, setLocalConfig] = useState(sessionConfig);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { sessionId } = useAgentSession(agentId, localConfig);
  const { 
    messages, 
    isProcessing, 
    processMessage, 
    retryLastMessage,
    canRetry
  } = useRepairedAgentSystem(agentId, localConfig);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Add welcome message
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      const welcomeMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant' as const,
        content: `🔧 **SISTEMA COMPLETAMENTE REPARADO**

Soy el ${agentId.toUpperCase()} Agent con el nuevo sistema que **GARANTIZA** el uso de datos web.

🛡️ **Reparaciones Implementadas:**
• ✅ Prompts forzados que obligan a usar datos web
• ✅ Validación automática de respuestas 
• ✅ Regeneración si no se usan datos actuales
• ✅ Modo honesto cuando no hay datos web
• ✅ Puntuación de calidad en tiempo real

🎯 **Para ${localConfig.companyName} en ${localConfig.industry}:**
• Búsqueda web garantizada con Perplexity
• Validación de que uso datos actuales (no de 2023)
• Fuentes verificadas y fechas actuales
• Rechazo automático de respuestas sin datos web

**El sistema ahora FUERZA el uso de datos web reales. Probémoslo.**

¿Qué análisis competitivo necesitas con datos actuales?`,
        timestamp: new Date(),
        agentType: agentId
      };
      
      setLocalConfig(prev => ({ ...prev, ...sessionConfig }));
    }
  }, [sessionId, messages.length, agentId, localConfig, sessionConfig]);

  const handleSendMessage = async () => {
    if (!sessionId || !inputMessage.trim()) return;
    
    await processMessage(inputMessage, sessionId);
    setInputMessage('');
  };

  const handleRetryMessage = async () => {
    if (!sessionId) return;
    await retryLastMessage(sessionId);
  };

  const handleQuickSetup = () => {
    setLocalConfig({
      companyName: 'Mi Empresa',
      industry: 'tecnología',
      analysisFocus: 'análisis competitivo',
      objectives: 'identificar oportunidades de mercado'
    });
    setShowQuickSetup(false);
  };

  // Quick setup screen
  if (!localConfig.companyName && !showQuickSetup) {
    return (
      <Card className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Sistema Reparado - {agentId.toUpperCase()}</h3>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Web Data Forzado
            </Badge>
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-4 max-w-md">
            <Settings className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Sistema Web Reparado</h3>
            <p className="text-muted-foreground">
              Nuevo sistema que FUERZA el uso de datos web actuales y valida automáticamente las respuestas.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleQuickSetup}>
              <Zap className="h-4 w-4 mr-2" />
              Configuración Rápida
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowQuickSetup(true)}
            >
              Configurar Manualmente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Manual setup screen
  if (showQuickSetup) {
    return (
      <Card className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Configuración Manual</h3>
          </div>
        </div>
        <CardContent className="flex-1 flex flex-col space-y-4 p-6">
          <div>
            <label className="text-sm font-medium">Nombre de la Empresa</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={localConfig.companyName}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Ej: Mi Empresa Tech"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Industria</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={localConfig.industry}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="Ej: tecnología, finanzas, retail"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Enfoque de Análisis</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              value={localConfig.analysisFocus}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, analysisFocus: e.target.value }))}
              placeholder="Ej: análisis competitivo, investigación de mercado"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Objetivos</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              value={localConfig.objectives}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, objectives: e.target.value }))}
              placeholder="Ej: identificar oportunidades de mercado y amenazas competitivas"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowQuickSetup(false)}
              disabled={!localConfig.companyName}
            >
              <Shield className="h-4 w-4 mr-2" />
              Iniciar Sistema Reparado
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowQuickSetup(false)}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasErrorMessages = messages.some(msg => msg.hasError);
  const lastMessage = messages[messages.length - 1];
  const validationScore = lastMessage?.metadata?.validationScore || 0;

  return (
    <Card className="h-full flex flex-col">
      {/* Header with validation status */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">{agentId.toUpperCase()} Agent - Sistema Reparado</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Web Data Forzado
            </Badge>
            {lastMessage?.metadata?.hasValidWebData && (
              <Badge variant="outline" className={
                validationScore >= 75 ? 'text-green-600 border-green-600' :
                validationScore >= 50 ? 'text-yellow-600 border-yellow-600' :
                'text-red-600 border-red-600'
              }>
                Validación: {validationScore}%
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Sistema que FUERZA el uso de datos web • {localConfig.companyName} • {localConfig.industry}
        </p>
      </div>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Status alerts */}
        {validationScore >= 75 && (
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Sistema verificado: Respuesta usa datos web actuales con alta confianza ({validationScore}%)
            </AlertDescription>
          </Alert>
        )}

        {validationScore > 0 && validationScore < 75 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              ⚠️ Validación parcial: Algunos datos web usados pero pueden necesitar refinamiento ({validationScore}%)
            </AlertDescription>
          </Alert>
        )}

        {hasErrorMessages && canRetry && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 flex items-center justify-between">
              <span>Error detectado en el sistema reparado</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryMessage}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
              <LoadingMessage 
                customText="🔧 Sistema reparado procesando con validación de datos web forzada..."
              />
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isProcessing}
          disabled={!sessionId}
          placeholder="Pregunta algo - el sistema FORZARÁ el uso de datos web actuales..."
        />
      </CardContent>
    </Card>
  );
}
