
import { useUserKnowledgeFiles } from '../useUserKnowledgeFiles';
import { useSystemKnowledge } from '../useSystemKnowledge';

export function useKnowledgeContext() {
  const { files } = useUserKnowledgeFiles();
  const { documents } = useSystemKnowledge();

  const buildKnowledgeContext = async (userMessage: string): Promise<string> => {
    let context = '';

    // Add personal knowledge files
    if (files && files.length > 0) {
      context += '=== PERSONAL KNOWLEDGE ===\n';
      const personalFiles = files.filter(file => 
        file.document_category === 'personal' || !file.document_category
      );
      
      personalFiles.forEach(file => {
        if (file.content || file.description) {
          context += `Title: ${file.title}\n`;
          if (file.description) context += `Description: ${file.description}\n`;
          if (file.content) context += `Content: ${file.content.substring(0, 500)}...\n`;
          if (file.tags && file.tags.length > 0) context += `Tags: ${file.tags.join(', ')}\n`;
          context += '\n';
        }
      });
    }

    // Add system knowledge
    if (documents && documents.length > 0) {
      context += '=== SYSTEM KNOWLEDGE ===\n';
      documents.forEach(doc => {
        if (doc.content) {
          context += `Title: ${doc.title}\n`;
          context += `Content: ${doc.content.substring(0, 500)}...\n`;
          if (doc.tags && doc.tags.length > 0) context += `Tags: ${doc.tags.join(', ')}\n`;
          context += '\n';
        }
      });
    }

    return context;
  };

  const knowledgeCount = (files?.length || 0) + (documents?.length || 0);

  return {
    buildKnowledgeContext,
    knowledgeCount,
  };
}
