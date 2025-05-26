
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContentItem } from '@/hooks/useContentItems';
import { MoreVertical, Edit, Copy, Heart, HeartOff, Trash2, Calendar, Clock, FileText } from 'lucide-react';
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
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'published', label: 'Published', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'archived', label: 'Archived', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge variant="outline" className={`${statusConfig?.color} border hover-lift`}>
        {statusConfig?.label}
      </Badge>
    );
  };

  return (
    <Card className="card-enhanced hover-lift group transition-all duration-300 hover:shadow-medium border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 flex items-center gap-2 group-hover:text-primary transition-colors">
              <FileText className="h-4 w-4 text-primary" />
              {item.title}
              {item.is_favorite && (
                <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {contentTypes.find(t => t.value === item.content_type)?.label}
              </Badge>
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border-border/50">
              <DropdownMenuItem onClick={() => onEdit(item)} className="hover:bg-primary/10 focus-ring">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(item)} className="hover:bg-primary/10 focus-ring">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(item)} className="hover:bg-primary/10 focus-ring">
                {item.is_favorite ? (
                  <HeartOff className="h-4 w-4 mr-2" />
                ) : (
                  <Heart className="h-4 w-4 mr-2" />
                )}
                {item.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-600 hover:bg-red-50 focus-ring">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {item.content.substring(0, 150)}...
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" />
              <span className="font-medium">{item.estimated_read_time} min read</span>
            </div>
            <div className="font-medium">{item.word_count} words</div>
          </div>

          <div className="flex items-center justify-between">
            {getStatusBadge(item.status)}
            <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
              Updated {format(new Date(item.updated_at), 'MMM d, yyyy')}
            </div>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-accent/10 border-accent/20 text-accent hover-lift">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-muted/50 hover-lift">
                  +{item.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {item.scheduled_for && (
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
              <Calendar className="h-3 w-3" />
              Scheduled for {format(new Date(item.scheduled_for), 'MMM d, yyyy h:mm a')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
