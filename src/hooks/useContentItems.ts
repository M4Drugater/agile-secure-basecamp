
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizations } from '@/hooks/useOrganizations';

export type ContentItem = Database['public']['Tables']['content_items']['Row'];
export type ContentItemInsert = Database['public']['Tables']['content_items']['Insert'];
export type ContentItemUpdate = Database['public']['Tables']['content_items']['Update'];

export function useContentItems() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganizations();
  const queryClient = useQueryClient();

  const { data: contentItems, isLoading } = useQuery({
    queryKey: ['content-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createContentItem = useMutation({
    mutationFn: async (contentData: Omit<ContentItemInsert, 'user_id' | 'organization_id'>) => {
      const { data, error } = await supabase
        .from('content_items')
        .insert({
          ...contentData,
          user_id: user?.id!,
          organization_id: currentOrganization?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
    },
  });

  const updateContentItem = useMutation({
    mutationFn: async ({ id, ...updates }: ContentItemUpdate & { id: string }) => {
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
    },
  });

  const duplicateContentItem = useMutation({
    mutationFn: async (id: string) => {
      const { data: original, error: fetchError } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('content_items')
        .insert({
          title: `${original.title} (Copy)`,
          content: original.content,
          content_type: original.content_type,
          tags: original.tags,
          user_id: user?.id!,
          organization_id: currentOrganization?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
    },
  });

  return {
    contentItems,
    isLoading,
    createContentItem,
    updateContentItem,
    deleteContentItem,
    duplicateContentItem,
    isCreating: createContentItem.isPending,
    isUpdating: updateContentItem.isPending,
  };
}
