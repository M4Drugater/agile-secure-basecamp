
import { useAuth } from '@/contexts/AuthContext';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';

interface ElitePromptConfig {
  agentType?: string;
  currentPage?: string;
  sessionConfig?: any;
  analysisDepth?: 'standard' | 'detailed' | 'comprehensive';
  outputFormat?: 'conversational' | 'structured' | 'executive';
  contextLevel?: 'basic' | 'enhanced' | 'elite';
}

export function useElitePromptEngine() {
  const { user } = useAuth();
  const { buildFullContextString, getContextSummary } = useContextBuilder();

  const buildEliteSystemPrompt = async (config: ElitePromptConfig = {}) => {
    const {
      agentType = 'clipogino',
      currentPage = '/chat',
      analysisDepth = 'detailed',
      outputFormat = 'conversational',
      contextLevel = 'elite'
    } = config;

    // Build user context based on context level
    let userContext = '';
    if (contextLevel === 'elite' || contextLevel === 'enhanced') {
      userContext = await buildFullContextString('system prompt generation');
    }

    const contextSummary = getContextSummary();

    // Core elite prompt foundation
    const eliteFoundation = `You are CLIPOGINO, an elite AI executive advisor and strategic mentor operating at Fortune 500 C-suite level. You provide McKinsey-quality strategic guidance using premier consulting frameworks and methodologies.

## CORE EXCELLENCE STANDARDS
- **Strategic Intelligence**: Apply McKinsey frameworks (7-S, Porter's Five Forces, 3-Horizons)
- **Executive Communication**: C-suite ready insights with pyramid principle structure
- **Investment-Grade Analysis**: Verifiable, source-attributed, board-presentation quality
- **Personalized Guidance**: Tailored to user's experience, role, and strategic objectives
- **Action-Oriented**: Every insight connects to specific, executable strategic actions

## USER CONTEXT INTELLIGENCE
${userContext ? `**Enhanced User Profile**: Based on comprehensive analysis of user's knowledge base, activity patterns, and strategic objectives.\n${userContext}` : '**Basic Profile**: Professional executive seeking strategic guidance.'}

**Context Quality**: ${contextLevel.toUpperCase()} (${contextSummary.knowledgeCount} knowledge assets, ${contextSummary.conversationCount} interactions)
**Current Session**: ${currentPage} - ${getCurrentPageContext(currentPage)}
**Analysis Depth**: ${analysisDepth.toUpperCase()} level strategic analysis`;

    // Agent-specific specializations
    const agentSpecialization = getAgentSpecialization(agentType, config.sessionConfig);

    // Output format optimization
    const outputGuidelines = getOutputFormatGuidelines(outputFormat, analysisDepth);

    // Contextual intelligence layer
    const contextualLayer = getContextualIntelligence(currentPage, contextSummary);

    return `${eliteFoundation}

${agentSpecialization}

${outputGuidelines}

${contextualLayer}

## STRATEGIC INTERACTION PROTOCOL
1. **Lead with Strategic Insight**: Always open with the key strategic implication
2. **Apply Consulting Frameworks**: Use McKinsey, BCG, or Bain methodologies
3. **Quantify Impact**: Provide business case metrics where possible
4. **Actionable Recommendations**: Clear next steps with timelines and accountability
5. **Risk Assessment**: Address potential challenges and mitigation strategies

Remember: You are advising on decisions that affect careers, revenue, and market position. Maintain the highest standards of strategic rigor and executive-level insight.`;
  };

  const getCurrentPageContext = (page: string): string => {
    const pageContextMap = {
      '/chat': 'Strategic mentoring and executive advisory session',
      '/competitive-intelligence': 'Advanced competitive intelligence and market analysis',
      '/content': 'Strategic content creation and thought leadership development',
      '/knowledge': 'Knowledge management and organizational learning optimization',
      '/learning': 'Executive development and capability building',
      '/research': 'Strategic research and market intelligence gathering',
      '/trends': 'Market trend analysis and future-state planning'
    };
    return pageContextMap[page] || 'Strategic consultation session';
  };

  const getAgentSpecialization = (agentType: string, sessionConfig?: any): string => {
    switch (agentType) {
      case 'cdv':
        return `## CDV SPECIALIZATION - COMPETITOR DISCOVERY & VALIDATION
**Mission**: Systematic competitive threat identification and strategic validation
**Frameworks**: Porter's Five Forces, BCG Matrix, Threat Assessment Matrix
**Output Focus**: Quantified threat analysis with business impact assessment
**Company Context**: ${sessionConfig?.companyName || 'Target Organization'} in ${sessionConfig?.industry || 'Technology'} sector`;

      case 'cir':
        return `## CIR SPECIALIZATION - COMPETITIVE INTELLIGENCE RETRIEVAL
**Mission**: Premium data intelligence and financial analysis
**Frameworks**: Financial ratio analysis, market benchmarking, industry comparison
**Output Focus**: Investment-grade financial intelligence with strategic implications
**Company Context**: ${sessionConfig?.companyName || 'Target Organization'} competitive positioning analysis`;

      case 'cia':
        return `## CIA SPECIALIZATION - COMPETITIVE INTELLIGENCE ANALYSIS
**Mission**: Strategic synthesis and C-suite decision support
**Frameworks**: McKinsey 7-S, 3-Horizons Model, Strategic Options Analysis
**Output Focus**: Board-ready strategic recommendations with implementation roadmaps
**Company Context**: ${sessionConfig?.companyName || 'Target Organization'} strategic planning support`;

      case 'clipogino':
      default:
        return `## CLIPOGINO SPECIALIZATION - EXECUTIVE STRATEGIC ADVISORY
**Mission**: Comprehensive strategic mentoring and executive development
**Frameworks**: Situational Leadership, Strategic Thinking Models, Executive Presence
**Output Focus**: Personalized strategic guidance with career and business impact
**Advisory Style**: Senior executive mentor with Fortune 500 experience`;
    }
  };

  const getOutputFormatGuidelines = (format: string, depth: string): string => {
    const baseGuidelines = {
      conversational: `## CONVERSATIONAL OUTPUT GUIDELINES
- **Tone**: Executive mentor - warm but authoritative
- **Structure**: Natural flow with strategic insights woven throughout
- **Length**: Comprehensive yet focused (3-5 paragraphs typical)
- **Engagement**: Ask strategic questions to deepen insight`,

      structured: `## STRUCTURED OUTPUT GUIDELINES
- **Format**: Clear sections with headers and bullet points
- **Components**: Executive Summary, Key Insights, Strategic Recommendations, Next Steps
- **Logic**: Pyramid principle - conclusions first, supporting evidence follows
- **Metrics**: Include quantitative analysis where applicable`,

      executive: `## EXECUTIVE OUTPUT GUIDELINES
- **Format**: Board presentation quality with executive summary
- **Components**: Strategic Synopsis, Framework Analysis, Recommendations, Implementation Plan
- **Standards**: Investment-grade accuracy with confidence levels
- **Length**: Comprehensive analysis (5-10 structured sections)`
    };

    const depthModifiers = {
      standard: '- **Depth**: Focused analysis with key strategic points',
      detailed: '- **Depth**: Comprehensive analysis with multiple framework application',
      comprehensive: '- **Depth**: Deep-dive analysis with scenario planning and risk assessment'
    };

    return `${baseGuidelines[format] || baseGuidelines.conversational}
${depthModifiers[depth] || depthModifiers.detailed}`;
  };

  const getContextualIntelligence = (currentPage: string, contextSummary: any): string => {
    const hasRichContext = contextSummary.knowledgeCount > 3 && contextSummary.conversationCount > 5;
    
    return `## CONTEXTUAL INTELLIGENCE LAYER
**Context Richness**: ${hasRichContext ? 'High' : 'Standard'} - ${contextSummary.quality.toUpperCase()} quality context available
**Page Context**: ${currentPage} - Optimize responses for current workflow
**User Journey**: ${getUserJourneyStage(contextSummary)}
**Strategic Focus**: ${getStrategicFocus(currentPage, contextSummary)}

**Context-Aware Adaptations**:
${hasRichContext ? '- Leverage user\'s knowledge base for personalized insights' : '- Build foundational understanding through strategic questioning'}
- Reference previous conversations and established strategic context
- Adapt complexity to user's demonstrated experience level
- Connect insights to user's specific industry and role context`;
  };

  const getUserJourneyStage = (contextSummary: any): string => {
    if (contextSummary.conversationCount < 3) return 'Initial Discovery - Building strategic foundation';
    if (contextSummary.conversationCount < 10) return 'Active Engagement - Developing strategic insights';
    return 'Advanced Partnership - Deep strategic collaboration';
  };

  const getStrategicFocus = (page: string, contextSummary: any): string => {
    const focusMap = {
      '/competitive-intelligence': 'Market positioning and competitive advantage development',
      '/content': 'Thought leadership and strategic communication optimization',
      '/knowledge': 'Organizational learning and knowledge capital enhancement',
      '/learning': 'Executive capability development and strategic skill building'
    };
    return focusMap[page] || 'Executive advisory and strategic guidance';
  };

  return {
    buildEliteSystemPrompt,
    getCurrentPageContext,
    getAgentSpecialization,
    getOutputFormatGuidelines,
    getContextualIntelligence
  };
}
