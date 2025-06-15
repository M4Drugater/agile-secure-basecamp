
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useKnowledgeContext } from './useKnowledgeContext';
import { useUserProfile } from './useUserProfile';
import { ContentFormData } from '@/components/content/ContentGeneratorTypes';

export interface EnhancedContentRequest extends ContentFormData {
  targetAudience?: string;
  businessContext?: string;
  useKnowledge?: boolean;
  tone?: string;
  industry?: string;
  purpose?: string;
}

export function useEnhancedContentGeneration() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { buildContext } = useKnowledgeContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const buildEnhancedPrompt = async (formData: EnhancedContentRequest): Promise<string> => {
    let enhancedPrompt = '';

    // Add user profile context for personalization
    if (profile) {
      enhancedPrompt += `=== USER PROFILE CONTEXT ===\n`;
      enhancedPrompt += `Role: ${profile.current_position || 'Professional'}\n`;
      enhancedPrompt += `Company: ${profile.company || 'Organization'}\n`;
      enhancedPrompt += `Industry: ${profile.industry || formData.industry || 'Business'}\n`;
      enhancedPrompt += `Experience Level: ${profile.experience_level || 'Experienced'}\n`;
      if (profile.career_goals) {
        enhancedPrompt += `Career Goals: ${profile.career_goals.join(', ')}\n`;
      }
      enhancedPrompt += '\n';
    }

    // Add knowledge base context if enabled
    if (formData.useKnowledge) {
      const knowledgeContext = buildContext(formData.topic);
      if (knowledgeContext) {
        enhancedPrompt += `${knowledgeContext}\n`;
      }
    }

    // Build sophisticated content prompt based on type
    enhancedPrompt += buildContentTypePrompt(formData);

    return enhancedPrompt;
  };

  const buildContentTypePrompt = (formData: EnhancedContentRequest): string => {
    const basePrompts = {
      'executive-memo': `Create an executive memorandum that demonstrates strategic thinking and business acumen. This should be suitable for C-suite consumption with:
- Clear executive summary with key takeaways
- Strategic implications and business impact analysis
- Data-driven insights and market context
- Actionable recommendations with implementation roadmap
- Professional tone with authority and credibility`,

      'strategic-analysis': `Develop a comprehensive strategic analysis that showcases deep business understanding:
- Market landscape assessment and competitive positioning
- SWOT analysis with strategic implications
- Risk assessment and mitigation strategies
- Financial impact projections
- Strategic recommendations with rationale`,

      'board-presentation': `Create board-level presentation content with executive gravitas:
- High-level strategic overview with key metrics
- Market trends and competitive landscape
- Financial performance and projections
- Strategic initiatives and their business impact
- Clear call-to-action with next steps`,

      'industry-insight': `Generate thought leadership content demonstrating industry expertise:
- Market trend analysis with forward-looking perspective
- Industry best practices and benchmarking
- Innovation opportunities and emerging technologies
- Strategic implications for business leaders
- Expert commentary with actionable insights`,

      'investor-communication': `Craft investor-grade communication with financial sophistication:
- Clear value proposition and market opportunity
- Financial metrics and performance indicators
- Growth strategy and market expansion plans
- Risk factors and mitigation approaches
- Investment highlights and competitive advantages`,

      'resume': `Create an executive-level resume that positions the candidate as a strategic leader:
- C-suite ready executive summary
- Strategic accomplishments with quantified business impact
- Leadership experience and team management
- Industry expertise and thought leadership
- Board experience and external recognition`,

      'cover-letter': `Write a compelling executive cover letter that demonstrates strategic thinking:
- Opening that establishes credibility and expertise
- Strategic value proposition aligned with company needs
- Leadership achievements with measurable business impact
- Industry knowledge and market understanding
- Strong close with clear next steps`,

      'linkedin-post': `Create a thought leadership LinkedIn post for executive engagement:
- Industry insights that demonstrate expertise
- Strategic perspective on market trends
- Professional tone with executive presence
- Engaging content that drives meaningful discussion
- Call-to-action that builds professional network`,

      'email': `Draft executive-level business correspondence:
- Professional tone appropriate for senior stakeholders
- Clear subject line and purpose statement
- Structured content with key points highlighted
- Action items and next steps clearly defined
- Professional closing with appropriate follow-up`,

      'presentation': `Develop presentation content for executive audiences:
- Executive summary with key takeaways
- Strategic framework and methodology
- Data-driven insights with visual storytelling
- Clear recommendations with business rationale
- Implementation roadmap with success metrics`,

      'article': `Write a thought leadership article demonstrating industry expertise:
- Compelling headline that captures attention
- Expert analysis of industry trends and challenges
- Strategic insights and forward-looking perspective
- Real-world examples and case studies
- Actionable recommendations for business leaders`,
    };

    const selectedPrompt = basePrompts[formData.type as keyof typeof basePrompts] || basePrompts['article'];

    let fullPrompt = `You are an expert content strategist and executive communication specialist. Your task is to create premium, C-suite quality content that demonstrates strategic thinking, business acumen, and executive presence.

CONTENT TYPE: ${formData.type.toUpperCase()}

CONTENT REQUIREMENTS:
${selectedPrompt}

TOPIC/SUBJECT: ${formData.topic}

STYLE GUIDELINES:
- Tone: ${formData.tone || formData.style} with executive presence
- Target Audience: ${formData.targetAudience || 'Senior executives and business leaders'}
- Content Length: ${formData.length} (optimize for executive consumption)
- Industry Context: ${formData.industry || profile?.industry || 'Cross-industry business environment'}

BUSINESS CONTEXT:
${formData.businessContext || 'Focus on strategic business value, competitive advantage, and measurable impact'}

QUALITY STANDARDS:
- Demonstrate deep business understanding and strategic thinking
- Use data-driven insights and market intelligence when relevant
- Include specific, actionable recommendations
- Maintain professional credibility and executive gravitas
- Ensure content is board-room ready and C-suite appropriate

PURPOSE: ${formData.purpose || 'Drive strategic thinking and informed decision-making'}

${formData.customPrompt ? `ADDITIONAL INSTRUCTIONS: ${formData.customPrompt}` : ''}

Create content that positions the author as a strategic business leader with deep industry expertise and executive presence.`;

    return fullPrompt;
  };

  const handleGenerate = async (formData: EnhancedContentRequest) => {
    if (!formData.topic.trim()) {
      toast.error('Please provide a topic or description');
      return;
    }

    if (!user) {
      toast.error('Please log in to generate content');
      return;
    }

    setIsGenerating(true);
    try {
      // Build enhanced prompt with knowledge integration
      const enhancedPrompt = await buildEnhancedPrompt(formData);

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: formData.type,
          topic: enhancedPrompt, // Send the enhanced prompt as the topic
          style: formData.style,
          length: formData.length,
          model: formData.model,
          targetAudience: formData.targetAudience,
          businessContext: formData.businessContext,
        },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      toast.success('Enhanced content generated successfully!');
    } catch (error) {
      console.error('Error generating enhanced content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedContent,
    handleGenerate,
    setGeneratedContent,
    profile,
  };
}
