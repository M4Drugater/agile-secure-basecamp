
import { useKnowledgeBase } from './useKnowledgeBase';

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  category?: string;
  source: string;
  difficulty_level?: string;
  estimated_duration_hours?: number;
  enrollment_count?: number;
  tags?: string[];
  relevance_score?: number;
}

interface KnowledgeItem {
  title: string;
  category: string;
  content: string;
}

export function useKnowledgeRetrieval() {
  const { documents } = useKnowledgeBase();

  const searchKnowledge = async (query: string, limit: number = 5): Promise<KnowledgeSearchResult[]> => {
    if (!documents || documents.length === 0) {
      return [];
    }

    // Simple text-based search implementation
    const searchTerms = query.toLowerCase().split(' ');
    
    const results = documents
      .filter(doc => {
        const searchText = `${doc.title} ${doc.content || ''} ${doc.description || ''}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      })
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        summary: doc.summary,
        category: doc.document_type,
        source: 'personal',
        tags: doc.tags || [],
        relevance_score: 0.8, // Simplified relevance scoring
      }))
      .slice(0, limit);

    return results;
  };

  const retrieveRelevantKnowledge = async (userMessage: string): Promise<KnowledgeItem[]> => {
    try {
      const results = await searchKnowledge(userMessage, 5);
      
      return results.map(result => ({
        title: result.title,
        category: result.category || 'General',
        content: result.content || result.summary || '',
      }));
    } catch (error) {
      console.error('Error retrieving relevant knowledge:', error);
      return [];
    }
  };

  return {
    searchKnowledge,
    retrieveRelevantKnowledge,
  };
}
