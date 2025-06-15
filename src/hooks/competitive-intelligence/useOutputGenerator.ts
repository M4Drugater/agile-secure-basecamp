
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface IntelligentOutput {
  id: string;
  session_id: string;
  user_id: string;
  output_type: 'strategic_report' | 'market_analysis' | 'competitive_brief' | 'action_plan';
  title: string;
  content: string;
  metadata: any;
  insights_generated: string[];
  action_items: any[];
  knowledge_updates: any[];
  content_suggestions: any[];
  auto_applied_to_kb: boolean;
  status: 'draft' | 'finalized' | 'archived';
  created_at: string;
  updated_at: string;
}

interface OutputGenerationRequest {
  sessionId: string;
  outputType: 'strategic_report' | 'market_analysis' | 'competitive_brief' | 'action_plan';
  title: string;
  sessionData: any;
  collaborationData: any[];
  agentInsights: Record<string, any>;
}

export function useOutputGenerator() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOutput = async (request: OutputGenerationRequest): Promise<IntelligentOutput> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setIsGenerating(true);

      // Basic content synthesis
      const content = generateBasicContent(request);
      const insights = extractBasicInsights(request.agentInsights);
      const actionItems = extractBasicActions(request.collaborationData);
      
      const { data, error } = await supabase
        .from('intelligent_outputs')
        .insert({
          session_id: request.sessionId,
          user_id: user.id,
          output_type: request.outputType,
          title: request.title,
          content: content,
          metadata: {
            generatedAt: new Date().toISOString(),
            sourceAgents: Object.keys(request.agentInsights),
            collaborationCount: request.collaborationData.length
          },
          insights_generated: insights,
          action_items: actionItems,
          knowledge_updates: [],
          content_suggestions: [],
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        output_type: data.output_type as IntelligentOutput['output_type'],
        status: data.status as IntelligentOutput['status']
      } as IntelligentOutput;

      return typedData;
    } catch (error) {
      console.error('Error generating output:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBasicContent = (request: OutputGenerationRequest) => {
    const { sessionData, outputType } = request;
    
    switch (outputType) {
      case 'strategic_report':
        return `# Strategic Report: ${sessionData.company_name}\n\nAnalysis completed for ${sessionData.industry} industry.`;
      case 'market_analysis':
        return `# Market Analysis: ${sessionData.industry}\n\nFocus: ${sessionData.company_name}`;
      case 'competitive_brief':
        return `# Competitive Brief\n\nTarget: ${sessionData.company_name}\nIndustry: ${sessionData.industry}`;
      case 'action_plan':
        return `# Action Plan: ${sessionData.company_name}\n\nObjectives: ${sessionData.objectives}`;
      default:
        return 'Generated analysis report';
    }
  };

  const extractBasicInsights = (agentInsights: Record<string, any>) => {
    return Object.values(agentInsights).flatMap(agent => 
      agent.insights || []
    ).map(insight => insight.title || 'Generated insight').slice(0, 5);
  };

  const extractBasicActions = (collaborationData: any[]) => {
    return collaborationData
      .filter(c => c.interaction_type === 'recommendation_merge')
      .flatMap(c => c.interaction_data?.actionItems || [])
      .slice(0, 3);
  };

  return { generateOutput, isGenerating };
}
