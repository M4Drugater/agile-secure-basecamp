
import { useOutputLoader } from './useOutputLoader';
import { useOutputGenerator } from './useOutputGenerator';
import { useOutputFinalization } from './useOutputFinalization';

export function useIntelligentOutputs() {
  const { outputs, setOutputs, loadOutputs } = useOutputLoader();
  const { generateOutput, isGenerating } = useOutputGenerator();
  const { finalizeOutput, isFinalizingOutput } = useOutputFinalization();

  return {
    outputs,
    isGenerating,
    isFinalizingOutput,
    loadOutputs,
    generateOutput: async (request: any) => {
      const output = await generateOutput(request);
      setOutputs(prev => [output, ...prev]);
      return output;
    },
    finalizeOutput
  };
}
