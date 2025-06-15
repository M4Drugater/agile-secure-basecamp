
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KnowledgeFile } from '@/types/knowledge';
import { ProcessingStatus } from './ProcessingStatus';
import { FileText, Edit, Trash2, Upload, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface KnowledgeListProps {
  files: KnowledgeFile[];
  onEdit: (file: KnowledgeFile) => void;
  onDelete: (id: string) => void;
  onReprocess?: (fileId: string, fileName: string) => void;
  isLoading?: boolean;
}

export function KnowledgeList({ 
  files, 
  onEdit, 
  onDelete, 
  onReprocess,
  isLoading = false 
}: KnowledgeListProps) {
  const handleDelete = (file: KnowledgeFile) => {
    if (window.confirm('Are you sure you want to delete this knowledge file?')) {
      onDelete(file.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading knowledge base...</span>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No knowledge items found</h3>
          <p className="text-muted-foreground">
            Start building your knowledge base by adding your first item
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <div key={file.id} className="relative group">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                    {file.file_url && <Upload className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                    {file.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
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
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <ProcessingStatus 
                  status={file.processing_status || 'completed'} 
                  isAiProcessed={file.is_ai_processed}
                  size="sm"
                />
                {file.file_url && (
                  <Badge variant="outline" className="text-xs">
                    Uploaded
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
            </CardContent>
          </Card>

          {/* Reprocess button overlay */}
          {!file.is_ai_processed && file.file_url && onReprocess && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onReprocess(file.id, file.title)}
                className="h-8 text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                AI Process
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
