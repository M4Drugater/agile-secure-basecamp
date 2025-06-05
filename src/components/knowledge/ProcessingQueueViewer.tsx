
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle, RefreshCw, FileText } from 'lucide-react';
import { useEnhancedKnowledgeBase } from '@/hooks/useEnhancedKnowledgeBase';

export function ProcessingQueueViewer() {
  const { processingQueue, isLoadingQueue } = useEnhancedKnowledgeBase();

  if (isLoadingQueue) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading processing queue...</span>
      </div>
    );
  }

  if (!processingQueue || processingQueue.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Processing Queue Items</h3>
          <p className="text-muted-foreground">
            Files you upload will appear here while being processed with AI analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Processing Queue</h3>
        <Badge variant="outline">{processingQueue.length} items</Badge>
      </div>

      <div className="space-y-3">
        {processingQueue.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">
                      {item.user_knowledge_files?.title || 'Unknown File'}
                    </span>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Type: {item.file_type}</div>
                    <div>Processing: {item.processing_type}</div>
                    <div>Priority: {item.priority}</div>
                    <div>Attempts: {item.attempts}/{item.max_attempts}</div>
                    {item.error_message && (
                      <div className="text-red-600">Error: {item.error_message}</div>
                    )}
                  </div>
                </div>

                <div className="text-right text-sm text-muted-foreground">
                  <div>Created: {new Date(item.created_at).toLocaleDateString()}</div>
                  {item.started_at && (
                    <div>Started: {new Date(item.started_at).toLocaleDateString()}</div>
                  )}
                  {item.completed_at && (
                    <div>Completed: {new Date(item.completed_at).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
