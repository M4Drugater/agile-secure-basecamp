
import { UnifiedRequest } from './types';

export function useTripartiteFlowDecision() {
  const shouldUseTripartiteFlow = (request: UnifiedRequest): boolean => {
    return request.useTripartiteFlow || 
           request.agentType === 'research-engine' ||
           request.agentType === 'enhanced-content-generator' ||
           (request.searchEnabled && ['cdv', 'cir', 'cia'].includes(request.agentType));
  };

  return {
    shouldUseTripartiteFlow
  };
}
