
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { isLoading: costLoading } = useCostMonitoring();

  const handleSendMessage = () => {
    if (!input.trim() || isLoading || costLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex space-x-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask CLIPOGINO about your career development..."
        className="flex-1 min-h-[60px]"
        disabled={isLoading || costLoading}
      />
      <Button
        onClick={handleSendMessage}
        disabled={!input.trim() || isLoading || costLoading}
        size="lg"
        className="self-end"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
