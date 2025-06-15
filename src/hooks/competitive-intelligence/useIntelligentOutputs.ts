
import { useOutputLoader } from './useOutputLoader';
import { useOutputGenerator } from './useOutputGenerator';

export function useIntelligentOutputs() {
  const { outputs, setOutputs, loadOutputs } = useOutputLoader();
  const { generateOutput, isGenerating } = useOutputGenerator();

  const finalizeOutput = async (outputId: string) => {
    // Implementation for finalizing output
    console.log('Finalizing output:', outputId);
  };

  return {
    outputs,
    isGenerating,
    loadOutputs,
    generateOutput: async (request: any) => {
      const output = await generateOutput(request);
      setOutputs(prev => [output, ...prev]);
      return output;
    },
    finalizeOutput
  };
}
