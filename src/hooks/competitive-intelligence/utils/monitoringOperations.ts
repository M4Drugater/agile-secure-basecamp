
import { MonitoringAlert, MonitoringConfig, AlertStats } from '../types/continuousMonitoring';

export const getDefaultMonitoringConfig = (): MonitoringConfig => ({
  competitors: [],
  keywords: ['product launch', 'acquisition', 'partnership', 'funding'],
  industries: ['technology', 'software', 'artificial intelligence'],
  sources: ['news', 'sec_filings', 'patents', 'social_media'],
  alertThresholds: {
    financial: 7,
    market: 6,
    product: 8,
    regulatory: 9
  },
  frequency: 'hourly'
});

export const calculateAlertStats = (alerts: MonitoringAlert[]): AlertStats => {
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;
  const critical = alerts.filter(a => a.severity === 'critical').length;
  const byType = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: alerts.length,
    unacknowledged,
    critical,
    byType
  };
};

export const getIntervalMs = (frequency: MonitoringConfig['frequency']): number => {
  switch (frequency) {
    case 'realtime': return 30000; // 30 seconds for demo
    case 'hourly': return 60000; // 1 minute for demo
    case 'daily': return 300000; // 5 minutes for demo
    case 'weekly': return 600000; // 10 minutes for demo
    default: return 60000;
  }
};

export const logMonitoringStart = (config: MonitoringConfig) => {
  console.log('Continuous monitoring started with config:', config);
};

export const logMonitoringStop = () => {
  console.log('Continuous monitoring stopped at:', new Date().toISOString());
};

export const logAlertAcknowledgment = (alertId: string) => {
  console.log('Alert acknowledged:', { alertId, acknowledgedAt: new Date().toISOString() });
};

export const logScanExecution = () => {
  console.log('Running competitive intelligence scan...');
};
