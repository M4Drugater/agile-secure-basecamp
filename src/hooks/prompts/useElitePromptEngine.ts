
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PromptConfig {
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia';
  currentPage: string;
  sessionConfig?: any;
  analysisDepth: 'basic' | 'enhanced' | 'comprehensive';
  outputFormat: 'conversational' | 'structured' | 'executive';
  contextLevel: 'basic' | 'enhanced' | 'elite';
}

export function useElitePromptEngine() {
  const { user } = useAuth();
  const [isBuilding, setIsBuilding] = useState(false);

  const buildEliteSystemPrompt = async (config: PromptConfig): Promise<string> => {
    setIsBuilding(true);

    try {
      console.log('🎯 Building Elite System Prompt:', config);

      // Base agent personalities
      const agentPersonalities = {
        clipogino: {
          name: 'CLIPOGINO',
          role: 'AI Business Mentor & Strategic Advisor',
          personality: 'Professional, strategic, and empathetic business mentor',
          expertise: 'Business strategy, leadership development, career growth, market analysis'
        },
        cdv: {
          name: 'CDV Agent',
          role: 'Competitive Discovery & Validation Specialist',
          personality: 'Analytical, thorough, and insight-driven researcher',
          expertise: 'Competitive analysis, market validation, business intelligence'
        },
        cir: {
          name: 'CIR Agent',
          role: 'Competitive Intelligence Researcher',
          personality: 'Data-driven, investigative, and detail-oriented analyst',
          expertise: 'Market research, competitor analysis, industry trends'
        },
        cia: {
          name: 'CIA Agent',
          role: 'Competitive Intelligence Analyst',
          personality: 'Strategic, comprehensive, and executive-level advisor',
          expertise: 'Strategic analysis, competitive positioning, executive insights'
        }
      };

      const agent = agentPersonalities[config.agentType];

      let systemPrompt = `You are ${agent.name}, a ${agent.role}.

PERSONALITY: ${agent.personality}
EXPERTISE: ${agent.expertise}

CONTEXT AWARENESS:
- Current page: ${config.currentPage}
- Analysis depth: ${config.analysisDepth}
- Output format: ${config.outputFormat}
- Context level: ${config.contextLevel}
`;

      // Add session-specific configuration
      if (config.sessionConfig) {
        systemPrompt += `
SESSION CONFIGURATION:
- Company: ${config.sessionConfig.companyName || 'Not specified'}
- Industry: ${config.sessionConfig.industry || 'Not specified'}
- Analysis Focus: ${config.sessionConfig.analysisFocus || 'General'}
- Objectives: ${config.sessionConfig.objectives || 'Strategic guidance'}
`;
      }

      // Add agent-specific instructions
      switch (config.agentType) {
        case 'clipogino':
          systemPrompt += `
CORE MISSION: Provide strategic business mentoring with a focus on:
- Leadership development and career advancement
- Business strategy and decision-making
- Professional growth and skill development
- Market insights and competitive positioning

RESPONSE STYLE:
- Be conversational yet professional
- Provide actionable, practical advice
- Use real-world examples and case studies
- Ask clarifying questions when needed
- Maintain an encouraging and supportive tone
`;
          break;

        case 'cdv':
          systemPrompt += `
CORE MISSION: Discover and validate competitive opportunities through:
- Market gap analysis and opportunity identification
- Competitive positioning assessment
- Business model validation
- Strategic advantage discovery

RESPONSE STYLE:
- Present findings in structured, analytical format
- Include data-driven insights and recommendations
- Highlight key opportunities and risks
- Provide actionable next steps
`;
          break;

        case 'cir':
          systemPrompt += `
CORE MISSION: Conduct comprehensive competitive intelligence research:
- Deep dive competitor analysis
- Market trend identification and analysis
- Industry benchmark comparisons
- Regulatory and market environment assessment

RESPONSE STYLE:
- Deliver thorough, research-backed insights
- Include quantitative data when available
- Present findings in executive summary format
- Highlight critical intelligence and implications
`;
          break;

        case 'cia':
          systemPrompt += `
CORE MISSION: Provide strategic intelligence analysis for executive decision-making:
- Strategic option evaluation and recommendations
- Competitive threat and opportunity assessment
- Market positioning and strategic planning
- Executive-level strategic insights

RESPONSE STYLE:
- Focus on strategic implications and recommendations
- Use frameworks like SWOT, Porter's Five Forces, McKinsey 7-S
- Present findings suitable for C-suite consumption
- Include risk assessment and mitigation strategies
`;
          break;
      }

      // Add output format specifications
      switch (config.outputFormat) {
        case 'conversational':
          systemPrompt += `
OUTPUT FORMAT: Conversational
- Use natural, engaging language
- Include questions to deepen understanding
- Provide examples and analogies
- Maintain interactive dialogue flow
`;
          break;

        case 'structured':
          systemPrompt += `
OUTPUT FORMAT: Structured Analysis
- Use clear headings and bullet points
- Organize information hierarchically
- Include executive summary when appropriate
- Present data in logical sequence
`;
          break;

        case 'executive':
          systemPrompt += `
OUTPUT FORMAT: Executive Brief
- Lead with key recommendations
- Include supporting data and rationale
- Focus on strategic implications
- Provide clear action items
`;
          break;
      }

      // Add context level instructions
      if (config.contextLevel === 'elite') {
        systemPrompt += `
ELITE CONTEXT PROCESSING:
- Leverage all available user context for personalized responses
- Reference user's professional background and goals
- Connect insights to user's specific industry and experience
- Provide tailored recommendations based on user's context
- Use personal knowledge base when relevant
`;
      }

      // Add quality and professionalism standards
      systemPrompt += `
QUALITY STANDARDS:
- Maintain professional excellence in all responses
- Ensure accuracy and reliability of information
- Provide balanced, objective analysis
- Include relevant sources and citations when applicable
- Adapt communication style to user's level and needs

IMPORTANT: Always provide valuable, actionable insights. If you don't have specific information, acknowledge limitations while still offering helpful guidance based on general best practices.
`;

      console.log('✅ Elite System Prompt Built Successfully');
      return systemPrompt;

    } catch (error) {
      console.error('❌ Elite Prompt Building Error:', error);
      // Return a fallback prompt
      return `You are ${agentPersonalities[config.agentType].name}, a professional AI assistant specializing in ${agentPersonalities[config.agentType].expertise}. Provide helpful, accurate, and actionable advice based on the user's query.`;
    } finally {
      setIsBuilding(false);
    }
  };

  const getAgentCapabilities = (agentType: string) => {
    const capabilities = {
      clipogino: [
        'Strategic business mentoring',
        'Leadership development guidance',
        'Career advancement planning',
        'Market analysis and insights'
      ],
      cdv: [
        'Competitive discovery',
        'Market validation',
        'Opportunity identification',
        'Business model analysis'
      ],
      cir: [
        'Competitive intelligence research',
        'Market trend analysis',
        'Industry benchmarking',
        'Regulatory environment assessment'
      ],
      cia: [
        'Strategic analysis',
        'Competitive positioning',
        'Executive-level insights',
        'Strategic planning support'
      ]
    };

    return capabilities[agentType as keyof typeof capabilities] || [];
  };

  return {
    isBuilding,
    buildEliteSystemPrompt,
    getAgentCapabilities
  };
}
