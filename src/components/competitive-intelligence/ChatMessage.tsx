
import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentType?: string;
  searchData?: any;
  metadata?: any;
  hasError?: boolean;
  canRetry?: boolean;
}

interface ChatMessageProps {
  message: Message;
  showMetadata?: boolean;
}

export function ChatMessage({ message, showMetadata }: ChatMessageProps) {
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
        
        {showMetadata && message.metadata && (
          <div className={`text-xs mt-2 pt-2 border-t ${
            message.role === 'user' ? 'border-blue-400 text-blue-200' : 'border-gray-300 text-gray-400'
          }`}>
            {message.metadata.model && <div>Model: {message.metadata.model}</div>}
            {message.metadata.tokensUsed && <div>Tokens: {message.metadata.tokensUsed}</div>}
            {message.metadata.cost && <div>Cost: ${message.metadata.cost}</div>}
            {message.metadata.searchStatus && <div>Search: {message.metadata.searchStatus}</div>}
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}
