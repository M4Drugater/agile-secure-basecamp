
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Euro } from 'lucide-react';

interface SyncStatusProps {
  lastSync: string | null;
}

export function SyncStatus({ lastSync }: SyncStatusProps) {
  return (
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
  );
}
