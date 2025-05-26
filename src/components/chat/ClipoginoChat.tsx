
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { useClipoginoChat } from './useClipoginoChat';
import { ChatHeader } from './ChatHeader';
import { UsageWarning } from './UsageWarning';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';
import { ChatInput } from './ChatInput';

export function ClipoginoChat() {
  const { messages, isLoading, sendMessage } = useClipoginoChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ChatHeader />
      <UsageWarning />

      {/* Chat Area */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Professional Development Chat</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && <WelcomeMessage />}
              
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              
              {isLoading && <LoadingMessage />}
            </div>
          </ScrollArea>

          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
