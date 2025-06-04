
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RefreshCw, CheckCircle, AlertCircle, Euro, Users, CreditCard, ChevronDown, Settings, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SyncResult {
  success: boolean;
  message?: string;
  details?: {
    plans_created?: number;
    users_initialized?: number;
    stripe_products?: {
      pro?: { product_id: string; price_id: string; amount_eur: number };
      enterprise?: { product_id: string; price_id: string; amount_eur: number };
    };
    configuration?: {
      stripe_connected?: boolean;
      database_updated?: boolean;
      credits_initialized?: boolean;
      ai_pricing_updated?: boolean;
    };
  };
  error?: string;
  troubleshooting?: {
    stripe_key_configured?: boolean;
    supabase_configured?: boolean;
    common_solutions?: string[];
  };
}

export function StripeSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin';

  const handleSync = async () => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You need admin privileges to sync with Stripe.',
        variant: 'destructive',
      });
      return;
    }

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

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Euro className="w-5 h-5 mr-2" />
            Stripe & Credit System Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Admin privileges required to access Stripe synchronization.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
            <strong>Target Configuration:</strong>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Free Plan - 100 credits/month, 10 daily limit</li>
            <li>• Pro Plan - €39/month, 1,000 credits/month, 50 daily limit</li>
            <li>• Enterprise Plan - €99/month, 5,000 credits/month, 200 daily limit</li>
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
            
            {syncResult.success && syncResult.details ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CreditCard className="w-3 h-3 mr-1" />
                  <span>{syncResult.details.plans_created || 0} subscription plans configured</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  <span>{syncResult.details.users_initialized || 0} user accounts initialized</span>
                </div>
                
                {syncResult.details.stripe_products && (
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div>✓ Pro: €{syncResult.details.stripe_products.pro?.amount_eur}/month</div>
                    <div>✓ Enterprise: €{syncResult.details.stripe_products.enterprise?.amount_eur}/month</div>
                  </div>
                )}

                {syncResult.details.configuration && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      Stripe Connected
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      Database Updated
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      Credits Initialized
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      AI Pricing Updated
                    </div>
                  </div>
                )}
              </div>
            ) : syncResult.error && (
              <div className="space-y-3">
                <div className="text-sm text-red-600">
                  {syncResult.error}
                </div>
                
                {syncResult.troubleshooting && (
                  <Collapsible open={showTroubleshooting} onOpenChange={setShowTroubleshooting}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <Settings className="w-3 h-3 mr-1" />
                        Troubleshooting Guide
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="text-xs space-y-2">
                        <div>
                          <strong>Configuration Status:</strong>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            {syncResult.troubleshooting.stripe_key_configured ? (
                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                            )}
                            <span>Stripe Secret Key</span>
                          </div>
                          <div className="flex items-center">
                            {syncResult.troubleshooting.supabase_configured ? (
                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                            )}
                            <span>Supabase Configuration</span>
                          </div>
                        </div>
                        
                        {syncResult.troubleshooting.common_solutions && (
                          <div className="mt-2">
                            <strong>Solutions:</strong>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                              {syncResult.troubleshooting.common_solutions.map((solution, index) => (
                                <li key={index}>{solution}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
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
              Sync with Stripe & Initialize System
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <strong>This action will:</strong>
          <ul className="mt-1 ml-4 list-disc space-y-1">
            <li>Create/verify Stripe products and prices in EUR</li>
            <li>Set up subscription plans in the database</li>
            <li>Initialize credit accounts for all users</li>
            <li>Configure AI model pricing for cost calculation</li>
            <li>Verify all system configurations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
