
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot,
  Loader2
} from 'lucide-react';

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

interface ChatMessageProps {
  message: CollaborativeMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const getAgentIcon = (message: CollaborativeMessage) => {
    if (message.agentIcon) {
      const Icon = message.agentIcon;
      return <Icon className="h-4 w-4 text-white" />;
    }
    return <Bot className="h-4 w-4 text-white" />;
  };

  if (message.type === 'user') {
    return (
      <>
        <div className="flex justify-end">
          <div className="bg-blue-600 text-white rounded-lg p-3 max-w-3xl">
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
        <Separator className="my-2" />
      </>
    );
  }

  return (
    <>
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
      <Separator className="my-2" />
    </>
  );
}

export function LoadingChatMessage({ currentStep }: { currentStep: string }) {
  return (
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
  );
}
