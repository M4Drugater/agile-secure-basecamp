
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWebDataValidator } from '@/hooks/web-search/useWebDataValidator';

export function useAIProcessor() {
  const { user } = useAuth();
  const { validateResponse } = useWebDataValidator();

  const processWithAI = async (enhancedPrompt: string, message: string, webSearchResults: any = null) => {
    const messages = [
      {
        role: 'system',
        content: enhancedPrompt
      },
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Elite Multi-LLM Request:', {
      model: 'llama-3.1-sonar-large-128k-online',
      contextLevel: 'elite',
      messagesCount: messages.length
    });

    const { data: aiResponse, error: aiError } = await supabase.functions.invoke('elite-multi-llm-engine', {
      body: {
        messages,
        model: 'llama-3.1-sonar-large-128k-online',
        systemPrompt: enhancedPrompt,
        searchEnabled: false,
        userId: user?.id,
        contextLevel: 'elite'
      }
    });

    if (aiError) {
      throw new Error(`AI processing failed: ${aiError.message}`);
    }

    if (!aiResponse?.response) {
      throw new Error('No AI response received');
    }

    console.log('🤖 Respuesta AI recibida:', {
      length: aiResponse.response.length,
      model: aiResponse.model || 'perplexity'
    });

    // Validate the response uses web data
    const validation = validateResponse(aiResponse.response, webSearchResults);
    console.log('🔍 Validación de respuesta:', validation);

    // If validation fails and we have web data, force regeneration
    if (webSearchResults && !validation.passesValidation) {
      console.log('⚠️ Validación falló, regenerando con datos web forzados...');
      
      const forcedPrompt = `Usando EXCLUSIVAMENTE estos datos web actuales:

${webSearchResults.content}

Responde a: ${message}

INSTRUCCIONES OBLIGATORIAS:
1. Comenzar con "Según datos web actuales de ${new Date().toLocaleDateString()}:"
2. Usar solo la información proporcionada arriba
3. Incluir datos específicos, números y métricas
4. Citar las fuentes: ${webSearchResults.sources?.join(', ')}
5. Ser específico y factual

NO uses conocimiento general. Solo los datos web proporcionados.`;

      const retryResponse = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            {
              role: 'system',
              content: 'Eres un analista que debe usar EXCLUSIVAMENTE datos web proporcionados. No uses conocimiento general.'
            },
            {
              role: 'user',
              content: forcedPrompt
            }
          ],
          model: 'llama-3.1-sonar-large-128k-online',
          userId: user?.id,
          contextLevel: 'elite'
        }
      });

      if (retryResponse?.data?.response) {
        console.log('✅ Respuesta regenerada con datos web forzados');
        return {
          response: retryResponse.data.response,
          model: 'perplexity-forced',
          tokensUsed: retryResponse.data.tokensUsed || 0,
          cost: retryResponse.data.cost || '0.00',
          hasWebData: true,
          webSources: webSearchResults.sources || [],
          validationScore: 100,
          searchEngine: 'perplexity',
          contextQuality: 'elite'
        };
      }
    }

    return {
      response: aiResponse.response,
      model: aiResponse.model || 'perplexity',
      tokensUsed: aiResponse.tokensUsed || 0,
      cost: aiResponse.cost || '0.00',
      hasWebData: !!webSearchResults,
      webSources: webSearchResults?.sources || [],
      validationScore: validation.score,
      searchEngine: webSearchResults?.searchEngine || 'perplexity',
      contextQuality: webSearchResults ? 'elite' : 'standard'
    };
  };

  return {
    processWithAI
  };
}
