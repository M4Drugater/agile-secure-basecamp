
import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

interface ExecutiveMetric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  priority: 'high' | 'medium' | 'low';
  category: 'competitive' | 'market' | 'financial' | 'operational';
}

interface CompetitiveThreat {
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

interface StrategicOpportunity {
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

interface ExecutiveDashboardData {
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

export function useExecutiveDashboard() {
  const { supabase } = useSupabase();
  const [dashboardData, setDashboardData] = useState<ExecutiveDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const generateExecutiveDashboard = async (companyContext: any): Promise<ExecutiveDashboardData> => {
    setIsLoading(true);
    
    try {
      // Generate mock executive dashboard data
      const kpiMetrics: ExecutiveMetric[] = [
        {
          id: 'market_position',
          title: 'Market Position',
          value: '#3',
          change: 1,
          trend: 'up',
          priority: 'high',
          category: 'competitive'
        },
        {
          id: 'competitive_threats',
          title: 'Active Threats',
          value: 7,
          change: -2,
          trend: 'down',
          priority: 'medium',
          category: 'competitive'
        },
        {
          id: 'market_share',
          title: 'Market Share',
          value: '23.5%',
          change: 1.2,
          trend: 'up',
          priority: 'high',
          category: 'market'
        },
        {
          id: 'competitive_advantage',
          title: 'Competitive Score',
          value: 8.2,
          change: 0.3,
          trend: 'up',
          priority: 'high',
          category: 'competitive'
        }
      ];

      const competitiveThreats: CompetitiveThreat[] = [
        {
          id: 'threat_1',
          competitor: 'Tech Giant Corp',
          threatType: 'Product Launch',
          severity: 8,
          probability: 7,
          timeframe: 'short-term',
          impact: 'Potential 5-10% market share loss',
          mitigation: ['Accelerate product development', 'Strengthen partnerships'],
          lastUpdated: new Date()
        },
        {
          id: 'threat_2',
          competitor: 'Startup Disruptor',
          threatType: 'Technology Disruption',
          severity: 6,
          probability: 9,
          timeframe: 'medium-term',
          impact: 'New technology could obsolete current offerings',
          mitigation: ['R&D investment', 'Acquisition consideration'],
          lastUpdated: new Date()
        }
      ];

      const strategicOpportunities: StrategicOpportunity[] = [
        {
          id: 'opp_1',
          title: 'European Market Expansion',
          description: 'Underserved enterprise segment in European markets',
          marketSize: '$2.8B addressable market',
          effort: 'high',
          impact: 'high',
          timeline: '12-18 months',
          probability: 75,
          requirements: ['Local partnerships', 'Regulatory compliance', 'Sales team']
        },
        {
          id: 'opp_2',
          title: 'AI-Powered Features',
          description: 'Integration of advanced AI capabilities',
          marketSize: '$1.2B premium segment',
          effort: 'medium',
          impact: 'high',
          timeline: '6-9 months',
          probability: 85,
          requirements: ['AI talent acquisition', 'Technology investment']
        }
      ];

      const dashboardData: ExecutiveDashboardData = {
        kpiMetrics,
        competitiveThreats,
        strategicOpportunities,
        marketIntelligence: {
          marketGrowth: 12.5,
          competitorActivity: 78,
          threatLevel: 6.2,
          opportunityScore: 8.1
        },
        lastUpdated: new Date()
      };

      // Log dashboard generation
      if (supabase) {
        await supabase.from('competitive_intelligence_logs').insert({
          action: 'dashboard_generated',
          company_name: companyContext.companyName,
          metrics_count: kpiMetrics.length,
          threats_count: competitiveThreats.length,
          opportunities_count: strategicOpportunities.length,
          generated_at: new Date().toISOString()
        });
      }

      return dashboardData;
    } catch (error) {
      console.error('Error generating executive dashboard:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDashboard = async (companyContext: any) => {
    const newData = await generateExecutiveDashboard(companyContext);
    setDashboardData(newData);
  };

  // Auto-refresh every 5 minutes if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (dashboardData) {
        console.log('Auto-refreshing executive dashboard...');
        // In a real implementation, this would refresh with current context
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, dashboardData]);

  const exportDashboard = (format: 'pdf' | 'excel' | 'powerpoint') => {
    // Mock export functionality
    console.log(`Exporting dashboard as ${format}...`);
    // In a real implementation, this would generate the appropriate file format
  };

  return {
    dashboardData,
    isLoading,
    autoRefresh,
    setAutoRefresh,
    generateExecutiveDashboard,
    refreshDashboard,
    exportDashboard
  };
}
