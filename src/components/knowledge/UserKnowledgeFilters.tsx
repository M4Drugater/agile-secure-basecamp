
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface UserKnowledgeFiltersProps {
  searchTerm: string;
  selectedType: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function UserKnowledgeFilters({
  searchTerm,
  selectedType,
  onSearchChange,
  onTypeChange,
}: UserKnowledgeFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your knowledge..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Files</SelectItem>
          <SelectItem value="uploaded">Uploaded Files</SelectItem>
          <SelectItem value="manual">Manual Entries</SelectItem>
          <SelectItem value="processed">AI Processed</SelectItem>
          <SelectItem value="unprocessed">Not Processed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
