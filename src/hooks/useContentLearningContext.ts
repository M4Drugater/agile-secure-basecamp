
import { useContentItems } from './useContentItems';
import { useLearningPaths } from './useLearningPaths';

export function useContentLearningContext() {
  const { contentItems } = useContentItems();
  const { learningPaths } = useLearningPaths();

  const buildContentContext = (): string => {
    if (!contentItems || contentItems.length === 0) return '';

    let context = `
=== USER CONTENT LIBRARY ===
Recent content created by user:
`;
    
    contentItems.slice(0, 5).forEach((item, index) => {
      context += `${index + 1}. ${item.title} (${item.content_type})
   Status: ${item.status}
   Created: ${new Date(item.created_at).toLocaleDateString()}
   Tags: ${item.tags?.join(', ') || 'None'}
`;
    });

    return context;
  };

  const buildLearningContext = (): string => {
    if (!learningPaths || learningPaths.length === 0) return '';

    let context = `
=== LEARNING PATHS ===
User's learning journey:
`;
    
    learningPaths.slice(0, 3).forEach((path, index) => {
      context += `${index + 1}. ${path.title}
   Difficulty: ${path.difficulty_level}
   Progress: Active learning path
   Description: ${path.description?.substring(0, 100) || 'No description'}...
`;
    });

    return context;
  };

  return {
    buildContentContext,
    buildLearningContext,
    contentCount: contentItems?.length || 0,
    learningCount: learningPaths?.length || 0,
  };
}
