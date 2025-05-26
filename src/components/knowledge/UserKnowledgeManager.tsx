
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserKnowledgeFiles, UserKnowledgeFile } from '@/hooks/useUserKnowledgeFiles';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileUploadZone } from './FileUploadZone';
import { Plus, FileText, Edit, Trash2, Search, Upload, Loader2, Brain, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function UserKnowledgeManager() {
  const { files, createFile, updateFile, deleteFile, isCreating } = useUserKnowledgeFiles();
  const { uploadFile, isUploading } = useFileUpload();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<UserKnowledgeFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<'manual' | 'upload'>('manual');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: '',
  });

  const filteredFiles = files?.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || 
                       (selectedType === 'processed' && file.is_ai_processed) ||
                       (selectedType === 'unprocessed' && !file.is_ai_processed) ||
                       (selectedType === 'uploaded' && file.file_url) ||
                       (selectedType === 'manual' && !file.file_url);
    return matchesSearch && matchesType;
  }) || [];

  const handleSubmit = async () => {
    let fileData: any = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      metadata: {},
    };

    // Handle file upload
    if (inputMethod === 'upload' && selectedFile) {
      const uploadResult = await uploadFile(selectedFile);
      if (!uploadResult) {
        return; // Upload failed, error already shown
      }

      fileData = {
        ...fileData,
        file_url: uploadResult.file_url,
        original_file_name: uploadResult.original_file_name,
        file_type: uploadResult.file_type,
        file_size: uploadResult.file_size,
        extraction_status: 'pending',
        processing_status: 'pending',
      };
    } else {
      // Manual input
      fileData.content = formData.content;
    }

    if (editingFile) {
      updateFile({ id: editingFile.id, ...fileData });
    } else {
      // For new files, we need to handle the async result properly
      try {
        createFile(fileData);
        
        // If it's a file upload, trigger processing after a short delay
        if (inputMethod === 'upload' && selectedFile) {
          setTimeout(async () => {
            try {
              // We'll need to get the created file ID from the response
              // For now, we'll trigger processing without the specific file ID
              await supabase.functions.invoke('process-knowledge-file', {
                body: {
                  fileUrl: fileData.file_url,
                  fileType: fileData.file_type,
                  fileName: fileData.original_file_name,
                },
              });
            } catch (error) {
              console.error('Error processing file:', error);
              toast({
                title: "Processing Error",
                description: "File uploaded but processing failed. You can manually add content.",
                variant: "destructive",
              });
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Error creating file:', error);
      }
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      tags: '',
    });
    setEditingFile(null);
    setSelectedFile(null);
    setInputMethod('manual');
  };

  const handleEdit = (file: UserKnowledgeFile) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      description: file.description || '',
      content: file.content || '',
      tags: file.tags?.join(', ') || '',
    });
    setInputMethod(file.file_url ? 'upload' : 'manual');
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this knowledge file?')) {
      deleteFile(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Personal Knowledge Base</h2>
          <p className="text-muted-foreground">
            Store and organize your personal knowledge, notes, and references
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFile ? 'Edit Knowledge File' : 'Add New Knowledge'}
              </DialogTitle>
              <DialogDescription>
                Add your personal knowledge, notes, or upload documents to your knowledge base
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {!editingFile && (
                <Tabs value={inputMethod} onValueChange={(value: any) => setInputMethod(value)}>
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
                      onFileSelect={setSelectedFile}
                      selectedFile={selectedFile}
                      onRemoveFile={() => setSelectedFile(null)}
                      isUploading={isUploading}
                    />
                  </TabsContent>
                </Tabs>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'Knowledge file title'}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., javascript, leadership, productivity"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isCreating || isUploading || !formData.title || (inputMethod === 'upload' && !selectedFile)}
              >
                {(isCreating || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingFile ? 'Update' : (inputMethod === 'upload' ? 'Upload & Process' : 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your knowledge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="uploaded">Uploaded Files</SelectItem>
            <SelectItem value="manual">Manual Entries</SelectItem>
            <SelectItem value="processed">AI Processed</SelectItem>
            <SelectItem value="unprocessed">Not Processed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                    {file.file_url && <Upload className="h-4 w-4 text-blue-500" />}
                    {file.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {file.description}
                  </CardDescription>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(file)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={file.is_ai_processed ? "default" : "secondary"} className="text-xs">
                    {file.is_ai_processed ? "AI Processed" : "Not Processed"}
                  </Badge>
                  {file.file_url && (
                    <Badge variant="outline" className="text-xs">
                      Uploaded
                    </Badge>
                  )}
                  {file.processing_status === 'processing' && (
                    <Badge variant="secondary" className="text-xs">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processing
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No knowledge files found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start building your personal knowledge base by adding your first file'
              }
            </p>
            {!searchTerm && selectedType === 'all' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Knowledge File
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
