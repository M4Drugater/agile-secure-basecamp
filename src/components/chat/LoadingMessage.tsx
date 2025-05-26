
import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

export function LoadingMessage() {
  return (
    <div className="flex items-start space-x-3">
      <Bot className="h-6 w-6 text-primary" />
      <div className="bg-muted rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">CLIPOGINO is thinking...</span>
        </div>
      </div>
    </div>
  );
}
