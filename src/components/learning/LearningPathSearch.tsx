
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface LearningPathSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function LearningPathSearch({ searchTerm, onSearchChange }: LearningPathSearchProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search learning paths..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
