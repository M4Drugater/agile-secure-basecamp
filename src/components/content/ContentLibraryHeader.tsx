
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Library } from 'lucide-react';

interface ContentLibraryHeaderProps {
  onCreateContent: () => void;
  embedded?: boolean;
}

export function ContentLibraryHeader({ onCreateContent, embedded = false }: ContentLibraryHeaderProps) {
  if (embedded) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Library className="h-5 w-5" />
            Content Library
          </h3>
          <p className="text-muted-foreground text-sm">
            Manage and organize your created content
          </p>
        </div>
        <Button onClick={onCreateContent} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Content Library</h1>
        <p className="text-muted-foreground mt-2">
          Manage and organize all your professional content
        </p>
      </div>
      <Button onClick={onCreateContent}>
        <Plus className="h-4 w-4 mr-2" />
        Create Content
      </Button>
    </div>
  );
}
