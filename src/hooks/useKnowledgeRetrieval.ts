
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  content: string;
  source: 'personal' | 'system' | 'downloadable' | 'learning_path';
  relevanceScore: number;
  category?: string;
  tags?: string[];
  type?: string;
  difficulty_level?: string;
  estimated_duration_hours?: number;
  enrollment_count?: number;
}

export function useKnowledgeRetrieval() {
  const { user } = useAuth();

  const searchKnowledge = async (query: string, limit: number = 5): Promise<KnowledgeSearchResult[]> => {
    if (!user || !query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    if (searchTerms.length === 0) return [];

    const results: KnowledgeSearchResult[] = [];

    try {
      // Search learning paths (prioritized for course recommendations)
      const { data: learningPaths } = await supabase
        .from('learning_paths')
        .select('id, title, description, difficulty_level, estimated_duration_hours, tags, learning_objectives, enrollment_count, is_published')
        .eq('is_published', true);

      if (learningPaths) {
        learningPaths.forEach(path => {
          const searchableText = `${path.title} ${path.description || ''} ${path.learning_objectives?.join(' ') || ''} ${path.tags?.join(' ') || ''}`.toLowerCase();
          let relevanceScore = calculateRelevanceScore(searchableText, searchTerms);
          
          // Boost learning paths relevance for course-related queries
          const courseKeywords = ['course', 'learn', 'training', 'skill', 'development', 'education', 'study', 'practice'];
          const hasCourseKeywords = searchTerms.some(term => courseKeywords.some(keyword => keyword.includes(term) || term.includes(keyword)));
          if (hasCourseKeywords) {
            relevanceScore *= 2.5; // Significant boost for course-related queries
          }
          
          if (relevanceScore > 0) {
            results.push({
              id: path.id,
              title: path.title,
              content: path.description || '',
              source: 'learning_path',
              relevanceScore,
              category: 'Learning Path',
              tags: path.tags,
              type: 'course',
              difficulty_level: path.difficulty_level,
              estimated_duration_hours: path.estimated_duration_hours,
              enrollment_count: path.enrollment_count,
            });
          }
        });
      }

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

      // Sort by relevance and return top results, prioritizing learning paths
      return results
        .sort((a, b) => {
          // Prioritize learning paths
          if (a.source === 'learning_path' && b.source !== 'learning_path') return -1;
          if (b.source === 'learning_path' && a.source !== 'learning_path') return 1;
          return b.relevanceScore - a.relevanceScore;
        })
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
