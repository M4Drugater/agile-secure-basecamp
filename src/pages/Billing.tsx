
import React from 'react';
import { UniversalLayout } from '@/components/layout/UniversalLayout';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { SubscriptionManagement } from '@/components/subscription/SubscriptionManagement';
import { CreditUsageCard } from '@/components/subscription/CreditUsageCard';
import { StripeSync } from '@/components/admin/StripeSync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, BarChart3, Package, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Billing() {
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin';

  return (
    <UniversalLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription, view usage, and update payment methods
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <CreditUsageCard />
            <SubscriptionManagement />
          </div>

          {isAdmin && (
            <div className="grid md:grid-cols-2 gap-6">
              <StripeSync />
            </div>
          )}

          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plans" className="flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Plans
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Usage History
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Subscription Plans</h3>
                  <p className="text-muted-foreground">
                    Choose the plan that best fits your needs
                  </p>
                </div>
                <SubscriptionPlans />
              </div>
            </TabsContent>

            <TabsContent value="usage">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Credit Usage History</h3>
                  <p className="text-muted-foreground">
                    Track your AI credit consumption over time
                  </p>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  Usage history coming soon...
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Payment History</h3>
                  <p className="text-muted-foreground">
                    View your past invoices and payments
                  </p>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  Payment history coming soon...
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </UniversalLayout>
  );
}
