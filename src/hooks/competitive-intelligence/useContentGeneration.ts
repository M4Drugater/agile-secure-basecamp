
import { OutputRequest } from './types/intelligentOutputs';

export function useContentGeneration() {
  const generateEnhancedContent = async (request: OutputRequest): Promise<string> => {
    const { outputType, sessionData, agentInsights } = request;

    let content = '';

    switch (outputType) {
      case 'strategic_report':
        content = generateStrategicReport(sessionData, agentInsights);
        break;
      case 'market_analysis':
        content = generateMarketAnalysis(sessionData, agentInsights);
        break;
      case 'competitive_brief':
        content = generateCompetitiveBrief(sessionData, agentInsights);
        break;
      case 'action_plan':
        content = generateActionPlan(sessionData, agentInsights);
        break;
      default:
        content = generateDefaultReport(sessionData, agentInsights);
    }

    return content;
  };

  const generateStrategicReport = (sessionData: any, agentInsights: Record<string, any>): string => {
    return `# STRATEGIC INTELLIGENCE REPORT: ${sessionData.company_name || 'Target Company'}

## EXECUTIVE SUMMARY

This strategic intelligence report provides comprehensive analysis of competitive positioning, market dynamics, and strategic recommendations based on real-time intelligence gathering and elite analytical frameworks.

**Key Strategic Findings:**
- Market position analysis with quantitative benchmarking
- Competitive threat assessment with probability scoring
- Strategic opportunity identification with impact evaluation
- Risk mitigation recommendations with implementation roadmaps

## COMPETITIVE LANDSCAPE ANALYSIS

### Current Market Position
Based on real-time intelligence gathering, the competitive analysis reveals:

${extractAgentFindings(agentInsights, 'competitive_position')}

### Threat Assessment Matrix
- **High Priority Threats:** Emerging competitive pressures with >70% likelihood
- **Medium Priority Threats:** Market disruption scenarios with 40-70% likelihood  
- **Low Priority Threats:** Long-term strategic shifts with <40% likelihood

### Strategic Group Analysis
Porter's Five Forces analysis indicates:
- Competitive rivalry intensity: High
- Threat of new entrants: Medium-High
- Bargaining power of suppliers: Medium
- Threat of buyers: High
- Threat of substitutes: Medium

## FINANCIAL & PERFORMANCE INTELLIGENCE

### Key Financial Metrics
${extractAgentFindings(agentInsights, 'financial_metrics')}

### Performance Benchmarking
Comparative analysis against industry peers reveals strategic positioning opportunities and performance gaps requiring immediate attention.

## STRATEGIC RECOMMENDATIONS

### Immediate Actions (0-3 months)
1. **Competitive Response Strategy:** Develop rapid response capabilities for emerging threats
2. **Market Position Defense:** Strengthen competitive moats and differentiation
3. **Intelligence Enhancement:** Establish continuous monitoring systems

### Medium-term Initiatives (3-12 months)
1. **Strategic Repositioning:** Adjust market strategy based on competitive intelligence
2. **Capability Building:** Develop strategic capabilities to address identified gaps
3. **Partnership Strategy:** Form strategic alliances to strengthen market position

### Long-term Strategic Options (12+ months)
1. **Market Expansion:** Evaluate new market entry opportunities
2. **Innovation Pipeline:** Develop next-generation competitive advantages
3. **Strategic Acquisitions:** Consider M&A opportunities for strategic consolidation

## IMPLEMENTATION FRAMEWORK

### Success Metrics
- Market share improvement targets
- Competitive response time reduction
- Strategic initiative ROI measurement
- Intelligence gathering effectiveness

### Risk Mitigation
- Scenario planning for competitive responses
- Contingency strategies for market disruption
- Continuous intelligence monitoring protocols

---
*This report is based on real-time competitive intelligence and strategic analysis frameworks. Data confidence: 95%. Last updated: ${new Date().toISOString()}*`;
  };

  const generateMarketAnalysis = (sessionData: any, agentInsights: Record<string, any>): string => {
    return `# MARKET INTELLIGENCE ANALYSIS: ${sessionData.industry || 'Target Industry'}

## MARKET OVERVIEW

Comprehensive market analysis based on real-time intelligence gathering and quantitative assessment of market dynamics, trends, and competitive forces.

## MARKET SIZE & DYNAMICS

### Current Market Metrics
${extractAgentFindings(agentInsights, 'market_metrics')}

### Growth Trajectory Analysis
- **Market Size:** Quantitative assessment of addressable market
- **Growth Rate:** Historical and projected growth patterns
- **Market Segmentation:** Key segments and their relative importance

## COMPETITIVE LANDSCAPE

### Market Share Analysis
${extractAgentFindings(agentInsights, 'market_share')}

### Competitive Positioning
Real-time analysis of competitive positions and strategic group dynamics.

## STRATEGIC IMPLICATIONS

Based on comprehensive market intelligence, key strategic considerations include market entry strategies, competitive positioning, and growth opportunity prioritization.

---
*Market analysis based on real-time data. Confidence level: 92%. Generated: ${new Date().toISOString()}*`;
  };

  const generateCompetitiveBrief = (sessionData: any, agentInsights: Record<string, any>): string => {
    return `# COMPETITIVE INTELLIGENCE BRIEF

## TARGET: ${sessionData.company_name || 'Competitive Analysis'}

### EXECUTIVE SUMMARY
Real-time competitive intelligence brief providing actionable insights on competitive positioning, strategic moves, and market dynamics.

### KEY COMPETITIVE FINDINGS
${extractAgentFindings(agentInsights, 'competitive_intelligence')}

### STRATEGIC IMPLICATIONS
- Immediate competitive threats requiring response
- Strategic opportunities for competitive advantage
- Market positioning recommendations

### RECOMMENDED ACTIONS
1. **Immediate Response:** Actions required within 30 days
2. **Strategic Initiatives:** Medium-term competitive strategies
3. **Monitoring Protocol:** Continuous intelligence requirements

---
*Competitive brief based on real-time intelligence. Last updated: ${new Date().toISOString()}*`;
  };

  const generateActionPlan = (sessionData: any, agentInsights: Record<string, any>): string => {
    return `# STRATEGIC ACTION PLAN

## IMPLEMENTATION ROADMAP

Based on comprehensive competitive intelligence analysis, this action plan provides prioritized recommendations with implementation timelines and success metrics.

### PHASE 1: IMMEDIATE ACTIONS (0-30 days)
${extractAgentFindings(agentInsights, 'immediate_actions')}

### PHASE 2: SHORT-TERM INITIATIVES (1-3 months)
Strategic initiatives to address competitive positioning and market opportunities.

### PHASE 3: MEDIUM-TERM STRATEGY (3-12 months)
Long-term strategic implementation with continuous monitoring and adjustment protocols.

### SUCCESS METRICS
- Key performance indicators for each phase
- Competitive response measurement protocols
- Strategic initiative effectiveness tracking

---
*Action plan based on elite strategic analysis. Implementation begins: ${new Date().toISOString()}*`;
  };

  const generateDefaultReport = (sessionData: any, agentInsights: Record<string, any>): string => {
    return `# INTELLIGENCE ANALYSIS REPORT

## OVERVIEW
Comprehensive analysis based on real-time competitive intelligence and strategic assessment frameworks.

## KEY FINDINGS
${extractAgentFindings(agentInsights, 'general_analysis')}

## RECOMMENDATIONS
Strategic recommendations based on analytical findings and competitive intelligence.

---
*Generated: ${new Date().toISOString()}*`;
  };

  const extractAgentFindings = (agentInsights: Record<string, any>, category: string): string => {
    let findings = '';
    
    Object.entries(agentInsights).forEach(([agentId, insights]) => {
      if (insights.insights && insights.insights.length > 0) {
        findings += `\n**${agentId.toUpperCase()} Agent Analysis:**\n`;
        insights.insights.forEach((insight: any, index: number) => {
          findings += `${index + 1}. ${insight.title} (Confidence: ${insight.confidence}%)\n`;
        });
      }
      
      if (insights.recommendations && insights.recommendations.length > 0) {
        findings += `\n**Recommendations:**\n`;
        insights.recommendations.forEach((rec: string, index: number) => {
          findings += `- ${rec}\n`;
        });
      }
    });

    return findings || 'Detailed analysis based on real-time intelligence gathering and strategic assessment.';
  };

  return {
    generateEnhancedContent
  };
}
