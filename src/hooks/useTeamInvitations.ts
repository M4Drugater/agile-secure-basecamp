
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type TeamInvitation = Database['public']['Tables']['team_invitations']['Row'];
type TeamInvitationInsert = Database['public']['Tables']['team_invitations']['Insert'];

export function useTeamInvitations(organizationId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['team-invitations', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('organization_id', organizationId!)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organizationId && !!user,
  });

  const createInvitation = useMutation({
    mutationFn: async (invitationData: Omit<TeamInvitationInsert, 'token' | 'invited_by'>) => {
      const token = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          ...invitationData,
          token,
          invited_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations', organizationId] });
    },
  });

  const revokeInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data, error } = await supabase
        .from('team_invitations')
        .update({ expires_at: new Date().toISOString() })
        .eq('id', invitationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations', organizationId] });
    },
  });

  return {
    invitations,
    isLoading,
    createInvitation,
    revokeInvitation,
  };
}
