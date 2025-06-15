
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { useContentItems } from '@/hooks/useContentItems';
import { useUnifiedTripartiteSystem } from '@/hooks/tripartite/useUnifiedTripartiteSystem';
import { toast } from 'sonner';
import { ContentFormData } from '@/components/content/ContentGeneratorTypes';

interface GenerationMetrics {
  tokensUsed: number;
  generationTime: number;
  qualityScore: number;
  personalizedElements: number;
  tripartiteUsed: boolean;
  sources?: string[];
}

export function useUnifiedContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generationMetrics, setGenerationMetrics] = useState<GenerationMetrics | null>(null);
  
  const { supabase, user } = useSupabase();
  const { buildFullContextString, getContextSummary } = useContextBuilder();
  const { createContentItem } = useContentItems();
  const { executeTripartiteFlow, isProcessing } = useUnifiedTripartiteSystem();

  const handleGenerate = async (formData: ContentFormData, useTripartite: boolean = false) => {
    if (!user || !supabase) {
      toast.error('Please sign in to use the content generator');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();

    try {
      let result;
      let generationTime;
      let metrics: GenerationMetrics;

      if (useTripartite) {
        // Use tripartite system for enhanced content with web research
        console.log('🚀 Using tripartite system for content generation');
        
        const tripartiteResult = await executeTripartiteFlow({
          userQuery: buildTripartitePrompt(formData),
          agentType: 'enhanced-content-generator',
          contextLevel: 'elite',
          sessionConfig: {
            industry: formData.industry,
            targetAudience: formData.targetAudience,
            businessContext: formData.businessContext
          }
        });

        result = {
          content: tripartiteResult.finalResponse,
          usage: {
            totalTokens: tripartiteResult.metadata.totalTokens
          }
        };

        metrics = {
          tokensUsed: tripartiteResult.metadata.totalTokens,
          generationTime: tripartiteResult.metadata.processingTime,
          qualityScore: tripartiteResult.metadata.qualityScore * 100,
          personalizedElements: countPersonalizedElements(result.content, getContextSummary()),
          tripartiteUsed: true,
          sources: tripartiteResult.metadata.webSources
        };

      } else {
        // Use enhanced content generation with context
        const fullContext = await buildFullContextString(formData.topic);
        const contextSummary = getContextSummary();
        const enhancedPrompt = buildEnhancedPrompt(formData, fullContext, contextSummary);

        console.log('🚀 Using enhanced content generation with context');

        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: {
            type: formData.type,
            topic: enhancedPrompt,
            style: formData.style,
            length: formData.length,
            targetAudience: formData.targetAudience,
            businessContext: formData.businessContext,
            tone: formData.tone,
            industry: formData.industry,
            purpose: formData.purpose,
            model: formData.model,
            additionalInstructions: formData.customPrompt,
            enhancedGeneration: true,
            userContext: {
              hasProfile: contextSummary.hasProfile,
              knowledgeCount: contextSummary.knowledgeCount,
              contentCount: contextSummary.contentCount,
              conversationCount: contextSummary.conversationCount
            }
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        result = data;
        generationTime = Date.now() - startTime;
        
        metrics = {
          tokensUsed: data.usage?.totalTokens || 0,
          generationTime,
          qualityScore: calculateQualityScore(data),
          personalizedElements: countPersonalizedElements(data.content, contextSummary),
          tripartiteUsed: false
        };
      }

      setGeneratedContent(result.content);
      setGenerationMetrics(metrics);

      // Auto-save to content library
      try {
        const formDataPlain = {
          type: formData.type,
          topic: formData.topic,
          style: formData.style,
          length: formData.length,
          model: formData.model,
          customPrompt: formData.customPrompt || '',
          targetAudience: formData.targetAudience || '',
          businessContext: formData.businessContext || '',
          useKnowledge: formData.useKnowledge || false,
          tone: formData.tone || '',
          industry: formData.industry || '',
          purpose: formData.purpose || ''
        };

        await createContentItem.mutateAsync({
          title: generateContentTitle(formData),
          content: result.content,
          content_type: mapContentType(formData.type),
          status: 'draft',
          tags: generateTags(formData, useTripartite),
          metadata: {
            generatedBy: useTripartite ? 'unified-tripartite' : 'unified-studio',
            formData: formDataPlain,
            metrics,
            tripartiteMetadata: useTripartite ? {
              sources: metrics.sources || [],
              qualityScore: metrics.qualityScore
            } : undefined
          }
        });
        
        toast.success(`Content generated${useTripartite ? ' with web research' : ''} and saved to library!`);
      } catch (saveError) {
        console.error('Failed to save content:', saveError);
        toast.success('Content generated successfully!');
        toast.error('Failed to save to library, but content is available above');
      }

    } catch (error) {
      console.error('Content generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const buildTripartitePrompt = (formData: ContentFormData): string => {
    return `Create ${formData.type.replace('-', ' ')} content about: ${formData.topic}

Target Audience: ${formData.targetAudience?.replace('-', ' ')}
Industry: ${formData.industry}
Purpose: ${formData.purpose?.replace('-', ' ')}
Style: ${formData.style}
Tone: ${formData.tone}
Length: ${formData.length}

${formData.businessContext ? `Business Context: ${formData.businessContext}` : ''}
${formData.customPrompt ? `Additional Requirements: ${formData.customPrompt}` : ''}

Please research current market trends and industry insights to create executive-level content that is informed by the latest data and competitive intelligence.`;
  };

  const buildEnhancedPrompt = (
    formData: ContentFormData, 
    fullContext: string, 
    contextSummary: any
  ): string => {
    let prompt = `${formData.topic}\n\n`;

    if (fullContext) {
      prompt += `**PERSONALIZATION CONTEXT:**\n${fullContext}\n\n`;
    }

    if (formData.businessContext) {
      prompt += `**BUSINESS CONTEXT:**\n${formData.businessContext}\n\n`;
    }

    if (formData.customPrompt) {
      prompt += `**ADDITIONAL REQUIREMENTS:**\n${formData.customPrompt}\n\n`;
    }

    prompt += `**CONTENT SPECIFICATIONS:**
- Type: ${formData.type.replace('-', ' ')}
- Target Audience: ${formData.targetAudience?.replace('-', ' ')}
- Industry Focus: ${formData.industry}
- Communication Purpose: ${formData.purpose?.replace('-', ' ')}
- Writing Style: ${formData.style}
- Tone: ${formData.tone}
- Length: ${formData.length}

**PERSONALIZATION LEVEL:**
- Profile Integration: ${contextSummary.hasProfile ? 'Full' : 'Basic'}
- Knowledge Base: ${contextSummary.knowledgeCount} documents
- Content History: ${contextSummary.contentCount} pieces
- Conversation Context: ${contextSummary.conversationCount} interactions

Please create premium, executive-level content that integrates the personalization context naturally and demonstrates sophisticated business thinking.`;

    return prompt;
  };

  const generateContentTitle = (formData: ContentFormData): string => {
    const typeMap: { [key: string]: string } = {
      'executive-memo': 'Executive Memo',
      'strategic-plan': 'Strategic Plan',
      'board-presentation': 'Board Presentation',
      'market-analysis': 'Market Analysis',
      'competitive-brief': 'Competitive Brief',
      'financial-report': 'Financial Report'
    };
    
    const contentType = typeMap[formData.type] || formData.type.replace('-', ' ');
    const topic = formData.topic.slice(0, 50);
    
    return `${contentType}: ${topic}${topic.length >= 50 ? '...' : ''}`;
  };

  const mapContentType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'executive-memo': 'email',
      'strategic-plan': 'article',
      'board-presentation': 'presentation',
      'market-analysis': 'article',
      'competitive-brief': 'article',
      'financial-report': 'article'
    };
    
    return typeMap[type] || 'article';
  };

  const generateTags = (formData: ContentFormData, tripartiteUsed: boolean): string[] => {
    const tags = ['ai-generated', 'unified-studio'];
    
    if (tripartiteUsed) tags.push('tripartite-enhanced', 'web-research');
    if (formData.industry) tags.push(formData.industry);
    if (formData.targetAudience) tags.push(formData.targetAudience);
    if (formData.purpose) tags.push(formData.purpose);
    
    return tags;
  };

  const calculateQualityScore = (data: any): number => {
    const baseScore = 75;
    const lengthBonus = Math.min(data.content?.length / 100, 15);
    const metadataBonus = data.metadata?.enhanced ? 10 : 0;
    
    return Math.min(100, baseScore + lengthBonus + metadataBonus);
  };

  const countPersonalizedElements = (content: string, contextSummary: any): number => {
    let count = 0;
    if (contextSummary.hasProfile) count += 2;
    if (contextSummary.knowledgeCount > 0) count += 1;
    if (contextSummary.contentCount > 0) count += 1;
    if (content.length > 1000) count += 1;
    
    return count;
  };

  return {
    isGenerating: isGenerating || isProcessing,
    generatedContent,
    generationMetrics,
    handleGenerate,
    setGeneratedContent
  };
}
