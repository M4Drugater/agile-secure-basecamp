
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  );
}
