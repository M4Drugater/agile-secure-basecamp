
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Users, ExternalLink } from 'lucide-react';
import { useUserSubscription, useCreatePortalSession } from '@/hooks/useSubscriptions';
import { useToast } from '@/components/ui/use-toast';

export function SubscriptionManagement() {
  const { data: subscription, isLoading, error } = useUserSubscription();
  const createPortalSession = useCreatePortalSession();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      console.log('Opening customer portal...');
      const { url } = await createPortalSession.mutateAsync();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: 'Error',
        description: 'Unable to open subscription management. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading subscription information...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-destructive">
            Error loading subscription information
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasActiveSubscription = subscription?.status === 'active';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          {hasActiveSubscription ? 'Active Subscription' : 'No Active Subscription'}
        </CardTitle>
        <CardDescription>
          {hasActiveSubscription 
            ? 'Manage your current subscription' 
            : "You're currently on the free plan"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hasActiveSubscription ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{subscription.subscription_plan?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {subscription.subscription_plan?.description}
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Monthly Price</div>
                  <div className="text-muted-foreground">
                    €{subscription.subscription_plan?.price_monthly}/month
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Credits per Month</div>
                  <div className="text-muted-foreground">
                    {subscription.subscription_plan?.credits_per_month?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleManageSubscription}
              disabled={createPortalSession.isPending}
              className="w-full"
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-sm text-muted-foreground mb-4">
              Upgrade to a paid plan to unlock more features and credits
            </div>
            <Button className="w-full" onClick={() => window.location.hash = '#plans'}>
              View Plans
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
