
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OptimizedSubscriptionData {
  user_subscription: any;
  available_plans: any[];
  payment_methods: any[];
  billing_history: any[];
}

// Single query to fetch all subscription-related data
export function useOptimizedSubscriptionData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['optimized-subscription-data', user?.id],
    queryFn: async (): Promise<OptimizedSubscriptionData> => {
      if (!user) throw new Error('User not authenticated');

      // Fetch all data in parallel
      const [subscriptionResult, plansResult, paymentsResult] = await Promise.allSettled([
        supabase
          .from('user_subscriptions')
          .select(`
            *,
            subscription_plan:subscription_plans(*)
          `)
          .eq('user_id', user.id)
          .maybeSingle(),
        
        supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly', { ascending: true }),
        
        supabase
          .from('payment_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const user_subscription = subscriptionResult.status === 'fulfilled' ? subscriptionResult.value.data : null;
      const available_plans = plansResult.status === 'fulfilled' ? plansResult.value.data || [] : [];
      const billing_history = paymentsResult.status === 'fulfilled' ? paymentsResult.value.data || [] : [];

      return {
        user_subscription,
        available_plans,
        payment_methods: [], // Stripe payment methods would be fetched separately if needed
        billing_history
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Optimized checkout with better error handling
export function useOptimizedCheckout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      priceId, 
      planId,
      successUrl,
      cancelUrl
    }: { 
      priceId: string; 
      planId: string;
      successUrl?: string;
      cancelUrl?: string;
    }) => {
      console.log('Creating optimized checkout session...');
      
      const origin = window.location.origin;
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId, 
          planId,
          successUrl: successUrl || `${origin}/billing?success=true`,
          cancelUrl: cancelUrl || `${origin}/billing?canceled=true`
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Checkout session created successfully:', data);
      // Open in new tab for better UX
      if (data.url) {
        window.open(data.url, '_blank');
      }
      
      toast({
        title: 'Redirecting to Payment',
        description: 'Opening Stripe checkout in a new tab...',
      });
    },
    onError: (error: any) => {
      console.error('Checkout failed:', error);
      
      let errorMessage = 'Payment setup failed. Please try again.';
      
      if (error.message?.includes('Invalid price configuration')) {
        errorMessage = 'This plan is temporarily unavailable. Please contact support.';
      } else if (error.message?.includes('Active subscription exists')) {
        errorMessage = 'You already have an active subscription. Manage it below.';
      } else if (error.message?.includes('Authentication')) {
        errorMessage = 'Please log in again to continue.';
      }
      
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  });
}

// Smart portal session management
export function useOptimizedPortalSession() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Creating optimized portal session...');
      
      const { data, error } = await supabase.functions.invoke('create-portal-session');

      if (error) {
        console.error('Portal error:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        // Open in new tab for better UX
        window.open(data.url, '_blank');
        toast({
          title: 'Customer Portal',
          description: 'Opening billing management in a new tab...',
        });
      }
    },
    onError: (error: any) => {
      console.error('Portal session failed:', error);
      
      let errorMessage = 'Unable to access billing portal. Please try again.';
      
      if (error.message?.includes('No subscription found')) {
        errorMessage = 'No active subscription found. Subscribe to a plan first.';
      }
      
      toast({
        title: 'Portal Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  });
}
