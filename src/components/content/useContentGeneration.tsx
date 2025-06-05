
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContentFormData } from './ContentGeneratorTypes';

export function useContentGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async (formData: ContentFormData) => {
    if (!formData.topic.trim()) {
      toast.error('Please provide a topic or description');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          type: formData.type,
          topic: formData.topic,
          style: formData.style,
          length: formData.length,
          model: formData.model,
          customPrompt: formData.customPrompt || undefined,
        },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedContent,
    handleGenerate,
    setGeneratedContent
  };
}
