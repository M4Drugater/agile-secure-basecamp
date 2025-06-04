
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, AlertCircle, CreditCard, Users, ChevronDown, Settings, Package } from 'lucide-react';
import { SyncResult as SyncResultType } from './types';

interface SyncResultProps {
  syncResult: SyncResultType;
}

export function SyncResult({ syncResult }: SyncResultProps) {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  return (
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
      
      {syncResult.success && syncResult.results ? (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Package className="w-3 h-3 mr-1 text-blue-500" />
              <span>{syncResult.results.products_created || 0} products created</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-3 h-3 mr-1 text-green-500" />
              <span>{syncResult.results.prices_created || 0} prices created</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-purple-500" />
              <span>{syncResult.results.database_updated || 0} plans updated</span>
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1 text-orange-500" />
              <span>{syncResult.results.users_credits_initialized || 0} users initialized</span>
            </div>
          </div>
          
          {syncResult.results.stripe_products && Object.keys(syncResult.results.stripe_products).length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="font-medium text-xs">Stripe Products Created:</div>
              {Object.entries(syncResult.results.stripe_products).map(([plan, details]: [string, any]) => (
                <div key={plan} className="text-xs text-muted-foreground bg-white p-2 rounded">
                  <div className="font-medium capitalize">{plan} Plan</div>
                  <div>Price ID: {details.price_id}</div>
                  <div>Amount: €{details.amount_eur}/month</div>
                </div>
              ))}
            </div>
          )}

          {syncResult.results.errors && syncResult.results.errors.length > 0 && (
            <div className="mt-3">
              <div className="font-medium text-xs text-amber-600">Warnings:</div>
              <ul className="text-xs text-amber-600 list-disc list-inside">
                {syncResult.results.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Stripe Connected
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Products Synced
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Database Updated
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Credits Initialized
            </div>
          </div>
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
                      {syncResult.troubleshooting.stripe_configured ? (
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
  );
}
