
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Euro, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSyncStripe } from './stripe-sync/useSyncStripe';
import { SyncStatus } from './stripe-sync/SyncStatus';
import { ConfigurationInfo } from './stripe-sync/ConfigurationInfo';
import { SyncResult } from './stripe-sync/SyncResult';
import { SyncButton } from './stripe-sync/SyncButton';
import { SyncInstructions } from './stripe-sync/SyncInstructions';

export function StripeSync() {
  const { profile } = useAuth();
  const { isLoading, lastSync, syncResult, handleSync } = useSyncStripe();

  // Check if user is admin - Fixed to use profile?.role instead of user metadata
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

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
              Admin or Super Admin privileges required to access Stripe synchronization. 
              Current role: {profile?.role || 'Not determined'}
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
        <SyncStatus lastSync={lastSync} />
        <ConfigurationInfo />
        
        {syncResult && <SyncResult syncResult={syncResult} />}
        
        <SyncButton isLoading={isLoading} onSync={handleSync} />
        <SyncInstructions />
      </CardContent>
    </Card>
  );
}
