
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen } from 'lucide-react';

export const ResearchHeader = React.memo(() => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-500" />
          Research Workbench
        </h1>
        <p className="text-muted-foreground mt-2">
          Intelligent research powered by Perplexity AI with verified sources
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          Enhanced Research v2.0
        </Badge>
      </div>
    </div>
  );
});

ResearchHeader.displayName = 'ResearchHeader';
