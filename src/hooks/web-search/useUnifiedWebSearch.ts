
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedSearchRequest {
  query: string;
  context?: string;
  searchType?: 'competitive' | 'financial' | 'market' | 'comprehensive';
  timeframe?: 'hour' | 'day' | 'week' | 'month' | 'quarter';
  companyName?: string;
  industry?: string;
}

interface UnifiedSearchResult {
  content: string;
  sources: string[];
  insights: Array<{
    title: string;
    description: string;
    confidence: number;
  }>;
  metrics: {
    confidence: number;
    sourceCount: number;
    relevanceScore: number;
  };
  timestamp: string;
  searchEngine: string;
}

export function useUnifiedWebSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performUnifiedSearch = async (request: UnifiedSearchRequest): Promise<UnifiedSearchResult> => {
    setIsSearching(true);
    setSearchError(null);
    
    console.log('🔍 Unified Web Search Request:', request);

    try {
      // Call the new unified web search edge function
      const { data, error } = await supabase.functions.invoke('unified-web-search', {
        body: {
          query: request.query,
          context: request.context || 'General search',
          searchType: request.searchType || 'comprehensive',
          timeframe: request.timeframe || 'month',
          companyName: request.companyName,
          industry: request.industry
        }
      });

      if (error) {
        throw new Error(`Unified search failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from unified search');
      }

      console.log('✅ Unified Search Success:', {
        sourcesFound: data.sources?.length || 0,
        confidence: data.metrics?.confidence || 0,
        searchEngine: data.searchEngine
      });

      setSearchResults(data);
      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      console.error('❌ Unified Search Error:', error);
      setSearchError(errorMessage);
      
      // Return fallback result to prevent agent failure
      const fallbackResult: UnifiedSearchResult = {
        content: `Search for "${request.query}" encountered technical difficulties. Providing analysis based on general knowledge.`,
        sources: [],
        insights: [{
          title: 'Technical Notice',
          description: 'Search system is recovering. Analysis provided from knowledge base.',
          confidence: 0.5
        }],
        metrics: {
          confidence: 0.5,
          sourceCount: 0,
          relevanceScore: 0.3
        },
        timestamp: new Date().toISOString(),
        searchEngine: 'fallback'
      };
      
      setSearchResults(fallbackResult);
      return fallbackResult;
    } finally {
      setIsSearching(false);
    }
  };

  const searchCompetitiveIntelligence = async (companyName: string, industry: string) => {
    return performUnifiedSearch({
      query: `competitive analysis market position ${companyName}`,
      context: `Competitive intelligence for ${companyName} in ${industry}`,
      searchType: 'competitive',
      timeframe: 'month',
      companyName,
      industry
    });
  };

  const searchFinancialData = async (companyName: string, industry: string) => {
    return performUnifiedSearch({
      query: `financial performance earnings revenue ${companyName}`,
      context: `Financial analysis for ${companyName}`,
      searchType: 'financial',
      timeframe: 'quarter',
      companyName,
      industry
    });
  };

  const searchMarketTrends = async (industry: string, keywords: string = '') => {
    return performUnifiedSearch({
      query: `market trends industry analysis ${industry} ${keywords}`,
      context: `Market trends for ${industry}`,
      searchType: 'market',
      timeframe: 'month',
      industry
    });
  };

  return {
    isSearching,
    searchResults,
    searchError,
    performUnifiedSearch,
    searchCompetitiveIntelligence,
    searchFinancialData,
    searchMarketTrends,
    clearResults: () => {
      setSearchResults(null);
      setSearchError(null);
    }
  };
}
