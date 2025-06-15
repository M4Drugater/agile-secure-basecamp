
import { useState } from 'react';
import { useTripartiteAIFlow } from './useTripartiteAIFlow';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AdvancedTripartiteConfig {
  enableOpenAIInterpretation: boolean;
  enablePerplexitySearch: boolean;
  enableClaudeStyled: boolean;
  fallbackMode: 'graceful' | 'strict';
  qualityThreshold: number;
}

interface AdvancedTripartiteRequest {
  userQuery: string;
  agentType: 'clipogino' | 'cdv' | 'cir' | 'cia' | 'research-engine' | 'enhanced-content-generator';
  sessionConfig?: any;
  config?: Partial<AdvancedTripartiteConfig>;
}

export function useAdvancedTripartiteFlow() {
  const { user } = useAuth();
  const { executeTripartiteFlow, isProcessing, currentStep } = useTripartiteAIFlow();
  const [flowMetrics, setFlowMetrics] = useState<any>(null);

  const defaultConfig: AdvancedTripartiteConfig = {
    enableOpenAIInterpretation: true,
    enablePerplexitySearch: true,
    enableClaudeStyled: true,
    fallbackMode: 'graceful',
    qualityThreshold: 0.7
  };

  const executeAdvancedFlow = async (request: AdvancedTripartiteRequest) => {
    if (!user) {
      throw new Error('Authentication required for advanced tripartite flow');
    }

    const config = { ...defaultConfig, ...request.config };
    
    console.log('🚀 SISTEMA TRIPARTITO AVANZADO - Iniciando:', {
      query: request.userQuery,
      agent: request.agentType,
      config,
      user: user.email
    });

    try {
      // Validar configuración
      if (!config.enableOpenAIInterpretation && !config.enablePerplexitySearch && !config.enableClaudeStyled) {
        throw new Error('Al menos un motor AI debe estar habilitado');
      }

      // Ejecutar flujo tripartito
      const result = await executeTripartiteFlow({
        userQuery: request.userQuery,
        agentType: request.agentType,
        sessionConfig: request.sessionConfig,
        contextLevel: 'elite'
      });

      // Evaluar calidad de respuesta
      const qualityScore = evaluateResponseQuality(result);
      
      console.log('📊 EVALUACIÓN DE CALIDAD:', {
        score: qualityScore,
        threshold: config.qualityThreshold,
        status: result.status
      });

      // Aplicar umbral de calidad
      if (qualityScore < config.qualityThreshold && config.fallbackMode === 'strict') {
        throw new Error(`Calidad de respuesta por debajo del umbral: ${qualityScore} < ${config.qualityThreshold}`);
      }

      // Actualizar métricas
      setFlowMetrics({
        qualityScore,
        processingTime: result.metadata.processingTime,
        totalCost: result.metadata.totalCost,
        confidenceScore: result.metadata.confidenceScore,
        webSourcesCount: result.metadata.webSources.length,
        timestamp: new Date().toISOString()
      });

      // Notificación de éxito con métricas
      toast.success('Flujo Tripartito Avanzado Completado', {
        description: `Calidad: ${Math.round(qualityScore * 100)}% | Confianza: ${Math.round(result.metadata.confidenceScore * 100)}% | Fuentes: ${result.metadata.webSources.length}`
      });

      return {
        ...result,
        qualityScore,
        advancedMetrics: {
          qualityScore,
          passesThreshold: qualityScore >= config.qualityThreshold,
          configUsed: config,
          flowCompleted: true
        }
      };

    } catch (error) {
      console.error('❌ SISTEMA TRIPARTITO AVANZADO - Error:', error);
      
      if (config.fallbackMode === 'graceful') {
        toast.warning('Flujo Avanzado con Respaldo', {
          description: 'Algunos componentes fallaron, pero se proporciona respuesta alternativa'
        });
        
        // Respuesta de respaldo con análisis básico
        return {
          finalResponse: `Sistema Tripartito Avanzado - Modo Respaldo Activado

**Error detectado**: ${error instanceof Error ? error.message : 'Error desconocido'}

**Análisis Disponible**: Aunque el flujo completo no se pudo completar, puedo proporcionar análisis estratégico basado en:

1. **Metodologías de Consultoría**: Frameworks McKinsey, BCG, Porter
2. **Análisis Estratégico**: FODA, análisis competitivo, evaluación de mercado
3. **Recomendaciones**: Basadas en mejores prácticas del sector

**Consulta Original**: ${request.userQuery}

Para obtener el análisis web completo con datos en tiempo real, intenta de nuevo en unos momentos.`,
          metadata: {
            openaiInterpretation: '',
            perplexitySearchResults: null,
            claudeStyledContent: '',
            totalTokens: 0,
            totalCost: '0.000000',
            webSources: [],
            confidenceScore: 0.4,
            processingTime: 0
          },
          status: 'partial' as const,
          qualityScore: 0.4,
          advancedMetrics: {
            qualityScore: 0.4,
            passesThreshold: false,
            configUsed: config,
            flowCompleted: false
          }
        };
      } else {
        throw error;
      }
    }
  };

  const evaluateResponseQuality = (result: any): number => {
    let score = 0.0;
    
    // Calidad base según status
    switch (result.status) {
      case 'success':
        score += 0.4;
        break;
      case 'partial':
        score += 0.2;
        break;
      case 'failed':
        score += 0.0;
        break;
    }
    
    // Puntuación por datos web
    if (result.metadata.webSources.length > 0) {
      score += 0.2;
    }
    
    // Puntuación por confianza
    score += result.metadata.confidenceScore * 0.2;
    
    // Puntuación por longitud de respuesta
    if (result.finalResponse.length > 200) {
      score += 0.1;
    }
    
    // Puntuación por datos específicos
    if (result.finalResponse.includes('%') || result.finalResponse.includes('$') || /\b\d+\b/.test(result.finalResponse)) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  };

  const getFlowStatus = () => ({
    isProcessing,
    currentStep,
    lastMetrics: flowMetrics
  });

  return {
    executeAdvancedFlow,
    getFlowStatus,
    flowMetrics
  };
}
