
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Unified research types that are compatible with both systems
export interface ResearchRequest {
  query: string;
  researchType: 'quick-scan' | 'comprehensive' | 'industry-deep-dive' | 'competitive-analysis';
  industry?: string;
  model?: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online';
  contextLevel?: 'basic' | 'enhanced' | 'elite';
  outputFormat?: 'executive-brief' | 'detailed-analysis' | 'data-points' | 'strategic-insights';
  sessionId?: string;
  sourceFilters?: string[];
  timeFilter?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  confidenceThreshold?: number;
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  domain: string;
  publishDate?: string;
  author?: string;
  credibilityScore: number;
  sourceType: 'academic' | 'news' | 'industry' | 'government' | 'corporate';
}

export interface ResearchSession {
  id: string;
  query: string;
  content: string;
  sources: ResearchSource[];
  insights: string[];
  keywords: string[];
  researchType: 'quick-scan' | 'comprehensive' | 'industry-deep-dive' | 'competitive-analysis';
  industry?: string;
  creditsUsed: number;
  modelUsed: string;
  createdAt: string;
  effectiveness: number;
  contextQuality: string;
  outputFormat: string;
  metadata: {
    processingTime: number;
    sourceCount: number;
    confidenceScore: number;
    strategicValue: number;
  };
}

export interface ResearchAnalytics {
  totalSessions: number;
  totalSourcesFound: number;
  averageEffectiveness: number;
  topIndustries: Array<{ industry: string; count: number }>;
  creditsUsed: number;
  timeSpent: number;
  favoriteResearchTypes: Array<{ type: string; count: number }>;
}

export function useEliteResearchEngine() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<ResearchSession | null>(null);
  const [researchProgress, setResearchProgress] = useState<{
    stage: string;
    progress: number;
    details: string;
  }>({ stage: 'idle', progress: 0, details: '' });

  // Enhanced research mutation with progress tracking
  const researchMutation = useMutation({
    mutationFn: async (request: ResearchRequest) => {
      if (!user) throw new Error('User not authenticated');

      setResearchProgress({ stage: 'initializing', progress: 10, details: 'Setting up research parameters...' });

      const { data, error } = await supabase.functions.invoke('elite-research-engine', {
        body: {
          ...request,
          userId: user.id,
          contextLevel: request.contextLevel || 'elite',
          progressCallback: (stage: string, progress: number, details: string) => {
            setResearchProgress({ stage, progress, details });
          }
        }
      });

      if (error) throw error;

      setResearchProgress({ stage: 'completed', progress: 100, details: 'Research completed successfully' });
      
      return data as ResearchSession;
    },
    onSuccess: (data) => {
      setCurrentSession(data);
      queryClient.invalidateQueries({ queryKey: ['research-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['research-analytics'] });
      toast.success('Research completed successfully');
    },
    onError: (error) => {
      console.error('Research failed:', error);
      toast.error('Research failed. Please try again.');
      setResearchProgress({ stage: 'error', progress: 0, details: error.message });
    }
  });

  // Load research sessions with enhanced data structure
  const { data: researchSessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['research-sessions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('research_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        query: item.query,
        content: item.content,
        sources: item.sources || [],
        insights: item.insights || [],
        keywords: item.keywords || [],
        researchType: item.research_type as 'quick-scan' | 'comprehensive' | 'industry-deep-dive' | 'competitive-analysis',
        industry: item.industry,
        creditsUsed: item.credits_used,
        modelUsed: item.model_used,
        createdAt: item.created_at,
        effectiveness: item.effectiveness || 75,
        contextQuality: item.context_quality || 'standard',
        outputFormat: item.output_format || 'detailed-analysis',
        metadata: item.metadata || {
          processingTime: 0,
          sourceCount: 0,
          confidenceScore: 0,
          strategicValue: 0
        }
      })) as ResearchSession[];
    },
    enabled: !!user,
  });

  // Load research analytics using the enhanced function
  const { data: analytics } = useQuery({
    queryKey: ['research-analytics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_enhanced_research_analytics', {
        user_uuid: user.id
      });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return {
          totalSessions: 0,
          totalSourcesFound: 0,
          averageEffectiveness: 0,
          topIndustries: [],
          creditsUsed: 0,
          timeSpent: 0,
          favoriteResearchTypes: []
        };
      }

      const result = data[0];
      return {
        totalSessions: result.total_sessions,
        totalSourcesFound: result.total_sources_found,
        averageEffectiveness: result.average_effectiveness,
        topIndustries: result.top_industries || [],
        creditsUsed: result.credits_used,
        timeSpent: result.time_spent_minutes,
        favoriteResearchTypes: result.favorite_research_types || []
      } as ResearchAnalytics;
    },
    enabled: !!user,
  });

  // Delete session
  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('research_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-sessions'] });
      toast.success('Research session deleted');
    },
  });

  // Save session to knowledge base
  const saveToKnowledge = useMutation({
    mutationFn: async (session: ResearchSession) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_knowledge_files')
        .insert({
          user_id: user.id,
          title: `Research: ${session.query}`,
          description: `Elite research session on ${session.query}`,
          content: session.content,
          file_type: 'research_report',
          tags: ['research', session.researchType, ...(session.keywords || [])],
          processing_status: 'completed',
          ai_summary: session.insights.join(' ')
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Research saved to knowledge base');
      queryClient.invalidateQueries({ queryKey: ['user-knowledge'] });
    },
  });

  // Estimate credits for research request
  const estimateCredits = useCallback((request: ResearchRequest): number => {
    const baseCredits = {
      'quick-scan': 2,
      'comprehensive': 5,
      'industry-deep-dive': 8,
      'competitive-analysis': 10
    };

    const modelMultiplier = request.model === 'llama-3.1-sonar-large-128k-online' ? 1.5 : 1;
    const contextMultiplier = request.contextLevel === 'elite' ? 1.3 : 1;
    
    return Math.ceil(baseCredits[request.researchType] * modelMultiplier * contextMultiplier);
  }, []);

  // Get research recommendations based on user context
  const getResearchRecommendations = useCallback(() => {
    if (!researchSessions || researchSessions.length === 0) {
      return [
        { query: 'Market trends in artificial intelligence', type: 'industry-deep-dive' },
        { query: 'Competitive landscape analysis', type: 'competitive-analysis' },
        { query: 'Industry disruption patterns', type: 'comprehensive' }
      ];
    }

    // Analyze user's research patterns and suggest related topics
    const industries = [...new Set(researchSessions.map(s => s.industry).filter(Boolean))];
    const keywords = [...new Set(researchSessions.flatMap(s => s.keywords || []))];
    
    return [
      { query: `Future trends in ${industries[0] || 'technology'}`, type: 'industry-deep-dive' },
      { query: `Competitive intelligence on ${keywords[0] || 'innovation'}`, type: 'competitive-analysis' },
      { query: `Market opportunities in ${industries[0] || 'emerging markets'}`, type: 'comprehensive' }
    ];
  }, [researchSessions]);

  return {
    // Actions
    conductResearch: researchMutation.mutate,
    deleteSession: deleteSession.mutate,
    saveToKnowledge: saveToKnowledge.mutate,
    
    // State
    isResearching: researchMutation.isPending,
    isLoadingSessions,
    currentSession,
    researchSessions: researchSessions || [],
    analytics,
    researchProgress,
    error: researchMutation.error || deleteSession.error,
    
    // Utilities
    estimateCredits,
    getResearchRecommendations,
    setCurrentSession,
  };
}
