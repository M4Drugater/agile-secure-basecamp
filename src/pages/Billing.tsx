
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionManagement } from '@/components/subscription/SubscriptionManagement';
import { CreditUsageCard } from '@/components/subscription/CreditUsageCard';
import { OptimizedCostMonitoring } from '@/components/billing/OptimizedCostMonitoring';
import { PaymentHistory } from '@/components/billing/PaymentHistory';

export default function Billing() {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access billing information.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscriptions</h1>
          <p className="text-muted-foreground">Manage your subscription, credits, and payment history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Usage Overview */}
        <div className="lg:col-span-2 space-y-6">
          <CreditUsageCard />
          <OptimizedCostMonitoring />
        </div>

        {/* Subscription Management */}
        <div className="space-y-6">
          <SubscriptionManagement />
        </div>
      </div>

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* Payment History */}
      <PaymentHistory />
    </div>
  );
}
