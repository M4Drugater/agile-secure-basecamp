
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContentLibraryHeaderProps {
  onCreateContent: () => void;
}

export function ContentLibraryHeader({ onCreateContent }: ContentLibraryHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Content Library</h1>
        <p className="text-muted-foreground">
          Manage and organize all your content in one place
        </p>
      </div>
      <Button onClick={onCreateContent}>
        <Plus className="h-4 w-4 mr-2" />
        Create Content
      </Button>
    </div>
  );
}
