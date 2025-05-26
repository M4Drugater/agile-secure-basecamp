
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, GraduationCap, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeSearchResult } from '@/hooks/useKnowledgeRetrieval';

interface KnowledgeRecommendationsProps {
  recommendations: KnowledgeSearchResult[];
  onViewResource: (resource: KnowledgeSearchResult) => void;
}

export function KnowledgeRecommendations({ recommendations, onViewResource }: KnowledgeRecommendationsProps) {
  const navigate = useNavigate();

  if (recommendations.length === 0) return null;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'learning_path':
        return <GraduationCap className="h-4 w-4" />;
      case 'personal':
        return <BookOpen className="h-4 w-4" />;
      case 'system':
        return <BookOpen className="h-4 w-4" />;
      case 'downloadable':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'learning_path':
        return 'Course';
      case 'personal':
        return 'Personal';
      case 'system':
        return 'Framework';
      case 'downloadable':
        return 'Resource';
      default:
        return source;
    }
  };

  const handleViewResource = (item: KnowledgeSearchResult) => {
    // Navigate based on the source type
    if (item.source === 'learning_path') {
      // Navigate to learning management page
      navigate('/learning');
    } else {
      // Navigate to knowledge base
      navigate('/knowledge-base');
    }
    
    // Also call the original handler
    onViewResource(item);
  };

  return (
    <div className="w-80 flex-shrink-0">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Related Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((item, index) => (
            <div
              key={`${item.source}-${item.id}-${index}`}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleViewResource(item)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                <Badge 
                  variant={item.source === 'learning_path' ? 'default' : 'secondary'} 
                  className="flex-shrink-0"
                >
                  {getSourceIcon(item.source)}
                  <span className="ml-1 text-xs">{getSourceLabel(item.source)}</span>
                </Badge>
              </div>
              
              {item.content && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {item.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
              )}

              {item.source === 'learning_path' && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  {item.difficulty_level && (
                    <Badge variant="outline" className="text-xs">
                      {item.difficulty_level}
                    </Badge>
                  )}
                  {item.estimated_duration_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.estimated_duration_hours}h</span>
                    </div>
                  )}
                  {item.enrollment_count && item.enrollment_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{item.enrollment_count}</span>
                    </div>
                  )}
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{item.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewResource(item);
                }}
              >
                {item.source === 'learning_path' ? 'View Course' : 'View Resource'}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
