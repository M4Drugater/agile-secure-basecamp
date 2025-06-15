
import { useOrchestrationStatus } from './useOrchestrationStatus';
import { useOrchestrationExecution } from './useOrchestrationExecution';
import { useFallbackResponse } from './useFallbackResponse';
import { toast } from 'sonner';
import type { LaigentRequest, LaigentResponse } from './types';

export function useLaigentMasterOrchestrator() {
  const {
    isOrchestrating,
    setIsOrchestrating,
    orchestrationStage,
    setOrchestrationStage,
    getOrchestrationStatus
  } = useOrchestrationStatus();
  
  const { executeOrchestrationSteps } = useOrchestrationExecution();
  const { createFallbackResponse } = useFallbackResponse();

  const executeLaigentOrchestration = async (request: LaigentRequest): Promise<LaigentResponse> => {
    setIsOrchestrating(true);
    const startTime = Date.now();

    try {
      const result = await executeOrchestrationSteps(request, setOrchestrationStage);
      return result;
    } catch (error) {
      console.error('❌ LAIGENT Orchestration Error:', error);
      
      toast.error('LAIGENT Orchestration Failed', {
        description: `Stage: ${orchestrationStage} | ${error instanceof Error ? error.message : 'Unknown error'}`
      });

      return createFallbackResponse(error, orchestrationStage, request.userQuery, startTime);
    } finally {
      setIsOrchestrating(false);
      setOrchestrationStage('idle');
    }
  };

  return {
    executeLaigentOrchestration,
    getOrchestrationStatus,
    isOrchestrating,
    orchestrationStage
  };
}
