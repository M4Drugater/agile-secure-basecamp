
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KnowledgeLibraryHeader } from './knowledge-library/KnowledgeLibraryHeader';
import { KnowledgeSearchFilters } from './knowledge-library/KnowledgeSearchFilters';
import { KnowledgeItemsGrid } from './knowledge-library/KnowledgeItemsGrid';
import { mockKnowledgeItems } from './knowledge-library/mockData';
import { CategoryInfo } from './knowledge-library/types';

export function KnowledgeLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [knowledgeItems] = useState(mockKnowledgeItems);

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories: CategoryInfo[] = [
    { id: 'all', label: 'All Categories', count: knowledgeItems.length },
    { id: 'framework', label: 'Frameworks', count: knowledgeItems.filter(i => i.category === 'framework').length },
    { id: 'case_study', label: 'Case Studies', count: knowledgeItems.filter(i => i.category === 'case_study').length },
    { id: 'template', label: 'Templates', count: knowledgeItems.filter(i => i.category === 'template').length },
    { id: 'research', label: 'Research', count: knowledgeItems.filter(i => i.category === 'research').length },
    { id: 'best_practice', label: 'Best Practices', count: knowledgeItems.filter(i => i.category === 'best_practice').length }
  ];

  return (
    <div className="space-y-6">
      <KnowledgeLibraryHeader totalItems={knowledgeItems.length} />
      
      <KnowledgeSearchFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory}>
          <KnowledgeItemsGrid items={filteredItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
