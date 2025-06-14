
import { ExecutiveMetric, CompetitiveThreat, StrategicOpportunity, ExecutiveDashboardData } from '../types/executiveDashboard';

export const generateKpiMetrics = (): ExecutiveMetric[] => [
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

export const generateCompetitiveThreats = (): CompetitiveThreat[] => [
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

export const generateStrategicOpportunities = (): StrategicOpportunity[] => [
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

export const generateMarketIntelligence = () => ({
  marketGrowth: 12.5,
  competitorActivity: 78,
  threatLevel: 6.2,
  opportunityScore: 8.1
});

export const generateExecutiveDashboardData = (companyContext: any): ExecutiveDashboardData => {
  const kpiMetrics = generateKpiMetrics();
  const competitiveThreats = generateCompetitiveThreats();
  const strategicOpportunities = generateStrategicOpportunities();
  const marketIntelligence = generateMarketIntelligence();

  // Log dashboard generation
  console.log('Executive dashboard generated:', {
    companyName: companyContext.companyName,
    metricsCount: kpiMetrics.length,
    threatsCount: competitiveThreats.length,
    opportunitiesCount: strategicOpportunities.length,
    generatedAt: new Date().toISOString()
  });

  return {
    kpiMetrics,
    competitiveThreats,
    strategicOpportunities,
    marketIntelligence,
    lastUpdated: new Date()
  };
};
