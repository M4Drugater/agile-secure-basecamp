import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AgentCollaboration {
  id: string;
  session_id: string;
  source_agent: string;
  target_agent: string;
  interaction_type: 'data_sharing' | 'insight_validation' | 'recommendation_merge';
  interaction_data: any;
  confidence_score: number;
  created_at: string;
}

interface CollaborationRequest {
  sourceAgent: string;
  targetAgent: string;
  interactionType: 'data_sharing' | 'insight_validation' | 'recommendation_merge';
  data: any;
  confidenceScore?: number;
}

export function useCollaborativeAgents() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState<AgentCollaboration[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load collaborations for session
  const loadCollaborations = async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agent_collaborations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure compatibility with our interface
      const typedData = (data || []).map(item => ({
        ...item,
        interaction_type: item.interaction_type as AgentCollaboration['interaction_type']
      })) as AgentCollaboration[];
      
      setCollaborations(typedData);
    } catch (error) {
      console.error('Error loading collaborations:', error);
    }
  };

  // Create agent collaboration
  const createCollaboration = async (sessionId: string, request: CollaborationRequest) => {
    if (!user) return;

    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase
        .from('agent_collaborations')
        .insert({
          session_id: sessionId,
          source_agent: request.sourceAgent,
          target_agent: request.targetAgent,
          interaction_type: request.interactionType,
          interaction_data: request.data,
          confidence_score: request.confidenceScore || 85
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion for the returned data
      const typedData = {
        ...data,
        interaction_type: data.interaction_type as AgentCollaboration['interaction_type']
      } as AgentCollaboration;

      setCollaborations(prev => [typedData, ...prev]);
      return typedData;
    } catch (error) {
      console.error('Error creating collaboration:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process agent data sharing
  const processDataSharing = async (sessionId: string, sourceAgent: string, targetAgent: string, data: any) => {
    return createCollaboration(sessionId, {
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
  };

  // Process insight validation between agents
  const processInsightValidation = async (
    sessionId: string, 
    sourceAgent: string, 
    targetAgent: string, 
    insight: any,
    validationResult: any
  ) => {
    return createCollaboration(sessionId, {
      sourceAgent,
      targetAgent,
      interactionType: 'insight_validation',
      data: {
        originalInsight: insight,
        validationResult,
        confidence: validationResult.confidence || 85,
        timestamp: new Date().toISOString()
      },
      confidenceScore: validationResult.confidence || 85
    });
  };

  // Merge recommendations from multiple agents
  const mergeRecommendations = async (
    sessionId: string,
    agents: string[],
    recommendations: any[]
  ) => {
    const mergedData = {
      participatingAgents: agents,
      originalRecommendations: recommendations,
      mergedRecommendation: {
        title: 'Collaborative Strategic Recommendation',
        priority: Math.max(...recommendations.map(r => r.priority || 5)),
        confidence: Math.round(recommendations.reduce((sum, r) => sum + (r.confidence || 80), 0) / recommendations.length),
        synthesis: recommendations.map(r => r.title || r.description).join(' | '),
        actionItems: recommendations.flatMap(r => r.actionItems || [])
      },
      timestamp: new Date().toISOString()
    };

    // Create collaboration record for each agent pair
    const collaborations = [];
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const collaboration = await createCollaboration(sessionId, {
          sourceAgent: agents[i],
          targetAgent: agents[j],
          interactionType: 'recommendation_merge',
          data: mergedData,
          confidenceScore: mergedData.mergedRecommendation.confidence
        });
        collaborations.push(collaboration);
      }
    }

    return {
      mergedRecommendation: mergedData.mergedRecommendation,
      collaborations
    };
  };

  // Get collaboration insights for session
  const getCollaborationInsights = (sessionId: string) => {
    const sessionCollaborations = collaborations.filter(c => c.session_id === sessionId);
    
    const insights = {
      totalCollaborations: sessionCollaborations.length,
      dataSharing: sessionCollaborations.filter(c => c.interaction_type === 'data_sharing').length,
      insightValidations: sessionCollaborations.filter(c => c.interaction_type === 'insight_validation').length,
      recommendationMerges: sessionCollaborations.filter(c => c.interaction_type === 'recommendation_merge').length,
      averageConfidence: sessionCollaborations.length > 0 
        ? Math.round(sessionCollaborations.reduce((sum, c) => sum + c.confidence_score, 0) / sessionCollaborations.length)
        : 0,
      mostActiveAgent: getMostActiveAgent(sessionCollaborations),
      collaborationNetwork: buildCollaborationNetwork(sessionCollaborations)
    };

    return insights;
  };

  // Helper function to find most active agent
  const getMostActiveAgent = (sessionCollaborations: AgentCollaboration[]) => {
    const agentCounts: Record<string, number> = {};
    
    sessionCollaborations.forEach(c => {
      agentCounts[c.source_agent] = (agentCounts[c.source_agent] || 0) + 1;
      agentCounts[c.target_agent] = (agentCounts[c.target_agent] || 0) + 1;
    });

    return Object.entries(agentCounts).reduce((max, [agent, count]) => 
      count > max.count ? { agent, count } : max, { agent: '', count: 0 }
    );
  };

  // Helper function to build collaboration network
  const buildCollaborationNetwork = (sessionCollaborations: AgentCollaboration[]) => {
    const network: Record<string, string[]> = {};
    
    sessionCollaborations.forEach(c => {
      if (!network[c.source_agent]) network[c.source_agent] = [];
      if (!network[c.target_agent]) network[c.target_agent] = [];
      
      if (!network[c.source_agent].includes(c.target_agent)) {
        network[c.source_agent].push(c.target_agent);
      }
      if (!network[c.target_agent].includes(c.source_agent)) {
        network[c.target_agent].push(c.source_agent);
      }
    });

    return network;
  };

  return {
    collaborations,
    isProcessing,
    loadCollaborations,
    createCollaboration,
    processDataSharing,
    processInsightValidation,
    mergeRecommendations,
    getCollaborationInsights
  };
}
