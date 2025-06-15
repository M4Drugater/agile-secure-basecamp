import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdvancedContextOrchestrator } from './useAdvancedContextOrchestrator';
import { useEnhancedPerplexityResearch } from './useEnhancedPerplexityResearch';
import { useSophisticatedClaudeStyling } from './useSophisticatedClaudeStyling';
import { toast } from 'sonner';

interface LaigentRequest {
  userQuery: string;
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia' | 'research-engine' | 'enhanced-content-generator';
  sessionConfig?: any;
  orchestrationLevel: 'standard' | 'advanced' | 'elite';
  customParameters?: {
    researchDepth?: 'surface' | 'standard' | 'deep' | 'comprehensive';
    stylingFormality?: 'professional' | 'executive' | 'c-suite';
    outputFormat?: 'brief' | 'detailed' | 'comprehensive';
  };
}

interface LaigentResponse {
  finalContent: string;
  orchestrationMetadata: {
    contextQuality: number;
    researchQuality: number;
    stylingQuality: number;
    overallScore: number;
    processingTime: number;
    agentCoordination: string[];
  };
  performanceAnalytics: {
    contextBuildTime: number;
    researchTime: number;
    stylingTime: number;
    totalTokens: number;
    totalCost: string;
  };
  qualityAssurance: {
    executiveReadiness: number;
    strategicDepth: number;
    dataIntegration: number;
    actionability: number;
  };
}

export function useLaigentMasterOrchestrator() {
  const { user } = useAuth();
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationStage, setOrchestrationStage] = useState<string>('idle');
  
  const { buildAdvancedContext } = useAdvancedContextOrchestrator();
  const { executeAdvancedResearch } = useEnhancedPerplexityResearch();
  const { executeAdvancedStyling } = useSophisticatedClaudeStyling();

  const executeLaigentOrchestration = async (request: LaigentRequest): Promise<LaigentResponse> => {
    if (!user) {
      throw new Error('User authentication required for LAIGENT orchestration');
    }

    setIsOrchestrating(true);
    const startTime = Date.now();
    let totalTokens = 0;
    let totalCost = 0;

    try {
      console.log('🚀 LAIGENT MASTER ORCHESTRATOR - Initiating elite coordination:', {
        query: request.userQuery.substring(0, 100),
        agent: request.agentType,
        level: request.orchestrationLevel,
        user: user.email
      });

      // Stage 1: Advanced Context Orchestration
      setOrchestrationStage('context-building');
      toast.info('LAIGENT Stage 1: Advanced Context Building', {
        description: 'Building comprehensive user and business context...'
      });

      const contextStartTime = Date.now();
      const advancedContext = await buildAdvancedContext(request.agentType, request.userQuery);
      const contextBuildTime = Date.now() - contextStartTime;

      console.log('✅ Stage 1 Complete - Advanced Context:', {
        profileCompleteness: advancedContext.userProfile ? 'High' : 'Standard',
        knowledgeAssets: advancedContext.knowledgeIntegration?.assetCount || 0,
        calibrationScore: advancedContext.agentCalibration?.executiveReadiness || 0
      });

      // Stage 2: Enhanced Perplexity Research
      setOrchestrationStage('research-execution');
      toast.info('LAIGENT Stage 2: Enhanced Research Execution', {
        description: 'Multi-vector research with quality standards...'
      });

      const researchStartTime = Date.now();
      const researchConfig = {
        depth: request.customParameters?.researchDepth || 'deep',
        timeframe: 'month' as const,
        industryFocus: advancedContext.userProfile?.industryExpertise || ['technology'],
        geographicScope: ['global'],
        languagePreference: ['english']
      };

      const researchResults = await executeAdvancedResearch(
        request.userQuery,
        request.agentType,
        researchConfig
      );
      const researchTime = Date.now() - researchStartTime;

      console.log('✅ Stage 2 Complete - Enhanced Research:', {
        sources: researchResults.sources?.length || 0,
        qualityScore: researchResults.metadata?.metrics?.qualityScore || 0,
        confidence: researchResults.metadata?.metrics?.confidenceLevel || 0
      });

      // Stage 3: Sophisticated Claude Styling
      setOrchestrationStage('content-styling');
      toast.info('LAIGENT Stage 3: Sophisticated Content Styling', {
        description: 'Executive-grade content transformation...'
      });

      const stylingStartTime = Date.now();
      const stylingResults = await executeAdvancedStyling(
        researchResults.content,
        researchResults,
        advancedContext.userProfile,
        request.agentType
      );
      const stylingTime = Date.now() - stylingStartTime;

      console.log('✅ Stage 3 Complete - Sophisticated Styling:', {
        qualityScore: stylingResults.metadata?.qualityMetrics?.overallQuality || 0,
        executiveReadiness: stylingResults.metadata?.qualityMetrics?.executiveReadiness || 0
      });

      // Stage 4: Final Quality Assurance & Analytics
      setOrchestrationStage('quality-assurance');
      const finalQualityAssurance = await performFinalQualityAssurance(
        stylingResults.content,
        advancedContext,
        researchResults,
        stylingResults
      );

      const processingTime = Date.now() - startTime;

      // Calculate total metrics with fallbacks
      const researchTokens = researchResults.metadata?.metrics?.totalTokens || 0;
      const researchCost = parseFloat(researchResults.metadata?.metrics?.totalCost || '0');
      
      totalTokens += researchTokens;
      totalCost += researchCost;

      // Build comprehensive response
      const laigentResponse: LaigentResponse = {
        finalContent: stylingResults.content,
        orchestrationMetadata: {
          contextQuality: advancedContext.agentCalibration?.executiveReadiness || 0,
          researchQuality: researchResults.metadata?.metrics?.qualityScore || 0,
          stylingQuality: stylingResults.metadata?.qualityMetrics?.overallQuality || 0,
          overallScore: finalQualityAssurance.overallScore,
          processingTime,
          agentCoordination: ['OpenAI-Context', 'Perplexity-Research', 'Claude-Styling']
        },
        performanceAnalytics: {
          contextBuildTime,
          researchTime,
          stylingTime,
          totalTokens,
          totalCost: totalCost.toFixed(6)
        },
        qualityAssurance: finalQualityAssurance
      };

      // Success notification
      toast.success('LAIGENT Orchestration Complete', {
        description: `Quality Score: ${Math.round(finalQualityAssurance.overallScore * 100)}% | Time: ${Math.round(processingTime / 1000)}s | Agents: 3`
      });

      console.log('🎯 LAIGENT ORCHESTRATION COMPLETE:', {
        overallScore: finalQualityAssurance.overallScore,
        totalTime: processingTime,
        stages: ['Context', 'Research', 'Styling', 'QA'],
        agentCoordination: 'Success'
      });

      return laigentResponse;

    } catch (error) {
      console.error('❌ LAIGENT Orchestration Error:', error);
      
      toast.error('LAIGENT Orchestration Failed', {
        description: `Stage: ${orchestrationStage} | ${error instanceof Error ? error.message : 'Unknown error'}`
      });

      // Return fallback response
      return {
        finalContent: `LAIGENT Master Orchestrator encountered an error during ${orchestrationStage}.

**Error Details**: ${error instanceof Error ? error.message : 'Unknown error'}

**Fallback Response**: While the full LAIGENT orchestration could not be completed, I can still provide strategic analysis based on standard methodologies for your query: "${request.userQuery}"

Please try again for full multi-agent coordination and advanced intelligence.`,
        orchestrationMetadata: {
          contextQuality: 0,
          researchQuality: 0,
          stylingQuality: 0,
          overallScore: 0,
          processingTime: Date.now() - startTime,
          agentCoordination: [`Failed-at-${orchestrationStage}`]
        },
        performanceAnalytics: {
          contextBuildTime: 0,
          researchTime: 0,
          stylingTime: 0,
          totalTokens: 0,
          totalCost: '0.000000'
        },
        qualityAssurance: {
          executiveReadiness: 0,
          strategicDepth: 0,
          dataIntegration: 0,
          actionability: 0
        }
      };

    } finally {
      setIsOrchestrating(false);
      setOrchestrationStage('idle');
    }
  };

  const performFinalQualityAssurance = async (
    finalContent: string,
    context: any,
    research: any,
    styling: any
  ) => {
    // Comprehensive quality assessment
    const executiveReadiness = styling.metadata?.qualityMetrics?.executiveReadiness || 0;
    const strategicDepth = styling.metadata?.qualityMetrics?.strategicDepth || 0;
    const dataIntegration = styling.metadata?.qualityMetrics?.dataIntegration || 0;
    const actionability = styling.metadata?.qualityMetrics?.actionability || 0;

    const overallScore = (executiveReadiness + strategicDepth + dataIntegration + actionability) / 4;

    return {
      executiveReadiness,
      strategicDepth,
      dataIntegration,
      actionability,
      overallScore
    };
  };

  const getOrchestrationStatus = () => ({
    isOrchestrating,
    currentStage: orchestrationStage,
    stageProgress: getStageProgress(orchestrationStage)
  });

  const getStageProgress = (stage: string): number => {
    const stageMap = {
      'idle': 0,
      'context-building': 25,
      'research-execution': 50,
      'content-styling': 75,
      'quality-assurance': 90,
      'complete': 100
    };
    
    return stageMap[stage as keyof typeof stageMap] || 0;
  };

  return {
    executeLaigentOrchestration,
    getOrchestrationStatus,
    isOrchestrating,
    orchestrationStage
  };
}
