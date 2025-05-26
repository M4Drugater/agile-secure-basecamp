
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, FileText, Download, Eye } from 'lucide-react';
import { KnowledgeSearchResult } from '@/hooks/useKnowledgeRetrieval';

interface KnowledgeRecommendationsProps {
  recommendations: KnowledgeSearchResult[];
  onViewResource?: (resource: KnowledgeSearchResult) => void;
}

export function KnowledgeRecommendations({ 
  recommendations, 
  onViewResource 
}: KnowledgeRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'personal':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'system':
        return <BookOpen className="h-4 w-4 text-purple-600" />;
      case 'downloadable':
        return <Download className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'personal':
        return 'Personal';
      case 'system':
        return 'System';
      case 'downloadable':
        return 'Resource';
      default:
        return source;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'personal':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'system':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'downloadable':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Relevant Knowledge
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {recommendations.map((item) => (
              <div
                key={`${item.source}-${item.id}`}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(item.source)}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getSourceColor(item.source)}`}
                    >
                      {getSourceLabel(item.source)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(item.relevanceScore * 10) / 10}
                  </div>
                </div>
                
                <h4 className="text-sm font-medium line-clamp-2 mb-1">
                  {item.title}
                </h4>
                
                {item.content && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {item.content.substring(0, 100)}
                    {item.content.length > 100 ? '...' : ''}
                  </p>
                )}

                {item.category && (
                  <div className="text-xs text-muted-foreground mb-2">
                    Category: {item.category}
                  </div>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {onViewResource && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-6 text-xs"
                    onClick={() => onViewResource(item)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
