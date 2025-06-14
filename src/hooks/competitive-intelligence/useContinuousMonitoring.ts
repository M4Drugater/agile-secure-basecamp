
import { useState, useEffect } from 'react';
import { MonitoringAlert, MonitoringConfig } from './types/continuousMonitoring';
import { generateMockAlert, logAlertGeneration } from './utils/alertGenerator';
import { 
  getDefaultMonitoringConfig, 
  calculateAlertStats, 
  getIntervalMs,
  logMonitoringStart,
  logMonitoringStop,
  logAlertAcknowledgment,
  logScanExecution
} from './utils/monitoringOperations';

export function useContinuousMonitoring() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [monitoringConfig, setMonitoringConfig] = useState<MonitoringConfig>(getDefaultMonitoringConfig());
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const startMonitoring = async (config: Partial<MonitoringConfig> = {}) => {
    const updatedConfig = { ...monitoringConfig, ...config };
    setMonitoringConfig(updatedConfig);
    setIsMonitoring(true);
    setLastScan(new Date());

    logMonitoringStart(updatedConfig);
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    logMonitoringStop();
  };

  const acknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));

    logAlertAcknowledgment(alertId);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const runScan = async () => {
    if (!isMonitoring) return;

    logScanExecution();
    setLastScan(new Date());

    // Simulate finding new alerts (30% chance per scan)
    if (Math.random() > 0.7) {
      const newAlert = generateMockAlert();
      setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts

      logAlertGeneration(newAlert);
    }
  };

  // Set up monitoring intervals
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(runScan, getIntervalMs(monitoringConfig.frequency));
    return () => clearInterval(interval);
  }, [isMonitoring, monitoringConfig.frequency]);

  const getAlertStats = () => calculateAlertStats(alerts);

  return {
    alerts,
    monitoringConfig,
    isMonitoring,
    lastScan,
    startMonitoring,
    stopMonitoring,
    acknowledgeAlert,
    dismissAlert,
    runScan,
    getAlertStats,
    setMonitoringConfig
  };
}
