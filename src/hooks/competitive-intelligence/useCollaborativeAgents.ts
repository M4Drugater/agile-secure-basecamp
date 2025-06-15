
import { useState } from 'react';
import { useCollaborationLoader } from './useCollaborationLoader';
import { useCollaborationCreator } from './useCollaborationCreator';
import { useCollaborationInsights } from './useCollaborationInsights';

export function useCollaborativeAgents() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { collaborations, setCollaborations, loadCollaborations } = useCollaborationLoader();
  const { createCollaboration } = useCollaborationCreator();
  const { getCollaborationInsights } = useCollaborationInsights();

  const processDataSharing = async (sessionId: string, sourceAgent: string, targetAgent: string, data: any) => {
    setIsProcessing(true);
    try {
      const collaboration = await createCollaboration(sessionId, {
        sourceAgent,
        targetAgent,
        interactionType: 'data_sharing',
        data: {
          sharedData: data,
          timestamp: new Date().toISOString(),
          dataType: data.type || 'analysis_result'
        },
        confidenceScore: 90
      });
      
      if (collaboration) {
        setCollaborations(prev => [collaboration, ...prev]);
      }
      return collaboration;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    collaborations,
    isProcessing,
    loadCollaborations,
    processDataSharing,
    getCollaborationInsights: (sessionId: string) => getCollaborationInsights(sessionId, collaborations)
  };
}
