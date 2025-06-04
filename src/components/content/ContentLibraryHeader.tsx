
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';

interface ContentLibraryHeaderProps {
  onCreateContent: () => void;
}

export function ContentLibraryHeader({ onCreateContent }: ContentLibraryHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold text-gradient">Content Library</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Manage and organize all your professional content in one centralized workspace. 
          Create, edit, and track performance across all your content assets.
        </p>
      </div>
      <Button 
        onClick={onCreateContent}
        className="btn-enhanced bg-gradient-primary hover:shadow-strong hover-lift"
        size="lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create Content
        <Sparkles className="h-4 w-4 ml-2 opacity-70" />
      </Button>
    </div>
  );
}
