
import { useKnowledgeRecommendations } from './knowledge/useKnowledgeRecommendations';
import { useProcessingQueue } from './knowledge/useProcessingQueue';
import { useKnowledgeConfig } from './knowledge/useKnowledgeConfig';

// Re-export types for backward compatibility
export type { KnowledgeRecommendation, ProcessingQueueItem, KnowledgeConfig } from './knowledge/types';

export function useEnhancedKnowledgeBase() {
  const { getRecommendations } = useKnowledgeRecommendations();
  const { 
    processingQueue, 
    isLoadingQueue, 
    queueForProcessing, 
    isQueuingFile 
  } = useProcessingQueue();
  const { 
    config, 
    isLoadingConfig, 
    updateConfig, 
    isUpdatingConfig 
  } = useKnowledgeConfig();

  return {
    // Data
    processingQueue,
    config,
    
    // Loading states
    isLoadingQueue,
    isLoadingConfig,
    
    // Actions
    getRecommendations,
    queueForProcessing,
    updateConfig,
    
    // Loading states for mutations
    isQueuingFile,
    isUpdatingConfig,
  };
}
