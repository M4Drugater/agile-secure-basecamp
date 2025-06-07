
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, TrendingUp, Eye } from 'lucide-react';
import { SystemKnowledgeDocument } from '@/hooks/useSystemKnowledge';

interface SystemKnowledgeCardProps {
  document: SystemKnowledgeDocument;
  onViewDetails: (document: SystemKnowledgeDocument) => void;
}

const knowledgeTypes = [
  { value: 'framework', label: 'Framework' },
  { value: 'methodology', label: 'Methodology' },
  { value: 'best_practice', label: 'Best Practice' },
  { value: 'template', label: 'Template' },
  { value: 'guideline', label: 'Guideline' },
  { value: 'user_contributed', label: 'User Contributed' },
];

export function SystemKnowledgeCard({ document, onViewDetails }: SystemKnowledgeCardProps) {
  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600';
    if (priority >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <Badge variant="outline" className="text-xs">
                {document.source_type === 'user' ? 'User Contributed' : 
                 knowledgeTypes.find(t => t.value === document.knowledge_type)?.label || 'Knowledge'}
              </Badge>
              {document.priority >= 8 && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {document.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {document.subcategory || document.category || 'Sistema'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Prioridad</span>
            <span className={`font-medium ${getPriorityColor(document.priority)}`}>
              {document.priority}/10
            </span>
          </div>
          
          {document.usage_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Usado {document.usage_count} veces</span>
            </div>
          )}

          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {document.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{document.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => onViewDetails(document)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
