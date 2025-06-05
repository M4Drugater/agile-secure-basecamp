
export interface KnowledgeRecommendation {
  id: string;
  title: string;
  description: string;
  content_snippet: string;
  knowledge_type: 'personal' | 'system';
  relevance_score: number;
}

export interface ProcessingQueueItem {
  id: string;
  file_id: string;
  file_type: string;
  processing_type: string;
  priority: number;
  status: string;
  attempts: number;
  max_attempts: number;
  error_message?: string;
  scheduled_for: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface KnowledgeConfig {
  id: string;
  config_key: string;
  config_value: any;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
