
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote
} from 'lucide-react';

interface RichTextToolbarProps {
  editor: Editor;
}

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter link URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1">
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        type="button"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => toggleHeading(1)}
        type="button"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => toggleHeading(2)}
        type="button"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
        size="sm"
        onClick={() => toggleHeading(3)}
        type="button"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        type="button"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        type="button"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        type="button"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        variant={editor.isActive('code') ? 'default' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        type="button"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={addLink}
        type="button"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        type="button"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
