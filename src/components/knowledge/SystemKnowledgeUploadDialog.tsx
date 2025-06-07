
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKnowledgeOperations } from '@/hooks/useKnowledgeOperations';
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { Upload, FileText, Plus } from 'lucide-react';

interface SystemKnowledgeUploadDialogProps {
  onUploadComplete?: () => void;
}

export function SystemKnowledgeUploadDialog({ onUploadComplete }: SystemKnowledgeUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const { createDocument, isCreating } = useKnowledgeOperations();

  // Manual entry form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    subcategory: '',
    knowledgeType: 'framework',
    tags: '',
    priority: '5',
  });

  const knowledgeTypes = [
    { value: 'framework', label: 'Framework' },
    { value: 'methodology', label: 'Methodology' },
    { value: 'best_practice', label: 'Best Practice' },
    { value: 'template', label: 'Template' },
    { value: 'guideline', label: 'Guideline' },
  ];

  const priorityLevels = [
    { value: '1', label: '1 - Muy Baja' },
    { value: '3', label: '3 - Baja' },
    { value: '5', label: '5 - Media' },
    { value: '7', label: '7 - Alta' },
    { value: '10', label: '10 - Crítica' },
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto-populate title from filename
    setFormData(prev => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, '')
    }));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleManualSubmit = async () => {
    if (!formData.title || !formData.content) return;

    try {
      const metadata = {
        category: formData.category,
        subcategory: formData.subcategory,
        knowledge_type: formData.knowledgeType,
        priority: parseInt(formData.priority),
      };

      await createDocument(
        'system',
        {
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
          metadata,
        },
        undefined,
        'manual'
      );

      handleClose();
      onUploadComplete?.();
    } catch (error) {
      console.error('Error creating system knowledge:', error);
    }
  };

  const handleFileSubmit = async () => {
    if (!selectedFile || !formData.title) return;

    try {
      setIsUploading(true);
      setUploadProgress(20);

      const metadata = {
        category: formData.category,
        subcategory: formData.subcategory,
        knowledge_type: formData.knowledgeType,
        priority: parseInt(formData.priority),
      };

      setUploadProgress(60);

      await createDocument(
        'system',
        {
          title: formData.title,
          tags: formData.tags,
          metadata,
        },
        selectedFile,
        'upload'
      );

      setUploadProgress(100);
      handleClose();
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading system knowledge:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setFormData({
      title: '',
      content: '',
      category: '',
      subcategory: '',
      knowledgeType: 'framework',
      tags: '',
      priority: '5',
    });
    setActiveTab('manual');
  };

  const canSubmit = () => {
    if (activeTab === 'manual') {
      return formData.title && formData.content && !isCreating;
    } else {
      return selectedFile && formData.title && !isUploading && !isCreating;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Subir Conocimiento del Sistema
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Conocimiento del Sistema
          </DialogTitle>
          <DialogDescription>
            Sube archivos o crea manualmente conocimiento que estará disponible para todos los usuarios del sistema
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Entrada Manual
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Subir Archivo
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            {/* Common metadata fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Título del conocimiento"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="knowledgeType">Tipo de Conocimiento</Label>
                <Select 
                  value={formData.knowledgeType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, knowledgeType: value }))}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  placeholder="Ej: Marketing, Ventas, Liderazgo"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategoría</Label>
                <Input
                  id="subcategory"
                  placeholder="Ej: Content Marketing, B2B Sales"
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="tag1, tag2, tag3"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  disabled={isUploading}
                />
              </div>
            </div>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  placeholder="Escribe el contenido del conocimiento del sistema..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="resize-none"
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
            </TabsContent>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handleClose} disabled={isUploading || isCreating}>
                Cancelar
              </Button>
              <Button 
                onClick={activeTab === 'manual' ? handleManualSubmit : handleFileSubmit}
                disabled={!canSubmit()}
              >
                {(isUploading || isCreating) ? 'Procesando...' : 'Crear Conocimiento del Sistema'}
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
