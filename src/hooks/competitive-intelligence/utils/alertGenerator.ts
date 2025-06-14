
import { MonitoringAlert } from '../types/continuousMonitoring';

const alertTypes = ['competitor', 'market', 'regulatory', 'technology'] as const;
const severityLevels = ['low', 'medium', 'high', 'critical'] as const;
const competitors = ['TechCorp Inc', 'Innovation Labs', 'Future Systems', 'Digital Solutions'];

const alertTemplates = {
  competitor: {
    title: (competitor: string) => `${competitor} Product Launch Detected`,
    description: (competitor: string) => `${competitor} has announced a new product that may impact your market position`,
    impact: 'Potential market share erosion in key segments',
    recommendedActions: [
      'Analyze competitive positioning',
      'Review pricing strategy',
      'Accelerate product roadmap'
    ]
  },
  market: {
    title: () => 'Market Shift Alert',
    description: () => 'Significant market movement detected in target segment',
    impact: 'Market dynamics changing, opportunity for repositioning',
    recommendedActions: [
      'Conduct market analysis',
      'Review go-to-market strategy',
      'Assess competitive landscape'
    ]
  },
  regulatory: {
    title: () => 'Regulatory Change Notice',
    description: () => 'New regulations may affect industry operations',
    impact: 'Compliance requirements may impact product development',
    recommendedActions: [
      'Review compliance requirements',
      'Assess product impact',
      'Consult legal team'
    ]
  },
  technology: {
    title: () => 'Technology Disruption Alert',
    description: () => 'Emerging technology trend detected in industry',
    impact: 'Potential disruption to current technology stack',
    recommendedActions: [
      'Evaluate technology implications',
      'Assess R&D priorities',
      'Consider strategic partnerships'
    ]
  }
};

export const generateMockAlert = (): MonitoringAlert => {
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
  const competitor = competitors[Math.floor(Math.random() * competitors.length)];

  const template = alertTemplates[type];

  return {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    title: template.title(competitor),
    description: template.description(competitor),
    competitor: type === 'competitor' ? competitor : undefined,
    impact: template.impact,
    recommendedActions: template.recommendedActions,
    timestamp: new Date(),
    acknowledged: false
  };
};

export const logAlertGeneration = (alert: MonitoringAlert) => {
  console.log('New alert generated:', {
    alertType: alert.type,
    alertSeverity: alert.severity,
    competitor: alert.competitor,
    generatedAt: new Date().toISOString()
  });
};
