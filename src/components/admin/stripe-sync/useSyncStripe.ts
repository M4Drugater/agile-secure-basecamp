
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SyncResult } from './types';

export function useSyncStripe() {
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
          description: `Successfully configured ${data.details?.plans_created || 0} plans and initialized ${data.details?.users_initialized || 0} user accounts.`,
        });
      } else {
        throw new Error(data.error || 'Synchronization failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      const errorResult: SyncResult = { 
        success: false, 
        error: error.message || 'Error synchronizing with Stripe.',
        troubleshooting: {
          stripe_key_configured: false,
          supabase_configured: true,
          common_solutions: [
            'Check that STRIPE_SECRET_KEY is configured in Supabase Edge Functions secrets',
            'Verify your Stripe account is activated',
            'Ensure your Stripe API key has the required permissions'
          ]
        }
      };
      setSyncResult(errorResult);
      toast({
        title: 'Sync Error',
        description: error.message || 'Error synchronizing with Stripe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    lastSync,
    syncResult,
    handleSync
  };
}
