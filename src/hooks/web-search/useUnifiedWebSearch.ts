
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  status: 'success' | 'partial' | 'fallback' | 'error';
  errorMessage?: string;
}

export function useUnifiedWebSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'partial' | 'disconnected'>('disconnected');

  const performUnifiedSearch = async (request: UnifiedSearchRequest): Promise<UnifiedSearchResult> => {
    setIsSearching(true);
    setSearchError(null);
    
    console.log('🔧 Sistema Reparado - Iniciando búsqueda unificada:', request);

    try {
      // Validate request
      if (!request.query?.trim()) {
        throw new Error('Query is required for search');
      }

      // Call the repaired unified web search edge function
      const { data, error } = await supabase.functions.invoke('unified-web-search', {
        body: {
          query: request.query.trim(),
          context: request.context || 'Análisis estratégico',
          searchType: request.searchType || 'comprehensive',
          timeframe: request.timeframe || 'month',
          companyName: request.companyName,
          industry: request.industry
        }
      });

      console.log('📡 Respuesta de edge function:', { 
        hasData: !!data, 
        hasError: !!error,
        status: data?.status 
      });

      if (error) {
        console.error('Edge function error:', error);
        // Don't throw immediately, try to work with partial data
        if (!data) {
          throw new Error(`Edge function failed: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error('No data returned from search service');
      }

      // Update connection status based on search result
      setConnectionStatus(
        data.status === 'success' ? 'connected' :
        data.status === 'partial' ? 'partial' : 
        'disconnected'
      );

      console.log('✅ Búsqueda completada exitosamente:', {
        engine: data.searchEngine,
        status: data.status,
        sourcesFound: data.sources?.length || 0,
        confidence: data.metrics?.confidence || 0
      });

      setSearchResults(data);
      
      // Show appropriate notification
      if (data.status === 'success') {
        toast.success('Conectividad Web Restaurada', {
          description: `Motor: ${data.searchEngine} | Fuentes: ${data.sources?.length || 0} | Confianza: ${Math.round(data.metrics?.confidence * 100 || 0)}%`
        });
      } else if (data.status === 'partial') {
        toast.warning('Conectividad Parcial', {
          description: `Sistema funcionando con ${data.searchEngine}. Algunas fuentes no disponibles.`
        });
      } else {
        toast.info('Sistema de Respaldo Activo', {
          description: 'Funcionando con análisis estratégico basado en conocimiento.'
        });
      }

      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido en búsqueda';
      console.error('❌ Error crítico en búsqueda unificada:', error);
      
      setSearchError(errorMessage);
      setConnectionStatus('disconnected');
      
      // Create comprehensive fallback result
      const fallbackResult: UnifiedSearchResult = {
        content: `El sistema de búsqueda web está experimentando dificultades técnicas. 

**Error**: ${errorMessage}

**Análisis Disponible**: Aunque la conectividad web esté limitada, puedo proporcionar análisis estratégico basado en metodologías estándar de consultoría:

1. **Marco de Análisis Competitivo**: Aplicación de metodologías McKinsey y BCG
2. **Evaluación Estratégica**: Análisis FODA y Porter Five Forces  
3. **Recomendaciones**: Basadas en mejores prácticas del sector

Para obtener datos de mercado en tiempo real, intenta de nuevo en unos momentos o contacta al soporte técnico.`,
        sources: [],
        insights: [
          {
            title: 'Sistema en Recuperación',
            description: 'Conectividad web limitada, funcionalidad analítica disponible',
            confidence: 0.5
          },
          {
            title: 'Análisis Alternativo',
            description: 'Marcos estratégicos estándar disponibles para consultoría',
            confidence: 0.7
          }
        ],
        metrics: {
          confidence: 0.4,
          sourceCount: 0,
          relevanceScore: 0.3
        },
        timestamp: new Date().toISOString(),
        searchEngine: 'system-error',
        status: 'error',
        errorMessage
      };
      
      setSearchResults(fallbackResult);
      
      toast.error('Error en Conectividad Web', {
        description: 'Sistema de respaldo activo. Funcionalidad básica disponible.'
      });
      
      return fallbackResult;
    } finally {
      setIsSearching(false);
    }
  };

  const searchCompetitiveIntelligence = async (companyName: string, industry: string) => {
    return performUnifiedSearch({
      query: `análisis competitivo completo ${companyName}`,
      context: `Inteligencia competitiva para ${companyName} en ${industry}`,
      searchType: 'competitive',
      timeframe: 'month',
      companyName,
      industry
    });
  };

  const searchFinancialData = async (companyName: string, industry: string) => {
    return performUnifiedSearch({
      query: `rendimiento financiero datos económicos ${companyName}`,
      context: `Análisis financiero para ${companyName}`,
      searchType: 'financial',
      timeframe: 'quarter',
      companyName,
      industry
    });
  };

  const searchMarketTrends = async (industry: string, keywords: string = '') => {
    return performUnifiedSearch({
      query: `tendencias de mercado análisis industria ${industry} ${keywords}`,
      context: `Tendencias de mercado para ${industry}`,
      searchType: 'market',
      timeframe: 'month',
      industry
    });
  };

  const testConnection = async () => {
    try {
      setIsSearching(true);
      const result = await performUnifiedSearch({
        query: 'test conectividad sistema',
        context: 'Test de conectividad del sistema',
        searchType: 'comprehensive',
        timeframe: 'day'
      });
      
      return result.status === 'success';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    searchResults,
    searchError,
    connectionStatus,
    performUnifiedSearch,
    searchCompetitiveIntelligence,
    searchFinancialData,
    searchMarketTrends,
    testConnection,
    clearResults: () => {
      setSearchResults(null);
      setSearchError(null);
    }
  };
}
