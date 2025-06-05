
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Loader2, Upload } from 'lucide-react';

interface UploadMonitorProps {
  isUploading: boolean;
  uploadProgress: number;
  fileName?: string;
  status?: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export function UploadMonitor({
  isUploading,
  uploadProgress,
  fileName,
  status = 'uploading',
  error
}: UploadMonitorProps) {
  if (!isUploading && !fileName) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Upload className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading file...';
      case 'processing':
        return 'Processing with AI...';
      case 'completed':
        return 'Upload completed successfully!';
      case 'error':
        return error || 'Upload failed';
      default:
        return 'Preparing upload...';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {getStatusIcon()}
          Upload Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {fileName && (
            <div className="text-sm text-muted-foreground truncate">
              {fileName}
            </div>
          )}
          <Progress value={uploadProgress} className="w-full" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              {getStatusMessage()}
            </span>
            <span className="font-medium">
              {uploadProgress}%
            </span>
          </div>
          {error && (
            <div className="text-xs text-red-600 mt-2">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
