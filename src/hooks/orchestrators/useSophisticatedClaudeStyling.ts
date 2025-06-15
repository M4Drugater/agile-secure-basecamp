
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StylingResults {
  content: string;
  metadata: {
    qualityMetrics: {
      overallQuality: number;
      executiveReadiness: number;
      strategicDepth: number;
      dataIntegration: number;
      actionability: number;
    };
    stylingApproach: string;
    processingTime: number;
  };
}

export function useSophisticatedClaudeStyling() {
  const { user } = useAuth();
  const [isStyling, setIsStyling] = useState(false);

  const executeAdvancedStyling = async (
    content: string,
    researchResults: any,
    userProfile: any,
    agentType: string
  ): Promise<StylingResults> => {
    if (!user) throw new Error('User authentication required');

    setIsStyling(true);
    const startTime = Date.now();

    try {
      console.log('✨ LAIGENT Claude Styling - Advanced execution');

      // Call the multi-LLM engine for sophisticated styling
      const { data, error } = await supabase.functions.invoke('elite-multi-llm-engine', {
        body: {
          messages: [
            {
              role: 'system',
              content: `You are Claude, an elite content stylist. Transform the provided research content into executive-grade strategic intelligence.

Styling Parameters:
- Agent Type: ${agentType}
- Management Level: ${userProfile?.managementLevel || 'senior'}
- Communication Style: ${userProfile?.communicationPreferences?.formality || 'executive'}
- Industry Focus: ${userProfile?.industryExpertise?.join(', ') || 'technology'}

Transform the content with:
1. Executive-level strategic framing
2. Data-driven insights integration
3. Actionable recommendations
4. Professional tone and structure
5. Clear executive summary and key findings`
            },
            {
              role: 'user',
              content: `Transform this research content into executive-grade strategic intelligence:

RESEARCH CONTENT:
${content}

RESEARCH SOURCES: ${JSON.stringify(researchResults.sources || [])}

Please provide a comprehensive, executive-ready analysis with clear strategic insights and actionable recommendations.`
            }
          ],
          model: 'claude-3-5-sonnet-20241022',
          userId: user.id,
          contextLevel: 'elite'
        }
      });

      if (error) throw error;

      const styledContent = data?.response || content;
      const processingTime = Date.now() - startTime;

      // Calculate quality metrics
      const qualityMetrics = calculateQualityMetrics(styledContent, researchResults, userProfile);

      console.log('✅ Claude styling completed:', {
        qualityScore: qualityMetrics.overallQuality,
        processingTime,
        executiveReadiness: qualityMetrics.executiveReadiness
      });

      return {
        content: styledContent,
        metadata: {
          qualityMetrics,
          stylingApproach: 'claude-executive-transformation',
          processingTime
        }
      };

    } catch (error) {
      console.error('❌ Claude styling error:', error);
      throw error;
    } finally {
      setIsStyling(false);
    }
  };

  const calculateQualityMetrics = (content: string, research: any, profile: any) => {
    // Advanced quality assessment
    const executiveReadiness = assessExecutiveReadiness(content);
    const strategicDepth = assessStrategicDepth(content);
    const dataIntegration = assessDataIntegration(content, research);
    const actionability = assessActionability(content);

    const overallQuality = (executiveReadiness + strategicDepth + dataIntegration + actionability) / 4;

    return {
      overallQuality,
      executiveReadiness,
      strategicDepth,
      dataIntegration,
      actionability
    };
  };

  const assessExecutiveReadiness = (content: string): number => {
    const executiveIndicators = [
      'executive summary',
      'strategic implications',
      'key findings',
      'recommendations',
      'action items'
    ];
    
    const matches = executiveIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;
    
    return Math.min(matches / executiveIndicators.length + 0.3, 1.0);
  };

  const assessStrategicDepth = (content: string): number => {
    const strategicKeywords = [
      'competitive advantage',
      'market position',
      'strategic',
      'opportunity',
      'threat',
      'trend'
    ];
    
    const density = strategicKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length / content.split(' ').length * 100;
    
    return Math.min(density * 10, 1.0);
  };

  const assessDataIntegration = (content: string, research: any): number => {
    const sourcesReferenced = (research?.sources?.length || 0) > 0 ? 0.5 : 0;
    const dataPoints = (content.match(/\d+%|\$\d+|\d+\.\d+/g) || []).length;
    
    return Math.min(sourcesReferenced + (dataPoints * 0.1), 1.0);
  };

  const assessActionability = (content: string): number => {
    const actionIndicators = [
      'recommend',
      'should',
      'implement',
      'action',
      'next steps',
      'priority'
    ];
    
    const matches = actionIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;
    
    return Math.min(matches / actionIndicators.length + 0.2, 1.0);
  };

  return {
    executeAdvancedStyling,
    isStyling
  };
}
