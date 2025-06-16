
import { supabase } from '@/integrations/supabase/client';
import { UnifiedRequest } from './types';

export function useWebSearchProcessor() {
  const performWebSearch = async (request: UnifiedRequest) => {
    console.log('📡 Iniciando búsqueda web con Perplexity');
    
    const { data: searchData, error: searchError } = await supabase.functions.invoke('unified-web-search', {
      body: {
        query: request.message,
        context: `Análisis ${request.agentType} para ${request.sessionConfig?.companyName || 'empresa objetivo'}`,
        searchType: 'competitive',
        timeframe: 'month',
        companyName: request.sessionConfig?.companyName || 'empresa objetivo',
        industry: request.sessionConfig?.industry || 'tecnología'
      }
    });

    console.log('📡 Respuesta de edge function:', {
      hasData: !!searchData,
      hasError: !!searchError,
      status: searchData?.status || 'unknown'
    });

    if (searchError) {
      console.warn('⚠️ Web search error:', searchError);
    }

    let webSearchResults = null;
    if (searchData && searchData.status === 'success') {
      webSearchResults = searchData;
      console.log('✅ Búsqueda completada exitosamente:', {
        engine: searchData.searchEngine,
        status: searchData.status,
        sourcesFound: searchData.sources?.length || 0,
        confidence: searchData.metrics?.confidence || 0
      });
    }

    return webSearchResults;
  };

  return {
    performWebSearch
  };
}
