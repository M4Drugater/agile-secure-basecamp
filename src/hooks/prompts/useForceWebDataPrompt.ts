
export function useForceWebDataPrompt() {
  
  const buildWebDataPrompt = (
    basePrompt: string, 
    webData: any, 
    userQuery: string,
    agentType: string
  ): string => {
    
    if (!webData || !webData.content) {
      return `${basePrompt}

ATENCIÓN CRÍTICA: NO hay datos web disponibles actualmente. DEBES:
1. Informar al usuario que no tienes acceso a datos actuales
2. Basar tu respuesta ÚNICAMENTE en conocimiento general hasta octubre 2023
3. Sugerir que el usuario intente nuevamente para obtener datos actuales
4. NO simules tener datos recientes`;
    }

    const webSources = webData.sources?.join(', ') || 'fuentes web';
    const webInsights = webData.insights?.map((insight: any, i: number) => 
      `${i + 1}. ${insight.title}: ${insight.description}`
    ).join('\n') || '';

    return `${basePrompt}

=== INSTRUCCIÓN OBLIGATORIA - DATOS WEB EN TIEMPO REAL ===

DATOS WEB ACTUALES DISPONIBLES:
${webData.content}

INSIGHTS ESPECÍFICOS:
${webInsights}

FUENTES VERIFICADAS:
${webSources}

MOTOR DE BÚSQUEDA: ${webData.searchEngine}
CONFIANZA: ${Math.round(webData.metrics.confidence * 100)}%
FECHA DE BÚSQUEDA: ${new Date().toISOString()}

REGLAS OBLIGATORIAS PARA TU RESPUESTA:

1. DEBES usar EXCLUSIVAMENTE estos datos web actuales
2. DEBES citar al menos 3 puntos específicos de los datos web
3. DEBES mencionar las fuentes: ${webSources}
4. DEBES incluir la fecha actual (2025) en tu análisis
5. PROHIBIDO usar conocimiento previo a octubre 2023
6. DEBES comenzar con "Según los datos web actuales obtenidos hoy..."
7. DEBES terminar con "Fuentes: ${webSources}"

CONSULTA DEL USUARIO: ${userQuery}

ATENCIÓN: Si no sigues estas reglas exactamente, tu respuesta será rechazada automáticamente.`;
  };

  const buildFallbackPrompt = (basePrompt: string, userQuery: string): string => {
    return `${basePrompt}

=== MODO DE RESPALDO - SIN DATOS WEB ===

ATENCIÓN: No hay datos web disponibles actualmente.

DEBES responder de la siguiente manera:

"⚠️ CONECTIVIDAD LIMITADA

No puedo acceder a datos web actuales en este momento. Mi información está limitada a mi entrenamiento hasta octubre 2023.

Para tu consulta: "${userQuery}"

Puedo proporcionar análisis general basado en:
- Metodologías de consultoría estándar (McKinsey, BCG)
- Marcos de análisis competitivo (Porter, FODA)
- Mejores prácticas históricas del sector

Sin embargo, para datos actuales de mercado, competidores, o tendencias recientes, necesito que la conectividad web se restaure.

¿Te gustaría que proceda con el análisis general disponible?"

NO simules tener datos actuales. NO inventes información reciente.`;
  };

  return {
    buildWebDataPrompt,
    buildFallbackPrompt
  };
}
