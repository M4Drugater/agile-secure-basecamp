
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';
import { IntelligentOutput, OutputRequest } from './types/intelligentOutputs';

export function useOutputStorage() {
  const [outputs, setOutputs] = useState<IntelligentOutput[]>([]);
  const { supabase, user } = useSupabase();

  const loadOutputs = async (sessionId: string) => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('intelligent_outputs')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData = (data || []).map(item => ({
        ...item,
        output_type: item.output_type as 'strategic_report' | 'market_analysis' | 'competitive_brief' | 'action_plan'
      })) as IntelligentOutput[];
      
      setOutputs(typedData);
    } catch (error) {
      console.error('Error loading outputs:', error);
      toast.error('Failed to load outputs');
    }
  };

  const saveOutput = async (
    request: OutputRequest,
    content: string,
    insights: string[],
    actionItems: any[],
    knowledgeUpdates: any[],
    contentSuggestions: any[]
  ): Promise<IntelligentOutput> => {
    if (!user || !supabase) {
      throw new Error('User not authenticated');
    }

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
          collaborationCount: request.collaborationData.length,
          enhancementLevel: 'elite',
          dataConfidence: 95,
          realTimeDataUsed: true
        },
        insights_generated: insights,
        action_items: actionItems,
        knowledge_updates: knowledgeUpdates,
        content_suggestions: contentSuggestions,
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;

    const newOutput = data as IntelligentOutput;
    setOutputs(prev => [newOutput, ...prev]);

    return newOutput;
  };

  return {
    outputs,
    setOutputs,
    loadOutputs,
    saveOutput
  };
}
