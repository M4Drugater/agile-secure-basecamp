
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  AlertTriangle, 
  Settings, 
  Play, 
  Pause, 
  Clock,
  CheckCircle,
  X,
  Eye,
  Download
} from 'lucide-react';
import { useContinuousMonitoring } from '@/hooks/competitive-intelligence/useContinuousMonitoring';

interface ContinuousMonitoringPanelProps {
  companyContext: {
    companyName: string;
    industry: string;
    analysisFocus: string;
  };
}

export function ContinuousMonitoringPanel({ companyContext }: ContinuousMonitoringPanelProps) {
  const {
    alerts,
    monitoringConfig,
    isMonitoring,
    lastScan,
    startMonitoring,
    stopMonitoring,
    acknowledgeAlert,
    dismissAlert,
    getAlertStats,
    setMonitoringConfig
  } = useContinuousMonitoring();

  const [activeTab, setActiveTab] = useState('alerts');
  const alertStats = getAlertStats();

  const handleStartMonitoring = () => {
    startMonitoring({
      competitors: [companyContext.companyName, 'Competition Analysis'],
      industries: [companyContext.industry]
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const AlertCard = ({ alert }: { alert: any }) => (
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
                onClick={() => acknowledgeAlert(alert.id)}
                className="h-6 px-2 text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Acknowledge
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Monitoring Control Panel */}
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
              onClick={isMonitoring ? stopMonitoring : handleStartMonitoring}
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

          {/* Alert Statistics */}
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
        </CardContent>
      </Card>

      {/* Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts ({alertStats.unacknowledged})
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <div className="space-y-4">
            {alerts.length === 0 ? (
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
            ) : (
              alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="config">
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
                      onChange={(e) => setMonitoringConfig(prev => ({
                        ...prev,
                        frequency: e.target.value as any
                      }))}
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
                            onChange={(e) => setMonitoringConfig(prev => ({
                              ...prev,
                              alertThresholds: {
                                ...prev.alertThresholds,
                                [key]: parseInt(e.target.value)
                              }
                            }))}
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
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Alert History</h3>
              <p className="text-muted-foreground">
                Historical alert data will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
