
import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useKnowledgeBase } from './useKnowledgeBase';
import { useDownloadableResources } from './useDownloadableResources';
import { useFileUpload } from './useFileUpload';
import { DocumentType } from './useUserKnowledgeForm';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useMultiTierKnowledge() {
  const personalKnowledge = useUserKnowledgeFiles();
  const systemKnowledge = useKnowledgeBase();
  const resources = useDownloadableResources();
  const { uploadFile } = useFileUpload();

  const createDocument = async (
    documentType: DocumentType,
    formData: any,
    selectedFile: File | null,
    inputMethod: 'manual' | 'upload'
  ) => {
    let fileData: any = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
      metadata: { documentType },
    };

    // Handle file upload if needed
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

    // Route to appropriate service based on document type
    switch (documentType) {
      case 'personal':
        personalKnowledge.createFile(fileData);
        break;
      
      case 'system':
        const systemData = {
          ...fileData,
          document_type: 'system_knowledge',
          privacy_level: 'private' as const,
          processing_status: 'completed' as const,
          is_active: true,
          processed_at: new Date().toISOString(),
        };
        systemKnowledge.createDocument(systemData);
        break;
      
      case 'resource':
        // Note: Resources typically require admin privileges
        // For now, we'll create as personal knowledge with resource metadata
        const resourceData = {
          ...fileData,
          metadata: { ...fileData.metadata, isResource: true },
        };
        personalKnowledge.createFile(resourceData);
        toast({
          title: "Resource Created",
          description: "Resource created in personal knowledge. Admin can promote to public resource.",
        });
        break;
      
      default:
        throw new Error(`Unsupported document type: ${documentType}`);
    }

    // Trigger processing for uploaded files
    if (inputMethod === 'upload' && selectedFile) {
      setTimeout(async () => {
        try {
          await supabase.functions.invoke('process-knowledge-file', {
            body: {
              fileUrl: fileData.file_url,
              fileType: fileData.file_type,
              fileName: fileData.original_file_name,
              documentType,
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
  };

  const updateDocument = async (
    documentType: DocumentType,
    id: string,
    updates: any
  ) => {
    switch (documentType) {
      case 'personal':
        personalKnowledge.updateFile({ id, ...updates });
        break;
      case 'system':
        systemKnowledge.updateDocument({ id, ...updates });
        break;
      case 'resource':
        // Handle resource updates through personal knowledge for now
        personalKnowledge.updateFile({ id, ...updates });
        break;
    }
  };

  const deleteDocument = async (documentType: DocumentType, id: string) => {
    switch (documentType) {
      case 'personal':
        personalKnowledge.deleteFile(id);
        break;
      case 'system':
        systemKnowledge.deleteDocument(id);
        break;
      case 'resource':
        personalKnowledge.deleteFile(id);
        break;
    }
  };

  return {
    createDocument,
    updateDocument,
    deleteDocument,
    isCreating: personalKnowledge.isCreating || systemKnowledge.isCreating,
    isUpdating: personalKnowledge.isUpdating || systemKnowledge.isUpdating,
    isDeleting: personalKnowledge.isDeleting || systemKnowledge.isDeleting,
  };
}
