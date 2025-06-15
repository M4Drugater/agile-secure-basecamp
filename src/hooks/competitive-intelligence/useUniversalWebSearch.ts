
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UniversalSearchRequest {
  query: string;
  context?: string;
  searchType?: 'quick' | 'comprehensive' | 'competitive' | 'financial' | 'market';
  sources?: string[];
  timeframe?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
}

interface SearchResults {
  content: string;
  insights: Array<{
    title: string;
    description: string;
    confidence: number;
    source: string;
  }>;
  sources: string[];
  relatedQuestions: string[];
  metrics: {
    searchTime: number;
    sourcesChecked: number;
    confidence: number;
  };
  metadata: {
    query: string;
    searchType: string;
    timestamp: string;
    model: string;
    provider: string;
  };
}

export function useUniversalWebSearch() {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [lastResults, setLastResults] = useState<SearchResults | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchResults[]>([]);

  const performUniversalSearch = async (request: UniversalSearchRequest): Promise<SearchResults> => {
    if (!user) {
      throw new Error('Authentication required for web search');
    }

    setIsSearching(true);

    try {
      console.log('Universal Web Search Request:', request);

      const { data, error } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            {
              role: 'user',
              content: `Research this topic comprehensively: ${request.query}`
            }
          ],
          model: 'gpt-4o',
          searchEnabled: true,
          searchQuery: request.query,
          contextLevel: 'elite',
          systemPrompt: `You are an elite research analyst. Provide comprehensive, investment-grade intelligence based on the search results. Focus on:

1. Executive Summary (key findings)
2. Detailed Analysis with data points
3. Strategic Implications
4. Competitive Intelligence
5. Market Context
6. Risk Assessment
7. Opportunities Identified

Search Context: ${request.context || 'General research'}
Search Type: ${request.searchType || 'comprehensive'}
Timeframe: ${request.timeframe || 'month'}

Provide actionable insights suitable for C-suite decision making.`
        }
      });

      if (error) throw error;

      if (!data.webSearchData) {
        throw new Error('No web search data returned');
      }

      const results: SearchResults = {
        content: data.response,
        insights: [
          {
            title: "Primary Finding",
            description: data.response.split('\n')[0] || "Research completed",
            confidence: 0.85,
            source: "Live Web Data"
          }
        ],
        sources: data.webSearchData.sources || ['Perplexity AI', 'Live Web Data'],
        relatedQuestions: data.webSearchData.relatedQuestions || [],
        metrics: {
          searchTime: 2500,
          sourcesChecked: data.webSearchData.sources?.length || 3,
          confidence: data.webSearchData.confidence || 0.85
        },
        metadata: {
          query: request.query,
          searchType: request.searchType || 'comprehensive',
          timestamp: new Date().toISOString(),
          model: data.model,
          provider: 'perplexity'
        }
      };

      setLastResults(results);
      setSearchHistory(prev => [results, ...prev.slice(0, 9)]); // Keep last 10 searches

      return results;

    } catch (error) {
      console.error('Universal web search error:', error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  const searchCompetitiveIntelligence = async (company: string, industry: string) => {
    return performUniversalSearch({
      query: `competitive analysis ${company} ${industry} market position`,
      context: `Competitive intelligence for ${company} in ${industry}`,
      searchType: 'competitive',
      timeframe: 'month'
    });
  };

  const searchMarketTrends = async (industry: string, timeframe: 'month' | 'quarter' = 'quarter') => {
    return performUniversalSearch({
      query: `${industry} market trends analysis growth forecast`,
      context: `Market trends analysis for ${industry}`,
      searchType: 'market',
      timeframe
    });
  };

  const searchFinancialData = async (company: string) => {
    return performUniversalSearch({
      query: `${company} financial performance earnings revenue metrics`,
      context: `Financial analysis for ${company}`,
      searchType: 'financial',
      timeframe: 'quarter'
    });
  };

  const quickSearch = async (query: string) => {
    return performUniversalSearch({
      query,
      searchType: 'quick',
      timeframe: 'week'
    });
  };

  return {
    isSearching,
    lastResults,
    searchHistory,
    performUniversalSearch,
    searchCompetitiveIntelligence,
    searchMarketTrends,
    searchFinancialData,
    quickSearch,
    clearHistory: () => setSearchHistory([]),
    clearResults: () => setLastResults(null)
  };
}
