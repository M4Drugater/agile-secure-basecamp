
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, AlertCircle, Loader2 } from 'lucide-react';
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

      // Check if user already has this plan
      if (currentSubscription?.subscription_plan_id === plan.id) {
        toast({
          title: 'Current Plan',
          description: `You are already subscribed to the ${plan.name} plan.`,
        });
        return;
      }

      // Use the real Stripe price ID from the database
      const priceId = plan.stripe_price_id_monthly;
      
      if (!priceId) {
        toast({
          title: 'Configuration Error',
          description: 'Plan pricing is not configured. Please contact support or sync with Stripe.',
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
      
      toast({
        title: 'Redirecting to Checkout',
        description: 'Opening Stripe checkout in a new tab...',
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error creating payment session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium">Error loading subscription plans</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try refreshing the page. If the problem persists, the plans may need to be synchronized with Stripe.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="font-medium">No subscription plans available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Subscription plans need to be configured. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrentPlan = currentSubscription?.subscription_plan_id === plan.id;
        const hasValidStripePrice = plan.stripe_price_id_monthly || plan.price_monthly === 0;
        
        return (
          <Card key={plan.id} className={`relative ${plan.is_featured ? 'border-primary ring-2 ring-primary/20' : ''}`}>
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
                  {plan.price_monthly === 0 ? 'Free' : `€${plan.price_monthly}`}
                  {plan.price_monthly > 0 && (
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  )}
                </div>
                {plan.price_yearly && (
                  <div className="text-sm text-muted-foreground">
                    or €{plan.price_yearly}/year (save 17%)
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {plan.credits_per_month?.toLocaleString() || 0} credits/month
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {plan.max_daily_credits || 0} credits per day
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {(plan.features as string[])?.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {!hasValidStripePrice && plan.price_monthly > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="text-sm text-orange-800">
                        Pricing not configured
                      </span>
                    </div>
                  </div>
                )}
                
                <Button
                  className="w-full"
                  variant={plan.is_featured ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                  disabled={createCheckout.isPending || isCurrentPlan || (!hasValidStripePrice && plan.price_monthly > 0)}
                >
                  {createCheckout.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : !hasValidStripePrice && plan.price_monthly > 0 ? (
                    'Not Available'
                  ) : plan.price_monthly === 0 ? (
                    'Current Plan (Free)'
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
