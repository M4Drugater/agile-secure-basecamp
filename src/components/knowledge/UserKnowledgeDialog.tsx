
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
import { Save, X, FileText, Type, Brain } from 'lucide-react';
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { useUserKnowledgeForm, DocumentType } from '@/hooks/useUserKnowledgeForm';
import { useEnhancedFileUpload } from '@/hooks/useEnhancedFileUpload';
import { useKnowledgeOperations } from '@/hooks/useKnowledgeOperations';

interface UserKnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserKnowledgeDialog({ open, onOpenChange }: UserKnowledgeDialogProps) {
  const {
    formData,
    editingFile,
    selectedFile,
    inputMethod,
    documentType,
    setSelectedFile,
    setInputMethod,
    setDocumentType,
    resetForm,
    updateFormField,
  } = useUserKnowledgeForm();

  const {
    isUploading,
    uploadProgress,
  } = useEnhancedFileUpload();

  const {
    createDocument,
    updateDocument,
    isCreating,
    isUpdating,
  } = useKnowledgeOperations();

  const handleSave = async () => {
    if (!formData.title.trim()) {
      return;
    }

    try {
      if (editingFile) {
        await updateDocument(documentType, editingFile.id, formData);
      } else {
        await createDocument(documentType, formData, selectedFile, inputMethod);
      }
      
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
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      updateFormField('title', nameWithoutExt);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const isLoading = isCreating || isUpdating || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingFile ? 'Edit Knowledge Item' : 'Add Knowledge Item'}
          </DialogTitle>
          <DialogDescription>
            {editingFile 
              ? 'Update your knowledge item information.'
              : 'Add information to your knowledge base. Choose between manual entry or file upload.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!editingFile && (
            <DocumentTypeSelector
              value={documentType}
              onChange={setDocumentType}
              disabled={isLoading}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormField('title', e.target.value)}
              placeholder="Enter a descriptive title..."
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {!editingFile && (
            <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as 'manual' | 'upload')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center gap-2" disabled={isLoading}>
                  <Type className="h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2" disabled={isLoading}>
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
                    disabled={isLoading}
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
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">AI Processing Available</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      This file will be processed with AI to extract content, generate summaries, and identify key insights automatically.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {editingFile && (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => updateFormField('content', e.target.value)}
                placeholder="Enter your knowledge content here..."
                rows={8}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => updateFormField('tags', e.target.value)}
              placeholder="Enter tags separated by commas..."
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas (e.g., "career, development, skills")
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formData.title.trim() || isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Processing...' : editingFile ? 'Update Knowledge' : 'Save Knowledge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
