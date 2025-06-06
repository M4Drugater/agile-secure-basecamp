
import { useState } from 'react';
import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useEnhancedFileUpload } from './useEnhancedFileUpload';
import { useAdvancedFileProcessing } from './useAdvancedFileProcessing';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DocumentType } from './useUserKnowledgeForm';

export interface CreateDocumentData {
  title: string;
  description?: string;
  content?: string;
  tags?: string;
  metadata?: any;
}

export function useKnowledge Operations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { createFile, updateFile, deleteFile } = useUserKnowledgeFiles();
  const { uploadAndProcessFile } = useEnhancedFileUpload();
  const { reprocessFile } = useAdvancedFileProcessing();

  const createDocument = async (
    type: DocumentType,
    data: CreateDocumentData,
    file?: File,
    inputMethod?: 'manual' | 'upload'
  ) => {
    setIsCreating(true);
    try {
      if (inputMethod === 'upload' && file) {
        // Use the unified upload and processing flow
        console.log('Creating document via file upload:', { fileName: file.name, inputData: data, type });
        
        const uploadResult = await uploadAndProcessFile(file);
        if (!uploadResult) {
          throw new Error('File upload failed');
        }

        // If this is system knowledge, we need to also update the type
        if (type === 'system') {
          const { data: fileData, error: fileError } = await supabase
            .from('user_knowledge_files')
            .select('id')
            .eq('file_url', uploadResult.file_url)
            .single();
          
          if (fileError || !fileData) {
            console.error('Error finding uploaded file record:', fileError);
            throw new Error('Failed to find uploaded file record');
          }

          // Update the document category to 'system'
          const { error: updateError } = await supabase
            .from('user_knowledge_files')
            .update({
              document_category: 'system',
            })
            .eq('id', fileData.id);

          if (updateError) {
            console.error('Error updating document category:', updateError);
            throw new Error('Failed to update document category');
          }
        }

        toast({
          title: "Success",
          description: "File uploaded and processed successfully.",
        });
      } else {
        // Manual entry - create directly in database
        console.log('Creating document via manual entry:', { data, type });
        
        const fileData = {
          title: data.title,
          description: data.description || '',
          content: data.content || '',
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          processing_status: 'completed',
          extraction_status: 'completed',
          is_ai_processed: false,
          source_type: 'manual',
          metadata: data.metadata || {},
          document_category: type === 'personal' ? 'personal' : 'system',
        };

        await createFile(fileData);
        toast({
          title: "Success",
          description: `${type === 'personal' ? 'Personal' : 'System'} knowledge item created successfully.`,
        });
      }
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: `Failed to create ${type} document. Please try again.`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateDocument = async (
    type: DocumentType,
    id: string,
    updates: Partial<CreateDocumentData>
  ) => {
    setIsUpdating(true);
    try {
      const updateData = {
        ...updates,
        tags: updates.tags ? updates.tags.split(',').map(tag => tag.trim()) : undefined,
      };

      await updateFile({ id, ...updateData });
      toast({
        title: "Success",
        description: "Knowledge item updated successfully.",
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const processFileWithAI = async (fileId: string, fileName: string) => {
    try {
      await reprocessFile(fileId, 'full');
      toast({
        title: "Processing Started",
        description: `${fileName} has been queued for AI processing.`,
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to queue file for processing.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteFile(id);
      toast({
        title: "Success",
        description: "Knowledge item deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createDocument,
    updateDocument,
    processFileWithAI,
    deleteDocument,
    isCreating,
    isUpdating,
  };
}
