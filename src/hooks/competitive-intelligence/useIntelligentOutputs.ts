
import { useState, useEffect } from 'react';
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

export function useIntelligentOutputs() {
  const { user } = useAuth();
  const [outputs, setOutputs] = useState<IntelligentOutput[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load outputs for session
  const loadOutputs = async (sessionId?: string) => {
    if (!user) return;

    try {
      let query = supabase
        .from('intelligent_outputs')
        .select('*')
        .eq('user_id', user.id);

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOutputs(data || []);
    } catch (error) {
      console.error('Error loading outputs:', error);
    }
  };

  // Generate intelligent output
  const generateOutput = async (request: OutputGenerationRequest): Promise<IntelligentOutput> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setIsGenerating(true);

      // Process and synthesize data from all sources
      const synthesizedContent = await synthesizeContent(request);
      
      const { data, error } = await supabase
        .from('intelligent_outputs')
        .insert({
          session_id: request.sessionId,
          user_id: user.id,
          output_type: request.outputType,
          title: request.title,
          content: synthesizedContent.content,
          metadata: {
            generatedAt: new Date().toISOString(),
            sourceAgents: Object.keys(request.agentInsights),
            collaborationCount: request.collaborationData.length,
            analysisDepth: request.sessionData.analysis_depth || 'Detailed'
          },
          insights_generated: synthesizedContent.insights,
          action_items: synthesizedContent.actionItems,
          knowledge_updates: synthesizedContent.knowledgeUpdates,
          content_suggestions: synthesizedContent.contentSuggestions,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      setOutputs(prev => [data, ...prev]);
      
      // Auto-apply to knowledge base if configured
      if (synthesizedContent.knowledgeUpdates.length > 0) {
        await applyKnowledgeUpdates(data.id, synthesizedContent.knowledgeUpdates);
      }

      return data;
    } catch (error) {
      console.error('Error generating output:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Synthesize content from multiple sources
  const synthesizeContent = async (request: OutputGenerationRequest) => {
    const { sessionData, agentInsights, collaborationData, outputType } = request;

    // Extract insights from all agents
    const allInsights = Object.values(agentInsights).flatMap(agent => 
      agent.insights || []
    );

    // Extract recommendations from collaborations
    const collaborativeRecommendations = collaborationData
      .filter(c => c.interaction_type === 'recommendation_merge')
      .map(c => c.interaction_data.mergedRecommendation);

    // Generate content based on output type
    let content = '';
    let actionItems: any[] = [];
    let knowledgeUpdates: any[] = [];
    let contentSuggestions: any[] = [];

    switch (outputType) {
      case 'strategic_report':
        content = generateStrategicReport(sessionData, allInsights, collaborativeRecommendations);
        actionItems = extractStrategicActions(allInsights, collaborativeRecommendations);
        knowledgeUpdates = generateKnowledgeUpdates(sessionData, allInsights);
        contentSuggestions = generateContentSuggestions(sessionData, allInsights, 'strategic');
        break;

      case 'market_analysis':
        content = generateMarketAnalysis(sessionData, allInsights, collaborativeRecommendations);
        actionItems = extractMarketActions(allInsights, collaborativeRecommendations);
        knowledgeUpdates = generateKnowledgeUpdates(sessionData, allInsights);
        contentSuggestions = generateContentSuggestions(sessionData, allInsights, 'market');
        break;

      case 'competitive_brief':
        content = generateCompetitiveBrief(sessionData, allInsights, collaborativeRecommendations);
        actionItems = extractCompetitiveActions(allInsights, collaborativeRecommendations);
        knowledgeUpdates = generateKnowledgeUpdates(sessionData, allInsights);
        contentSuggestions = generateContentSuggestions(sessionData, allInsights, 'competitive');
        break;

      case 'action_plan':
        content = generateActionPlan(sessionData, allInsights, collaborativeRecommendations);
        actionItems = extractAllActions(allInsights, collaborativeRecommendations);
        knowledgeUpdates = generateKnowledgeUpdates(sessionData, allInsights);
        contentSuggestions = generateContentSuggestions(sessionData, allInsights, 'action');
        break;
    }

    return {
      content,
      insights: allInsights.map(insight => insight.title || insight.description || 'Generated insight'),
      actionItems,
      knowledgeUpdates,
      contentSuggestions
    };
  };

  // Content generation helpers
  const generateStrategicReport = (sessionData: any, insights: any[], recommendations: any[]) => {
    return `# Strategic Intelligence Report: ${sessionData.company_name}

## Executive Summary
This comprehensive analysis of ${sessionData.company_name} in the ${sessionData.industry} industry provides strategic insights for competitive positioning and market opportunities.

## Key Findings
${insights.slice(0, 5).map((insight, i) => `${i + 1}. ${insight.title || insight.description || 'Key finding'}`).join('\n')}

## Strategic Recommendations
${recommendations.map((rec, i) => `${i + 1}. ${rec.title || rec.synthesis || 'Strategic recommendation'}`).join('\n')}

## Analysis Focus: ${sessionData.analysis_focus || 'Comprehensive competitive landscape'}

## Geographic Scope: ${sessionData.geographic_scope || 'Global'}

*Generated on ${new Date().toLocaleDateString()} using collaborative AI analysis*`;
  };

  const generateMarketAnalysis = (sessionData: any, insights: any[], recommendations: any[]) => {
    return `# Market Analysis: ${sessionData.industry} Industry

## Company Focus: ${sessionData.company_name}

## Market Overview
${insights.filter(i => i.category === 'market' || i.type === 'market_trend').slice(0, 3).map(insight => 
  `• ${insight.title || insight.description || 'Market insight'}`
).join('\n')}

## Competitive Landscape
${insights.filter(i => i.category === 'competitive' || i.type === 'competitive_analysis').slice(0, 3).map(insight => 
  `• ${insight.title || insight.description || 'Competitive insight'}`
).join('\n')}

## Market Opportunities
${recommendations.map(rec => `• ${rec.title || rec.synthesis || 'Market opportunity'}`).join('\n')}

*Analysis generated from collaborative intelligence on ${new Date().toLocaleDateString()}*`;
  };

  const generateCompetitiveBrief = (sessionData: any, insights: any[], recommendations: any[]) => {
    return `# Competitive Intelligence Brief

**Target Company:** ${sessionData.company_name}
**Industry:** ${sessionData.industry}
**Analysis Date:** ${new Date().toLocaleDateString()}

## Quick Insights
${insights.slice(0, 4).map(insight => `• ${insight.title || insight.description || 'Competitive insight'}`).join('\n')}

## Immediate Actions
${recommendations.slice(0, 3).map(rec => `• ${rec.title || rec.synthesis || 'Recommended action'}`).join('\n')}

## Strategic Context
Focus: ${sessionData.analysis_focus || 'General competitive analysis'}
Scope: ${sessionData.geographic_scope || 'Global'}`;
  };

  const generateActionPlan = (sessionData: any, insights: any[], recommendations: any[]) => {
    return `# Action Plan: ${sessionData.company_name} Competitive Strategy

## Objectives
${sessionData.objectives || 'Strategic competitive positioning and market advantage'}

## Priority Actions
${recommendations.flatMap(rec => rec.actionItems || []).slice(0, 5).map((action, i) => 
  `${i + 1}. ${action.title || action.description || 'Priority action'}`
).join('\n')}

## Supporting Intelligence
${insights.slice(0, 3).map(insight => `• ${insight.title || insight.description || 'Supporting insight'}`).join('\n')}

## Implementation Timeline
- Immediate (0-30 days): High-priority actions
- Short-term (1-3 months): Strategic initiatives  
- Long-term (3-12 months): Competitive positioning

*Action plan generated from collaborative AI analysis*`;
  };

  // Action extraction helpers
  const extractStrategicActions = (insights: any[], recommendations: any[]) => {
    return recommendations.flatMap(rec => rec.actionItems || []).concat(
      insights.filter(i => i.actionable).map(i => ({
        title: i.title || 'Strategic action',
        description: i.description || '',
        priority: i.priority || 'medium',
        timeframe: i.timeframe || 'short-term'
      }))
    );
  };

  const extractMarketActions = (insights: any[], recommendations: any[]) => {
    return recommendations.flatMap(rec => rec.actionItems || []).filter(action => 
      action.category === 'market' || action.type === 'market_action'
    );
  };

  const extractCompetitiveActions = (insights: any[], recommendations: any[]) => {
    return recommendations.flatMap(rec => rec.actionItems || []).filter(action => 
      action.category === 'competitive' || action.type === 'competitive_action'
    );
  };

  const extractAllActions = (insights: any[], recommendations: any[]) => {
    return recommendations.flatMap(rec => rec.actionItems || []);
  };

  // Knowledge update generation
  const generateKnowledgeUpdates = (sessionData: any, insights: any[]) => {
    return [
      {
        type: 'industry_analysis',
        title: `${sessionData.industry} Industry Intelligence`,
        content: `Updated competitive intelligence for ${sessionData.industry} industry`,
        tags: [sessionData.industry, 'competitive-intelligence', sessionData.company_name.toLowerCase()],
        insights: insights.slice(0, 3)
      },
      {
        type: 'company_profile',
        title: `${sessionData.company_name} Competitive Profile`,
        content: `Comprehensive competitive analysis and insights`,
        tags: [sessionData.company_name.toLowerCase(), 'company-analysis', sessionData.industry],
        insights: insights.filter(i => i.company === sessionData.company_name)
      }
    ];
  };

  // Content suggestion generation
  const generateContentSuggestions = (sessionData: any, insights: any[], contentType: string) => {
    const baseTopics = [
      `${sessionData.industry} Industry Trends`,
      `Competitive Analysis: ${sessionData.company_name}`,
      `Market Opportunities in ${sessionData.industry}`,
      `Strategic Insights for ${sessionData.analysis_focus}`
    ];

    return baseTopics.map(topic => ({
      type: contentType,
      title: topic,
      description: `Content piece based on competitive intelligence analysis`,
      suggestedFormat: ['blog_post', 'report', 'presentation'][Math.floor(Math.random() * 3)],
      priority: Math.floor(Math.random() * 5) + 1,
      insights: insights.slice(0, 2)
    }));
  };

  // Apply knowledge updates to knowledge base
  const applyKnowledgeUpdates = async (outputId: string, knowledgeUpdates: any[]) => {
    try {
      for (const update of knowledgeUpdates) {
        await supabase.rpc('auto_update_knowledge_from_session', {
          session_uuid: outputs.find(o => o.id === outputId)?.session_id,
          user_uuid: user?.id
        });
      }

      // Mark output as auto-applied
      await supabase
        .from('intelligent_outputs')
        .update({ auto_applied_to_kb: true })
        .eq('id', outputId);

    } catch (error) {
      console.error('Error applying knowledge updates:', error);
    }
  };

  // Finalize output
  const finalizeOutput = async (outputId: string) => {
    return supabase
      .from('intelligent_outputs')
      .update({ status: 'finalized' })
      .eq('id', outputId)
      .eq('user_id', user?.id);
  };

  return {
    outputs,
    isGenerating,
    loadOutputs,
    generateOutput,
    finalizeOutput
  };
}
