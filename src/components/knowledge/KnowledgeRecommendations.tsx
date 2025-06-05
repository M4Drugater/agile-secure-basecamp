
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEnhancedKnowledgeBase, KnowledgeRecommendation } from '@/hooks/useEnhancedKnowledgeBase';
import { Search, Brain, FileText, Database, ExternalLink } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface KnowledgeRecommendationsProps {
  searchTerm?: string;
  onRecommendationClick?: (recommendation: KnowledgeRecommendation) => void;
}

export function KnowledgeRecommendations({ 
  searchTerm = '', 
  onRecommendationClick 
}: KnowledgeRecommendationsProps) {
  const { getRecommendations } = useEnhancedKnowledgeBase();
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
  const [recommendations, setRecommendations] = useState<KnowledgeRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchTerm = useDebounce(internalSearchTerm || searchTerm, 300);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!debouncedSearchTerm?.trim()) {
        setRecommendations([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await getRecommendations(debouncedSearchTerm);
        setRecommendations(results);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchRecommendations();
  }, [debouncedSearchTerm, getRecommendations]);

  const getKnowledgeTypeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <Database className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4 text-gray-500" />;
    }
  };

  const getKnowledgeTypeBadge = (type: string) => {
    const variants = {
      personal: 'default',
      system: 'secondary',
    } as const;
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || 'outline'}>
        {type === 'personal' ? 'Personal' : 'System'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Knowledge Recommendations
        </CardTitle>
        <CardDescription>
          Discover relevant knowledge from your personal library and system resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!searchTerm && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for knowledge and recommendations..."
                value={internalSearchTerm}
                onChange={(e) => setInternalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {isSearching && (
            <div className="text-center text-muted-foreground">
              <Brain className="h-6 w-6 animate-pulse mx-auto mb-2" />
              Searching knowledge base...
            </div>
          )}

          {!isSearching && debouncedSearchTerm && recommendations.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p>No relevant knowledge found</p>
              <p className="text-sm">Try different search terms or add more content to your knowledge base</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Found {recommendations.length} relevant knowledge items
              </div>
              
              {recommendations.map((rec) => (
                <div
                  key={`${rec.knowledge_type}-${rec.id}`}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => onRecommendationClick?.(rec)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getKnowledgeTypeIcon(rec.knowledge_type)}
                      <h4 className="font-medium line-clamp-1">{rec.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getKnowledgeTypeBadge(rec.knowledge_type)}
                      <Badge variant="outline" className="text-xs">
                        {Math.round(rec.relevance_score * 100)}% match
                      </Badge>
                    </div>
                  </div>
                  
                  {rec.description && rec.description !== rec.title && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {rec.description}
                    </p>
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {rec.content_snippet}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                      {rec.knowledge_type === 'personal' ? 'Your Knowledge' : 'System Knowledge'}
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
