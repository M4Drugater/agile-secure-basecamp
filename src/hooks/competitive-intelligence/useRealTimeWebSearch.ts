
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchRequest {
  query: string;
  companyName: string;
  industry: string;
  searchType: 'news' | 'financial' | 'competitive' | 'market' | 'regulatory';
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'quarter';
}

interface SearchResults {
  searchResults: {
    webData: string;
    strategicAnalysis: string;
    relatedQuestions: string[];
  };
  insights: any[];
  metrics: any;
  threats: any[];
  opportunities: any[];
  metadata: {
    searchType: string;
    timeframe: string;
    companyName: string;
    industry: string;
    timestamp: string;
    dataConfidence: number;
    sources: string[];
  };
}

export function useRealTimeWebSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performWebSearch = async (searchRequest: SearchRequest): Promise<SearchResults> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Performing real-time web search:', searchRequest);

      const { data, error: functionError } = await supabase.functions.invoke('real-time-web-search', {
        body: searchRequest
      });

      if (functionError) {
        throw new Error(`Web search failed: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data returned from web search');
      }

      setSearchResults(data);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Real-time web search error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchCompetitiveNews = async (companyName: string, industry: string, timeframe: 'day' | 'week' | 'month' = 'week') => {
    return performWebSearch({
      query: `competitive analysis ${companyName}`,
      companyName,
      industry,
      searchType: 'news',
      timeframe
    });
  };

  const searchMarketTrends = async (industry: string, timeframe: 'week' | 'month' | 'quarter' = 'month') => {
    return performWebSearch({
      query: `market trends and analysis`,
      companyName: '',
      industry,
      searchType: 'market',
      timeframe
    });
  };

  const searchFinancialUpdates = async (companyName: string, industry: string) => {
    return performWebSearch({
      query: `financial performance earnings revenue stock price ${companyName}`,
      companyName,
      industry,
      searchType: 'financial',
      timeframe: 'quarter'
    });
  };

  const searchRegulatoryChanges = async (industry: string) => {
    return performWebSearch({
      query: `regulatory changes compliance`,
      companyName: '',
      industry,
      searchType: 'regulatory',
      timeframe: 'month'
    });
  };

  const clearResults = () => {
    setSearchResults(null);
    setError(null);
  };

  return {
    isLoading,
    searchResults,
    error,
    performWebSearch,
    searchCompetitiveNews,
    searchMarketTrends,
    searchFinancialUpdates,
    searchRegulatoryChanges,
    clearResults
  };
}
