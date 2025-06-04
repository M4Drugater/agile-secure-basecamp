
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, Euro } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function StripeSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Stripe synchronization...');
      
      const { data, error } = await supabase.functions.invoke('initialize-test-data');
      
      if (error) {
        throw error;
      }
      
      console.log('Sync response:', data);
      
      setLastSync(new Date().toLocaleString('en-US'));
      toast({
        title: 'Sync Successful',
        description: `Successfully synced ${data.plans?.length || 0} plans with Stripe in EUR.`,
      });
    } catch (error) {
      console.error('Sync error:', error);
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
          Stripe Synchronization
        </CardTitle>
        <CardDescription>
          Sync subscription plans with your Stripe products in EUR
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
            <li>• Pro (prod_RRxuCJBN3M2XL5)</li>
            <li>• T Leadership (prod_RRxrSQAeJfVMWH)</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync with Stripe
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          This action will update subscription plans with current Stripe prices in EUR.
        </div>
      </CardContent>
    </Card>
  );
}
