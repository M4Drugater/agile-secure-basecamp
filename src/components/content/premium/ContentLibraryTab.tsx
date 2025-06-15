
import React, { useState } from 'react';
import { ContentLibrary } from '../ContentLibrary';
import { ContentEditor } from '../ContentEditor';
import { ContentItem } from '@/hooks/useContentItems';

interface ContentLibraryTabProps {
  onContentSelect?: (content: ContentItem) => void;
}

export function ContentLibraryTab({ onContentSelect }: ContentLibraryTabProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  const handleEditContent = (item: ContentItem) => {
    setEditingItem(item);
    setShowEditor(true);
  };

  const handleCreateContent = () => {
    setEditingItem(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingItem(null);
  };

  if (showEditor) {
    return (
      <ContentEditor
        item={editingItem}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <ContentLibrary 
      onEdit={handleEditContent}
      onCreateContent={handleCreateContent}
      onContentSelect={onContentSelect}
      embedded={true}
    />
  );
}
