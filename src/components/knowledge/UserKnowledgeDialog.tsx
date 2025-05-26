
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploadZone } from './FileUploadZone';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { useFileUpload } from '@/hooks/useFileUpload';
import { KnowledgeFormData } from '@/hooks/useUserKnowledgeForm';
import { FileText, Upload, Loader2, Brain, BookOpen, Database, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type DocumentType = 'personal' | 'system' | 'resource';

interface UserKnowledgeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: KnowledgeFormData;
  editingFile: any;
  selectedFile: File | null;
  inputMethod: 'manual' | 'upload';
  documentType: DocumentType;
  onFormUpdate: (field: keyof KnowledgeFormData, value: string) => void;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  onInputMethodChange: (method: 'manual' | 'upload') => void;
  onDocumentTypeChange: (type: DocumentType) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function UserKnowledgeDialog({
  isOpen,
  onClose,
  formData,
  editingFile,
  selectedFile,
  inputMethod,
  documentType,
  onFormUpdate,
  onFileSelect,
  onRemoveFile,
  onInputMethodChange,
  onDocumentTypeChange,
  onSubmit,
  onReset,
}: UserKnowledgeDialogProps) {
  const { isCreating } = useUserKnowledgeFiles();
  const { isUploading } = useFileUpload();

  const handleClose = () => {
    onReset();
    onClose();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const isSubmitDisabled = isCreating || isUploading || !formData.title || (inputMethod === 'upload' && !selectedFile);

  const getDocumentTypeConfig = (type: DocumentType) => {
    switch (type) {
      case 'personal':
        return {
          icon: BookOpen,
          title: 'Personal Knowledge',
          description: 'Your personal notes, insights, and learning materials',
          color: 'text-blue-600'
        };
      case 'system':
        return {
          icon: Database,
          title: 'System Knowledge',
          description: 'Organizational frameworks and methodologies',
          color: 'text-green-600'
        };
      case 'resource':
        return {
          icon: Download,
          title: 'Downloadable Resource',
          description: 'Templates, guides, and downloadable materials',
          color: 'text-purple-600'
        };
    }
  };

  const currentConfig = getDocumentTypeConfig(documentType);
  const IconComponent = currentConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 ${currentConfig.color}`} />
            {editingFile ? 'Edit Knowledge File' : `Add ${currentConfig.title}`}
          </DialogTitle>
          <DialogDescription>
            {currentConfig.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {!editingFile && (
            <>
              <div className="space-y-4">
                <Label>Document Type</Label>
                <Select value={documentType} onValueChange={onDocumentTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        Personal Knowledge
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-600" />
                        System Knowledge
                      </div>
                    </SelectItem>
                    <SelectItem value="resource">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-purple-600" />
                        Downloadable Resource
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={inputMethod} onValueChange={(value: any) => onInputMethodChange(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Manual Entry
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    File Upload
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-4">
                  <FileUploadZone
                    onFileSelect={onFileSelect}
                    selectedFile={selectedFile}
                    onRemoveFile={onRemoveFile}
                    isUploading={isUploading}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onFormUpdate('title', e.target.value)}
                placeholder={selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'Knowledge file title'}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => onFormUpdate('tags', e.target.value)}
                placeholder="e.g., javascript, leadership, productivity"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormUpdate('description', e.target.value)}
              placeholder="Brief description of the knowledge"
              rows={2}
            />
          </div>

          {(inputMethod === 'manual' || editingFile) && (
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => onFormUpdate('content', e.target.value)}
                placeholder="Your knowledge content, notes, or insights"
                rows={8}
              />
            </div>
          )}

          {inputMethod === 'upload' && selectedFile && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">AI Processing</span>
              </div>
              <p className="text-sm text-blue-700">
                After upload, your file will be automatically processed to extract text content, 
                generate an AI summary, and identify key insights using advanced AI analysis.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {(isCreating || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {editingFile ? 'Update' : (inputMethod === 'upload' ? 'Upload & Process' : 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
