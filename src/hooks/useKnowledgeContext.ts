
import { useKnowledgeRetrieval, KnowledgeSearchResult } from './useKnowledgeRetrieval';

export function useKnowledgeContext() {
  const { searchKnowledge } = useKnowledgeRetrieval();

  const buildKnowledgeContext = async (userMessage: string): Promise<string> => {
    try {
      const relevantKnowledge = await searchKnowledge(userMessage, 8);
      
      if (relevantKnowledge.length === 0) {
        return '';
      }

      const contextSections = {
        learning_path: relevantKnowledge.filter(k => k.source === 'learning_path'),
        personal: relevantKnowledge.filter(k => k.source === 'personal'),
        system: relevantKnowledge.filter(k => k.source === 'system'),
        downloadable: relevantKnowledge.filter(k => k.source === 'downloadable'),
      };

      let context = '\n--- RELEVANT KNOWLEDGE CONTEXT ---\n';

      // Add learning paths first (highest priority for course recommendations)
      if (contextSections.learning_path.length > 0) {
        context += '\n🎓 INTERNAL LEARNING PATHS & COURSES:\n';
        contextSections.learning_path.forEach(item => {
          context += `• "${item.title}" (${item.difficulty_level || 'beginner'} level)\n`;
          if (item.content && item.content.length < 300) {
            context += `  Description: ${item.content.substring(0, 200)}${item.content.length > 200 ? '...' : ''}\n`;
          }
          if (item.estimated_duration_hours) {
            context += `  Duration: ${item.estimated_duration_hours} hours\n`;
          }
          if (item.enrollment_count && item.enrollment_count > 0) {
            context += `  ${item.enrollment_count} users enrolled\n`;
          }
          if (item.tags && item.tags.length > 0) {
            context += `  Topics: ${item.tags.join(', ')}\n`;
          }
          context += '\n';
        });
      }

      // Add personal knowledge
      if (contextSections.personal.length > 0) {
        context += '\n🏠 PERSONAL KNOWLEDGE:\n';
        contextSections.personal.forEach(item => {
          context += `• ${item.title}\n`;
          if (item.content && item.content.length < 300) {
            context += `  ${item.content.substring(0, 200)}${item.content.length > 200 ? '...' : ''}\n`;
          }
          if (item.tags && item.tags.length > 0) {
            context += `  Tags: ${item.tags.join(', ')}\n`;
          }
          context += '\n';
        });
      }

      // Add system knowledge
      if (contextSections.system.length > 0) {
        context += '\n🏢 SYSTEM FRAMEWORKS & METHODOLOGIES:\n';
        contextSections.system.forEach(item => {
          context += `• ${item.title} (${item.type})\n`;
          if (item.content && item.content.length < 400) {
            context += `  ${item.content.substring(0, 300)}${item.content.length > 300 ? '...' : ''}\n`;
          }
          if (item.category) {
            context += `  Category: ${item.category}\n`;
          }
          context += '\n';
        });
      }

      // Add downloadable resources
      if (contextSections.downloadable.length > 0) {
        context += '\n📁 AVAILABLE RESOURCES:\n';
        contextSections.downloadable.forEach(item => {
          context += `• ${item.title} (${item.category})\n`;
          if (item.content) {
            context += `  ${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}\n`;
          }
          context += '\n';
        });
      }

      context += '\n--- END KNOWLEDGE CONTEXT ---\n';
      context += '\nPLEASE PRIORITIZE RECOMMENDING INTERNAL LEARNING PATHS when users ask about learning, training, skill development, or career growth. These are courses specifically designed for our platform users. Reference specific course titles, difficulty levels, and topics covered when making recommendations.\n';

      return context;
    } catch (error) {
      console.error('Error building knowledge context:', error);
      return '';
    }
  };

  const getKnowledgeRecommendations = async (userMessage: string): Promise<KnowledgeSearchResult[]> => {
    try {
      return await searchKnowledge(userMessage, 5);
    } catch (error) {
      console.error('Error getting knowledge recommendations:', error);
      return [];
    }
  };

  return {
    buildKnowledgeContext,
    getKnowledgeRecommendations,
  };
}
