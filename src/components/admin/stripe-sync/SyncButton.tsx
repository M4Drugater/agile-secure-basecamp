
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wrench } from 'lucide-react';

interface SyncButtonProps {
  isLoading: boolean;
  onSync: () => void;
}

export function SyncButton({ isLoading, onSync }: SyncButtonProps) {
  return (
    <Button 
      onClick={onSync} 
      disabled={isLoading}
      className="w-full"
      variant="default"
    >
      {isLoading ? (
        <>
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Repairing Stripe System...
        </>
      ) : (
        <>
          <Wrench className="w-4 h-4 mr-2" />
          Repair and Sync Stripe
        </>
      )}
    </Button>
  );
}
