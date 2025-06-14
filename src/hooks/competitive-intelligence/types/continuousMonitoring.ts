
export interface MonitoringAlert {
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

export interface MonitoringConfig {
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

export interface AlertStats {
  total: number;
  unacknowledged: number;
  critical: number;
  byType: Record<string, number>;
}
