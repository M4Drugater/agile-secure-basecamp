
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type OrganizationUser = Database['public']['Tables']['organization_users']['Row'] & {
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
};

export function useOrganizationUsers(organizationId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: organizationUsers, isLoading } = useQuery({
    queryKey: ['organization-users', organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from('organization_users')
        .select(`
          *,
          profiles:user_id(full_name, email)
        `)
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data as OrganizationUser[];
    },
    enabled: !!organizationId && !!user,
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      if (!organizationId) throw new Error('Organization ID is required');

      const { data, error } = await supabase
        .from('organization_users')
        .update({ role })
        .eq('organization_id', organizationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-users', organizationId] });
    },
  });

  const removeUser = useMutation({
    mutationFn: async (userId: string) => {
      if (!organizationId) throw new Error('Organization ID is required');

      const { data, error } = await supabase
        .from('organization_users')
        .update({ is_active: false })
        .eq('organization_id', organizationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-users', organizationId] });
    },
  });

  return {
    organizationUsers,
    isLoading,
    updateUserRole,
    removeUser,
  };
}
