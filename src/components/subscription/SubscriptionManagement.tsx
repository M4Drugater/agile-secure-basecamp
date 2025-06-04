
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, Settings } from 'lucide-react';
import { useUserSubscription, useCreatePortalSession } from '@/hooks/useSubscriptions';
import { useToast } from '@/components/ui/use-toast';

export function SubscriptionManagement() {
  const { data: subscription, isLoading } = useUserSubscription();
  const createPortal = useCreatePortalSession();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      const { url } = await createPortal.mutateAsync();
      window.location.href = url;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading subscription...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            You're currently on the free plan
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'canceled': return 'destructive';
      case 'past_due': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Current Subscription
          </div>
          <Badge variant={getStatusColor(subscription.status)}>
            {subscription.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Plan</div>
            <div className="font-medium">{subscription.subscription_plan?.name}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="font-medium">
              ${subscription.subscription_plan?.price_monthly}/month
            </div>
          </div>
        </div>

        {subscription.current_period_end && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {subscription.cancel_at_period_end ? 'Cancels on' : 'Renews on'}
              </span>
            </div>
            <div className="text-sm font-medium">
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleManageSubscription}
          disabled={createPortal.isPending}
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage Subscription
        </Button>
      </CardContent>
    </Card>
  );
}
