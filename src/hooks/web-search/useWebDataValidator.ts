
import { useState } from 'react';

interface WebDataValidation {
  hasWebReferences: boolean;
  hasSpecificData: boolean;
  hasRecency: boolean;
  hasSourceAttribution: boolean;
  score: number;
  issues: string[];
}

export function useWebDataValidator() {
  const [lastValidation, setLastValidation] = useState<WebDataValidation | null>(null);

  const validateResponse = (response: string, webData: any): WebDataValidation => {
    const issues: string[] = [];
    let score = 0;

    // Check for web data references
    const hasWebReferences = webData?.sources?.some((source: string) => 
      response.toLowerCase().includes(source.toLowerCase().split('.')[0])
    ) || false;
    
    if (!hasWebReferences) {
      issues.push('No se encontraron referencias a fuentes web específicas');
    } else {
      score += 25;
    }

    // Check for specific data points from web results
    const webContent = webData?.content || '';
    const webWords = webContent.toLowerCase().split(' ').filter((word: string) => word.length > 4);
    const responseWords = response.toLowerCase().split(' ');
    
    const commonWords = webWords.filter((word: string) => responseWords.includes(word));
    const hasSpecificData = commonWords.length > 10;
    
    if (!hasSpecificData) {
      issues.push('Respuesta no contiene datos específicos de la búsqueda web');
    } else {
      score += 25;
    }

    // Check for recency indicators
    const recencyTerms = ['2024', '2025', 'reciente', 'actual', 'último', 'según datos actuales'];
    const hasRecency = recencyTerms.some(term => response.toLowerCase().includes(term));
    
    if (!hasRecency) {
      issues.push('No hay indicadores de datos recientes');
    } else {
      score += 25;
    }

    // Check for source attribution
    const hasSourceAttribution = response.includes('según') || response.includes('fuente') || 
                                response.includes('reporta') || response.includes('indica');
    
    if (!hasSourceAttribution) {
      issues.push('Falta atribución de fuentes');
    } else {
      score += 25;
    }

    const validation: WebDataValidation = {
      hasWebReferences,
      hasSpecificData,
      hasRecency,
      hasSourceAttribution,
      score,
      issues
    };

    setLastValidation(validation);
    return validation;
  };

  return {
    validateResponse,
    lastValidation
  };
}
