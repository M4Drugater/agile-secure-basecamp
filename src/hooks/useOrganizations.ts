
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update'];

export function useOrganizations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      // Get organizations where user is a member
      const { data, error } = await supabase
        .from('organization_users')
        .select(`
          organizations(*)
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      return data.map(item => item.organizations).filter(Boolean) as Organization[];
    },
    enabled: !!user,
  });

  const { data: currentOrganization } = useQuery({
    queryKey: ['current-organization'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_users')
        .select(`
          organizations(*)
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) throw error;
      return data?.organizations as Organization;
    },
    enabled: !!user,
  });

  const createOrganization = useMutation({
    mutationFn: async (organizationData: OrganizationInsert) => {
      const { data, error } = await supabase
        .from('organizations')
        .insert(organizationData)
        .select()
        .single();

      if (error) throw error;

      // Add current user as owner
      await supabase
        .from('organization_users')
        .insert({
          organization_id: data.id,
          user_id: user?.id,
          role: 'owner'
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['current-organization'] });
    },
  });

  const updateOrganization = useMutation({
    mutationFn: async ({ id, ...updates }: OrganizationUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['current-organization'] });
    },
  });

  const switchOrganization = useMutation({
    mutationFn: async (organizationId: string) => {
      // This is a simple implementation - in a real app you might want to store the selected org in user preferences
      queryClient.setQueryData(['current-organization'], 
        organizations?.find(org => org.id === organizationId)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-organization'] });
    },
  });

  return {
    organizations,
    currentOrganization,
    isLoading,
    createOrganization,
    updateOrganization,
    switchOrganization,
  };
}
