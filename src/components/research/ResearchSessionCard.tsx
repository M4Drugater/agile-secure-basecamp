
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  ExternalLink, 
  Clock, 
  Brain,
  Trash2,
  Eye
} from 'lucide-react';
import { ResearchSession } from '@/hooks/usePerplexityResearch';

interface ResearchSessionCardProps {
  session: ResearchSession;
  onSelect: (session: ResearchSession) => void;
  onDelete?: (sessionId: string) => void;
}

export function ResearchSessionCard({ session, onSelect, onDelete }: ResearchSessionCardProps) {
  const handleSelect = () => {
    onSelect(session);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this research session?')) {
      onDelete(session.id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quick': return 'bg-green-100 text-green-800';
      case 'comprehensive': return 'bg-blue-100 text-blue-800';
      case 'industry-specific': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2">
              {session.query}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className={getTypeColor(session.researchType)}>
                {session.researchType}
              </Badge>
              {session.industry && (
                <Badge variant="outline" className="text-xs">
                  {session.industry}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelect}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-3 w-3" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={handleSelect}>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span>{session.sources?.length || 0} sources</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span>{session.insights?.length || 0} insights</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{session.creditsUsed} credits</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(session.createdAt).toLocaleDateString()}</span>
            </div>
            <span className="font-mono text-xs">{session.modelUsed.split('-')[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
