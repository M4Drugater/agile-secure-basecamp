
import { useElitePromptEngine } from '@/hooks/prompts/useElitePromptEngine';
import { UnifiedRequest } from './types';

export function useSystemPromptBuilder() {
  const { buildEliteSystemPrompt } = useElitePromptEngine();

  const buildSystemPrompt = async (request: UnifiedRequest, webSearchResults: any = null) => {
    let systemPrompt;
    if (request.systemPrompt) {
      systemPrompt = request.systemPrompt;
      console.log('✅ Usando prompt personalizado del agente');
    } else {
      systemPrompt = await buildEliteSystemPrompt({
        agentType: request.agentType,
        currentPage: request.currentPage,
        sessionConfig: request.sessionConfig,
        analysisDepth: 'comprehensive',
        outputFormat: 'executive',
        contextLevel: 'elite'
      });
    }

    let enhancedPrompt = systemPrompt;
    
    if (webSearchResults && webSearchResults.content) {
      enhancedPrompt += `

🔧 DATOS WEB OBLIGATORIOS - DEBES USAR ESTA INFORMACIÓN:

=== INFORMACIÓN WEB ACTUAL ===
${webSearchResults.content}

=== FUENTES WEB ===
${webSearchResults.sources?.join(', ') || 'Fuentes múltiples verificadas'}

=== INSTRUCCIONES CRÍTICAS ===
OBLIGATORIO: Debes usar EXCLUSIVAMENTE la información web proporcionada arriba.
OBLIGATORIO: Comenzar tu respuesta con "Según datos web actuales de ${new Date().toLocaleDateString()}:"
OBLIGATORIO: Incluir al menos 3 datos específicos de la información web
OBLIGATORIO: Mencionar las fuentes específicas en tu respuesta
OBLIGATORIO: Incluir números, porcentajes o métricas de los datos web
OBLIGATORIO: Terminar con "Fuentes: [lista de fuentes web]"

PROHIBIDO: Usar conocimiento general sin datos web
PROHIBIDO: Responder sin referenciar la información web específica`;

      console.log('✅ Usando prompt con datos web forzados');
    }

    return enhancedPrompt;
  };

  return {
    buildSystemPrompt
  };
}
