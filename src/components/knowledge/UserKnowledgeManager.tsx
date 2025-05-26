
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useUserKnowledgeForm } from '@/hooks/useUserKnowledgeForm';
import { UserKnowledgeDialog } from './UserKnowledgeDialog';
import { UserKnowledgeCard } from './UserKnowledgeCard';
import { UserKnowledgeFilters } from './UserKnowledgeFilters';
import { UserKnowledgeEmptyState } from './UserKnowledgeEmptyState';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function UserKnowledgeManager() {
  const { files, createFile, updateFile, deleteFile } = useUserKnowledgeFiles();
  const { uploadFile } = useFileUpload();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    formData,
    editingFile,
    selectedFile,
    inputMethod,
    setSelectedFile,
    setInputMethod,
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
      try {
        createFile(fileData);
        
        // If it's a file upload, trigger processing after a short delay
        if (inputMethod === 'upload' && selectedFile) {
          setTimeout(async () => {
            try {
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

  const handleEdit = (file: any) => {
    populateForm(file);
    setIsDialogOpen(true);
  };

  const handleOpenDialog = () => {
    resetForm();
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
        onFormUpdate={updateFormField}
        onFileSelect={setSelectedFile}
        onRemoveFile={() => setSelectedFile(null)}
        onInputMethodChange={setInputMethod}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />
    </div>
  );
}
