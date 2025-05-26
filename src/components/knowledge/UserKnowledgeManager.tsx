
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { useUserKnowledgeForm, DocumentType } from '@/hooks/useUserKnowledgeForm';
import { useMultiTierKnowledge } from '@/hooks/useMultiTierKnowledge';
import { UserKnowledgeDialog } from './UserKnowledgeDialog';
import { UserKnowledgeCard } from './UserKnowledgeCard';
import { UserKnowledgeFilters } from './UserKnowledgeFilters';
import { UserKnowledgeEmptyState } from './UserKnowledgeEmptyState';
import { Plus } from 'lucide-react';

export function UserKnowledgeManager() {
  const { files, deleteFile } = useUserKnowledgeFiles();
  const { createDocument, updateDocument } = useMultiTierKnowledge();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      });
    } else {
      await createDocument(documentType, formData, selectedFile, inputMethod);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (file: any) => {
    populateForm(file);
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    resetForm();
    setDocumentType('personal'); // Default to personal for this manager
    setIsDialogOpen(true);
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
        <Button onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

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
            <UserKnowledgeCard
              key={file.id}
              file={file}
              onEdit={handleEdit}
              onDelete={deleteFile}
            />
          ))}
        </div>
      )}

      <UserKnowledgeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        formData={formData}
        editingFile={editingFile}
        selectedFile={selectedFile}
        inputMethod={inputMethod}
        documentType={documentType}
        onFormUpdate={updateFormField}
        onFileSelect={setSelectedFile}
        onRemoveFile={() => setSelectedFile(null)}
        onInputMethodChange={setInputMethod}
        onDocumentTypeChange={setDocumentType}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
    </div>
  );
}
