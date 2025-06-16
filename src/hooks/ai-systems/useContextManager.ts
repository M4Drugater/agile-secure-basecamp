
import { useAuth } from '@/contexts/AuthContext';
import { ContextSummary } from './types';

export function useContextManager() {
  const { user } = useAuth();

  const getContextSummary = (): ContextSummary => {
    return {
      hasProfile: !!user,
      knowledgeCount: 0,
      contentCount: 0,
      activityCount: 0,
      quality: 'standard'
    };
  };

  return {
    getContextSummary
  };
}
