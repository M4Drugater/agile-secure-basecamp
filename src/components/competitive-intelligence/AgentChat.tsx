
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgentSession } from '@/hooks/competitive-intelligence/useAgentSession';
import { useAgentChatMessages } from '@/hooks/competitive-intelligence/useAgentChatMessages';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingMessage } from './LoadingMessage';
import { ConfigurationRequired } from './ConfigurationRequired';

interface AgentChatProps {
  agentId: string;
  sessionConfig: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
  };
}

export function AgentChat({ agentId, sessionConfig }: AgentChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { sessionId } = useAgentSession(agentId, sessionConfig);
  const { messages, isLoading, sendMessage, addWelcomeMessage } = useAgentChatMessages(agentId, sessionConfig);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Add welcome message when session is initialized
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      addWelcomeMessage();
    }
  }, [sessionId, messages.length]);

  const handleSendMessage = async () => {
    if (!sessionId) return;
    
    await sendMessage(inputMessage, sessionId);
    setInputMessage('');
  };

  if (!sessionConfig.companyName) {
    return <ConfigurationRequired />;
  }

  return (
    <Card className="h-full flex flex-col">
      <ChatHeader agentId={agentId} sessionConfig={sessionConfig} />

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && <LoadingMessage />}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!sessionId}
        />
      </CardContent>
    </Card>
  );
}
