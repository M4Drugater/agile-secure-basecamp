
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Play, Pause, Clock } from 'lucide-react';
import { AlertStats } from '@/hooks/competitive-intelligence/types/continuousMonitoring';
import { AlertStatistics } from './AlertStatistics';

interface MonitoringControlPanelProps {
  isMonitoring: boolean;
  lastScan: Date | null;
  alertStats: AlertStats;
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
}

export function MonitoringControlPanel({
  isMonitoring,
  lastScan,
  alertStats,
  onStartMonitoring,
  onStopMonitoring
}: MonitoringControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Continuous Competitive Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
              </span>
            </div>
            {lastScan && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Last scan: {lastScan.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <Button
            onClick={isMonitoring ? onStopMonitoring : onStartMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Monitoring
              </>
            )}
          </Button>
        </div>

        <AlertStatistics alertStats={alertStats} />
      </CardContent>
    </Card>
  );
}
