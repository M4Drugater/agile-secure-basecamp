
import type { LaigentResponse } from './types';

export function useFallbackResponse() {
  const createFallbackResponse = (
    error: unknown,
    orchestrationStage: string,
    userQuery: string,
    startTime: number
  ): LaigentResponse => {
    return {
      finalContent: `LAIGENT Master Orchestrator encountered an error during ${orchestrationStage}.

**Error Details**: ${error instanceof Error ? error.message : 'Unknown error'}

**Fallback Response**: While the full LAIGENT orchestration could not be completed, I can still provide strategic analysis based on standard methodologies for your query: "${userQuery}"

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
  };

  return {
    createFallbackResponse
  };
}
