
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Database, Filter, X, BookOpen, Zap } from 'lucide-react';
import { useKnowledgeSearch } from '@/hooks/useKnowledgeSearch';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'personal' | 'system' | 'resource';
  category?: string;
  relevanceScore: number;
  tags: string[];
}

interface AdvancedKnowledgeSearchProps {
  onResultSelect?: (result: SearchResult) => void;
}

export function AdvancedKnowledgeSearch({ onResultSelect }: AdvancedKnowledgeSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    tags: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);

  const { 
    searchResults, 
    isSearching, 
    searchKnowledge, 
    availableCategories, 
    availableTags 
  } = useKnowledgeSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    await searchKnowledge({
      query: query.trim(),
      filters: filters.type !== 'all' ? { type: filters.type } : undefined,
      categories: filters.category !== 'all' ? [filters.category] : undefined,
      tags: filters.tags.length > 0 ? filters.tags : undefined
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters]);

  const handleAddTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personal': return <FileText className="h-4 w-4" />;
      case 'system': return <Database className="h-4 w-4" />;
      case 'resource': return <BookOpen className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'system': return 'bg-purple-100 text-purple-800';
      case 'resource': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Advanced Knowledge Search
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all your knowledge sources..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-primary text-primary-foreground' : ''}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Source Type</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="personal">Personal Files</SelectItem>
                      <SelectItem value="system">System Knowledge</SelectItem>
                      <SelectItem value="resource">Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {filters.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={handleAddTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add tags to filter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags
                      .filter(tag => !filters.tags.includes(tag))
                      .map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Searching knowledge base...</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Search Results ({searchResults.length})</h4>
              <Badge variant="outline">{query}</Badge>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <Card 
                  key={result.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onResultSelect?.(result)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium truncate flex-1">{result.title}</h5>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                          {getTypeIcon(result.type)}
                          <span className="ml-1 capitalize">{result.type}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(result.relevanceScore * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.content.substring(0, 150)}...
                    </p>
                    {result.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {result.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {result.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {query && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No results found for "{query}"</p>
            <p className="text-sm">Try adjusting your search terms or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
