
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { SystemKnowledgeUploadDialog } from './SystemKnowledgeUploadDialog';

interface SystemKnowledgeEmptyStateProps {
  hasFilters: boolean;
  onUploadComplete: () => void;
}

export function SystemKnowledgeEmptyState({ 
  hasFilters, 
  onUploadComplete 
}: SystemKnowledgeEmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No se encontró conocimiento</h3>
        <p className="text-muted-foreground mb-4">
          {hasFilters
            ? 'Intenta ajustar tu búsqueda o criterios de filtro'
            : 'El conocimiento del sistema aparecerá aquí cuando esté disponible'
          }
        </p>
        <SystemKnowledgeUploadDialog onUploadComplete={onUploadComplete} />
      </CardContent>
    </Card>
  );
}
