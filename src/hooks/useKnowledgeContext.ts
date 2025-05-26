
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
        personal: relevantKnowledge.filter(k => k.source === 'personal'),
        system: relevantKnowledge.filter(k => k.source === 'system'),
        downloadable: relevantKnowledge.filter(k => k.source === 'downloadable'),
      };

      let context = '\n--- RELEVANT KNOWLEDGE CONTEXT ---\n';

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
      context += '\nPlease reference and incorporate relevant knowledge from the above context in your response when applicable. If you reference specific frameworks, methodologies, or resources, mention them by name to help the user understand the source of the guidance.\n';

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
