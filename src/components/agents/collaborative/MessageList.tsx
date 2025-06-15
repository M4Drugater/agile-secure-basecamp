
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, LoadingChatMessage } from './ChatMessage';

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

interface MessageListProps {
  messages: CollaborativeMessage[];
  isProcessing: boolean;
  currentStep: string;
}

export function MessageList({ messages, isProcessing, currentStep }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isProcessing && (
          <LoadingChatMessage currentStep={currentStep} />
        )}
      </div>
    </ScrollArea>
  );
}
