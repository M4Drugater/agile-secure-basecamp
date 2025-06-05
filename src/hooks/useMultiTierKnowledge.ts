
import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useSystemKnowledge } from './useSystemKnowledge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type DocumentType = 'personal' | 'system' | 'template';

export interface CreateDocumentData {
  title: string;
  description?: string;
  content?: string;
  tags?: string;
  metadata?: any;
}

export function useMultiTierKnowledge() {
  const { user } = useAuth();
  const { createFile: createPersonalFile, updateFile: updatePersonalFile } = useUserKnowledgeFiles();
  const { incrementUsage: incrementSystemUsage } = useSystemKnowledge();

  const createDocument = async (
    type: DocumentType,
    data: CreateDocumentData,
    file?: File,
    inputMethod?: 'manual' | 'upload'
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      if (type === 'personal') {
        const fileData = {
          title: data.title,
          description: data.description || '',
          content: data.content || '',
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          processing_status: 'completed',
          is_ai_processed: false,
          metadata: data.metadata || {},
        };

        if (inputMethod === 'upload' && file) {
          // Upload file to storage first
          const fileName = `${user.id}/${Date.now()}_${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('knowledge-files')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('knowledge-files')
            .getPublicUrl(fileName);

          Object.assign(fileData, {
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_url: urlData.publicUrl,
            original_file_name: file.name,
            file_path: fileName,
            processing_status: 'pending',
          });

          // Trigger file processing
          try {
            await supabase.functions.invoke('process-knowledge-file', {
              body: {
                fileId: 'temp', // Will be updated after creation
                fileUrl: urlData.publicUrl,
                fileType: file.type,
                fileName: file.name,
              },
            });
          } catch (processingError) {
            console.error('File processing failed:', processingError);
            // Continue with creation even if processing fails
          }
        }

        await createPersonalFile(fileData);
      } else {
        toast({
          title: "Not implemented",
          description: "System knowledge creation is not yet implemented.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDocument = async (
    type: DocumentType,
    id: string,
    updates: Partial<CreateDocumentData>
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      if (type === 'personal') {
        const updateData = {
          ...updates,
          tags: updates.tags ? updates.tags.split(',').map(tag => tag.trim()) : undefined,
        };

        await updatePersonalFile({ id, ...updateData });
      } else {
        toast({
          title: "Not implemented",
          description: "System knowledge updates are not yet implemented.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const trackUsage = async (type: DocumentType, id: string) => {
    try {
      if (type === 'system') {
        await incrementSystemUsage(id);
      } else if (type === 'personal') {
        // For now, just log usage - we can implement a proper tracking system later
        console.log('Tracking usage for personal knowledge:', id);
      }
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  return {
    createDocument,
    updateDocument,
    trackUsage,
    isCreating: false, // You could implement loading states here
    isUpdating: false,
  };
}
