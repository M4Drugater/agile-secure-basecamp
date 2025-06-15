
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface KnowledgeSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function KnowledgeSearchFilters({ searchTerm, setSearchTerm }: KnowledgeSearchFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Filters
        </Button>
      </div>
    </div>
  );
}
