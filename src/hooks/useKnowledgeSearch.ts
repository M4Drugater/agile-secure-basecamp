
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'personal' | 'system' | 'resource';
  category?: string;
  relevanceScore: number;
  tags: string[];
}

interface SearchFilters {
  type?: string;
  categories?: string[];
  tags?: string[];
}

interface SearchParams {
  query: string;
  filters?: SearchFilters;
  categories?: string[];
  tags?: string[];
}

export function useKnowledgeSearch() {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const searchKnowledge = async (params: SearchParams) => {
    if (!user || !params.query.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.rpc('get_knowledge_recommendations', {
        search_text: params.query,
        user_uuid: user.id
      });

      if (error) throw error;

      // Transform and filter results
      let results: SearchResult[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content_snippet,
        type: item.knowledge_type as 'personal' | 'system' | 'resource',
        category: item.category,
        relevanceScore: parseFloat(item.relevance_score) || 0,
        tags: item.tags || []
      }));

      // Apply additional filters
      if (params.filters?.type && params.filters.type !== 'all') {
        results = results.filter(r => r.type === params.filters?.type);
      }

      if (params.categories && params.categories.length > 0) {
        results = results.filter(r => r.category && params.categories!.includes(r.category));
      }

      if (params.tags && params.tags.length > 0) {
        results = results.filter(r => 
          params.tags!.some(tag => r.tags.includes(tag))
        );
      }

      // Sort by relevance score
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching knowledge:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const loadCategories = async () => {
    if (!user) return;

    try {
      // Load categories from different sources
      const [systemCategories, personalCategories] = await Promise.all([
        supabase
          .from('system_knowledge_base')
          .select('category')
          .eq('is_active', true),
        supabase
          .from('user_knowledge_files')
          .select('document_category')
          .eq('user_id', user.id)
          .eq('processing_status', 'completed')
      ]);

      const categories = new Set<string>();
      
      systemCategories.data?.forEach(item => {
        if (item.category) categories.add(item.category);
      });
      
      personalCategories.data?.forEach(item => {
        if (item.document_category) categories.add(item.document_category);
      });

      setAvailableCategories(Array.from(categories).sort());
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTags = async () => {
    if (!user) return;

    try {
      // Load tags from different sources
      const [systemTags, personalTags] = await Promise.all([
        supabase
          .from('system_knowledge_base')
          .select('tags')
          .eq('is_active', true),
        supabase
          .from('user_knowledge_files')
          .select('tags')
          .eq('user_id', user.id)
          .eq('processing_status', 'completed')
      ]);

      const tags = new Set<string>();
      
      systemTags.data?.forEach(item => {
        if (item.tags) item.tags.forEach((tag: string) => tags.add(tag));
      });
      
      personalTags.data?.forEach(item => {
        if (item.tags) item.tags.forEach((tag: string) => tags.add(tag));
      });

      setAvailableTags(Array.from(tags).sort());
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  // Load categories and tags on mount
  React.useEffect(() => {
    if (user) {
      loadCategories();
      loadTags();
    }
  }, [user]);

  return {
    searchResults,
    isSearching,
    searchKnowledge,
    availableCategories,
    availableTags,
    loadCategories,
    loadTags
  };
}
