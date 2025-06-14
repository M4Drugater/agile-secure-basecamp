
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FinancialRequest {
  symbol: string;
  companyName: string;
  industry: string;
  analysisType: 'overview' | 'earnings' | 'ratios' | 'comparison' | 'forecast';
}

interface FinancialResults {
  financialData: {
    overview: any;
    keyMetrics: any;
    earnings: any;
    ratios: any;
  };
  peerComparison: any;
  marketContext: any;
  analysis: string;
  insights: any[];
  riskFactors: any[];
  opportunities: any[];
  metadata: {
    symbol: string;
    companyName: string;
    industry: string;
    analysisType: string;
    timestamp: string;
    dataQuality: string;
    confidence: number;
  };
}

export function useFinancialData() {
  const [isLoading, setIsLoading] = useState(false);
  const [financialData, setFinancialData] = useState<FinancialResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFinancialAnalysis = async (request: FinancialRequest): Promise<FinancialResults> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Retrieving financial data:', request);

      const { data, error: functionError } = await supabase.functions.invoke('financial-data-retrieval', {
        body: request
      });

      if (functionError) {
        throw new Error(`Financial data retrieval failed: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No financial data returned');
      }

      setFinancialData(data);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Financial data error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyOverview = async (symbol: string, companyName: string, industry: string) => {
    return getFinancialAnalysis({
      symbol,
      companyName,
      industry,
      analysisType: 'overview'
    });
  };

  const getEarningsAnalysis = async (symbol: string, companyName: string, industry: string) => {
    return getFinancialAnalysis({
      symbol,
      companyName,
      industry,
      analysisType: 'earnings'
    });
  };

  const getFinancialRatios = async (symbol: string, companyName: string, industry: string) => {
    return getFinancialAnalysis({
      symbol,
      companyName,
      industry,
      analysisType: 'ratios'
    });
  };

  const getPeerComparison = async (symbol: string, companyName: string, industry: string) => {
    return getFinancialAnalysis({
      symbol,
      companyName,
      industry,
      analysisType: 'comparison'
    });
  };

  const getFinancialForecast = async (symbol: string, companyName: string, industry: string) => {
    return getFinancialAnalysis({
      symbol,
      companyName,
      industry,
      analysisType: 'forecast'
    });
  };

  const clearData = () => {
    setFinancialData(null);
    setError(null);
  };

  return {
    isLoading,
    financialData,
    error,
    getFinancialAnalysis,
    getCompanyOverview,
    getEarningsAnalysis,
    getFinancialRatios,
    getPeerComparison,
    getFinancialForecast,
    clearData
  };
}
