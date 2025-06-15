
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { toast } from 'sonner';
import { ContentFormData } from '@/components/content/ContentGeneratorTypes';

interface GenerationMetrics {
  tokensUsed: number;
  generationTime: number;
  qualityScore: number;
  personalizedElements: number;
}

export function usePremiumContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generationMetrics, setGenerationMetrics] = useState<GenerationMetrics | null>(null);
  
  const { supabase, user } = useSupabase();
  const { buildFullContextString, getContextSummary } = useContextBuilder();

  const handleGenerate = async (formData: ContentFormData) => {
    if (!user || !supabase) {
      toast.error('Please sign in to use the content generator');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();

    try {
      // Build comprehensive context
      const fullContext = await buildFullContextString(formData.topic);
      const contextSummary = getContextSummary();

      // Enhanced prompt building
      const enhancedPrompt = buildEnhancedPrompt(formData, fullContext, contextSummary);

      console.log('🚀 Generating premium content with full context integration');

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

      const generationTime = Date.now() - startTime;
      
      setGeneratedContent(data.content);
      setGenerationMetrics({
        tokensUsed: data.usage?.totalTokens || 0,
        generationTime,
        qualityScore: calculateQualityScore(data),
        personalizedElements: countPersonalizedElements(data.content, contextSummary)
      });

      toast.success('Premium content generated successfully!');

    } catch (error) {
      console.error('Content generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

  const calculateQualityScore = (data: any): number => {
    // Simple quality scoring based on content length, structure, and metadata
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
    if (content.length > 1000) count += 1; // Longer content likely more personalized
    
    return count;
  };

  return {
    isGenerating,
    generatedContent,
    generationMetrics,
    handleGenerate,
    setGeneratedContent
  };
}
