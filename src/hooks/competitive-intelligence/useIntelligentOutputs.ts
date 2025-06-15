
import { useState } from 'react';
import { toast } from 'sonner';
import { useContentGeneration } from './useContentGeneration';
import { useOutputMetadata } from './useOutputMetadata';
import { useOutputStorage } from './useOutputStorage';
import { OutputRequest, IntelligentOutput } from './types/intelligentOutputs';

export function useIntelligentOutputs() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateEnhancedContent } = useContentGeneration();
  const { extractIntelligentInsights, generateActionItems, identifyKnowledgeUpdates, generateContentSuggestions } = useOutputMetadata();
  const { outputs, loadOutputs, saveOutput } = useOutputStorage();

  const generateOutput = async (request: OutputRequest): Promise<IntelligentOutput> => {
    setIsGenerating(true);

    try {
      console.log('🎯 Generating intelligent output:', request.outputType);

      // Enhanced content generation with real intelligence
      const enhancedContent = await generateEnhancedContent(request);
      const insights = extractIntelligentInsights(request.agentInsights);
      const actionItems = generateActionItems(request);
      const knowledgeUpdates = identifyKnowledgeUpdates(request);
      const contentSuggestions = generateContentSuggestions(request);

      const newOutput = await saveOutput(
        request,
        enhancedContent,
        insights,
        actionItems,
        knowledgeUpdates,
        contentSuggestions
      );

      console.log('✅ Intelligent output generated successfully');
      toast.success('Intelligent output generated successfully!');

      return newOutput;

    } catch (error) {
      console.error('❌ Error generating intelligent output:', error);
      toast.error('Failed to generate output. Please try again.');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateOutput,
    isGenerating,
    outputs,
    loadOutputs
  };
}
