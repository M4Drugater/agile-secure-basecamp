
export interface OutputRequest {
  sessionId: string;
  outputType: 'strategic_report' | 'market_analysis' | 'competitive_brief' | 'action_plan';
  title: string;
  sessionData: any;
  collaborationData: any[];
  agentInsights: Record<string, any>;
}

export interface IntelligentOutput {
  id: string;
  session_id: string;
  output_type: 'strategic_report' | 'market_analysis' | 'competitive_brief' | 'action_plan';
  title: string;
  content: string;
  insights_generated: string[];
  action_items: any[];
  knowledge_updates: any[];
  content_suggestions: any[];
  metadata: any;
  status: 'draft' | 'completed' | 'finalized' | 'archived';
  created_at: string;
  updated_at: string;
}
