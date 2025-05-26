
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';

export function UsageWarning() {
  const { usage } = useCostMonitoring();

  if (!usage || (usage.dailyPercentage <= 80 && usage.monthlyPercentage <= 80)) {
    return null;
  }

  return (
    <Alert variant={usage.dailyPercentage > 95 ? "destructive" : "default"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {usage.dailyPercentage > 95 
          ? "You're very close to your daily limit. Use AI requests sparingly."
          : "You're approaching your usage limits. Monitor your requests."
        }
      </AlertDescription>
    </Alert>
  );
}
