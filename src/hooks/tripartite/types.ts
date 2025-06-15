
export interface TripartiteRequest {
  userQuery: string;
  agentType: string;
  sessionConfig?: any;
  contextLevel?: 'standard' | 'elite';
}

export interface TripartiteResponse {
  finalResponse: string;
  metadata: TripartiteMetadata;
  status: 'success' | 'partial' | 'error';
}

export interface TripartiteMetadata {
  totalTokens: number;
  totalCost: string;
  webSources: string[];
  searchEngine: string;
  qualityScore: number;
  processingTime: number;
  stages: {
    openaiTime: number;
    perplexityTime: number;
    claudeTime: number;
  };
}
