
import { useAdvancedPrompts } from './useAdvancedPrompts';

export function useAgentPrompts() {
  const { getEnhancedSystemPrompt, getIndustrySpecificContext } = useAdvancedPrompts();
  
  // Legacy function for backward compatibility
  const getSystemPrompt = (agentType: string, userContext: string, sessionConfig: any) => {
    return getEnhancedSystemPrompt(agentType, userContext, sessionConfig);
  };

  const getAdvancedPromptWithContext = (agentType: string, userContext: string, sessionConfig: any) => {
    const basePrompt = getEnhancedSystemPrompt(agentType, userContext, sessionConfig);
    const industryContext = getIndustrySpecificContext(sessionConfig.industry);
    
    const enhancedPrompt = `${basePrompt}

## INDUSTRY-SPECIFIC INTELLIGENCE REQUIREMENTS

### Key Performance Indicators for ${sessionConfig.industry?.toUpperCase() || 'TECHNOLOGY'} Industry:
${industryContext.keyMetrics.map(metric => `- ${metric}`).join('\n')}

### Critical Competitive Factors:
${industryContext.competitiveFactors.map(factor => `- ${factor}`).join('\n')}

### Primary Threat Vectors:
${industryContext.threats.map(threat => `- ${threat}`).join('\n')}

### Analysis Context:
- Company: ${sessionConfig.companyName}
- Industry Focus: ${sessionConfig.industry}
- Analysis Scope: ${sessionConfig.analysisFocus}
- Strategic Objectives: ${sessionConfig.objectives}

## DELIVERABLE REQUIREMENTS

### Executive Output Standards:
- **Investment Grade Accuracy**: All quantitative data must be verifiable and source-attributed
- **Strategic Relevance**: Every insight must connect to actionable business decisions
- **McKinsey Rigor**: Apply management consulting frameworks and analytical standards
- **C-Suite Ready**: Format suitable for board presentations and strategic planning

### Confidence and Source Attribution:
- Cite specific sources for all quantitative claims
- Provide confidence levels (High 90%+, Medium 70-89%, Low 50-69%)
- Distinguish between verified facts and analytical estimates
- Flag data gaps and information uncertainties

Remember: You are advising on decisions that affect millions in revenue and market position. Maintain the highest standards of analytical rigor and strategic insight.`;

    return enhancedPrompt;
  };

  return {
    getSystemPrompt,
    getEnhancedSystemPrompt,
    getAdvancedPromptWithContext,
    getIndustrySpecificContext,
  };
}
