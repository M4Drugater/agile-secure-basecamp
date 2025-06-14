
import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

export function LoadingMessage() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-gray-100 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">Analizando...</span>
        </div>
      </div>
    </div>
  );
}
