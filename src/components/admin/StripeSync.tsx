
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Euro, Users, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SyncResult {
  success: boolean;
  plans?: any[];
  stripeProducts?: any;
  creditSystemInitialized?: boolean;
  usersInitialized?: number;
  error?: string;
}

export function StripeSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    setSyncResult(null);
    
    try {
      console.log('Starting comprehensive Stripe synchronization...');
      
      const { data, error } = await supabase.functions.invoke('initialize-test-data');
      
      if (error) {
        throw error;
      }
      
      console.log('Sync response:', data);
      setSyncResult(data);
      
      if (data.success) {
        setLastSync(new Date().toLocaleString('en-US'));
        toast({
          title: 'Synchronization Successful',
          description: `Successfully synced ${data.plans?.length || 0} plans and initialized ${data.usersInitialized || 0} user credit accounts.`,
        });
      } else {
        throw new Error(data.error || 'Synchronization failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncResult({ 
        success: false, 
        error: error.message || 'Error synchronizing with Stripe.' 
      });
      toast({
        title: 'Sync Error',
        description: error.message || 'Error synchronizing with Stripe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Euro className="w-5 h-5 mr-2" />
          Stripe & Credit System Sync
        </CardTitle>
        <CardDescription>
          Synchronize subscription plans with Stripe and initialize the credit system
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Sync Status</div>
            <div className="text-sm text-muted-foreground">
              {lastSync ? `Last sync: ${lastSync}` : 'Never synced'}
            </div>
          </div>
          <Badge variant="outline" className="flex items-center">
            <Euro className="w-3 h-3 mr-1" />
            EUR
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Configured Products:</strong>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Pro (prod_RRxuCJBN3M2XL5) - €39/month</li>
            <li>• Enterprise (prod_RRxrSQAeJfVMWH) - €99/month</li>
          </ul>
        </div>

        {syncResult && (
          <div className="mt-4 p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center mb-2">
              {syncResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              )}
              <span className="font-medium">
                {syncResult.success ? 'Synchronization Successful' : 'Synchronization Failed'}
              </span>
            </div>
            
            {syncResult.success ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CreditCard className="w-3 h-3 mr-1" />
                  <span>{syncResult.plans?.length || 0} subscription plans synced</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  <span>{syncResult.usersInitialized || 0} user credit accounts initialized</span>
                </div>
                {syncResult.stripeProducts && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div>Pro: €{syncResult.stripeProducts.pro?.amountEur}/month</div>
                    <div>Enterprise: €{syncResult.stripeProducts.enterprise?.amountEur}/month</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-red-600">
                {syncResult.error}
              </div>
            )}
          </div>
        )}
        
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync with Stripe & Initialize Credits
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          This action will:
          <ul className="mt-1 ml-4 list-disc">
            <li>Update subscription plans with current Stripe prices in EUR</li>
            <li>Initialize credit accounts for all users</li>
            <li>Set up AI model pricing for cost calculation</li>
            <li>Verify Stripe product configuration</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
