
import React from 'react';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  return (
    <div className={cn("border rounded-lg", className)}>
      <div className="p-4 prose prose-sm max-w-none">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
        ) : (
          <p className="text-muted-foreground">{placeholder}</p>
        )}
      </div>
    </div>
  );
}
