
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { useSubscriptionPlans, useCreateCheckoutSession } from '@/hooks/useSubscriptions';
import { useToast } from '@/components/ui/use-toast';

export function SubscriptionPlans() {
  const { data: plans, isLoading } = useSubscriptionPlans();
  const createCheckout = useCreateCheckoutSession();
  const { toast } = useToast();

  const handleSubscribe = async (plan: any) => {
    try {
      const { url } = await createCheckout.mutateAsync({
        priceId: plan.stripe_price_id_monthly,
        planId: plan.id,
      });
      window.location.href = url;
    } catch (error) {
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

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans?.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.is_featured ? 'border-primary' : ''}`}>
          {plan.is_featured && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
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
                disabled={createCheckout.isPending || plan.price_monthly === 0}
              >
                {plan.price_monthly === 0 ? 'Current Plan' : 'Subscribe Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
