
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserKnowledgeFile } from '@/hooks/useUserKnowledgeFiles';
import { FileText, Edit, Trash2, Upload, Loader2, Brain, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface UserKnowledgeCardProps {
  file: UserKnowledgeFile;
  onEdit: (file: UserKnowledgeFile) => void;
  onDelete: (id: string) => void;
}

export function UserKnowledgeCard({ file, onEdit, onDelete }: UserKnowledgeCardProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this knowledge file?')) {
      onDelete(file.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
              {file.file_url && <Upload className="h-4 w-4 text-blue-500" />}
              {file.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {file.description}
            </CardDescription>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(file)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Badge variant={file.is_ai_processed ? "default" : "secondary"} className="text-xs">
              {file.is_ai_processed ? "AI Processed" : "Not Processed"}
            </Badge>
            {file.file_url && (
              <Badge variant="outline" className="text-xs">
                Uploaded
              </Badge>
            )}
            {file.processing_status === 'processing' && (
              <Badge variant="secondary" className="text-xs">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Processing
              </Badge>
            )}
          </div>

          {file.ai_summary && (
            <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="h-3 w-3 text-blue-600" />
                <span className="font-medium text-blue-900">AI Summary</span>
              </div>
              <p className="line-clamp-2">{file.ai_summary}</p>
            </div>
          )}

          {file.tags && file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {file.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {file.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{file.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Updated {format(new Date(file.updated_at), 'MMM d, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
