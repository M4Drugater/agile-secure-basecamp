
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEnhancedKnowledgeBase } from '@/hooks/useEnhancedKnowledgeBase';
import { Clock, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function ProcessingQueueViewer() {
  const { processingQueue, isLoadingQueue } = useEnhancedKnowledgeBase();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'default';
      case 'completed':
        return 'success';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoadingQueue) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Queue</CardTitle>
          <CardDescription>Loading processing status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Processing Queue
        </CardTitle>
        <CardDescription>
          Track the status of your file processing tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!processingQueue || processingQueue.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p>No files currently in processing queue</p>
            <p className="text-sm">Upload files to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {processingQueue.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">
                      {item.user_knowledge_files?.title || 'Unknown File'}
                    </span>
                    <Badge variant={getStatusColor(item.status) as any}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Type: {item.processing_type}</div>
                    <div>File Type: {item.file_type}</div>
                    <div>
                      Queued: {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                    </div>
                    {item.started_at && (
                      <div>
                        Started: {format(new Date(item.started_at), 'MMM d, yyyy HH:mm')}
                      </div>
                    )}
                    {item.completed_at && (
                      <div>
                        Completed: {format(new Date(item.completed_at), 'MMM d, yyyy HH:mm')}
                      </div>
                    )}
                    {item.error_message && (
                      <div className="text-red-600">
                        Error: {item.error_message}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Priority: {item.priority}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Attempts: {item.attempts}/{item.max_attempts}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
