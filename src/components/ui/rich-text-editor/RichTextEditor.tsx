
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { RichTextToolbar } from './RichTextToolbar';
import { createEditorExtensions, editorProps } from './editorConfig';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: createEditorExtensions(),
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      <RichTextToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="min-h-[200px]" 
        placeholder={placeholder}
      />
    </div>
  );
}
