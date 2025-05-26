
import React from 'react';
import { Bot } from 'lucide-react';

export function WelcomeMessage() {
  return (
    <div className="text-center text-muted-foreground py-8">
      <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <p className="text-lg font-medium mb-2">Welcome to CLIPOGINO!</p>
      <p>I'm your AI-powered career mentor. Ask me about:</p>
      <ul className="text-sm mt-2 space-y-1">
        <li>• Career strategy and planning</li>
        <li>• Leadership development</li>
        <li>• Interview preparation</li>
        <li>• Professional skills</li>
      </ul>
    </div>
  );
}
