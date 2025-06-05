
import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useSystemKnowledge } from './useSystemKnowledge';
import { useDownloadableResources } from './useDownloadableResources';

export function useKnowledgeContext() {
  const { files: personalFiles } = useUserKnowledgeFiles();
  const { documents: systemDocuments } = useSystemKnowledge();
  const { resources } = useDownloadableResources();

  const buildKnowledgeContext = async (userMessage: string): Promise<string> => {
    const searchTerms = userMessage.toLowerCase().split(' ').filter(term => term.length > 3);
    let context = '';

    // Search personal knowledge
    const relevantPersonalFiles = personalFiles?.filter(file => 
      searchTerms.some(term => 
        file.title.toLowerCase().includes(term) ||
        file.content?.toLowerCase().includes(term) ||
        file.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        file.ai_summary?.toLowerCase().includes(term)
      )
    ) || [];

    // Search system knowledge
    const relevantSystemDocs = systemDocuments?.filter(doc =>
      searchTerms.some(term =>
        doc.title.toLowerCase().includes(term) ||
        doc.content.toLowerCase().includes(term) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        doc.category.toLowerCase().includes(term)
      )
    ) || [];

    // Build context string
    if (relevantPersonalFiles.length > 0) {
      context += '\n\n=== PERSONAL KNOWLEDGE ===\n';
      relevantPersonalFiles.slice(0, 3).forEach(file => {
        context += `\n**${file.title}**\n`;
        if (file.ai_summary) {
          context += `Summary: ${file.ai_summary}\n`;
        }
        if (file.content) {
          context += `Content: ${file.content.substring(0, 500)}...\n`;
        }
        if (file.tags && file.tags.length > 0) {
          context += `Tags: ${file.tags.join(', ')}\n`;
        }
      });
    }

    if (relevantSystemDocs.length > 0) {
      context += '\n\n=== SYSTEM KNOWLEDGE ===\n';
      relevantSystemDocs.slice(0, 3).forEach(doc => {
        context += `\n**${doc.title}** (${doc.category})\n`;
        context += `${doc.content.substring(0, 800)}...\n`;
        if (doc.tags && doc.tags.length > 0) {
          context += `Tags: ${doc.tags.join(', ')}\n`;
        }
      });
    }

    return context;
  };

  return {
    buildKnowledgeContext,
    personalFilesCount: personalFiles?.length || 0,
    systemDocsCount: systemDocuments?.length || 0,
    resourcesCount: resources?.length || 0,
  };
}
