
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { useUserKnowledgeForm, DocumentType } from '@/hooks/useUserKnowledgeForm';
import { useMultiTierKnowledge } from '@/hooks/useMultiTierKnowledge';
import { useAdvancedFileProcessing } from '@/hooks/useAdvancedFileProcessing';
import { UserKnowledgeDialog } from './UserKnowledgeDialog';
import { UserKnowledgeCard } from './UserKnowledgeCard';
import { UserKnowledgeFilters } from './UserKnowledgeFilters';
import { UserKnowledgeEmptyState } from './UserKnowledgeEmptyState';
import { ProcessingQueueViewer } from './ProcessingQueueViewer';
import { KnowledgeRecommendations } from './KnowledgeRecommendations';
import { Plus, Brain, Settings } from 'lucide-react';

export function EnhancedUserKnowledgeManager() {
  const { files, deleteFile } = useUserKnowledgeFiles();
  const { createDocument, updateDocument } = useMultiTierKnowledge();
  const { reprocessFile } = useAdvancedFileProcessing();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('files');

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
    populateForm,
    updateFormField,
  } = useUserKnowledgeForm();

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
    if (editingFile) {
      await updateDocument('personal', editingFile.id, {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        tags: formData.tags,
      });
    } else {
      await createDocument('personal', formData, selectedFile, inputMethod);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (file: any) => {
    populateForm(file);
    setIsDialogOpen(true);
  };

  const handleReprocess = async (fileId: string) => {
    await reprocessFile(fileId, 'full');
  };

  const handleOpenDialog = () => {
    resetForm();
    setDocumentType('personal');
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Knowledge Base</h2>
          <p className="text-muted-foreground">
            Advanced AI-powered knowledge management with processing queue and recommendations
          </p>
        </div>
        <Button onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="files" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            My Files
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Processing
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-6">
          <div className="space-y-6">
            <UserKnowledgeFilters
              searchTerm={searchTerm}
              selectedType={selectedType}
              onSearchChange={setSearchTerm}
              onTypeChange={setSelectedType}
            />

            {filteredFiles.length === 0 ? (
              <UserKnowledgeEmptyState
                searchTerm={searchTerm}
                selectedType={selectedType}
                onAddNew={handleOpenDialog}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="relative">
                    <UserKnowledgeCard
                      file={file}
                      onEdit={handleEdit}
                      onDelete={deleteFile}
                    />
                    {!file.is_ai_processed && file.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => handleReprocess(file.id)}
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Process
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="processing" className="mt-6">
          <ProcessingQueueViewer />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <KnowledgeRecommendations />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Total Knowledge Items</h3>
              <p className="text-2xl font-bold">{files?.length || 0}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">AI Processed</h3>
              <p className="text-2xl font-bold">
                {files?.filter(f => f.is_ai_processed).length || 0}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">File Uploads</h3>
              <p className="text-2xl font-bold">
                {files?.filter(f => f.file_url).length || 0}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <UserKnowledgeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
