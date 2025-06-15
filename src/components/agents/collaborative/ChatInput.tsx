
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isProcessing: boolean;
}

export function ChatInput({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isProcessing 
}: ChatInputProps) {
  return (
    <div className="space-y-2">
      <Textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Haz una pregunta para que todos los agentes colaboren en la respuesta..."
        className="min-h-[80px]"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
          }
        }}
      />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
        <Button 
          onClick={onSendMessage} 
          disabled={!inputMessage.trim() || isProcessing}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Enviar
        </Button>
      </div>
    </div>
  );
}
