
import { useProfileContextBuilder } from '@/hooks/useProfileContextBuilder';
import { useKnowledgeContextBuilder } from '@/hooks/useKnowledgeContextBuilder';

export function useContextBuilder() {
  const { buildProfileContextString, hasProfileContext } = useProfileContextBuilder();
  const { buildKnowledgeContextString } = useKnowledgeContextBuilder();

  const buildFullContext = async (userMessage: string): Promise<string> => {
    let fullContext = '';
    
    // Add profile context
    const profileContext = buildProfileContextString();
    if (profileContext) {
      fullContext += profileContext;
    }
    
    // Add knowledge context
    const knowledgeContext = await buildKnowledgeContextString(userMessage);
    if (knowledgeContext) {
      fullContext += knowledgeContext;
    }
    
    return fullContext;
  };

  return {
    buildFullContext,
    hasProfileContext,
  };
}
