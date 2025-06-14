
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface CostUsage {
  dailyUsage: number;
  monthlyUsage: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyPercentage: number;
  monthlyPercentage: number;
}

interface CostMonitoringHook {
  usage: CostUsage | null;
  isLoading: boolean;
  isNearLimit: boolean;
  isOverLimit: boolean;
  refreshUsage: () => Promise<void>;
  checkBeforeAction: (estimatedCost?: number) => boolean;
}

export function useCostMonitoring(): CostMonitoringHook {
  const { user } = useAuth();
  const { toast } = useToast();

  // Use React Query for better caching and error handling
  const { data: usage, isLoading, refetch } = useQuery({
    queryKey: ['cost-monitoring', user?.id],
    queryFn: async (): Promise<CostUsage> => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Parallel fetch for better performance
        const [dailyResult, monthlyResult, configResult] = await Promise.allSettled([
          supabase.rpc('get_user_daily_cost', { user_uuid: user.id }),
          supabase
            .from('ai_usage_logs')
            .select('total_cost')
            .eq('user_id', user.id)
            .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
            .eq('status', 'success'),
          supabase
            .from('cost_monitoring_config')
            .select('per_user_daily_limit, monthly_limit')
            .eq('is_active', true)
            .single()
        ]);

        const dailyUsage = dailyResult.status === 'fulfilled' 
          ? parseFloat(String(dailyResult.value.data || '0'))
          : 0;

        const monthlyUsage = monthlyResult.status === 'fulfilled'
          ? (monthlyResult.value.data?.reduce((sum: number, log: any) => 
              sum + parseFloat(log.total_cost), 0) || 0)
          : 0;

        const config = configResult.status === 'fulfilled' 
          ? configResult.value.data 
          : null;

        const dailyLimit = config?.per_user_daily_limit || 5.0;
        const monthlyLimit = config?.monthly_limit || 1000.0;

        return {
          dailyUsage,
          monthlyUsage,
          dailyLimit,
          monthlyLimit,
          dailyPercentage: (dailyUsage / dailyLimit) * 100,
          monthlyPercentage: (monthlyUsage / monthlyLimit) * 100,
        };
      } catch (error) {
        console.error('Error fetching cost usage:', error);
        toast({
          title: 'Usage Monitoring Error',
          description: 'Unable to fetch current usage data.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const isNearLimit = usage ? (usage.dailyPercentage > 80 || usage.monthlyPercentage > 80) : false;
  const isOverLimit = usage ? (usage.dailyPercentage >= 100 || usage.monthlyPercentage >= 100) : false;

  const refreshUsage = async () => {
    await refetch();
  };

  const checkBeforeAction = (estimatedCost = 0.01): boolean => {
    if (!usage) return true;

    const projectedDaily = usage.dailyUsage + estimatedCost;
    const projectedMonthly = usage.monthlyUsage + estimatedCost;

    if (projectedDaily > usage.dailyLimit) {
      toast({
        title: 'Daily Limit Reached',
        description: `This action would exceed your daily limit ($${usage.dailyLimit.toFixed(2)}). Please try again tomorrow.`,
        variant: 'destructive',
      });
      return false;
    }

    if (projectedMonthly > usage.monthlyLimit) {
      toast({
        title: 'Monthly Limit Reached',
        description: `This action would exceed your monthly limit ($${usage.monthlyLimit.toFixed(2)}). Please upgrade your plan.`,
        variant: 'destructive',
      });
      return false;
    }

    if (projectedDaily > usage.dailyLimit * 0.9) {
      toast({
        title: 'Approaching Daily Limit',
        description: `You're close to your daily limit. Remaining: $${(usage.dailyLimit - usage.dailyUsage).toFixed(4)}`,
        variant: 'default',
      });
    }

    return true;
  };

  return {
    usage: usage || null,
    isLoading,
    isNearLimit,
    isOverLimit,
    refreshUsage,
    checkBeforeAction,
  };
}
