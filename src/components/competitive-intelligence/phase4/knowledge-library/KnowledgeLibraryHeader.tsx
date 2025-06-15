
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain } from 'lucide-react';

interface KnowledgeLibraryHeaderProps {
  totalItems: number;
}

export function KnowledgeLibraryHeader({ totalItems }: KnowledgeLibraryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-500" />
          AI-Powered Knowledge Library
        </h2>
        <p className="text-muted-foreground">
          Comprehensive repository of competitive intelligence resources and frameworks
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="default" className="flex items-center gap-1">
          <Brain className="h-3 w-3" />
          AI-Enhanced Content
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          {totalItems} Resources
        </Badge>
      </div>
    </div>
  );
}
