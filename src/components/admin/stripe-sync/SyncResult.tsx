
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, AlertCircle, CreditCard, Users, ChevronDown, Settings } from 'lucide-react';
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
  );
}
