
export interface UnifiedRequest {
  message: string;
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia' | 'research-engine' | 'enhanced-content-generator';
  currentPage: string;
  sessionConfig?: any;
  searchEnabled?: boolean;
  model?: string;
  useTripartiteFlow?: boolean;
  systemPrompt?: string;
}

export interface UnifiedResponse {
  response: string;
  model: string;
  tokensUsed: number;
  cost: string;
  hasWebData: boolean;
  webSources: string[];
  validationScore: number;
  searchEngine: string;
  contextQuality?: string;
  tripartiteMetrics?: any;
}

export interface ContextSummary {
  hasProfile: boolean;
  knowledgeCount: number;
  contentCount: number;
  activityCount: number;
  quality: string;
}
