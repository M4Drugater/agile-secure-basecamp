
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, CreditCard } from 'lucide-react';
import { useSubscriptionPlans, useUserSubscription, useCreateCheckoutSession } from '@/hooks/useSubscriptions';
import { useToast } from '@/hooks/use-toast';

export function SubscriptionPlans() {
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: userSubscription, isLoading: subscriptionLoading } = useUserSubscription();
  const createCheckoutSession = useCreateCheckoutSession();
  const { toast } = useToast();

  const handleSubscribe = async (planId: string, priceId: string | null) => {
    if (!priceId) {
      toast({
        title: 'Error',
        description: 'This plan is not available for subscription.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { url } = await createCheckoutSession.mutateAsync({
        priceId,
        planId,
      });
      
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (plansLoading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No subscription plans available.</p>
      </div>
    );
  }

  const currentPlanId = userSubscription?.subscription_plan?.id;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrentPlan = currentPlanId === plan.id;
        const isFree = plan.price_monthly === 0;
        
        return (
          <Card key={plan.id} className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''} ${plan.is_featured ? 'border-primary' : ''}`}>
            {plan.is_featured && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            
            {isCurrentPlan && (
              <div className="absolute -top-3 right-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Your Plan
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {isFree ? 'Free' : `€${plan.price_monthly}`}
                </span>
                {!isFree && <span className="text-muted-foreground">/month</span>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credits per month</span>
                  <span className="font-medium">{plan.credits_per_month.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily limit</span>
                  <span className="font-medium">{plan.max_daily_credits}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Features:</h4>
                <ul className="space-y-1">
                  {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                {isCurrentPlan ? (
                  <Button disabled className="w-full">
                    <Check className="w-4 h-4 mr-2" />
                    Current Plan
                  </Button>
                ) : isFree ? (
                  <Button disabled className="w-full" variant="outline">
                    Default Plan
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleSubscribe(plan.id, plan.stripe_price_id_monthly)}
                    disabled={createCheckoutSession.isPending || !plan.stripe_price_id_monthly}
                    className="w-full"
                  >
                    {createCheckoutSession.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
