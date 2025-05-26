
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContentLibraryEmptyStateProps {
  hasContentItems: boolean;
  onCreateContent: () => void;
}

export function ContentLibraryEmptyState({ hasContentItems, onCreateContent }: ContentLibraryEmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="text-muted-foreground mb-4">
          {!hasContentItems ? (
            <>
              <h3 className="text-lg font-semibold mb-2">No content yet</h3>
              <p>Start building your content library by creating your first item</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">No matching content</h3>
              <p>Try adjusting your search or filter criteria</p>
            </>
          )}
        </div>
        {!hasContentItems && (
          <Button onClick={onCreateContent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Content
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
