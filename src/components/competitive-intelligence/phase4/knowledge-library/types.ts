
export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  category: 'framework' | 'case_study' | 'template' | 'research' | 'best_practice';
  type: 'document' | 'video' | 'interactive' | 'template';
  rating: number;
  downloads: number;
  views: number;
  publishDate: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  aiEnhanced: boolean;
}

export interface CategoryInfo {
  id: string;
  label: string;
  count: number;
}
