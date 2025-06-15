
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ResearchVector {
  primary: string;
  secondary: string[];
  supplementary: string[];
  contextual: string[];
}

interface SourceQualityStandards {
  minimumDomainAuthority: number;
  requiredRecency: string; // 'day' | 'week' | 'month' | 'quarter'
  preferredSources: string[];
  excludedDomains: string[];
  factCheckRequirement: boolean;
}

interface ResearchConfiguration {
  depth: 'surface' | 'standard' | 'deep' | 'comprehensive';
  timeframe: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
  industryFocus: string[];
  geographicScope: string[];
  languagePreference: string[];
}

export function useEnhancedPerplexityResearch() {
  const { user } = useAuth();
  const [isResearching, setIsResearching] = useState(false);
  const [researchMetrics, setResearchMetrics] = useState<any>(null);

  const executeAdvancedResearch = async (
    query: string,
    agentType: string,
    configuration: ResearchConfiguration
  ) => {
    if (!user) throw new Error('User authentication required');

    setIsResearching(true);
    console.log('🔍 LAIGENT Perplexity Research - Enhanced execution');

    try {
      // 1. Multi-Vector Research Strategy
      const researchVectors = buildResearchVectors(query, agentType, configuration);

      // 2. Source Quality Standards
      const qualityStandards = defineQualityStandards(configuration);

      // 3. Execute Multi-Phase Research
      const researchResults = await executeMultiPhaseResearch(
        researchVectors,
        qualityStandards,
        configuration
      );

      // 4. Validate and Synthesize
      const synthesizedResults = await validateAndSynthesize(researchResults, qualityStandards);

      const metrics = {
        totalSources: researchResults.totalSources,
        qualityScore: synthesizedResults.qualityScore,
        confidenceLevel: synthesizedResults.confidenceLevel,
        researchDepth: configuration.depth,
        processingTime: synthesizedResults.processingTime
      };

      setResearchMetrics(metrics);

      console.log('✅ Enhanced research completed:', metrics);

      return {
        content: synthesizedResults.content,
        sources: synthesizedResults.sources,
        metadata: {
          researchVectors,
          qualityStandards,
          metrics,
          configuration
        }
      };

    } catch (error) {
      console.error('❌ Enhanced research error:', error);
      throw error;
    } finally {
      setIsResearching(false);
    }
  };

  const buildResearchVectors = (
    query: string,
    agentType: string,
    config: ResearchConfiguration
  ): ResearchVector => {
    // Build multi-dimensional research approach
    const baseKeywords = extractKeywords(query);
    const agentSpecificKeywords = getAgentSpecificKeywords(agentType);
    const industryKeywords = config.industryFocus.flatMap(industry => 
      getIndustryKeywords(industry)
    );

    return {
      primary: `${query} ${agentSpecificKeywords.join(' ')}`,
      secondary: baseKeywords.map(keyword => 
        `${keyword} ${config.industryFocus.join(' ')} analysis`
      ),
      supplementary: industryKeywords.map(keyword => 
        `${keyword} competitive landscape ${config.timeframe}`
      ),
      contextual: config.geographicScope.map(geo => 
        `${query} ${geo} market trends`
      )
    };
  };

  const defineQualityStandards = (config: ResearchConfiguration): SourceQualityStandards => {
    const depthStandards = {
      surface: { minDA: 30, recency: 'month', factCheck: false },
      standard: { minDA: 40, recency: 'week', factCheck: true },
      deep: { minDA: 50, recency: 'week', factCheck: true },
      comprehensive: { minDA: 60, recency: 'day', factCheck: true }
    };

    const standards = depthStandards[config.depth];

    return {
      minimumDomainAuthority: standards.minDA,
      requiredRecency: standards.recency,
      preferredSources: [
        'bloomberg.com', 'reuters.com', 'wsj.com', 'ft.com',
        'mckinsey.com', 'bcg.com', 'bain.com', 'pwc.com',
        'deloitte.com', 'ey.com', 'kpmg.com'
      ],
      excludedDomains: ['wikipedia.org', 'reddit.com', 'quora.com'],
      factCheckRequirement: standards.factCheck
    };
  };

  const executeMultiPhaseResearch = async (
    vectors: ResearchVector,
    quality: SourceQualityStandards,
    config: ResearchConfiguration
  ) => {
    const phases = [];

    // Phase 1: Primary Research
    console.log('📊 Research Phase 1: Primary vector');
    const primaryResults = await executePerplexitySearch(vectors.primary, quality, config);
    phases.push({ phase: 'primary', results: primaryResults });

    // Phase 2: Secondary Research (parallel)
    console.log('📊 Research Phase 2: Secondary vectors');
    const secondaryPromises = vectors.secondary.map(query => 
      executePerplexitySearch(query, quality, config)
    );
    const secondaryResults = await Promise.allSettled(secondaryPromises);
    phases.push({ phase: 'secondary', results: secondaryResults });

    // Phase 3: Supplementary Research (if deep/comprehensive)
    if (['deep', 'comprehensive'].includes(config.depth)) {
      console.log('📊 Research Phase 3: Supplementary vectors');
      const suppPromises = vectors.supplementary.slice(0, 3).map(query => 
        executePerplexitySearch(query, quality, config)
      );
      const suppResults = await Promise.allSettled(suppPromises);
      phases.push({ phase: 'supplementary', results: suppResults });
    }

    return {
      phases,
      totalSources: phases.reduce((acc, phase) => acc + countSources(phase.results), 0)
    };
  };

  const executePerplexitySearch = async (
    query: string,
    quality: SourceQualityStandards,
    config: ResearchConfiguration
  ) => {
    const { data, error } = await supabase.functions.invoke('elite-multi-llm-engine', {
      body: {
        messages: [
          {
            role: 'system',
            content: `You are an elite research analyst. Conduct comprehensive research with these quality standards:
            - Minimum domain authority: ${quality.minimumDomainAuthority}
            - Recency requirement: ${quality.requiredRecency}
            - Fact-checking: ${quality.factCheckRequirement ? 'Required' : 'Optional'}
            - Geographic scope: ${config.geographicScope.join(', ')}
            - Industry focus: ${config.industryFocus.join(', ')}
            
            Provide detailed, verifiable information with specific data points and sources.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        model: 'llama-3.1-sonar-large-128k-online',
        userId: user?.id,
        contextLevel: 'elite'
      }
    });

    if (error) throw error;
    return data;
  };

  const validateAndSynthesize = async (researchResults: any, quality: SourceQualityStandards) => {
    const startTime = Date.now();

    // Extract all content and sources
    const allContent = researchResults.phases.flatMap((phase: any) => 
      Array.isArray(phase.results) 
        ? phase.results.filter(r => r.status === 'fulfilled').map(r => r.value?.response)
        : [phase.results?.response]
    ).filter(Boolean);

    const allSources = extractAllSources(researchResults);

    // Quality validation
    const qualityScore = calculateQualityScore(allSources, quality);
    const confidenceLevel = calculateConfidenceLevel(allContent, allSources);

    // Synthesize content
    const synthesizedContent = await synthesizeContent(allContent);

    return {
      content: synthesizedContent,
      sources: allSources,
      qualityScore,
      confidenceLevel,
      processingTime: Date.now() - startTime
    };
  };

  // Helper functions
  const extractKeywords = (query: string): string[] => {
    return query.toLowerCase()
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5);
  };

  const getAgentSpecificKeywords = (agentType: string): string[] => {
    const agentKeywords = {
      'clipogino': ['strategic', 'leadership', 'executive', 'management'],
      'cdv': ['competitive', 'validation', 'discovery', 'market'],
      'cir': ['intelligence', 'research', 'analysis', 'data'],
      'cia': ['assessment', 'strategy', 'planning', 'insights']
    };
    
    return agentKeywords[agentType as keyof typeof agentKeywords] || [];
  };

  const getIndustryKeywords = (industry: string): string[] => {
    const industryMap = {
      'technology': ['tech', 'software', 'digital', 'innovation'],
      'finance': ['financial', 'banking', 'investment', 'capital'],
      'healthcare': ['medical', 'pharmaceutical', 'health', 'clinical'],
      'retail': ['consumer', 'commerce', 'sales', 'customer']
    };
    
    return industryMap[industry as keyof typeof industryMap] || [];
  };

  const countSources = (results: any): number => {
    if (Array.isArray(results)) {
      return results.filter(r => r.status === 'fulfilled').length;
    }
    return results ? 1 : 0;
  };

  const extractAllSources = (researchResults: any): string[] => {
    // Extract sources from all phases
    const sources: string[] = [];
    
    researchResults.phases.forEach((phase: any) => {
      if (Array.isArray(phase.results)) {
        phase.results.forEach((result: any) => {
          if (result.status === 'fulfilled' && result.value?.sources) {
            sources.push(...result.value.sources);
          }
        });
      } else if (phase.results?.sources) {
        sources.push(...phase.results.sources);
      }
    });
    
    return [...new Set(sources)]; // Remove duplicates
  };

  const calculateQualityScore = (sources: string[], quality: SourceQualityStandards): number => {
    if (sources.length === 0) return 0;
    
    const highQualitySources = sources.filter(source => 
      quality.preferredSources.some(preferred => source.includes(preferred))
    );
    
    return Math.min(highQualitySources.length / sources.length + 0.3, 1.0);
  };

  const calculateConfidenceLevel = (content: string[], sources: string[]): number => {
    const contentLength = content.join(' ').length;
    const sourceCount = sources.length;
    
    // Confidence based on content depth and source quantity
    const lengthScore = Math.min(contentLength / 5000, 0.5);
    const sourceScore = Math.min(sourceCount / 10, 0.5);
    
    return lengthScore + sourceScore;
  };

  const synthesizeContent = async (content: string[]): Promise<string> => {
    if (content.length === 1) return content[0];
    
    // Simple synthesis - in production, this could use another LLM call
    const combinedContent = content.join('\n\n--- RESEARCH SYNTHESIS ---\n\n');
    return `RESEARCH SYNTHESIS:\n\n${combinedContent}`;
  };

  return {
    executeAdvancedResearch,
    isResearching,
    researchMetrics
  };
}
