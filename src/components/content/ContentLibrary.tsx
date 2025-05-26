
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useContentItems, ContentItem } from '@/hooks/useContentItems';
import { Plus, Search, Filter, MoreVertical, Eye, Edit, Copy, Trash2, Calendar, Clock, Heart, HeartOff } from 'lucide-react';
import { format } from 'date-fns';
import { ContentEditor } from './ContentEditor';

export function ContentLibrary() {
  const { contentItems, isLoading, deleteContentItem, duplicateContentItem, updateContentItem } = useContentItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

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

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || item.content_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setShowEditor(true);
  };

  const handleDelete = (item: ContentItem) => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      deleteContentItem.mutate(item.id);
    }
  };

  const handleToggleFavorite = (item: ContentItem) => {
    updateContentItem.mutate({
      id: item.id,
      is_favorite: !item.is_favorite,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge variant="secondary" className={statusConfig?.color}>
        {statusConfig?.label}
      </Badge>
    );
  };

  if (showEditor) {
    return (
      <ContentEditor
        item={editingItem}
        onClose={() => {
          setShowEditor(false);
          setEditingItem(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">
            Manage and organize all your content in one place
          </p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {contentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              {contentItems.length === 0 ? (
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
            {contentItems.length === 0 && (
              <Button onClick={() => setShowEditor(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Content
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
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
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateContentItem.mutate(item)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFavorite(item)}>
                        {item.is_favorite ? (
                          <HeartOff className="h-4 w-4 mr-2" />
                        ) : (
                          <Heart className="h-4 w-4 mr-2" />
                        )}
                        {item.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
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
          ))}
        </div>
      )}
    </div>
  );
}
