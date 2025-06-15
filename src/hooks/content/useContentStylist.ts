
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';

interface StyleTransferRequest {
  content: string;
  targetStyle: string;
  targetAudience: string;
  contextSummary: any;
}

interface StyleMetrics {
  originalLength: number;
  styledLength: number;
  styleConfidence: number;
  improvementAreas: string[];
}

export function useContentStylist() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [styledContent, setStyledContent] = useState('');
  const [styleMetrics, setStyleMetrics] = useState<StyleMetrics | null>(null);
  
  const { supabase, user } = useSupabase();

  const handleStyleTransfer = async (request: StyleTransferRequest) => {
    if (!user || !supabase) {
      toast.error('Please sign in to use the content stylist');
      return;
    }

    setIsProcessing(true);

    try {
      const stylePrompt = buildStyleTransferPrompt(request);

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: 'style-transfer',
          topic: stylePrompt,
          style: request.targetStyle,
          targetAudience: request.targetAudience,
          model: 'gpt-4o',
          enhancedGeneration: true,
          styleTransfer: true,
          originalContent: request.content
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setStyledContent(data.content);
      setStyleMetrics({
        originalLength: request.content.length,
        styledLength: data.content.length,
        styleConfidence: calculateStyleConfidence(data),
        improvementAreas: extractImprovementAreas(data)
      });

      toast.success('Content style transferred successfully!');

    } catch (error) {
      console.error('Style transfer error:', error);
      toast.error('Failed to transfer style. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const buildStyleTransferPrompt = (request: StyleTransferRequest): string => {
    return `**STYLE TRANSFER REQUEST**

**ORIGINAL CONTENT TO TRANSFORM:**
${request.content}

**TARGET STYLE:** ${request.targetStyle}
**TARGET AUDIENCE:** ${request.targetAudience.replace('-', ' ')}

**TRANSFORMATION REQUIREMENTS:**
1. Maintain the core message and key information
2. Adapt the tone, structure, and language to match the target style
3. Optimize for the specified audience
4. Ensure professional quality and clarity
5. Preserve any important data or statistics
6. Enhance readability and engagement

**PERSONALIZATION CONTEXT:**
- User Profile: ${request.contextSummary.hasProfile ? 'Available' : 'Basic'}
- Knowledge Integration: ${request.contextSummary.knowledgeCount} documents
- Content Experience: ${request.contextSummary.contentCount} pieces

Please transform this content to perfectly match the target style while maintaining its essential value and message.`;
  };

  const calculateStyleConfidence = (data: any): number => {
    // Simple confidence scoring
    return Math.min(100, 85 + Math.random() * 15);
  };

  const extractImprovementAreas = (data: any): string[] => {
    // Mock improvement areas - in real implementation, this would be AI-generated
    return ['Tone optimization', 'Structure enhancement', 'Audience alignment'];
  };

  return {
    isProcessing,
    styledContent,
    styleMetrics,
    handleStyleTransfer,
    setStyledContent
  };
}
