
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  Brain, 
  Target, 
  BookOpen,
  Star,
  Download,
  Clock,
  Lightbulb
} from 'lucide-react';
import { KnowledgeItem } from './types';

interface KnowledgeItemCardProps {
  item: KnowledgeItem;
}

export function KnowledgeItemCard({ item }: KnowledgeItemCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'framework': return 'bg-blue-500';
      case 'case_study': return 'bg-green-500';
      case 'template': return 'bg-purple-500';
      case 'research': return 'bg-orange-500';
      case 'best_practice': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'video': return <Eye className="h-4 w-4" />;
      case 'interactive': return <Brain className="h-4 w-4" />;
      case 'template': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getTypeIcon(item.type)}
              {item.title}
              {item.aiEnhanced && (
                <Lightbulb className="h-4 w-4 text-yellow-500" />
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge 
            variant="secondary"
            className={`${getCategoryColor(item.category)} text-white text-xs`}
          >
            {item.category.replace('_', ' ')}
          </Badge>
          <Badge 
            variant="outline"
            className={`${getDifficultyColor(item.difficulty)} text-xs`}
          >
            {item.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Rating and Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{item.rating}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {item.downloads}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {item.views}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            {item.type === 'video' ? 'Watch' : 'View'}
          </Button>
          {item.type !== 'video' && (
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Download
            </Button>
          )}
        </div>

        {/* Publish Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(item.publishDate).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
