
import React from 'react';
import { AlertStats } from '@/hooks/competitive-intelligence/types/continuousMonitoring';

interface AlertStatisticsProps {
  alertStats: AlertStats;
}

export function AlertStatistics({ alertStats }: AlertStatisticsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center p-3 border rounded-lg">
        <div className="text-lg font-bold">{alertStats.total}</div>
        <div className="text-xs text-muted-foreground">Total Alerts</div>
      </div>
      <div className="text-center p-3 border rounded-lg">
        <div className="text-lg font-bold text-red-500">{alertStats.critical}</div>
        <div className="text-xs text-muted-foreground">Critical</div>
      </div>
      <div className="text-center p-3 border rounded-lg">
        <div className="text-lg font-bold text-orange-500">{alertStats.unacknowledged}</div>
        <div className="text-xs text-muted-foreground">Unacknowledged</div>
      </div>
      <div className="text-center p-3 border rounded-lg">
        <div className="text-lg font-bold">{alertStats.byType.competitor || 0}</div>
        <div className="text-xs text-muted-foreground">Competitor</div>
      </div>
    </div>
  );
}
