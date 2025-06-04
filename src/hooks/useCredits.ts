
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreditStatus {
  total_credits: number;
  used_today: number;
  daily_limit: number;
  subscription_status: string;
  plan_name: string;
}

export function useCreditStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['credit-status', user?.id],
    queryFn: async (): Promise<CreditStatus> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_user_credit_status', { user_uuid: user.id });

      if (error) throw error;
      return data[0] as CreditStatus;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useConsumeCredits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      credits,
      functionName,
      description = 'AI function usage'
    }: {
      credits: number;
      functionName: string;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .rpc('consume_credits', {
          user_uuid: (await supabase.auth.getUser()).data.user?.id!,
          credits_to_consume: credits,
          function_name: functionName,
          description_text: description
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-status'] });
    },
  });
}

export function useCreditTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['credit-transactions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
