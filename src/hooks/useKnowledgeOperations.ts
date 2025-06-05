
import { useState } from 'react';
import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useEnhancedFileUpload } from './useEnhancedFileUpload';
import { useAdvancedFileProcessing } from './useAdvancedFileProcessing';
import { toast } from '@/hooks/use-toast';
import { DocumentType } from './useUserKnowledgeForm';

export interface CreateDocumentData {
  title: string;
  description?: string;
  content?: string;
  tags?: string;
  metadata?: any;
}

export function useKnowledgeOperations() {
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
    if (type !== 'personal') {
      toast({
        title: "Not implemented",
        description: "System knowledge creation is not yet implemented.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      let finalFormData = { ...data };
      let fileData: any = {
        title: data.title,
        description: data.description || '',
        content: data.content || '',
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        processing_status: 'completed',
        is_ai_processed: false,
        metadata: data.metadata || {},
      };

      // Handle file upload if provided
      if (inputMethod === 'upload' && file) {
        const uploadResult = await uploadAndProcessFile(file);
        if (!uploadResult) {
          throw new Error('File upload failed');
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

        // Add file information
        Object.assign(fileData, {
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: uploadResult.file_url,
          original_file_name: file.name,
          processing_status: uploadResult.ai_analysis ? 'completed' : 'pending',
          is_ai_processed: !!uploadResult.ai_analysis,
          extracted_content: uploadResult.extracted_content,
          ai_analysis: uploadResult.ai_analysis,
          title: finalFormData.title,
          description: finalFormData.description,
          content: finalFormData.content,
          tags: finalFormData.tags ? finalFormData.tags.split(',').map(tag => tag.trim()) : [],
        });
      }

      await createFile(fileData);
      toast({
        title: "Success",
        description: "Knowledge item created successfully.",
      });
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
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
    if (type !== 'personal') {
      toast({
        title: "Not implemented",
        description: "System knowledge updates are not yet implemented.",
        variant: "destructive",
      });
      return;
    }

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
