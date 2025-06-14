
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MonitoringConfig } from '@/hooks/competitive-intelligence/types/continuousMonitoring';

interface ConfigurationTabProps {
  monitoringConfig: MonitoringConfig;
  onConfigUpdate: (config: MonitoringConfig) => void;
}

export function ConfigurationTab({ monitoringConfig, onConfigUpdate }: ConfigurationTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="frequency">Scan Frequency</Label>
              <select 
                id="frequency"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                value={monitoringConfig.frequency}
                onChange={(e) => onConfigUpdate({
                  ...monitoringConfig,
                  frequency: e.target.value as any
                })}
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div>
              <Label>Alert Thresholds</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(monitoringConfig.alertThresholds).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key}:</span>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) => onConfigUpdate({
                        ...monitoringConfig,
                        alertThresholds: {
                          ...monitoringConfig.alertThresholds,
                          [key]: parseInt(e.target.value)
                        }
                      })}
                      className="w-16 h-8"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Data Sources</Label>
              <div className="space-y-2 mt-2">
                {monitoringConfig.sources.map((source) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{source.replace('_', ' ')}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Keywords</Label>
              <div className="mt-2 space-y-1">
                {monitoringConfig.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="mr-1 mb-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
