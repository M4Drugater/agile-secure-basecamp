
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import { SystemKnowledgeUploadDialog } from './SystemKnowledgeUploadDialog';

interface SystemKnowledgeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  categories: string[];
  refreshing: boolean;
  onRefresh: () => void;
  onUploadComplete: () => void;
}

const knowledgeTypes = [
  { value: 'framework', label: 'Framework' },
  { value: 'methodology', label: 'Methodology' },
  { value: 'best_practice', label: 'Best Practice' },
  { value: 'template', label: 'Template' },
  { value: 'guideline', label: 'Guideline' },
  { value: 'user_contributed', label: 'User Contributed' },
];

export function SystemKnowledgeSearch({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  categories,
  refreshing,
  onRefresh,
  onUploadComplete,
}: SystemKnowledgeSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar frameworks, metodologías, mejores prácticas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {knowledgeTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          disabled={refreshing}
          className={refreshing ? 'animate-spin' : ''}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <SystemKnowledgeUploadDialog onUploadComplete={onUploadComplete} />
      </div>
    </div>
  );
}
