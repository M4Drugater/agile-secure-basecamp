
export interface KnowledgeFile {
  id: string;
  title: string;
  description?: string;
  content?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_url?: string;
  original_file_name?: string;
  tags?: string[];
  summary?: string;
  key_insights?: string[];
  ai_summary?: string;
  ai_key_points?: string[];
  is_ai_processed?: boolean;
  processing_status?: string;
  extraction_status?: string;
  document_category?: string;
  source_type?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SystemKnowledge {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  knowledge_type: string;
  tags?: string[];
  priority: number;
  usage_count: number;
  effectiveness_score: number;
  is_active: boolean;
  source_type?: string;
  version?: number;
  parent_id?: string;
  is_template?: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_updated_by?: string;
  document_category?: string;
}

export type DocumentType = 'personal' | 'system' | 'template';

export interface CreateDocumentData {
  title: string;
  description?: string;
  content?: string;
  tags?: string;
  metadata?: any;
}

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  relevance_score?: number;
  difficulty_level?: string;
  estimated_duration_hours?: number;
  enrollment_count?: number;
  tags?: string[];
}

export interface ProcessingQueueItem {
  id: string;
  file_id: string;
  file_type: string;
  processing_type: string;
  status: string;
  priority: number;
  attempts: number;
  max_attempts: number;
  scheduled_for: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
  user_knowledge_files?: {
    id: string;
    title: string;
    user_id: string;
  };
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
