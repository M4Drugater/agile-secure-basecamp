
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLaigentMasterOrchestrator } from './useLaigentMasterOrchestrator';

interface AgentSpecificConfig {
  clipogino: {
    mentorshipStyle: 'directive' | 'coaching' | 'consultative';
    focusAreas: string[];
    developmentLevel: 'emerging' | 'established' | 'advanced';
  };
  cdv: {
    discoveryDepth: 'surface' | 'standard' | 'deep';
    validationCriteria: string[];
    competitiveScope: 'direct' | 'adjacent' | 'ecosystem';
  };
  cir: {
    researchMethodology: 'quantitative' | 'qualitative' | 'mixed';
    dataRequirements: string[];
    analysisFramework: 'descriptive' | 'diagnostic' | 'predictive';
  };
  cia: {
    analysisFramework: 'porter' | 'mckinsey' | 'bcg' | 'custom';
    recommendationStyle: 'options' | 'directive' | 'roadmap';
    stakeholderLevel: 'operational' | 'tactical' | 'strategic';
  };
}

export function useAgentSpecificOrchestrators() {
  const { user } = useAuth();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const { executeLaigentOrchestration, isOrchestrating } = useLaigentMasterOrchestrator();

  const executeClipoginoOrchestration = async (
    query: string,
    config: AgentSpecificConfig['clipogino'],
    sessionConfig: any
  ) => {
    setActiveAgent('clipogino');
    
    console.log('🧠 CLIPOGINO Specialized Orchestration:', {
      mentorshipStyle: config.mentorshipStyle,
      focusAreas: config.focusAreas,
      developmentLevel: config.developmentLevel
    });

    const specializedRequest = {
      userQuery: `Strategic Mentorship Query: ${query}
      
      Mentorship Context:
      - Style: ${config.mentorshipStyle}
      - Focus Areas: ${config.focusAreas.join(', ')}
      - Development Level: ${config.developmentLevel}
      
      Please provide executive mentorship with strategic insights, leadership guidance, and actionable development recommendations.`,
      agentType: 'clipogino' as const,
      sessionConfig,
      orchestrationLevel: 'elite' as const,
      customParameters: {
        researchDepth: 'comprehensive' as const,
        stylingFormality: 'executive' as const,
        outputFormat: 'comprehensive' as const
      }
    };

    try {
      const result = await executeLaigentOrchestration(specializedRequest);
      
      return {
        ...result,
        agentSpecialization: {
          type: 'clipogino',
          mentorshipApproach: config.mentorshipStyle,
          focusAlignment: config.focusAreas,
          developmentCalibration: config.developmentLevel
        }
      };
    } finally {
      setActiveAgent(null);
    }
  };

  const executeCdvOrchestration = async (
    query: string,
    config: AgentSpecificConfig['cdv'],
    sessionConfig: any
  ) => {
    setActiveAgent('cdv');
    
    console.log('🔍 CDV Specialized Orchestration:', {
      discoveryDepth: config.discoveryDepth,
      validationCriteria: config.validationCriteria,
      competitiveScope: config.competitiveScope
    });

    const specializedRequest = {
      userQuery: `Competitive Discovery & Validation Query: ${query}
      
      Discovery Parameters:
      - Depth: ${config.discoveryDepth}
      - Validation Criteria: ${config.validationCriteria.join(', ')}
      - Competitive Scope: ${config.competitiveScope}
      
      Conduct comprehensive competitive discovery with validation focus on threat assessment and market positioning.`,
      agentType: 'cdv' as const,
      sessionConfig,
      orchestrationLevel: 'elite' as const,
      customParameters: {
        researchDepth: config.discoveryDepth === 'deep' ? 'comprehensive' as const : 'deep' as const,
        stylingFormality: 'executive' as const,
        outputFormat: 'detailed' as const
      }
    };

    try {
      const result = await executeLaigentOrchestration(specializedRequest);
      
      return {
        ...result,
        agentSpecialization: {
          type: 'cdv',
          discoveryApproach: config.discoveryDepth,
          validationFramework: config.validationCriteria,
          competitiveMapping: config.competitiveScope
        }
      };
    } finally {
      setActiveAgent(null);
    }
  };

  const executeCirOrchestration = async (
    query: string,
    config: AgentSpecificConfig['cir'],
    sessionConfig: any
  ) => {
    setActiveAgent('cir');
    
    console.log('📊 CIR Specialized Orchestration:', {
      methodology: config.researchMethodology,
      dataRequirements: config.dataRequirements,
      analysisFramework: config.analysisFramework
    });

    const specializedRequest = {
      userQuery: `Competitive Intelligence Research Query: ${query}
      
      Research Methodology:
      - Approach: ${config.researchMethodology}
      - Data Requirements: ${config.dataRequirements.join(', ')}
      - Analysis Framework: ${config.analysisFramework}
      
      Execute rigorous competitive intelligence research with quantitative analysis and data-driven insights.`,
      agentType: 'cir' as const,
      sessionConfig,
      orchestrationLevel: 'elite' as const,
      customParameters: {
        researchDepth: 'comprehensive' as const,
        stylingFormality: 'professional' as const,
        outputFormat: 'detailed' as const
      }
    };

    try {
      const result = await executeLaigentOrchestration(specializedRequest);
      
      return {
        ...result,
        agentSpecialization: {
          type: 'cir',
          researchMethodology: config.researchMethodology,
          dataFramework: config.dataRequirements,
          analyticsApproach: config.analysisFramework
        }
      };
    } finally {
      setActiveAgent(null);
    }
  };

  const executeCiaOrchestration = async (
    query: string,
    config: AgentSpecificConfig['cia'],
    sessionConfig: any
  ) => {
    setActiveAgent('cia');
    
    console.log('🎯 CIA Specialized Orchestration:', {
      framework: config.analysisFramework,
      recommendationStyle: config.recommendationStyle,
      stakeholderLevel: config.stakeholderLevel
    });

    const specializedRequest = {
      userQuery: `Strategic Intelligence Analysis Query: ${query}
      
      Analysis Configuration:
      - Framework: ${config.analysisFramework}
      - Recommendation Style: ${config.recommendationStyle}
      - Stakeholder Level: ${config.stakeholderLevel}
      
      Provide strategic intelligence analysis with framework-based insights and executive-level recommendations.`,
      agentType: 'cia' as const,
      sessionConfig,
      orchestrationLevel: 'elite' as const,
      customParameters: {
        researchDepth: 'comprehensive' as const,
        stylingFormality: 'c-suite' as const,
        outputFormat: 'comprehensive' as const
      }
    };

    try {
      const result = await executeLaigentOrchestration(specializedRequest);
      
      return {
        ...result,
        agentSpecialization: {
          type: 'cia',
          strategicFramework: config.analysisFramework,
          recommendationApproach: config.recommendationStyle,
          stakeholderAlignment: config.stakeholderLevel
        }
      };
    } finally {
      setActiveAgent(null);
    }
  };

  const executeResearchEngineOrchestration = async (
    query: string,
    sessionConfig: any
  ) => {
    setActiveAgent('research-engine');
    
    console.log('🔬 Research Engine Specialized Orchestration');

    const specializedRequest = {
      userQuery: `Advanced Research Query: ${query}
      
      Research Parameters:
      - Comprehensive multi-source analysis
      - Academic and industry source integration
      - Trend analysis and predictive insights
      - Global market perspective
      
      Execute elite-level research with comprehensive data gathering and strategic synthesis.`,
      agentType: 'research-engine' as const,
      sessionConfig,
      orchestrationLevel: 'elite' as const,
      customParameters: {
        researchDepth: 'comprehensive' as const,
        stylingFormality: 'executive' as const,
        outputFormat: 'comprehensive' as const
      }
    };

    try {
      const result = await executeLaigentOrchestration(specializedRequest);
      
      return {
        ...result,
        agentSpecialization: {
          type: 'research-engine',
          researchScope: 'comprehensive',
          sourceIntegration: 'multi-vector',
          analyticsLevel: 'elite'
        }
      };
    } finally {
      setActiveAgent(null);
    }
  };

  const executeEnhancedContentGeneratorOrchestration = async (
    query: string,
    sessionConfig: any
  ) => {
    setActiveAgent('enhanced-content-generator');
    
    console.log('✨ Enhanced Content Generator Specialized Orchestration');

    const specializedRequest = {
      userQuery: `Executive Content Generation Query: ${query}
      
      Content Requirements:
      - Executive-grade professional content
      - Strategic intelligence integration
      - Multi-agent insights synthesis
      - C-suite ready format and tone
      
      Generate sophisticated executive content with multi-agent intelligence and strategic depth.`,
      agentType: 'enhanced-content-generator' as const,
      sessionConfig,
      orchestrationLevel: 'elite' as const,
      customParameters: {
        researchDepth: 'comprehensive' as const,
        stylingFormality: 'c-suite' as const,
        outputFormat: 'comprehensive' as const
      }
    };

    try {
      const result = await executeLaigentOrchestration(specializedRequest);
      
      return {
        ...result,
        agentSpecialization: {
          type: 'enhanced-content-generator',
          contentLevel: 'executive',
          intelligenceIntegration: 'multi-agent',
          outputQuality: 'c-suite'
        }
      };
    } finally {
      setActiveAgent(null);
    }
  };

  const getDefaultConfig = (agentType: string): any => {
    const defaults: AgentSpecificConfig = {
      clipogino: {
        mentorshipStyle: 'consultative',
        focusAreas: ['strategic-leadership', 'business-development'],
        developmentLevel: 'established'
      },
      cdv: {
        discoveryDepth: 'deep',
        validationCriteria: ['market-position', 'competitive-threat', 'strategic-impact'],
        competitiveScope: 'ecosystem'
      },
      cir: {
        researchMethodology: 'mixed',
        dataRequirements: ['financial-metrics', 'market-data', 'competitive-analysis'],
        analysisFramework: 'diagnostic'
      },
      cia: {
        analysisFramework: 'mckinsey',
        recommendationStyle: 'roadmap',
        stakeholderLevel: 'strategic'
      }
    };
    
    return defaults[agentType as keyof AgentSpecificConfig];
  };

  return {
    executeClipoginoOrchestration,
    executeCdvOrchestration,
    executeCirOrchestration,
    executeCiaOrchestration,
    executeResearchEngineOrchestration,
    executeEnhancedContentGeneratorOrchestration,
    getDefaultConfig,
    activeAgent,
    isOrchestrating
  };
}
