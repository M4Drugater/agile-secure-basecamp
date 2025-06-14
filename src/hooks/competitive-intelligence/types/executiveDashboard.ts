
export interface ExecutiveMetric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  priority: 'high' | 'medium' | 'low';
  category: 'competitive' | 'market' | 'financial' | 'operational';
}

export interface CompetitiveThreat {
  id: string;
  competitor: string;
  threatType: string;
  severity: number; // 1-10
  probability: number; // 1-10
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  impact: string;
  mitigation: string[];
  lastUpdated: Date;
}

export interface StrategicOpportunity {
  id: string;
  title: string;
  description: string;
  marketSize: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeline: string;
  probability: number;
  requirements: string[];
}

export interface ExecutiveDashboardData {
  kpiMetrics: ExecutiveMetric[];
  competitiveThreats: CompetitiveThreat[];
  strategicOpportunities: StrategicOpportunity[];
  marketIntelligence: {
    marketGrowth: number;
    competitorActivity: number;
    threatLevel: number;
    opportunityScore: number;
  };
  lastUpdated: Date;
}
