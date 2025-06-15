
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Star, 
  Edit, 
  Trash2, 
  Copy, 
  Calendar,
  Eye,
  Plus
} from 'lucide-react';
import { ContentItem } from '@/hooks/useContentItems';
import { format } from 'date-fns';

interface ContentLibraryGridProps {
  items: ContentItem[];
  isLoading: boolean;
  hasContentItems: boolean;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onToggleFavorite: (item: ContentItem) => void;
  onCreateContent: () => void;
  onContentSelect?: (item: ContentItem) => void;
  embedded?: boolean;
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
  onContentSelect,
  embedded = false
}: ContentLibraryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!hasContentItems) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">No content yet</CardTitle>
          <CardDescription className="mb-4">
            {embedded 
              ? "Start creating content with the generator above, or create content manually."
              : "Create your first piece of content to get started with your professional library."
            }
          </CardDescription>
          <Button onClick={onCreateContent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Content
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {item.content_type.replace('-', ' ')}
                  </Badge>
                  <Badge 
                    variant={item.status === 'published' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => onToggleFavorite(item)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
              >
                <Star 
                  className={`h-4 w-4 ${
                    item.is_favorite 
                      ? 'text-yellow-500 fill-current' 
                      : 'text-gray-400'
                  }`} 
                />
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(item.created_at), 'MMM d, yyyy')}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onContentSelect && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onContentSelect(item)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onEdit(item)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDuplicate(item)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDelete(item)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
