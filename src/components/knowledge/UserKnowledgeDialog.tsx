
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, X, FileText, Type } from 'lucide-react';
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { useUserKnowledgeForm } from '@/hooks/useUserKnowledgeForm';
import { useEnhancedFileUpload } from '@/hooks/useEnhancedFileUpload';
import { useMultiTierKnowledge } from '@/hooks/useMultiTierKnowledge';

interface UserKnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserKnowledgeDialog({ open, onOpenChange }: UserKnowledgeDialogProps) {
  const {
    formData,
    selectedFile,
    inputMethod,
    setSelectedFile,
    setInputMethod,
    resetForm,
    updateFormField,
  } = useUserKnowledgeForm();

  const {
    uploadAndProcessFile,
    isUploading,
    uploadProgress,
  } = useEnhancedFileUpload();

  const {
    createDocument,
    isCreating,
  } = useMultiTierKnowledge();

  const handleSave = async () => {
    if (!formData.title.trim()) {
      return;
    }

    try {
      let finalFormData = { ...formData };

      // If uploading a file, process it first
      if (inputMethod === 'upload' && selectedFile) {
        const uploadResult = await uploadAndProcessFile(selectedFile);
        if (!uploadResult) {
          return; // Upload failed
        }

        // Enhance form data with AI analysis
        if (uploadResult.ai_analysis) {
          finalFormData = {
            ...finalFormData,
            description: finalFormData.description || uploadResult.ai_analysis.summary || '',
            content: uploadResult.extracted_content || '',
            tags: finalFormData.tags || uploadResult.ai_analysis.key_points?.join(', ') || '',
          };
        }

        // Add file information to metadata
        finalFormData.metadata = {
          ...finalFormData.metadata,
          fileUrl: uploadResult.file_url,
          originalFileName: uploadResult.original_file_name,
          fileType: uploadResult.file_type,
          fileSize: uploadResult.file_size,
          aiAnalysis: uploadResult.ai_analysis,
        };
      }

      await createDocument('personal', finalFormData, selectedFile, inputMethod);
      
      handleClose();
    } catch (error) {
      console.error('Error saving knowledge:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto-populate title from filename if not set
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      updateFormField('title', nameWithoutExt);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Knowledge Item</DialogTitle>
          <DialogDescription>
            Add information to your personal knowledge base. Choose between manual entry or file upload.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormField('title', e.target.value)}
              placeholder="Enter a descriptive title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormField('description', e.target.value)}
              placeholder="Brief description of this knowledge item..."
              rows={2}
            />
          </div>

          <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as 'manual' | 'upload')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => updateFormField('content', e.target.value)}
                  placeholder="Enter your knowledge content here..."
                  rows={8}
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <EnhancedFileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onRemoveFile={handleRemoveFile}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
              
              {selectedFile && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">AI Processing Available</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    This file will be processed with AI to extract content, generate summaries, and identify key insights automatically.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => updateFormField('tags', e.target.value)}
              placeholder="Enter tags separated by commas..."
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas (e.g., "career, development, skills")
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formData.title.trim() || isCreating || isUploading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isCreating || isUploading ? 'Processing...' : 'Save Knowledge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
