
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Star } from 'lucide-react';

interface KnowledgeRecommendation {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  type: 'document' | 'article' | 'resource';
  url?: string;
}

interface KnowledgeRecommendationsProps {
  recommendations: KnowledgeRecommendation[];
  onViewResource: (resource: KnowledgeRecommendation) => void;
}

export function KnowledgeRecommendations({ 
  recommendations, 
  onViewResource 
}: KnowledgeRecommendationsProps) {
  const [filteredRecommendations, setFilteredRecommendations] = useState<KnowledgeRecommendation[]>([]);

  const searchRecommendations = useCallback((searchTerm: string = '') => {
    if (!searchTerm.trim()) {
      setFilteredRecommendations(recommendations);
      return;
    }

    const filtered = recommendations.filter(rec =>
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecommendations(filtered);
  }, [recommendations]);

  useEffect(() => {
    searchRecommendations();
  }, [searchRecommendations]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-80 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm">{recommendation.title}</h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs">{recommendation.relevanceScore}</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {recommendation.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {recommendation.type}
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewResource(recommendation)}
                  className="h-6 px-2 text-xs"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
