
import React, { useState } from 'react';
import { useSystemKnowledge } from '@/hooks/useSystemKnowledge';
import { SystemKnowledgeSearch } from './SystemKnowledgeSearch';
import { SystemKnowledgeCard } from './SystemKnowledgeCard';
import { SystemKnowledgeDetailDialog } from './SystemKnowledgeDetailDialog';
import { SystemKnowledgeEmptyState } from './SystemKnowledgeEmptyState';

export function SystemKnowledgeViewer() {
  const { documents, isLoading, refetch } = useSystemKnowledge();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Extract unique categories from documents
  const categories = [...new Set(documents?.map(doc => doc.category).filter(Boolean))];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleUploadComplete = () => {
    refetch();
  };

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.knowledge_type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  }) || [];

  const hasFilters = searchTerm || selectedCategory !== 'all' || selectedType !== 'all';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando conocimiento del sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SystemKnowledgeSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        categories={categories}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onUploadComplete={handleUploadComplete}
      />

      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <SystemKnowledgeCard
              key={document.id}
              document={document}
              onViewDetails={setViewingDocument}
            />
          ))}
        </div>
      ) : (
        <SystemKnowledgeEmptyState
          hasFilters={hasFilters}
          onUploadComplete={handleUploadComplete}
        />
      )}

      <SystemKnowledgeDetailDialog
        document={viewingDocument}
        open={!!viewingDocument}
        onOpenChange={() => setViewingDocument(null)}
      />
    </div>
  );
}
