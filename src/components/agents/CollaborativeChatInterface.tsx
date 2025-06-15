
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Sparkles } from 'lucide-react';
import { AgentConfig } from './UnifiedAgentWorkspace';
import { ChatHeader } from './collaborative/ChatHeader';
import { MessageList } from './collaborative/MessageList';
import { ChatInput } from './collaborative/ChatInput';
import { useEnhancedCollaborativeChat } from '@/hooks/collaborative/useEnhancedCollaborativeChat';

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
  const [inputMessage, setInputMessage] = useState('');

  const {
    messages,
    isProcessing,
    currentStep,
    sendCollaborativeMessage,
    initializeCollaborativeChat
  } = useEnhancedCollaborativeChat({
    selectedAgents,
    sessionConfig
  });

  // Inicializar chat cuando se cargan los agentes
  useEffect(() => {
    if (selectedAgents.length > 0) {
      initializeCollaborativeChat();
    }
  }, [selectedAgents.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const currentInput = inputMessage;
    setInputMessage('');
    
    await sendCollaborativeMessage(currentInput);
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
