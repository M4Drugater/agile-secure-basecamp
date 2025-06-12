
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

export interface ResearchSession {
  id: string;
  query: string;
  content: string;
  sources: ResearchSource[];
  insights: string[];
  keywords: string[];
  researchType: 'quick' | 'comprehensive' | 'industry-specific';
  industry?: string;
  creditsUsed: number;
  modelUsed: string;
  createdAt: string;
}

export interface ResearchRequest {
  query: string;
  researchType: 'quick' | 'comprehensive' | 'industry-specific';
  model?: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online';
  industry?: string;
  depth?: 'surface' | 'detailed' | 'expert';
  sessionId?: string;
}

export function usePerplexityResearch() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<ResearchSession | null>(null);

  const researchMutation = useMutation({
    mutationFn: async (request: ResearchRequest) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('perplexity-research', {
        body: request
      });

      if (error) throw error;
      return data as ResearchSession;
    },
    onSuccess: (data) => {
      setCurrentSession(data);
      queryClient.invalidateQueries({ queryKey: ['research-sessions'] });
    },
  });

  const { data: researchSessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['research-sessions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('research_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map((item: any) => ({
        id: item.id,
        query: item.query,
        content: item.content,
        sources: item.sources || [],
        insights: item.insights || [],
        keywords: item.keywords || [],
        researchType: item.research_type,
        industry: item.industry,
        creditsUsed: item.credits_used,
        modelUsed: item.model_used,
        createdAt: item.created_at,
      })) as ResearchSession[];
    },
    enabled: !!user,
  });

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
    },
  });

  const estimateCredits = (researchType: ResearchRequest['researchType'], model?: string): number => {
    const baseCredits = {
      'quick': 3,
      'comprehensive': 6,
      'industry-specific': 8
    };

    const modelMultiplier = model === 'llama-3.1-sonar-large-128k-online' ? 1.5 : 1;
    return Math.ceil(baseCredits[researchType] * modelMultiplier);
  };

  return {
    // Actions
    conductResearch: researchMutation.mutate,
    deleteSession: deleteSession.mutate,
    
    // State
    isResearching: researchMutation.isPending,
    isLoadingSessions,
    currentSession,
    researchSessions: researchSessions || [],
    error: researchMutation.error || deleteSession.error,
    
    // Utilities
    estimateCredits,
    setCurrentSession,
  };
}
