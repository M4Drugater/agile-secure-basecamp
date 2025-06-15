
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { KnowledgeItem } from './types';
import { KnowledgeItemCard } from './KnowledgeItemCard';

interface KnowledgeItemsGridProps {
  items: KnowledgeItem[];
}

export function KnowledgeItemsGrid({ items }: KnowledgeItemsGridProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or category filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <KnowledgeItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
