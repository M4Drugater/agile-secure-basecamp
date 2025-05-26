
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

interface UserKnowledgeEmptyStateProps {
  searchTerm: string;
  selectedType: string;
  onAddNew: () => void;
}

export function UserKnowledgeEmptyState({
  searchTerm,
  selectedType,
  onAddNew,
}: UserKnowledgeEmptyStateProps) {
  const hasFilters = searchTerm || selectedType !== 'all';

  return (
    <Card className="text-center py-12">
      <CardContent>
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No knowledge files found</h3>
        <p className="text-muted-foreground mb-4">
          {hasFilters 
            ? 'Try adjusting your search or filter criteria'
            : 'Start building your personal knowledge base by adding your first file'
          }
        </p>
        {!hasFilters && (
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Knowledge File
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
