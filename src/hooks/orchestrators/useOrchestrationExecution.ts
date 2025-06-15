
import { useAuth } from '@/contexts/AuthContext';
import { useAdvancedContextOrchestrator } from './useAdvancedContextOrchestrator';
import { useEnhancedPerplexityResearch } from './useEnhancedPerplexityResearch';
import { useSophisticatedClaudeStyling } from './useSophisticatedClaudeStyling';
import { useQualityAssurance } from './useQualityAssurance';
import { toast } from 'sonner';
import type { LaigentRequest, LaigentResponse } from './types';

export function useOrchestrationExecution() {
  const { user } = useAuth();
  const { buildAdvancedContext } = useAdvancedContextOrchestrator();
  const { executeAdvancedResearch } = useEnhancedPerplexityResearch();
  const { executeAdvancedStyling } = useSophisticatedClaudeStyling();
  const { performFinalQualityAssurance } = useQualityAssurance();

  const executeOrchestrationSteps = async (
    request: LaigentRequest,
    setOrchestrationStage: (stage: string) => void
  ): Promise<LaigentResponse> => {
    if (!user) {
      throw new Error('User authentication required for LAIGENT orchestration');
    }

    const startTime = Date.now();
    let totalTokens = 0;
    let totalCost = 0;

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

    // Calculate tokens and costs from available data
    // Research results may not have token/cost data, so we estimate
    const estimatedResearchTokens = Math.floor(researchResults.content.length / 4);
    const estimatedStylingTokens = Math.floor(stylingResults.content.length / 4);
    
    totalTokens = estimatedResearchTokens + estimatedStylingTokens;
    totalCost = totalTokens * 0.00002; // Rough cost estimate

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
  };

  return {
    executeOrchestrationSteps
  };
}
