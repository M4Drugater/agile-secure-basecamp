
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContentItem } from '@/hooks/useContentItems';
import { MoreVertical, Edit, Copy, Heart, HeartOff, Trash2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ContentLibraryCardProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onToggleFavorite: (item: ContentItem) => void;
}

export function ContentLibraryCard({ 
  item, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onToggleFavorite 
}: ContentLibraryCardProps) {
  const contentTypes = [
    { value: 'resume', label: 'Resume' },
    { value: 'cover-letter', label: 'Cover Letter' },
    { value: 'linkedin-post', label: 'LinkedIn Post' },
    { value: 'email', label: 'Email' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'article', label: 'Article' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Archived', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge variant="secondary" className={statusConfig?.color}>
        {statusConfig?.label}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
              {item.title}
              {item.is_favorite && (
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              )}
            </CardTitle>
            <CardDescription>
              {contentTypes.find(t => t.value === item.content_type)?.label}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(item)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(item)}>
                {item.is_favorite ? (
                  <HeartOff className="h-4 w-4 mr-2" />
                ) : (
                  <Heart className="h-4 w-4 mr-2" />
                )}
                {item.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.content.substring(0, 150)}...
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.estimated_read_time} min read
            </div>
            <div>{item.word_count} words</div>
          </div>

          <div className="flex items-center justify-between">
            {getStatusBadge(item.status)}
            <div className="text-xs text-muted-foreground">
              {format(new Date(item.updated_at), 'MMM d, yyyy')}
            </div>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
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

          {item.scheduled_for && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Calendar className="h-3 w-3" />
              Scheduled for {format(new Date(item.scheduled_for), 'MMM d, yyyy h:mm a')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
