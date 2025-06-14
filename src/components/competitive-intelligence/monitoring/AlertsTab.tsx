
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor } from 'lucide-react';
import { MonitoringAlert } from '@/hooks/competitive-intelligence/types/continuousMonitoring';
import { AlertCard } from './AlertCard';

interface AlertsTabProps {
  alerts: MonitoringAlert[];
  isMonitoring: boolean;
  onAcknowledgeAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
}

export function AlertsTab({ alerts, isMonitoring, onAcknowledgeAlert, onDismissAlert }: AlertsTabProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
          <p className="text-muted-foreground">
            {isMonitoring 
              ? "Monitoring is active. New alerts will appear here when detected."
              : "Start monitoring to begin receiving competitive intelligence alerts."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertCard 
          key={alert.id} 
          alert={alert}
          onAcknowledge={onAcknowledgeAlert}
          onDismiss={onDismissAlert}
        />
      ))}
    </div>
  );
}
