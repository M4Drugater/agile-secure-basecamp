
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ContentItem } from '@/hooks/useContentItems';
import { ContentLibraryCard } from './ContentLibraryCard';
import { ContentLibraryEmptyState } from './ContentLibraryEmptyState';

interface ContentLibraryGridProps {
  items: ContentItem[];
  isLoading: boolean;
  hasContentItems: boolean;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onToggleFavorite: (item: ContentItem) => void;
  onCreateContent: () => void;
}

export function ContentLibraryGrid({
  items,
  isLoading,
  hasContentItems,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onCreateContent,
}: ContentLibraryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <ContentLibraryEmptyState
        hasContentItems={hasContentItems}
        onCreateContent={onCreateContent}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ContentLibraryCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
