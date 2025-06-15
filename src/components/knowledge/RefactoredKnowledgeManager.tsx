
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { useKnowledgeOperations } from '@/hooks/useKnowledgeOperations';
import { UserKnowledgeFilters } from './UserKnowledgeFilters';
import { KnowledgeList } from './KnowledgeList';
import { ProcessingQueueViewer } from './ProcessingQueueViewer';
import { KnowledgeErrorBoundary } from './KnowledgeErrorBoundary';
import { UserKnowledgeDialog } from './UserKnowledgeDialog';
import { Plus, Settings, BarChart3 } from 'lucide-react';

export function RefactoredKnowledgeManager() {
  const { files, isLoading: isLoadingFiles, error } = useUserKnowledgeFiles();
  const { processFileWithAI, deleteDocument } = useKnowledgeOperations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('files');

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

  const handleEdit = (file: any) => {
    // This will be handled by the dialog component
    setIsDialogOpen(true);
  };

  const handleReprocess = async (fileId: string, fileName: string) => {
    await processFileWithAI(fileId, fileName);
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  if (error) {
    throw error; // Let error boundary handle it
  }

  return (
    <KnowledgeErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Enhanced Knowledge Base</h2>
            <p className="text-muted-foreground">
              Advanced AI-powered knowledge management with processing queue and insights
            </p>
          </div>
          <Button onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              My Files
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
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

              <KnowledgeList
                files={filteredFiles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReprocess={handleReprocess}
                isLoading={isLoadingFiles}
              />
            </div>
          </TabsContent>

          <TabsContent value="processing" className="mt-6">
            <KnowledgeErrorBoundary>
              <ProcessingQueueViewer />
            </KnowledgeErrorBoundary>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Manual Entries</h3>
                <p className="text-2xl font-bold">
                  {files?.filter(f => !f.file_url).length || 0}
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
    </KnowledgeErrorBoundary>
  );
}
