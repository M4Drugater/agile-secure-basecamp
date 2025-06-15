
import { useState } from 'react';
import type { OrchestrationStatus } from './types';

export function useOrchestrationStatus() {
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationStage, setOrchestrationStage] = useState<string>('idle');

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

  const getOrchestrationStatus = (): OrchestrationStatus => ({
    isOrchestrating,
    currentStage: orchestrationStage,
    stageProgress: getStageProgress(orchestrationStage)
  });

  return {
    isOrchestrating,
    setIsOrchestrating,
    orchestrationStage,
    setOrchestrationStage,
    getOrchestrationStatus,
    getStageProgress
  };
}
