
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  AlertTriangle, 
  Play, 
  Pause, 
  Settings, 
  Bell,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { useContinuousMonitoring } from '@/hooks/competitive-intelligence/useContinuousMonitoring';

interface ContinuousMonitoringPanelProps {
  companyContext: {
    companyName: string;
    industry: string;
    analysisFocus: string;
    objectives: string;
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

  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const alertStats = getAlertStats();

  useEffect(() => {
    // Auto-start monitoring if company context is available
    if (companyContext.companyName && !isMonitoring) {
      startMonitoring({
        competitors: [`${companyContext.companyName} competitors`],
        industries: [companyContext.industry]
      });
    }
  }, [companyContext.companyName]);

  const AlertCard = ({ alert }: { alert: any }) => (
    <Card className={`mb-4 cursor-pointer transition-all ${
      selectedAlert === alert.id ? 'ring-2 ring-blue-500' : ''
    } ${alert.acknowledged ? 'opacity-75' : ''}`}
    onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              alert.severity === 'critical' ? 'bg-red-500' :
              alert.severity === 'high' ? 'bg-orange-500' :
              alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <h4 className="font-semibold text-sm">{alert.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={
              alert.severity === 'critical' ? 'destructive' :
              alert.severity === 'high' ? 'outline' : 'secondary'
            } className="text-xs">
              {alert.severity}
            </Badge>
            {alert.acknowledged && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
        
        {alert.competitor && (
          <div className="flex items-center gap-2 text-xs mb-2">
            <Shield className="h-3 w-3" />
            <span className="font-medium">{alert.competitor}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {alert.timestamp.toLocaleString()}
          </div>
          <Badge variant="outline" className="text-xs">
            {alert.type}
          </Badge>
        </div>

        {selectedAlert === alert.id && (
          <div className="mt-4 space-y-3 border-t pt-3">
            <div>
              <p className="text-xs font-medium mb-1">Business Impact:</p>
              <p className="text-xs text-muted-foreground">{alert.impact}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium mb-1">Recommended Actions:</p>
              <div className="space-y-1">
                {alert.recommendedActions.map((action: string, index: number) => (
                  <div key={index} className="text-xs bg-muted p-2 rounded">
                    • {action}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!alert.acknowledged && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    acknowledgeAlert(alert.id);
                  }}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acknowledge
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissAlert(alert.id);
                }}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const MonitoringStatsCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Monitoring Header */}
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
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                Status: {isMonitoring ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">
                Frequency: {monitoringConfig.frequency}
              </Badge>
              {lastScan && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last scan: {lastScan.toLocaleTimeString()}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isMonitoring ? "outline" : "default"}
                size="sm"
                onClick={isMonitoring ? stopMonitoring : () => startMonitoring()}
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
          </div>

          {/* Monitoring Progress */}
          {isMonitoring && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Monitoring Progress</span>
                <span>{monitoringConfig.sources.length} sources active</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitoring Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MonitoringStatsCard
          title="Total Alerts"
          value={alertStats.total}
          icon={Bell}
          color="text-blue-500"
        />
        <MonitoringStatsCard
          title="Unacknowledged"
          value={alertStats.unacknowledged}
          icon={AlertTriangle}
          color="text-orange-500"
        />
        <MonitoringStatsCard
          title="Critical Alerts"
          value={alertStats.critical}
          icon={Zap}
          color="text-red-500"
        />
        <MonitoringStatsCard
          title="Monitoring Score"
          value="8.7/10"
          icon={TrendingUp}
          color="text-green-500"
        />
      </div>

      {/* Alerts and Configuration */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Active Alerts ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No alerts yet. {isMonitoring ? 'Monitoring is active.' : 'Start monitoring to receive alerts.'}
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

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alert Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(alertStats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(count as number) * 20} className="w-24 h-2" />
                        <span className="text-sm font-medium">{count as number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monitoring Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">87%</p>
                    <p className="text-sm text-muted-foreground">Overall Effectiveness</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Threat Detection</span>
                      <span>92%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>False Positive Rate</span>
                      <span>8%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Response Time</span>
                      <span>< 5 min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Monitoring Frequency</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['realtime', 'hourly', 'daily', 'weekly'].map((freq) => (
                    <Button
                      key={freq}
                      variant={monitoringConfig.frequency === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMonitoringConfig(prev => ({ ...prev, frequency: freq as any }))}
                      className="text-xs"
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Alert Thresholds</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(monitoringConfig.alertThresholds).map(([type, threshold]) => (
                    <div key={type} className="space-y-2">
                      <label className="text-sm capitalize">{type}</label>
                      <div className="flex items-center gap-2">
                        <Progress value={threshold * 10} className="flex-1 h-2" />
                        <span className="text-sm w-8">{threshold}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Monitored Sources</h4>
                <div className="grid grid-cols-2 gap-2">
                  {monitoringConfig.sources.map((source) => (
                    <div key={source} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm capitalize">{source.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
