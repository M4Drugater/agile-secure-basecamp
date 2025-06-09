
import { useContentItems } from './useContentItems';
import { useLearningProgress } from './useLearningProgress';

export function useContentLearningContext() {
  const contentQuery = useContentItems();
  const contentItems = (contentQuery as any)?.contentItems || [];
  
  const learningQuery = useLearningProgress();
  const learningData = (learningQuery as any)?.userProgress || [];

  const buildContentContext = (): string => {
    if (!contentItems || contentItems.length === 0) return '';

    let context = `
=== CREATED CONTENT (${contentItems.length} items) ===
Recent content created by user:
`;
    contentItems.slice(0, 5).forEach((item: any) => {
      context += `• ${item.title} (${item.content_type}) - ${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
  Status: ${item.status || 'Unknown'}
  Topics: ${item.tags?.join(', ') || 'No tags'}
`;
    });

    return context;
  };

  const buildLearningContext = (): string => {
    if (!learningData || learningData.length === 0) return '';

    let context = `
=== LEARNING PROGRESS ===
`;
    learningData.forEach((progress: any) => {
      context += `• Learning Path: Progress ${progress.progress_percentage || 0}%
  Status: ${progress.status || 'In progress'}
  Last Activity: ${progress.last_activity_at ? new Date(progress.last_activity_at).toLocaleDateString() : 'Never'}
`;
    });

    return context;
  };

  return {
    contentItems,
    learningData,
    buildContentContext,
    buildLearningContext,
    contentCount: contentItems?.length || 0,
    learningCount: learningData?.length || 0,
  };
}
