
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface ContentLibraryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export function ContentLibraryFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
}: ContentLibraryFiltersProps) {
  const contentTypes = [
    { value: 'resume', label: 'Resume' },
    { value: 'cover-letter', label: 'Cover Letter' },
    { value: 'linkedin-post', label: 'LinkedIn Post' },
    { value: 'email', label: 'Email' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'article', label: 'Article' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-soft mb-8 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Filter & Search</h3>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content by title, tags, or content..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 focus-ring bg-white/50 border-border/50 focus:bg-white hover:bg-white/70 transition-colors"
          />
        </div>
        
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-48 focus-ring bg-white/50 border-border/50 hover:bg-white/70 transition-colors">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-border/50">
            <SelectItem value="all">All Types</SelectItem>
            {contentTypes.map(type => (
              <SelectItem key={type.value} value={type.value} className="hover:bg-primary/10">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-48 focus-ring bg-white/50 border-border/50 hover:bg-white/70 transition-colors">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-border/50">
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status.value} value={status.value} className="hover:bg-primary/10">
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
