
import { OutputRequest } from './types/intelligentOutputs';

export function useOutputMetadata() {
  const extractIntelligentInsights = (agentInsights: Record<string, any>): string[] => {
    const insights: string[] = [];
    
    Object.values(agentInsights).forEach((agent: any) => {
      if (agent.insights) {
        agent.insights.forEach((insight: any) => {
          insights.push(insight.title || insight.description || 'Strategic insight identified');
        });
      }
    });

    return insights.slice(0, 10); // Limit to top 10 insights
  };

  const generateActionItems = (request: OutputRequest): any[] => {
    return [
      {
        id: 'action_1',
        title: 'Implement competitive monitoring protocols',
        priority: 'high',
        timeline: '30 days',
        owner: 'Strategic Intelligence Team',
        category: 'intelligence_enhancement'
      },
      {
        id: 'action_2', 
        title: 'Develop competitive response strategies',
        priority: 'high',
        timeline: '60 days',
        owner: 'Strategy Team',
        category: 'competitive_strategy'
      },
      {
        id: 'action_3',
        title: 'Establish performance benchmarking',
        priority: 'medium',
        timeline: '90 days', 
        owner: 'Analytics Team',
        category: 'performance_tracking'
      }
    ];
  };

  const identifyKnowledgeUpdates = (request: OutputRequest): any[] => {
    return [
      {
        type: 'competitive_intelligence',
        title: `Competitive Analysis: ${request.sessionData.company_name}`,
        description: 'Real-time competitive intelligence findings',
        priority: 'high',
        autoApply: true
      },
      {
        type: 'market_intelligence',
        title: `Market Analysis: ${request.sessionData.industry}`,
        description: 'Market dynamics and strategic positioning insights',
        priority: 'medium',
        autoApply: true
      }
    ];
  };

  const generateContentSuggestions = (request: OutputRequest): any[] => {
    return [
      {
        type: 'executive_brief',
        title: 'Executive Summary Brief',
        description: 'C-suite ready summary of competitive findings',
        priority: 'high'
      },
      {
        type: 'strategic_presentation',
        title: 'Strategic Presentation Deck',
        description: 'Board-ready presentation of strategic analysis',
        priority: 'medium'
      },
      {
        type: 'monitoring_dashboard',
        title: 'Competitive Monitoring Dashboard',
        description: 'Real-time competitive intelligence dashboard',
        priority: 'medium'
      }
    ];
  };

  return {
    extractIntelligentInsights,
    generateActionItems,
    identifyKnowledgeUpdates,
    generateContentSuggestions
  };
}
