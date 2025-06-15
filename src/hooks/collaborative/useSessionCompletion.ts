
import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useIntelligentOutputs } from '@/hooks/competitive-intelligence/useIntelligentOutputs';
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

  const detectSessionCompletion = async (sessionMetrics: SessionMetrics) => {
    // Detectar finalización basada en múltiples criterios
    const isComplete = 
      sessionMetrics.sessionProgress >= 100 ||
      (sessionMetrics.consensusLevel >= 85 && 
       sessionMetrics.collaborationScore >= 80 && 
       sessionMetrics.completedTasks >= 5);

    if (isComplete && !hasBeenCompleted && !isGeneratingResults) {
      console.log('🎯 Sesión completa detectada, generando resultados finales...');
      await generateFinalResults(sessionMetrics);
    }
  };

  const generateFinalResults = async (sessionMetrics: SessionMetrics) => {
    if (!user || isGeneratingResults) return;

    try {
      setIsGeneratingResults(true);
      console.log('📊 Iniciando generación de resultados finales...');

      // 1. Generar outputs específicos por agente
      const agentOutputs: Record<string, any> = {};
      
      for (const agent of selectedAgents) {
        console.log(`🤖 Generando output para agente: ${agent.name}`);
        
        const agentOutput = await generateAgentSpecificOutput(agent, sessionMetrics);
        agentOutputs[agent.id] = agentOutput;
      }

      // 2. Generar síntesis colaborativa final
      console.log('🔄 Generando síntesis colaborativa...');
      const synthesisReport = await generateCollaborativeSynthesis(agentOutputs, sessionMetrics);

      // 3. Generar plan de acción ejecutivo
      console.log('📋 Generando plan de acción...');
      const actionPlan = await generateExecutiveActionPlan(synthesisReport, sessionMetrics);

      // 4. Crear reporte final unificado
      const finalReport = await generateUnifiedReport({
        agentOutputs,
        synthesisReport,
        actionPlan,
        sessionMetrics
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

      // 5. Guardar resultados en la base de datos
      await saveCompletionResults(results);

      console.log('✅ Resultados finales generados exitosamente');

    } catch (error) {
      console.error('❌ Error generando resultados finales:', error);
    } finally {
      setIsGeneratingResults(false);
    }
  };

  const generateAgentSpecificOutput = async (agent: AgentConfig, sessionMetrics: SessionMetrics) => {
    const outputTypes = {
      'cdv': 'competitive_brief',
      'cir': 'market_analysis', 
      'cia': 'strategic_report',
      'clipogino': 'strategic_report'
    } as const;

    const outputType = outputTypes[agent.id as keyof typeof outputTypes] || 'strategic_report';

    return await generateOutput({
      sessionId,
      outputType,
      title: `Reporte Final - ${agent.name}`,
      sessionData: {
        company_name: 'Empresa Analizada',
        industry: 'Industria de Enfoque',
        objectives: 'Análisis Competitivo Completo'
      },
      collaborationData: [{
        interaction_type: 'final_synthesis',
        interaction_data: {
          agent: agent.id,
          metrics: sessionMetrics,
          finalStage: true
        }
      }],
      agentInsights: {
        [agent.id]: {
          insights: [
            { title: `Análisis completo de ${agent.name}`, confidence: 95 },
            { title: 'Recomendaciones estratégicas', confidence: 90 },
            { title: 'Perspectivas de mercado', confidence: 88 }
          ],
          recommendations: [
            'Implementar estrategia competitiva identificada',
            'Monitorear métricas clave del mercado',
            'Desarrollar ventajas competitivas sostenibles'
          ]
        }
      }
    });
  };

  const generateCollaborativeSynthesis = async (agentOutputs: Record<string, any>, sessionMetrics: SessionMetrics) => {
    return await generateOutput({
      sessionId,
      outputType: 'strategic_report',
      title: 'Síntesis Colaborativa Final',
      sessionData: {
        company_name: 'Análisis Colaborativo',
        industry: 'Multi-Agente',
        objectives: 'Síntesis de Perspectivas Integradas'
      },
      collaborationData: Object.entries(agentOutputs).map(([agentId, output]) => ({
        interaction_type: 'synthesis_integration',
        interaction_data: {
          agentId,
          outputId: output.id,
          contributions: output.insights_generated?.length || 0
        }
      })),
      agentInsights: {
        synthesis: {
          insights: [
            { title: 'Consenso entre agentes alcanzado', confidence: sessionMetrics.consensusLevel },
            { title: 'Síntesis de recomendaciones estratégicas', confidence: 92 },
            { title: 'Perspectiva holística del mercado', confidence: 89 }
          ],
          collaborationMetrics: sessionMetrics
        }
      }
    });
  };

  const generateExecutiveActionPlan = async (synthesisReport: any, sessionMetrics: SessionMetrics) => {
    return await generateOutput({
      sessionId,
      outputType: 'action_plan',
      title: 'Plan de Acción Ejecutivo',
      sessionData: {
        company_name: 'Implementación Estratégica',
        industry: 'Ejecución',
        objectives: 'Acciones Prioritarias y Timeline'
      },
      collaborationData: [{
        interaction_type: 'action_planning',
        interaction_data: {
          synthesisId: synthesisReport.id,
          priorityLevel: 'executive',
          timeframe: 'immediate'
        }
      }],
      agentInsights: {
        actionPlanning: {
          insights: [
            { title: 'Acciones inmediatas identificadas', confidence: 94 },
            { title: 'Roadmap estratégico definido', confidence: 91 },
            { title: 'Métricas de seguimiento establecidas', confidence: 87 }
          ],
          executiveSummary: 'Plan de acción basado en análisis colaborativo completo'
        }
      }
    });
  };

  const generateUnifiedReport = async (data: {
    agentOutputs: Record<string, any>;
    synthesisReport: any;
    actionPlan: any;
    sessionMetrics: SessionMetrics;
  }) => {
    return await generateOutput({
      sessionId,
      outputType: 'strategic_report',
      title: 'Reporte Ejecutivo Final - Análisis Colaborativo',
      sessionData: {
        company_name: 'Reporte Unificado',
        industry: 'Análisis Integral',
        objectives: 'Documento Ejecutivo Completo'
      },
      collaborationData: [{
        interaction_type: 'final_report_generation',
        interaction_data: {
          agentCount: Object.keys(data.agentOutputs).length,
          synthesisId: data.synthesisReport.id,
          actionPlanId: data.actionPlan.id,
          sessionMetrics: data.sessionMetrics
        }
      }],
      agentInsights: {
        finalReport: {
          insights: [
            { title: 'Análisis colaborativo completado exitosamente', confidence: 96 },
            { title: 'Consenso estratégico alcanzado', confidence: data.sessionMetrics.consensusLevel },
            { title: 'Plan de implementación definido', confidence: 93 }
          ],
          executiveOverview: 'Reporte final que integra todas las perspectivas de agentes especializados'
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
          agent_outputs: results.agentOutputs
        },
        status: 'completed'
      });

      console.log('💾 Resultados de finalización guardados en la base de datos');
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
