
import React, { useState } from 'react';
import { useContentItems, ContentItem } from '@/hooks/useContentItems';
import { ContentEditor } from './ContentEditor';
import { ContentLibraryHeader } from './ContentLibraryHeader';
import { ContentLibraryFilters } from './ContentLibraryFilters';
import { ContentLibraryGrid } from './ContentLibraryGrid';

interface ContentLibraryProps {
  onEdit?: (item: ContentItem) => void;
  onCreateContent?: () => void;
  onContentSelect?: (item: ContentItem) => void;
  embedded?: boolean;
}

export function ContentLibrary({ 
  onEdit, 
  onCreateContent, 
  onContentSelect,
  embedded = false 
}: ContentLibraryProps) {
  const { contentItems, isLoading, deleteContentItem, duplicateContentItem, updateContentItem } = useContentItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  const filteredItems = contentItems?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || item.content_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleEdit = (item: ContentItem) => {
    if (onEdit) {
      onEdit(item);
    } else {
      setEditingItem(item);
      setShowEditor(true);
    }
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

  const handleCreateContent = () => {
    if (onCreateContent) {
      onCreateContent();
    } else {
      setEditingItem(null);
      setShowEditor(true);
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingItem(null);
  };

  // If not embedded and showing editor, render editor
  if (!embedded && showEditor) {
    return (
      <ContentEditor
        item={editingItem}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ContentLibraryHeader 
        onCreateContent={handleCreateContent}
        embedded={embedded}
      />
      
      <ContentLibraryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <ContentLibraryGrid
        items={filteredItems}
        isLoading={isLoading}
        hasContentItems={(contentItems?.length || 0) > 0}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={(item) => duplicateContentItem.mutate(item.id)}
        onToggleFavorite={handleToggleFavorite}
        onCreateContent={handleCreateContent}
        onContentSelect={onContentSelect}
        embedded={embedded}
      />
    </div>
  );
}
