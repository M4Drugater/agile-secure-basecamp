import { useElitePromptEngine } from '@/hooks/prompts/useElitePromptEngine';

export function useOptimizedAgentPrompts() {
  const { buildEliteSystemPrompt } = useElitePromptEngine();

  const getEnhancedAgentPrompt = async (
    agentType: 'clipogino' | 'cdv' | 'cir' | 'cia', 
    sessionConfig: any, 
    currentPage: string = '/competitive-intelligence'
  ) => {
    const basePrompt = await buildEliteSystemPrompt({
      agentType,
      currentPage,
      sessionConfig,
      analysisDepth: 'comprehensive',
      outputFormat: 'executive',
      contextLevel: 'elite'
    });

    const agentEnhancements = getAgentSpecificEnhancements(agentType, sessionConfig);
    const industryIntelligence = getIndustryIntelligence(sessionConfig.industry);
    const outputOptimization = getOutputOptimization(agentType);

    return `${basePrompt}

${agentEnhancements}

${industryIntelligence}

${outputOptimization}`;
  };

  const getAgentSpecificEnhancements = (agentType: 'clipogino' | 'cdv' | 'cir' | 'cia', sessionConfig: any): string => {
    const companyContext = `
**Target Analysis Context**:
- **Company**: ${sessionConfig.companyName || 'Target Organization'}
- **Industry**: ${sessionConfig.industry || 'Technology'}
- **Analysis Focus**: ${sessionConfig.analysisFocus || 'Competitive Landscape'}
- **Strategic Objectives**: ${sessionConfig.objectives || 'Market Leadership'}
- **Geographic Scope**: ${sessionConfig.geographicScope || 'Global'}`;

    switch (agentType) {
      case 'cdv':
        return `## CDV ENHANCEMENT - COMPETITOR DISCOVERY & VALIDATION SPECIALIST
${companyContext}

**Enhanced Discovery Capabilities**:
- **Systematic Market Mapping**: Complete competitive ecosystem analysis using Porter's Five Forces
- **Threat Assessment Matrix**: Quantified threat scoring (Impact × Probability × Timeframe)
- **Competitive Intelligence Validation**: Multi-source verification with confidence scoring
- **Early Warning Systems**: Predictive threat detection for market disruptions

**Specialized Methodologies**:
- **Discovery Framework**: Comprehensive market scanning with STEEP analysis integration
- **Validation Protocol**: Cross-reference validation across minimum 3 independent sources
- **Threat Quantification**: 1-10 scale scoring with business impact assessment
- **Strategic Profiling**: Deep-dive competitor analysis with strategic intent evaluation

**Output Excellence Standards**:
- **Competitor Profiles**: Financial metrics, strategic positioning, threat assessment
- **Market Landscape**: Strategic group mapping with competitive dynamics
- **Threat Matrix**: Probability-weighted impact assessment with mitigation strategies
- **Validation Confidence**: Source attribution with reliability scoring (High/Medium/Low)`;

      case 'cir':
        return `## CIR ENHANCEMENT - COMPETITIVE INTELLIGENCE RETRIEVAL SPECIALIST
${companyContext}

**Enhanced Retrieval Capabilities**:
- **Financial Intelligence**: Bloomberg/FactSet-level analysis with comprehensive benchmarking
- **Real-Time Market Data**: Live performance indicators and competitive positioning metrics
- **Strategic Intelligence**: M&A activity, partnership analysis, strategic initiative tracking
- **Operational Benchmarking**: Efficiency ratios, productivity measures, operational KPIs

**Premium Data Analysis**:
- **Financial Analysis**: Income statement, balance sheet, cash flow analysis with industry comparison
- **Market Intelligence**: Market share analysis, pricing strategies, customer acquisition metrics
- **Innovation Tracking**: Patent analysis, R&D investments, product pipeline assessment
- **Strategic Moves**: Investment patterns, geographic expansion, strategic partnerships

**Intelligence Quality Standards**:
- **Investment-Grade Analysis**: Verifiable financial data with trend identification
- **Competitive Benchmarks**: Industry-relative performance with percentile ranking
- **Strategic Context**: Business impact evaluation with competitive implications
- **Forward Indicators**: Growth prospects assessment with risk factor analysis`;

      case 'cia':
        return `## CIA ENHANCEMENT - COMPETITIVE INTELLIGENCE ANALYSIS SPECIALIST
${companyContext}

**Enhanced Analysis Capabilities**:
- **Strategic Framework Mastery**: McKinsey 7-S, Porter's Five Forces, 3-Horizons planning application
- **Scenario Planning**: Multiple future-state analysis with probability weighting and strategic options
- **Executive Intelligence**: Board-ready strategic synthesis with C-suite decision support
- **Implementation Strategy**: Detailed execution roadmaps with success metrics and accountability

**Premier Analytical Frameworks**:
- **McKinsey 7-S Model**: Organizational effectiveness and strategic alignment assessment
- **Porter's Five Forces**: Industry structure analysis with competitive dynamics evaluation
- **3-Horizons Framework**: Innovation pipeline mapping with growth opportunity identification
- **BCG Growth-Share Matrix**: Portfolio analysis with resource allocation optimization
- **Blue Ocean Strategy**: Uncontested market space identification and value innovation

**Strategic Excellence Standards**:
- **Executive Summary**: C-suite ready strategic insights with business impact quantification
- **Strategic Options Analysis**: Multiple pathways with detailed business cases and ROI projections
- **Risk-Adjusted Planning**: Comprehensive scenario analysis with probability-weighted outcomes
- **Implementation Excellence**: 90-day, 180-day, 365-day milestone planning with success metrics`;

      default:
        return `## GENERAL INTELLIGENCE ENHANCEMENT
${companyContext}

**Comprehensive Analysis Framework**:
- **Strategic Context**: Industry dynamics with competitive landscape evaluation
- **Business Intelligence**: Financial performance with operational efficiency assessment
- **Market Position**: Competitive advantage analysis with differentiation strategies
- **Future State Planning**: Strategic options development with implementation guidance`;
    }
  };

  const getIndustryIntelligence = (industry: string): string => {
    const industryMap = {
      technology: {
        keyMetrics: [
          'Revenue growth rate and recurring revenue percentage',
          'Customer acquisition cost (CAC) and lifetime value (LTV)',
          'Market share in key product segments',
          'R&D investment as percentage of revenue',
          'Platform adoption and user engagement metrics'
        ],
        competitiveFactors: [
          'Innovation velocity and time-to-market capabilities',
          'Platform ecosystem strength and developer adoption',
          'Data advantage and AI/ML capabilities',
          'Strategic partnerships and integration capabilities',
          'Global scaling and localization effectiveness'
        ],
        threats: [
          'Disruptive technology emergence and market convergence',
          'Big Tech platform expansion and ecosystem consolidation',
          'Regulatory changes and data privacy restrictions',
          'Talent acquisition challenges and retention costs',
          'Cybersecurity vulnerabilities and compliance requirements'
        ]
      },
      finance: {
        keyMetrics: [
          'Assets under management (AUM) and fee income',
          'Net interest margin and return on equity (ROE)',
          'Cost-to-income ratio and operational efficiency',
          'Credit loss provisions and risk-weighted assets',
          'Digital adoption and customer engagement metrics'
        ],
        competitiveFactors: [
          'Digital transformation and fintech integration',
          'Regulatory compliance and capital adequacy',
          'Customer experience and omnichannel capabilities',
          'Risk management and credit assessment capabilities',
          'Strategic partnerships with fintech companies'
        ],
        threats: [
          'Fintech disruption and digital-first competitors',
          'Regulatory changes and compliance costs',
          'Interest rate volatility and economic downturns',
          'Cybersecurity threats and fraud prevention',
          'Customer switching and loyalty challenges'
        ]
      },
      healthcare: {
        keyMetrics: [
          'Revenue per patient and treatment efficacy rates',
          'R&D pipeline value and regulatory approval rates',
          'Market access and reimbursement coverage',
          'Patient satisfaction and clinical outcomes',
          'Operational efficiency and cost per outcome'
        ],
        competitiveFactors: [
          'Clinical evidence strength and treatment differentiation',
          'Regulatory expertise and approval velocity',
          'Market access and payer relationships',
          'Digital health integration and patient engagement',
          'Strategic partnerships and collaborative research'
        ],
        threats: [
          'Regulatory changes and approval delays',
          'Price pressure from payers and government policies',
          'Generic competition and patent expirations',
          'Clinical trial failures and safety concerns',
          'Digital health disruption and new care models'
        ]
      }
    };

    const selected = industryMap[industry?.toLowerCase()] || industryMap.technology;
    
    return `## INDUSTRY-SPECIFIC INTELLIGENCE: ${(industry || 'TECHNOLOGY').toUpperCase()}

### Critical Performance Indicators:
${selected.keyMetrics.map(metric => `- ${metric}`).join('\n')}

### Competitive Advantage Factors:
${selected.competitiveFactors.map(factor => `- ${factor}`).join('\n')}

### Strategic Threat Vectors:
${selected.threats.map(threat => `- ${threat}`).join('\n')}

### Industry Intelligence Requirements:
- **Quantitative Analysis**: Focus on industry-specific KPIs with benchmarking
- **Competitive Dynamics**: Analyze industry-specific competitive forces and strategic positioning
- **Regulatory Environment**: Consider industry regulations and compliance requirements
- **Innovation Patterns**: Track industry-specific innovation cycles and disruption patterns`;
  };

  const getOutputOptimization = (agentType: 'clipogino' | 'cdv' | 'cir' | 'cia'): string => {
    const baseOptimization = `## OUTPUT OPTIMIZATION FRAMEWORK

### Structured Excellence Standards:
**EXECUTIVE SUMMARY** (2-3 sentences maximum)
[Lead with key strategic insight and quantified business impact]

**KEY STRATEGIC FINDINGS** (3-5 priority insights)
• [Finding with quantitative evidence and strategic implications]
• [Market positioning insight with competitive context]
• [Risk/opportunity assessment with probability and impact]

**STRATEGIC ANALYSIS**
- **Framework Applied**: [Specific McKinsey/BCG framework used]
- **Confidence Level**: [High 90%+ / Medium 70-89% / Low 50-69%]
- **Analysis Depth**: [Comprehensive framework-based evaluation]

**STRATEGIC RECOMMENDATIONS** (Prioritized)
**HIGH PRIORITY** (Next 90 days):
1. **[Recommendation Title]** - [Clear action with business case and expected impact]

**MEDIUM PRIORITY** (3-6 months):
2. **[Strategic Initiative]** - [Implementation approach with success metrics]

**SUCCESS METRICS & MONITORING**
- **Key Performance Indicators**: [Specific measurable outcomes]
- **Implementation Milestones**: [90-day, 180-day checkpoints]
- **Risk Mitigation**: [Identified risks with specific countermeasures]

### Quality Assurance Checklist:
✓ Executive summary leads with strategic conclusion (Pyramid Principle)
✓ Quantitative data included with source attribution and confidence levels
✓ Strategic frameworks correctly applied with clear methodology
✓ Recommendations prioritized with clear business cases and timelines
✓ Risk assessment includes probability, impact, and mitigation strategies
✓ Language is C-suite appropriate and board presentation ready`;

    const agentSpecific = {
      cdv: `
### CDV-Specific Output Requirements:
- **Competitor Discovery Matrix**: Systematic competitive landscape mapping
- **Threat Assessment Scoring**: Quantified threat evaluation (1-10 scale)
- **Validation Confidence**: Source verification with reliability assessment
- **Early Warning Indicators**: Predictive threat detection metrics`,

      cir: `
### CIR-Specific Output Requirements:
- **Financial Intelligence Summary**: Key ratios with industry benchmarking
- **Market Position Analysis**: Competitive ranking with market share data
- **Strategic Intelligence Brief**: Recent moves with business impact analysis
- **Performance Benchmarks**: Operational efficiency vs. industry standards`,

      cia: `
### CIA-Specific Output Requirements:
- **Strategic Options Analysis**: Multiple pathways with ROI projections
- **Implementation Roadmap**: Phased execution with milestone planning
- **Scenario Planning**: Future-state analysis with probability weighting
- **Board Presentation Summary**: C-suite ready strategic synthesis`,

      clipogino: `
### CLIPOGINO-Specific Output Requirements:
- **Strategic Mentoring Brief**: Personalized guidance with career impact
- **Leadership Development Plan**: Skills and competency roadmap
- **Business Strategy Overview**: Market positioning and growth strategies
- **Executive Coaching Summary**: Actionable development recommendations`
    };

    return `${baseOptimization}
${agentSpecific[agentType] || ''}`;
  };

  return {
    getEnhancedAgentPrompt,
    getAgentSpecificEnhancements,
    getIndustryIntelligence,
    getOutputOptimization
  };
}
