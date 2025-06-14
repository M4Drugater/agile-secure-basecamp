
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OptimizedCreditStatus {
  total_credits: number;
  used_today: number;
  daily_limit: number;
  subscription_status: string;
  plan_name: string;
  remaining_today: number;
  usage_percentage: number;
  is_near_limit: boolean;
  is_over_limit: boolean;
}

// Optimized version that combines multiple queries and adds smart caching
export function useOptimizedCreditStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['optimized-credit-status', user?.id],
    queryFn: async (): Promise<OptimizedCreditStatus> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('get_user_credit_status', { user_uuid: user.id });

      if (error) {
        console.error('Credit status error:', error);
        throw error;
      }

      const baseData = data?.[0] || {
        total_credits: 0,
        used_today: 0,
        daily_limit: 10,
        subscription_status: 'inactive',
        plan_name: 'Free'
      };

      // Calculate derived values
      const remaining_today = Math.max(0, baseData.daily_limit - baseData.used_today);
      const usage_percentage = baseData.daily_limit > 0 ? (baseData.used_today / baseData.daily_limit) * 100 : 0;
      const is_near_limit = usage_percentage >= 80;
      const is_over_limit = usage_percentage >= 100;

      return {
        ...baseData,
        remaining_today,
        usage_percentage,
        is_near_limit,
        is_over_limit
      };
    },
    enabled: !!user,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Auto-refetch every minute
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false, // Reduce unnecessary requests
  });
}

// Optimized consume credits with smart validation
export function useOptimizedConsumeCredits() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Pre-validate against current cache to avoid unnecessary requests
      const currentStatus = queryClient.getQueryData(['optimized-credit-status', user.id]) as OptimizedCreditStatus;
      if (currentStatus?.is_over_limit) {
        throw new Error('Daily credit limit exceeded');
      }

      const { data, error } = await supabase
        .rpc('consume_credits', {
          user_uuid: user.id,
          credits_to_consume: credits,
          function_name: functionName,
          description_text: description
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Optimistically update cache
      queryClient.setQueryData(['optimized-credit-status'], (old: OptimizedCreditStatus | undefined) => {
        if (!old) return old;
        const newUsed = old.used_today + variables.credits;
        const newRemaining = Math.max(0, old.daily_limit - newUsed);
        const newPercentage = old.daily_limit > 0 ? (newUsed / old.daily_limit) * 100 : 0;
        
        return {
          ...old,
          used_today: newUsed,
          remaining_today: newRemaining,
          usage_percentage: newPercentage,
          is_near_limit: newPercentage >= 80,
          is_over_limit: newPercentage >= 100
        };
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['optimized-credit-status'] });
      
      // Show warning if approaching limit
      const updatedStatus = queryClient.getQueryData(['optimized-credit-status']) as OptimizedCreditStatus;
      if (updatedStatus?.is_near_limit && !updatedStatus.is_over_limit) {
        toast({
          title: 'Approaching Credit Limit',
          description: `You have ${updatedStatus.remaining_today} credits remaining today.`,
          variant: 'default',
        });
      }
    },
    onError: (error) => {
      console.error('Credit consumption failed:', error);
      toast({
        title: 'Credit Error',
        description: error.message || 'Failed to consume credits',
        variant: 'destructive',
      });
    }
  });
}

// Batch credit operations for efficiency
export function useBatchCreditOperations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operations: Array<{
      type: 'consume' | 'add';
      credits: number;
      functionName?: string;
      description?: string;
    }>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const results = [];
      for (const op of operations) {
        if (op.type === 'consume') {
          const { data, error } = await supabase.rpc('consume_credits', {
            user_uuid: user.id,
            credits_to_consume: op.credits,
            function_name: op.functionName || 'batch_operation',
            description_text: op.description || 'Batch credit consumption'
          });
          if (error) throw error;
          results.push(data);
        } else if (op.type === 'add') {
          const { data, error } = await supabase.rpc('add_credits', {
            user_uuid: user.id,
            credits_to_add: op.credits,
            description_text: op.description || 'Batch credit addition'
          });
          if (error) throw error;
          results.push(data);
        }
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimized-credit-status'] });
    }
  });
}
