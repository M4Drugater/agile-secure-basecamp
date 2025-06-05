
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Brain, FileText, Database } from 'lucide-react';
import { useEnhancedKnowledgeBase } from '@/hooks/useEnhancedKnowledgeBase';
import { useDebounce } from '@/hooks/useDebounce';

export function KnowledgeRecommendations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { getRecommendations } = useEnhancedKnowledgeBase();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  React.useEffect(() => {
    const searchRecommendations = async () => {
      if (!debouncedSearchQuery.trim()) {
        setRecommendations([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await getRecommendations(debouncedSearchQuery);
        setRecommendations(results);
      } catch (error) {
        console.error('Error getting recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchRecommendations();
  }, [debouncedSearchQuery, getRecommendations]);

  const getKnowledgeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return <FileText className="h-4 w-4" />;
      case 'system':
        return <Database className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getKnowledgeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-50 text-blue-600';
      case 'system':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Knowledge Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your knowledge base for recommendations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isSearching && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <Brain className="h-4 w-4 animate-pulse" />
                  Searching knowledge base...
                </div>
              </div>
            )}

            {!searchQuery.trim() && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Enter a search term to get AI-powered recommendations from your knowledge base</p>
              </div>
            )}

            {searchQuery.trim() && !isSearching && recommendations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recommendations found for "{searchQuery}"</p>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="space-y-3">
                {recommendations.map((recommendation) => (
                  <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${getKnowledgeColor(recommendation.knowledge_type)}`}>
                              {getKnowledgeIcon(recommendation.knowledge_type)}
                            </div>
                            <h4 className="font-medium">{recommendation.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(recommendation.relevance_score * 100)}% match
                            </Badge>
                          </div>
                          
                          {recommendation.description && (
                            <p className="text-sm text-muted-foreground">
                              {recommendation.description}
                            </p>
                          )}
                          
                          {recommendation.content_snippet && (
                            <p className="text-sm bg-gray-50 p-2 rounded border-l-2 border-gray-200">
                              {recommendation.content_snippet}...
                            </p>
                          )}
                        </div>

                        <Badge variant={recommendation.knowledge_type === 'personal' ? 'default' : 'secondary'}>
                          {recommendation.knowledge_type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
