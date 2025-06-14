
import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

interface MonitoringAlert {
  id: string;
  type: 'competitor' | 'market' | 'regulatory' | 'technology';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  competitor?: string;
  impact: string;
  recommendedActions: string[];
  timestamp: Date;
  acknowledged: boolean;
}

interface MonitoringConfig {
  competitors: string[];
  keywords: string[];
  industries: string[];
  sources: string[];
  alertThresholds: {
    financial: number;
    market: number;
    product: number;
    regulatory: number;
  };
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export function useContinuousMonitoring() {
  const { supabase } = useSupabase();
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [monitoringConfig, setMonitoringConfig] = useState<MonitoringConfig>({
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
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const generateMockAlert = (): MonitoringAlert => {
    const alertTypes = ['competitor', 'market', 'regulatory', 'technology'] as const;
    const severityLevels = ['low', 'medium', 'high', 'critical'] as const;
    const competitors = ['TechCorp Inc', 'Innovation Labs', 'Future Systems', 'Digital Solutions'];
    
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    const competitor = competitors[Math.floor(Math.random() * competitors.length)];

    const alertTemplates = {
      competitor: {
        title: `${competitor} Product Launch Detected`,
        description: `${competitor} has announced a new product that may impact your market position`,
        impact: 'Potential market share erosion in key segments',
        recommendedActions: [
          'Analyze competitive positioning',
          'Review pricing strategy',
          'Accelerate product roadmap'
        ]
      },
      market: {
        title: 'Market Shift Alert',
        description: 'Significant market movement detected in target segment',
        impact: 'Market dynamics changing, opportunity for repositioning',
        recommendedActions: [
          'Conduct market analysis',
          'Review go-to-market strategy',
          'Assess competitive landscape'
        ]
      },
      regulatory: {
        title: 'Regulatory Change Notice',
        description: 'New regulations may affect industry operations',
        impact: 'Compliance requirements may impact product development',
        recommendedActions: [
          'Review compliance requirements',
          'Assess product impact',
          'Consult legal team'
        ]
      },
      technology: {
        title: 'Technology Disruption Alert',
        description: 'Emerging technology trend detected in industry',
        impact: 'Potential disruption to current technology stack',
        recommendedActions: [
          'Evaluate technology implications',
          'Assess R&D priorities',
          'Consider strategic partnerships'
        ]
      }
    };

    const template = alertTemplates[type];

    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title: template.title,
      description: template.description,
      competitor: type === 'competitor' ? competitor : undefined,
      impact: template.impact,
      recommendedActions: template.recommendedActions,
      timestamp: new Date(),
      acknowledged: false
    };
  };

  const startMonitoring = async (config: Partial<MonitoringConfig> = {}) => {
    setMonitoringConfig(prev => ({ ...prev, ...config }));
    setIsMonitoring(true);
    setLastScan(new Date());

    // Log monitoring start
    if (supabase) {
      await supabase.from('competitive_intelligence_logs').insert({
        action: 'monitoring_started',
        config: JSON.stringify(monitoringConfig),
        started_at: new Date().toISOString()
      });
    }

    console.log('Continuous monitoring started with config:', monitoringConfig);
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    
    if (supabase) {
      await supabase.from('competitive_intelligence_logs').insert({
        action: 'monitoring_stopped',
        stopped_at: new Date().toISOString()
      });
    }

    console.log('Continuous monitoring stopped');
  };

  const acknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));

    if (supabase) {
      await supabase.from('competitive_intelligence_logs').insert({
        action: 'alert_acknowledged',
        alert_id: alertId,
        acknowledged_at: new Date().toISOString()
      });
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const runScan = async () => {
    if (!isMonitoring) return;

    console.log('Running competitive intelligence scan...');
    setLastScan(new Date());

    // Simulate finding new alerts (30% chance per scan)
    if (Math.random() > 0.7) {
      const newAlert = generateMockAlert();
      setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts

      // Log new alert
      if (supabase) {
        await supabase.from('competitive_intelligence_logs').insert({
          action: 'alert_generated',
          alert_type: newAlert.type,
          alert_severity: newAlert.severity,
          competitor: newAlert.competitor,
          generated_at: new Date().toISOString()
        });
      }
    }
  };

  // Set up monitoring intervals
  useEffect(() => {
    if (!isMonitoring) return;

    const getIntervalMs = () => {
      switch (monitoringConfig.frequency) {
        case 'realtime': return 30000; // 30 seconds for demo
        case 'hourly': return 60000; // 1 minute for demo
        case 'daily': return 300000; // 5 minutes for demo
        case 'weekly': return 600000; // 10 minutes for demo
        default: return 60000;
      }
    };

    const interval = setInterval(runScan, getIntervalMs());
    return () => clearInterval(interval);
  }, [isMonitoring, monitoringConfig.frequency]);

  const getAlertStats = () => {
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
