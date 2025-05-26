
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface KnowledgeDocument {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content?: string;
  document_type: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  tags?: string[];
  summary?: string;
  key_insights?: string[];
  privacy_level?: string;
  processing_status?: string;
  processed_at?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export function useKnowledgeBase() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading,
    error
  } = useQuery({
    queryKey: ['knowledgeDocuments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('knowledge_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createDocument = useMutation({
    mutationFn: async (documentData: Omit<KnowledgeDocument, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('knowledge_documents')
        .insert({
          user_id: user.id,
          ...documentData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeDocuments', user?.id] });
      toast({
        title: "Document created",
        description: "Your document has been added to the knowledge base.",
      });
    },
    onError: (error) => {
      console.error('Document creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<KnowledgeDocument> & { id: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('knowledge_documents')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeDocuments', user?.id] });
      toast({
        title: "Document updated",
        description: "Your document has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Document update error:', error);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('knowledge_documents')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeDocuments', user?.id] });
      toast({
        title: "Document deleted",
        description: "Your document has been removed from the knowledge base.",
      });
    },
    onError: (error) => {
      console.error('Document deletion error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    documents,
    isLoading,
    error,
    createDocument: createDocument.mutate,
    updateDocument: updateDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    isCreating: createDocument.isPending,
    isUpdating: updateDocument.isPending,
    isDeleting: deleteDocument.isPending,
  };
}
