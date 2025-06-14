
import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] p-3 rounded-lg ${
        message.role === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className={`text-xs mt-1 ${
          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}
