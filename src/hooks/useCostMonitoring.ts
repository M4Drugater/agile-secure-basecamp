
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [usage, setUsage] = useState<CostUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUsage = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Get user's current usage
      const [dailyResult, monthlyResult] = await Promise.all([
        supabase.rpc('get_user_daily_cost', { user_uuid: user.id }),
        supabase
          .from('ai_usage_logs')
          .select('total_cost')
          .eq('user_id', user.id)
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .eq('status', 'success')
      ]);

      // Get current limits
      const { data: configData } = await supabase
        .from('cost_monitoring_config')
        .select('per_user_daily_limit, monthly_limit')
        .eq('is_active', true)
        .single();

      const dailyUsage = parseFloat(dailyResult.data || '0');
      const monthlyUsage = monthlyResult.data?.reduce((sum, log) => sum + parseFloat(log.total_cost), 0) || 0;
      const dailyLimit = configData?.per_user_daily_limit || 5.0;
      const monthlyLimit = configData?.monthly_limit || 1000.0;

      const newUsage: CostUsage = {
        dailyUsage,
        monthlyUsage,
        dailyLimit,
        monthlyLimit,
        dailyPercentage: (dailyUsage / dailyLimit) * 100,
        monthlyPercentage: (monthlyUsage / monthlyLimit) * 100,
      };

      setUsage(newUsage);
    } catch (error) {
      console.error('Error fetching cost usage:', error);
      toast({
        title: 'Usage Monitoring Error',
        description: 'Unable to fetch current usage data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isNearLimit = usage ? (usage.dailyPercentage > 80 || usage.monthlyPercentage > 80) : false;
  const isOverLimit = usage ? (usage.dailyPercentage >= 100 || usage.monthlyPercentage >= 100) : false;

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

  useEffect(() => {
    if (user) {
      refreshUsage();
      
      // Set up periodic refresh every 5 minutes
      const interval = setInterval(refreshUsage, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    usage,
    isLoading,
    isNearLimit,
    isOverLimit,
    refreshUsage,
    checkBeforeAction,
  };
}
