
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, AlertCircle } from 'lucide-react';
import { useSubscriptionPlans, useCreateCheckoutSession, useUserSubscription } from '@/hooks/useSubscriptions';
import { useToast } from '@/components/ui/use-toast';

export function SubscriptionPlans() {
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const { data: currentSubscription } = useUserSubscription();
  const createCheckout = useCreateCheckoutSession();
  const { toast } = useToast();

  const handleSubscribe = async (plan: any) => {
    try {
      // Skip free plan
      if (plan.price_monthly === 0) {
        toast({
          title: 'Free Plan',
          description: 'You are already on the free plan!',
        });
        return;
      }

      // Use the real Stripe price ID from the database
      const priceId = plan.stripe_price_id_monthly;
      
      if (!priceId) {
        toast({
          title: 'Error',
          description: 'Plan configuration error. Please contact support.',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Subscribing to plan:', plan.name, 'with price ID:', priceId);
      
      const { url } = await createCheckout.mutateAsync({
        priceId: priceId,
        planId: plan.id,
      });
      
      // Open in new tab to avoid losing the current page
      window.open(url, '_blank');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading subscription plans...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">Failed to load subscription plans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans?.map((plan) => {
        const isCurrentPlan = currentSubscription?.subscription_plan_id === plan.id;
        
        return (
          <Card key={plan.id} className={`relative ${plan.is_featured ? 'border-primary' : ''}`}>
            {plan.is_featured && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            {isCurrentPlan && (
              <div className="absolute -top-3 right-4">
                <Badge variant="secondary">Current Plan</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="text-4xl font-bold">
                  ${plan.price_monthly}
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                {plan.price_yearly && (
                  <div className="text-sm text-muted-foreground">
                    or ${plan.price_yearly}/year (save 17%)
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {plan.credits_per_month.toLocaleString()} credits/month
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {plan.max_daily_credits} credits per day
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {(plan.features as string[])?.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className="w-full"
                  variant={plan.is_featured ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                  disabled={createCheckout.isPending || isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Subscribe Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
