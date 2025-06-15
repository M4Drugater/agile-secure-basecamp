
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

export function useCollaborationInsights() {
  const getCollaborationInsights = (sessionId: string, collaborations: AgentCollaboration[]) => {
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

  return { getCollaborationInsights };
}
