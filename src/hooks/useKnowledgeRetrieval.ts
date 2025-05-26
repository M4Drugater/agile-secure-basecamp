
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  content: string;
  source: 'personal' | 'system' | 'downloadable';
  relevanceScore: number;
  category?: string;
  tags?: string[];
  type?: string;
}

export function useKnowledgeRetrieval() {
  const { user } = useAuth();

  const searchKnowledge = async (query: string, limit: number = 5): Promise<KnowledgeSearchResult[]> => {
    if (!user || !query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    if (searchTerms.length === 0) return [];

    const results: KnowledgeSearchResult[] = [];

    try {
      // Search personal knowledge files
      const { data: personalFiles } = await supabase
        .from('user_knowledge_files')
        .select('id, title, content, description, tags, summary')
        .eq('user_id', user.id)
        .eq('processing_status', 'completed');

      if (personalFiles) {
        personalFiles.forEach(file => {
          const searchableText = `${file.title} ${file.content || ''} ${file.description || ''} ${file.summary || ''} ${file.tags?.join(' ') || ''}`.toLowerCase();
          const relevanceScore = calculateRelevanceScore(searchableText, searchTerms);
          
          if (relevanceScore > 0) {
            results.push({
              id: file.id,
              title: file.title,
              content: file.content || file.description || file.summary || '',
              source: 'personal',
              relevanceScore,
              tags: file.tags,
            });
          }
        });
      }

      // Search system knowledge base
      const { data: systemKnowledge } = await supabase
        .from('system_knowledge_base')
        .select('id, title, content, category, subcategory, knowledge_type, tags, priority')
        .eq('is_active', true);

      if (systemKnowledge) {
        systemKnowledge.forEach(doc => {
          const searchableText = `${doc.title} ${doc.content} ${doc.category} ${doc.subcategory || ''} ${doc.tags?.join(' ') || ''}`.toLowerCase();
          const relevanceScore = calculateRelevanceScore(searchableText, searchTerms) * (1 + doc.priority / 10);
          
          if (relevanceScore > 0) {
            results.push({
              id: doc.id,
              title: doc.title,
              content: doc.content,
              source: 'system',
              relevanceScore,
              category: doc.category,
              tags: doc.tags,
              type: doc.knowledge_type,
            });
          }
        });
      }

      // Search downloadable resources
      const { data: resources } = await supabase
        .from('downloadable_resources')
        .select('id, title, description, category, tags')
        .eq('is_active', true);

      if (resources) {
        resources.forEach(resource => {
          const searchableText = `${resource.title} ${resource.description || ''} ${resource.category} ${resource.tags?.join(' ') || ''}`.toLowerCase();
          const relevanceScore = calculateRelevanceScore(searchableText, searchTerms);
          
          if (relevanceScore > 0) {
            results.push({
              id: resource.id,
              title: resource.title,
              content: resource.description || '',
              source: 'downloadable',
              relevanceScore,
              category: resource.category,
              tags: resource.tags,
            });
          }
        });
      }

      // Sort by relevance and return top results
      return results
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

    } catch (error) {
      console.error('Knowledge search error:', error);
      return [];
    }
  };

  return { searchKnowledge };
}

function calculateRelevanceScore(text: string, searchTerms: string[]): number {
  let score = 0;
  
  searchTerms.forEach(term => {
    // Exact match in title (higher weight)
    if (text.includes(term)) {
      const matches = (text.match(new RegExp(term, 'g')) || []).length;
      score += matches * 2;
    }
    
    // Partial matches (lower weight)
    const words = text.split(' ');
    words.forEach(word => {
      if (word.includes(term) && word.length > term.length) {
        score += 0.5;
      }
    });
  });
  
  return score;
}
