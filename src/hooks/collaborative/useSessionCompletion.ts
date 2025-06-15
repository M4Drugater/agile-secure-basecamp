import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useIntelligentOutputs } from '@/hooks/competitive-intelligence/useIntelligentOutputs';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { useElitePromptEngine } from '@/hooks/prompts/useElitePromptEngine';
import { AgentConfig } from '@/components/agents/UnifiedAgentWorkspace';

interface CompletionResults {
  sessionId: string;
  finalReport: any;
  agentOutputs: Record<string, any>;
  synthesisReport: any;
  actionPlan: any;
  completedAt: Date;
}

interface SessionMetrics {
  sessionProgress: number;
  totalInteractions: number;
  consensusLevel: number;
  activeAgents: number;
  completedTasks: number;
  pendingTasks: number;
  averageResponseTime: number;
  collaborationScore: number;
}

export function useSessionCompletion(sessionId: string, selectedAgents: AgentConfig[]) {
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);
  const [completionResults, setCompletionResults] = useState<CompletionResults | null>(null);
  const [hasBeenCompleted, setHasBeenCompleted] = useState(false);
  const { supabase, user } = useSupabase();
  const { generateOutput } = useIntelligentOutputs();
  const { buildFullContextString, getContextSummary } = useContextBuilder();
  const { buildEliteSystemPrompt } = useElitePromptEngine();

  const detectSessionCompletion = async (sessionMetrics: SessionMetrics) => {
    // Detectar finalización basada en múltiples criterios
    const isComplete = 
      sessionMetrics.sessionProgress >= 100 ||
      (sessionMetrics.consensusLevel >= 85 && 
       sessionMetrics.collaborationScore >= 80 && 
       sessionMetrics.completedTasks >= 5);

    if (isComplete && !hasBeenCompleted && !isGeneratingResults) {
      console.log('🎯 Sesión completa detectada, generando resultados finales personalizados...');
      await generateFinalResults(sessionMetrics);
    }
  };

  const generateFinalResults = async (sessionMetrics: SessionMetrics) => {
    if (!user || isGeneratingResults) return;

    try {
      setIsGeneratingResults(true);
      console.log('📊 Iniciando generación de resultados finales personalizados...');

      // 1. Construir contexto completo del usuario
      const fullUserContext = await buildFullContextString('session completion');
      const contextSummary = getContextSummary();

      console.log('🔍 Contexto personalizado construido:', {
        hasProfile: contextSummary.hasProfile,
        knowledgeCount: contextSummary.knowledgeCount,
        contentCount: contextSummary.contentCount
      });

      // 2. Generar outputs específicos por agente con contexto personalizado
      const agentOutputs: Record<string, any> = {};
      
      for (const agent of selectedAgents) {
        console.log(`🤖 Generando output personalizado para agente: ${agent.name}`);
        
        const agentOutput = await generatePersonalizedAgentOutput(
          agent, 
          sessionMetrics, 
          fullUserContext,
          contextSummary
        );
        agentOutputs[agent.id] = agentOutput;
      }

      // 3. Generar síntesis colaborativa personalizada
      console.log('🔄 Generando síntesis colaborativa personalizada...');
      const synthesisReport = await generatePersonalizedSynthesis(
        agentOutputs, 
        sessionMetrics, 
        fullUserContext,
        contextSummary
      );

      // 4. Generar plan de acción ejecutivo personalizado
      console.log('📋 Generando plan de acción personalizado...');
      const actionPlan = await generatePersonalizedActionPlan(
        synthesisReport, 
        sessionMetrics, 
        fullUserContext,
        contextSummary
      );

      // 5. Crear reporte final unificado personalizado
      const finalReport = await generatePersonalizedFinalReport({
        agentOutputs,
        synthesisReport,
        actionPlan,
        sessionMetrics,
        fullUserContext,
        contextSummary
      });

      const results: CompletionResults = {
        sessionId,
        finalReport,
        agentOutputs,
        synthesisReport,
        actionPlan,
        completedAt: new Date()
      };

      setCompletionResults(results);
      setHasBeenCompleted(true);

      // 6. Guardar resultados en la base de datos
      await saveCompletionResults(results);

      console.log('✅ Resultados finales personalizados generados exitosamente');

    } catch (error) {
      console.error('❌ Error generando resultados finales personalizados:', error);
    } finally {
      setIsGeneratingResults(false);
    }
  };

  const generatePersonalizedAgentOutput = async (
    agent: AgentConfig, 
    sessionMetrics: SessionMetrics,
    fullUserContext: string,
    contextSummary: any
  ) => {
    const outputTypes = {
      'cdv': 'competitive_brief',
      'cir': 'market_analysis', 
      'cia': 'strategic_report',
      'clipogino': 'strategic_report'
    } as const;

    const outputType = outputTypes[agent.id as keyof typeof outputTypes] || 'strategic_report';

    // Construir prompt personalizado para el agente
    const systemPrompt = await buildEliteSystemPrompt({
      agentType: agent.id as 'clipogino' | 'cdv' | 'cir' | 'cia',
      currentPage: '/unified-agents',
      analysisDepth: 'comprehensive',
      outputFormat: 'executive',
      contextLevel: 'elite'
    });

    return await generateOutput({
      sessionId,
      outputType,
      title: `Reporte Final Personalizado - ${agent.name}`,
      sessionData: {
        company_name: 'Análisis Personalizado',
        industry: 'Basado en tu Perfil',
        objectives: 'Resultados Específicos para tu Contexto'
      },
      collaborationData: [{
        interaction_type: 'personalized_final_output',
        interaction_data: {
          agent: agent.id,
          metrics: sessionMetrics,
          contextQuality: contextSummary.quality,
          personalizationLevel: 'high',
          userProfile: contextSummary.hasProfile,
          knowledgeAssets: contextSummary.knowledgeCount
        }
      }],
      agentInsights: {
        [agent.id]: {
          insights: [
            { title: `Análisis personalizado de ${agent.name} basado en tu perfil`, confidence: 95 },
            { title: 'Recomendaciones específicas para tu industria y rol', confidence: 92 },
            { title: 'Estrategias adaptadas a tu experiencia y objetivos', confidence: 90 }
          ],
          recommendations: [
            'Implementar estrategias alineadas con tu perfil profesional',
            'Aprovechar tu base de conocimiento existente',
            'Desarrollar capacidades específicas para tus objetivos'
          ],
          personalizationData: {
            contextUsed: fullUserContext.length > 0,
            profileIntegrated: contextSummary.hasProfile,
            knowledgeApplied: contextSummary.knowledgeCount > 0
          }
        }
      }
    });
  };

  const generatePersonalizedSynthesis = async (
    agentOutputs: Record<string, any>, 
    sessionMetrics: SessionMetrics,
    fullUserContext: string,
    contextSummary: any
  ) => {
    return await generateOutput({
      sessionId,
      outputType: 'strategic_report',
      title: 'Síntesis Colaborativa Personalizada',
      sessionData: {
        company_name: 'Tu Perfil Profesional',
        industry: 'Análisis Integrado Personalizado',
        objectives: 'Síntesis Adaptada a tu Contexto'
      },
      collaborationData: Object.entries(agentOutputs).map(([agentId, output]) => ({
        interaction_type: 'personalized_synthesis',
        interaction_data: {
          agentId,
          outputId: output.id,
          personalizationLevel: 'high',
          contextIntegration: true,
          contributions: output.insights_generated?.length || 0
        }
      })),
      agentInsights: {
        personalizedSynthesis: {
          insights: [
            { title: 'Consenso personalizado entre agentes alcanzado', confidence: sessionMetrics.consensusLevel },
            { title: 'Síntesis adaptada a tu perfil y objetivos profesionales', confidence: 94 },
            { title: 'Recomendaciones específicas basadas en tu experiencia', confidence: 91 }
          ],
          collaborationMetrics: sessionMetrics,
          personalizationMetrics: {
            profileUtilization: contextSummary.hasProfile ? 100 : 0,
            knowledgeIntegration: Math.min(100, contextSummary.knowledgeCount * 20),
            contextQuality: contextSummary.quality
          }
        }
      }
    });
  };

  const generatePersonalizedActionPlan = async (
    synthesisReport: any, 
    sessionMetrics: SessionMetrics,
    fullUserContext: string,
    contextSummary: any
  ) => {
    return await generateOutput({
      sessionId,
      outputType: 'action_plan',
      title: 'Plan de Acción Ejecutivo Personalizado',
      sessionData: {
        company_name: 'Tu Desarrollo Profesional',
        industry: 'Implementación Personalizada',
        objectives: 'Acciones Específicas para tu Perfil'
      },
      collaborationData: [{
        interaction_type: 'personalized_action_planning',
        interaction_data: {
          synthesisId: synthesisReport.id,
          priorityLevel: 'executive',
          timeframe: 'immediate',
          personalizationLevel: 'high',
          profileBased: contextSummary.hasProfile
        }
      }],
      agentInsights: {
        personalizedActionPlanning: {
          insights: [
            { title: 'Acciones inmediatas adaptadas a tu rol y experiencia', confidence: 96 },
            { title: 'Roadmap estratégico basado en tu perfil profesional', confidence: 93 },
            { title: 'Métricas personalizadas para tu contexto específico', confidence: 89 }
          ],
          executiveSummary: 'Plan de acción personalizado basado en análisis colaborativo y tu perfil único',
          personalizationFeatures: {
            roleSpecific: true,
            industryFocused: true,
            experienceBased: true,
            goalOriented: true
          }
        }
      }
    });
  };

  const generatePersonalizedFinalReport = async (data: {
    agentOutputs: Record<string, any>;
    synthesisReport: any;
    actionPlan: any;
    sessionMetrics: SessionMetrics;
    fullUserContext: string;
    contextSummary: any;
  }) => {
    return await generateOutput({
      sessionId,
      outputType: 'strategic_report',
      title: 'Reporte Ejecutivo Final - Análisis Colaborativo Personalizado',
      sessionData: {
        company_name: 'Tu Perfil Ejecutivo',
        industry: 'Análisis Integral Personalizado',
        objectives: 'Documento Ejecutivo Adaptado a tu Contexto'
      },
      collaborationData: [{
        interaction_type: 'personalized_final_report',
        interaction_data: {
          agentCount: Object.keys(data.agentOutputs).length,
          synthesisId: data.synthesisReport.id,
          actionPlanId: data.actionPlan.id,
          sessionMetrics: data.sessionMetrics,
          personalizationLevel: 'elite',
          contextQuality: data.contextSummary.quality,
          profileIntegration: data.contextSummary.hasProfile
        }
      }],
      agentInsights: {
        personalizedFinalReport: {
          insights: [
            { title: 'Análisis colaborativo personalizado completado exitosamente', confidence: 98 },
            { title: 'Consenso estratégico adaptado a tu perfil profesional', confidence: data.sessionMetrics.consensusLevel },
            { title: 'Plan de implementación específico para tu contexto', confidence: 95 }
          ],
          executiveOverview: 'Reporte final que integra todas las perspectivas de agentes especializados con tu información personal y profesional única',
          personalizationSummary: {
            profileUtilized: data.contextSummary.hasProfile,
            knowledgeIntegrated: data.contextSummary.knowledgeCount,
            contextQuality: data.contextSummary.quality,
            customization: 'elite'
          }
        }
      }
    });
  };

  const saveCompletionResults = async (results: CompletionResults) => {
    if (!supabase || !user) return;

    try {
      // Guardar metadatos de finalización en la tabla de intelligent_outputs
      await supabase.from('intelligent_outputs').insert({
        session_id: sessionId,
        user_id: user.id,
        output_type: 'session_completion',
        title: 'Resultados de Sesión Colaborativa Completada',
        content: JSON.stringify({
          final_report_id: results.finalReport.id,
          synthesis_report_id: results.synthesisReport.id,
          action_plan_id: results.actionPlan.id,
          completed_at: results.completedAt.toISOString()
        }),
        metadata: {
          agentCount: selectedAgents.length,
          completionTrigger: 'automatic',
          outputsGenerated: Object.keys(results.agentOutputs).length + 3,
          agent_outputs: results.agentOutputs,
          personalizationLevel: 'elite'
        },
        status: 'completed'
      });

      console.log('💾 Resultados de finalización personalizados guardados en la base de datos');
    } catch (error) {
      console.error('Error guardando resultados de finalización:', error);
    }
  };

  const resetCompletion = () => {
    setCompletionResults(null);
    setHasBeenCompleted(false);
  };

  return {
    isGeneratingResults,
    completionResults,
    hasBeenCompleted,
    detectSessionCompletion,
    generateFinalResults,
    resetCompletion
  };
}
