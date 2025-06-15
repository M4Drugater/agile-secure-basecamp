
import { useState } from 'react';

interface WebDataValidation {
  hasWebReferences: boolean;
  hasSpecificData: boolean;
  hasRecency: boolean;
  hasSourceAttribution: boolean;
  hasQuantitativeData: boolean;
  score: number;
  issues: string[];
  passesValidation: boolean;
}

export function useWebDataValidator() {
  const [lastValidation, setLastValidation] = useState<WebDataValidation | null>(null);

  const validateResponse = (response: string, webData: any): WebDataValidation => {
    console.log('🔍 SISTEMA REPARADO - Validando respuesta web:', {
      responseLength: response.length,
      hasWebData: !!webData,
      webSources: webData?.sources?.length || 0
    });

    const issues: string[] = [];
    let score = 0;
    
    // Enhanced validation criteria
    
    // 1. Check for web data references (25 points)
    const hasWebReferences = webData?.sources?.some((source: string) => {
      const domain = source.toLowerCase().split('.')[0];
      return response.toLowerCase().includes(domain) || 
             response.toLowerCase().includes(source.toLowerCase()) ||
             response.toLowerCase().includes('según') ||
             response.toLowerCase().includes('fuente');
    }) || false;
    
    if (hasWebReferences) {
      score += 25;
      console.log('✅ Validación: Referencias web encontradas');
    } else {
      issues.push('Respuesta no referencia fuentes web específicas');
      console.log('❌ Validación: Sin referencias web');
    }

    // 2. Check for specific data points (25 points)
    const webContentWords = webData?.content ? 
      webData.content.toLowerCase().split(/\s+/).filter((word: string) => word.length > 4) : [];
    const responseWords = response.toLowerCase().split(/\s+/);
    const commonDataPoints = webContentWords.filter((word: string) => responseWords.includes(word));
    const hasSpecificData = commonDataPoints.length > 8 || 
                           response.includes('%') || 
                           response.includes('$') ||
                           /\b\d+\b/.test(response); // Contains numbers
    
    if (hasSpecificData) {
      score += 25;
      console.log('✅ Validación: Datos específicos encontrados');
    } else {
      issues.push('Respuesta carece de datos específicos del web search');
      console.log('❌ Validación: Sin datos específicos');
    }

    // 3. Check for recency indicators (20 points)
    const recencyTerms = [
      '2024', '2025', 'reciente', 'actual', 'último', 'hoy',
      'según datos actuales', 'datos web actuales', 'información actual',
      'recientemente', 'actualmente', 'en la actualidad'
    ];
    const hasRecency = recencyTerms.some(term => 
      response.toLowerCase().includes(term.toLowerCase())
    );
    
    if (hasRecency) {
      score += 20;
      console.log('✅ Validación: Indicadores de actualidad encontrados');
    } else {
      issues.push('Respuesta no indica uso de datos actuales');
      console.log('❌ Validación: Sin indicadores de actualidad');
    }

    // 4. Check for source attribution (15 points)
    const attributionTerms = [
      'según', 'fuente', 'reporta', 'indica', 'datos de',
      'información de', 'basado en', 'de acuerdo con'
    ];
    const hasSourceAttribution = attributionTerms.some(term => 
      response.toLowerCase().includes(term.toLowerCase())
    );
    
    if (hasSourceAttribution) {
      score += 15;
      console.log('✅ Validación: Atribución de fuentes encontrada');
    } else {
      issues.push('Respuesta carece de atribución de fuentes');
      console.log('❌ Validación: Sin atribución de fuentes');
    }

    // 5. Check for quantitative data (15 points)
    const quantitativePatterns = [
      /\b\d+[\.,]?\d*\s*%/g, // Percentages
      /\$\s*\d+/g, // Dollar amounts
      /\b\d+[\.,]?\d*\s*(millones?|billions?|mil)/g, // Large numbers
      /\b\d{4}\b/g, // Years
      /\b\d+[\.,]?\d*\s*(usuarios?|clientes?|empleados?)/g // User/customer counts
    ];
    
    const hasQuantitativeData = quantitativePatterns.some(pattern => 
      pattern.test(response)
    );
    
    if (hasQuantitativeData) {
      score += 15;
      console.log('✅ Validación: Datos cuantitativos encontrados');
    } else {
      issues.push('Respuesta carece de datos cuantitativos específicos');
      console.log('❌ Validación: Sin datos cuantitativos');
    }

    // Determine if validation passes (minimum 60% required)
    const passesValidation = score >= 60;

    const validation: WebDataValidation = {
      hasWebReferences,
      hasSpecificData,
      hasRecency,
      hasSourceAttribution,
      hasQuantitativeData,
      score,
      issues,
      passesValidation
    };

    console.log('🔍 SISTEMA REPARADO - Resultado de validación:', {
      score,
      passesValidation,
      issuesCount: issues.length,
      webDataAvailable: !!webData?.content
    });

    setLastValidation(validation);
    return validation;
  };

  const getValidationSummary = () => {
    if (!lastValidation) return null;
    
    return {
      score: lastValidation.score,
      status: lastValidation.passesValidation ? 'success' : 'warning',
      issues: lastValidation.issues,
      recommendation: lastValidation.passesValidation ? 
        'Respuesta validada con datos web' : 
        'Respuesta necesita mejorar uso de datos web'
    };
  };

  return {
    validateResponse,
    lastValidation,
    getValidationSummary
  };
}
