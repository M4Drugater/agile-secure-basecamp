
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, CheckCircle, AlertCircle, Brain } from 'lucide-react';

interface EnhancedFileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function EnhancedFileUpload({
  onFileSelect,
  selectedFile,
  onRemoveFile,
  isUploading,
  uploadProgress
}: EnhancedFileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    maxSize: 10 * 1024 * 1024, // 10MB limit
    multiple: false
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('text')) return '📄';
    if (type.includes('json')) return '🔧';
    if (type.includes('csv')) return '📊';
    return '📄';
  };

  if (selectedFile) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {getFileIcon(selectedFile.type)}
              </div>
              <div>
                <div className="font-medium">{selectedFile.name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </div>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveFile}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Brain className="h-4 w-4 animate-pulse text-blue-600" />
                Processing with AI analysis...
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <div className="text-xs text-muted-foreground">
                {uploadProgress}% complete
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <Upload className="h-6 w-6 text-gray-600" />
        </div>
        
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop your file here' : 'Upload a knowledge file'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop or click to select a file
          </p>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>Supported formats: PDF, Word docs, text files, JSON, CSV, Markdown</div>
          <div>Maximum file size: 10MB</div>
          <div className="flex items-center justify-center gap-1 text-blue-600">
            <Brain className="h-3 w-3" />
            AI-powered content extraction and analysis
          </div>
        </div>

        <Button variant="outline" className="mt-4">
          Choose File
        </Button>
      </div>
    </div>
  );
}
