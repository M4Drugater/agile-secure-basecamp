
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ContentItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_type: 'resume' | 'cover-letter' | 'linkedin-post' | 'email' | 'presentation' | 'article';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  tags?: string[];
  word_count?: number;
  estimated_read_time?: number;
  is_favorite?: boolean;
}

export interface CreateContentItem {
  title: string;
  content: string;
  content_type: ContentItem['content_type'];
  status?: ContentItem['status'];
  scheduled_for?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  is_favorite?: boolean;
}

export function useContentItems() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: contentItems, isLoading } = useQuery({
    queryKey: ['content-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!user,
  });

  const createContentItem = useMutation({
    mutationFn: async (newItem: CreateContentItem) => {
      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          ...newItem,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast.success('Content item created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create content item');
      console.error('Error creating content item:', error);
    },
  });

  const updateContentItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContentItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('content_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast.success('Content item updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update content item');
      console.error('Error updating content item:', error);
    },
  });

  const deleteContentItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast.success('Content item deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete content item');
      console.error('Error deleting content item:', error);
    },
  });

  const duplicateContentItem = useMutation({
    mutationFn: async (item: ContentItem) => {
      const { data, error } = await supabase
        .from('content_items')
        .insert([{
          title: `${item.title} (Copy)`,
          content: item.content,
          content_type: item.content_type,
          status: 'draft',
          metadata: item.metadata,
          tags: item.tags,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast.success('Content item duplicated successfully');
    },
    onError: (error) => {
      toast.error('Failed to duplicate content item');
      console.error('Error duplicating content item:', error);
    },
  });

  return {
    contentItems: contentItems || [],
    isLoading,
    createContentItem,
    updateContentItem,
    deleteContentItem,
    duplicateContentItem,
    isCreating: createContentItem.isPending,
    isUpdating: updateContentItem.isPending,
    isDeleting: deleteContentItem.isPending,
  };
}
