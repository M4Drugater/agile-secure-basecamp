
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row'] & {
  subscription_plan?: SubscriptionPlan;
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      console.log('Fetching subscription plans...');
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) {
        console.error('Error fetching subscription plans:', error);
        throw error;
      }
      
      console.log('Fetched subscription plans:', data);
      return data as SubscriptionPlan[];
    },
  });
}

export function useUserSubscription() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching user subscription for:', user.id);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plan:subscription_plans(*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user subscription:', error);
        throw error;
      }
      
      console.log('User subscription data:', data);
      return data as UserSubscription | null;
    },
    enabled: !!user,
  });
}

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      priceId, 
      planId 
    }: { 
      priceId: string; 
      planId: string; 
    }) => {
      console.log('Creating checkout session with:', { priceId, planId });
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, planId }
      });

      if (error) {
        console.error('Checkout session error:', error);
        throw error;
      }
      
      console.log('Checkout session created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: async () => {
      console.log('Creating portal session...');
      
      const { data, error } = await supabase.functions.invoke('create-portal-session');

      if (error) {
        console.error('Portal session error:', error);
        throw error;
      }
      
      console.log('Portal session created:', data);
      return data;
    },
  });
}
