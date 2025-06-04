
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, X, AlertCircle, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface FilePreview {
  file: File;
  preview?: string;
  type: 'pdf' | 'image' | 'text' | 'other';
}

interface EnhancedFileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  onPreviewFile?: (file: File) => void;
}

export function EnhancedFileUpload({ 
  onFileSelect, 
  selectedFile, 
  onRemoveFile, 
  isUploading = false,
  uploadProgress = 0,
  onPreviewFile
}: EnhancedFileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);

  const getFileType = (file: File): FilePreview['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type === 'text/plain') return 'text';
    return 'other';
  };

  const createPreview = useCallback((file: File): FilePreview => {
    const type = getFileType(file);
    let preview: string | undefined;

    if (type === 'image') {
      preview = URL.createObjectURL(file);
    }

    return { file, preview, type };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 50MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload PDF, image, DOC, or DOCX files.');
      } else {
        setError('Failed to upload file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const preview = createPreview(file);
      setFilePreview(preview);
      onFileSelect(file);
    }
  }, [onFileSelect, createPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    maxSize: 52428800, // 50MB
    multiple: false,
    disabled: isUploading
  });

  const getFileIcon = (type: FilePreview['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'image':
        return <Image className="h-8 w-8 text-blue-600" />;
      case 'text':
        return <FileText className="h-8 w-8 text-gray-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeLabel = (type: FilePreview['type']) => {
    switch (type) {
      case 'pdf':
        return 'PDF Document';
      case 'image':
        return 'Image File';
      case 'text':
        return 'Text File';
      default:
        return 'Document';
    }
  };

  const handleRemoveFile = () => {
    if (filePreview?.preview) {
      URL.revokeObjectURL(filePreview.preview);
    }
    setFilePreview(null);
    onRemoveFile();
  };

  if (selectedFile && filePreview) {
    return (
      <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(filePreview.type)}
              <div>
                <p className="font-medium text-green-900">{selectedFile.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {getFileTypeLabel(filePreview.type)}
                  </Badge>
                  <span className="text-sm text-green-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onPreviewFile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onPreviewFile(selectedFile)}
                  className="text-green-700 hover:text-green-900"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {!isUploading && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRemoveFile}
                  className="text-green-700 hover:text-green-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {filePreview.type === 'image' && filePreview.preview && (
            <div className="mt-4">
              <img 
                src={filePreview.preview} 
                alt="Preview" 
                className="max-w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Uploading and processing...</span>
                <span className="text-green-700">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Drop your file here' : 'Upload a knowledge file'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop or click to select
        </p>
        <div className="text-xs text-gray-400 space-y-1">
          <p>Supports PDF, DOC, DOCX, TXT, and images (JPG, PNG, GIF, WebP)</p>
          <p>Maximum file size: 50MB</p>
          <p>🤖 AI-powered content extraction and analysis</p>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
