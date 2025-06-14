
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { MonitoringAlert } from '@/hooks/competitive-intelligence/types/continuousMonitoring';

interface AlertCardProps {
  alert: MonitoringAlert;
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

export function AlertCard({ alert, onAcknowledge, onDismiss }: AlertCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`mb-4 ${alert.severity === 'critical' ? 'border-red-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`h-4 w-4 ${
                alert.severity === 'critical' ? 'text-red-500' : 
                alert.severity === 'high' ? 'text-orange-500' : 
                'text-yellow-500'
              }`} />
              <h4 className="font-semibold text-sm">{alert.title}</h4>
            </div>
            {alert.competitor && (
              <Badge variant="outline" className="text-xs mb-2">
                {alert.competitor}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
              {alert.severity}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {alert.type}
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">
          {alert.description}
        </p>
        
        <div className="bg-muted p-2 rounded text-xs mb-3">
          <strong>Impact:</strong> {alert.impact}
        </div>
        
        <div className="space-y-1 mb-3">
          <span className="text-xs font-medium text-muted-foreground">Recommended Actions:</span>
          {alert.recommendedActions.map((action: string, index: number) => (
            <div key={index} className="text-xs bg-blue-50 p-2 rounded">
              • {action}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {alert.timestamp.toLocaleDateString()} at {alert.timestamp.toLocaleTimeString()}
          </span>
          <div className="flex items-center gap-2">
            {!alert.acknowledged && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAcknowledge(alert.id)}
                className="h-6 px-2 text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Acknowledge
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(alert.id)}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
