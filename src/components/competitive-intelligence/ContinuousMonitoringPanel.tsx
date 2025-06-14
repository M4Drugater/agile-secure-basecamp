
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Settings, Clock } from 'lucide-react';
import { useContinuousMonitoring } from '@/hooks/competitive-intelligence/useContinuousMonitoring';
import { MonitoringControlPanel } from './monitoring/MonitoringControlPanel';
import { AlertsTab } from './monitoring/AlertsTab';
import { ConfigurationTab } from './monitoring/ConfigurationTab';
import { HistoryTab } from './monitoring/HistoryTab';

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

  return (
    <div className="space-y-6">
      <MonitoringControlPanel
        isMonitoring={isMonitoring}
        lastScan={lastScan}
        alertStats={alertStats}
        onStartMonitoring={handleStartMonitoring}
        onStopMonitoring={stopMonitoring}
      />

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
          <AlertsTab
            alerts={alerts}
            isMonitoring={isMonitoring}
            onAcknowledgeAlert={acknowledgeAlert}
            onDismissAlert={dismissAlert}
          />
        </TabsContent>

        <TabsContent value="config">
          <ConfigurationTab
            monitoringConfig={monitoringConfig}
            onConfigUpdate={setMonitoringConfig}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
