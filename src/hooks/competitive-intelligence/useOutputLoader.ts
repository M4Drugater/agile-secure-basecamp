
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

export function useOutputLoader() {
  const { user } = useAuth();
  const [outputs, setOutputs] = useState<IntelligentOutput[]>([]);

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
      
      const typedData = (data || []).map(item => ({
        ...item,
        output_type: item.output_type as IntelligentOutput['output_type'],
        status: item.status as IntelligentOutput['status']
      })) as IntelligentOutput[];
      
      setOutputs(typedData);
    } catch (error) {
      console.error('Error loading outputs:', error);
    }
  };

  return { outputs, setOutputs, loadOutputs };
}
