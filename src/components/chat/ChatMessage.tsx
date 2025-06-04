
import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex items-start space-x-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="flex-shrink-0">
          <Bot className="h-6 w-6 text-primary" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere leading-relaxed">
          {message.content}
        </p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
      {message.role === 'user' && (
        <div className="flex-shrink-0">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
