
import { useContextBuilder as useNewContextBuilder } from '@/hooks/context/useContextBuilder';

export function useContextBuilder() {
  const { buildFullContextString, getContextSummary } = useNewContextBuilder();

  const buildFullContext = async (userMessage: string): Promise<string> => {
    return await buildFullContextString(userMessage);
  };

  const contextSummary = getContextSummary();

  return {
    buildFullContext,
    hasProfileContext: contextSummary.hasProfile,
  };
}
